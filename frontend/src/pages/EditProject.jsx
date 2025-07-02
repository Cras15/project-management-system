import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate, useParams } from 'react-router';
import { Autocomplete, Box, Button, FormControl, FormLabel, IconButton, Input, Option, Select, Table, Typography } from '@mui/joy';
import { DeleteOutline, People } from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationContext';

const EditProject = () => {
    const token = useAuthStore((state) => state.token);
    const { id } = useParams();
    const navigation = useNavigate();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState({ projectName: '', status: '' });

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleStatusChange = (event, newValue) => {
        setFormData(prev => ({
            ...prev,
            status: newValue
        }));
    };

    const fetchProject = async () => {
        const { data } = await axios.get(`http://localhost:8080/project/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setFormData({
            projectName: data.projectName || '',
            status: data.status || ''
        });
        return data;
    };

    const fetchEmployees = async () => {
        const { data } = await axios.get('http://localhost:8080/employee/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    };

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['project'],
        queryFn: fetchProject,
    });
    const { data: employees, isLoading: isEmployeesLoading, isError: isEmployeesError, error: employeesError } = useQuery({
        queryKey: ['employees'],
        queryFn: fetchEmployees,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setFormData({ projectName: '', status: '' });
        axios.put(`http://localhost:8080/project/update/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                addNotification('Proje başarıyla güncellendi', { type: 'success' });
                navigation('/');
            }
            )
            .catch(error => {
                addNotification(error.response.data || 'Proje güncellenirken hata oluştu', { type: 'danger' });
            });
    };
    const onChangeAssignedEmployee = (event, newValue) => {
        if (newValue) {
            axios.post(`http://localhost:8080/project/assignEmployee`, { employeeId: newValue.id, projectId: id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    refetch();
                    addNotification('Çalışan proje atamasına eklendi', { type: 'success' });
                    setFormData(prev => ({ ...prev, assignedEmployee: '' }));
                })
                .catch(error => {
                    addNotification(error.response.data || 'Çalışan eklenirken hata oluştu', { type: 'danger' });
                });
        }
    };

    const DeleteAssignedEmployee = (employeeId) => {
        if (!window.confirm('Çalışan proje atamasından silinecek, onaylıyor musunuz?')) return;
        axios.post(`http://localhost:8080/project/deleteEmployee`, { employeeId, projectId: id }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                refetch();
                addNotification('Çalışan ataması başarıyla silindi', { type: 'success' });
            })
            .catch(error => {
                addNotification(error.response.data || 'Çalışan ataması silinirken hata oluştu', { type: 'danger' });
            });
    };

    return (
        <form onSubmit={onSubmit}>
            <FormControl>
                <FormLabel>Proje Adı</FormLabel>
                <Input
                    name="projectName"
                    type="text"
                    value={formData.projectName}
                    onChange={onChange}
                    placeholder="Proje Adı"
                />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
                <FormLabel>Proje Durumu</FormLabel>
                <Select
                    placeholder="Proje Durumu"
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    id="status-select"
                    sx={{ minWidth: 200 }}
                >
                    <Option value="NEW">Yeni</Option>
                    <Option value="IN_PROGRESS">Devam Ediyor</Option>
                    <Option value="COMPLETED">Tamamlandı</Option>
                </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
                <Typography level="title-md" sx={{ mt: 2 }}>
                    Atanan Çalışanlar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ width: '50%' }}>
                        <Table aria-label="basic table" sx={{ mt: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>Ad Soyad</th>
                                    <th style={{ textAlign: 'center' }}>E-Mail</th>
                                    <th style={{ textAlign: 'center', width: '50px' }}>İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.assignedEmployees?.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.firstName} {employee.lastName}</td>
                                        <td>{employee.email}</td>
                                        <td>
                                            <IconButton color='danger' onClick={()=>DeleteAssignedEmployee(employee.id)}>
                                                <DeleteOutline />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Box>
                    <Box sx={{ width: '45%' }}>
                        <Autocomplete
                            placeholder="Çalışan Ekle"
                            options={employees || []}
                            selectOnFocus
                            clearOnBlur
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                            getOptionDisabled={(option) =>
                                data.assignedEmployees?.some(emp => emp.id === option.id)
                            }
                            onChange={onChangeAssignedEmployee}
                        />
                    </Box>
                </Box>
            </Box>
            <Button sx={{ mt: 2 }} type='submit'>Kaydet</Button>
        </form>
    )
}

export default EditProject