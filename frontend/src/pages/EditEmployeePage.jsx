import { Autocomplete, Box, Button, FormControl, FormLabel, Input, Link, Sheet, Typography } from "@mui/joy"
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNotification } from "../contexts/NotificationContext";
import { hasPermission } from "../utils/PermissionControl";

const EditEmployeePage = () => {
    const { token, user } = useAuthStore((state) => state);
    const { id } = useParams();
    const navigation = useNavigate();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', roles: null });

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/employee/update/${id}`, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            roles: formData.roles.map(role => ({ id: role.id, name: role.name }))
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                addNotification('Çalışan başarıyla güncellendi', { type: 'success' });
                navigation('/employees');
            })
            .catch(error => {
                addNotification(error.response.data || 'Çalışan güncellenirken bir hata oluştu', { type: 'danger' });
            });
    }

    const fetchEmployee = async () => {
        const { data } = await axios.get(`http://localhost:8080/employee/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    };
    const { data } = useQuery({
        queryKey: ['employee'],
        queryFn: fetchEmployee,
    });

    const { data: roles } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:8080/admin/role', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return data.content;
        }
    });

    useEffect(() => {
        if (data) {
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                roles: data.roles || []
            });
        }
    }, [data]);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <Sheet
            sx={{
                width: 300,
                mx: 'auto',
                my: 4,
                py: 3,
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
            }}
            variant="outlined"
        >
            <Box>
                <Typography level="h4" component="h1" fontWeight="bold">
                    Çalışan Düzenleme
                </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>Ad</FormLabel>
                    <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={onChange}
                        placeholder="ad"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Soyad</FormLabel>
                    <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={onChange}
                        placeholder="soyad"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        type="email"
                        placeholder="mail@pms.com"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Rol</FormLabel>
                    <Autocomplete
                        multiple
                        options={roles ? roles : []}
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option => option.id)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, value) => setFormData(prev => ({ ...prev, roles: value.map(role => ({ name: role.name, id: role.id })) }))}
                        value={formData.roles || []}
                        getOptionDisabled={(option) => !hasPermission(user, `ADD_${option.name}`)}
                    />
                </FormControl>
                <Button sx={{ mt: 1 }} type="submit">Kaydet</Button>
            </form>
        </Sheet>
    )
}

export default EditEmployeePage