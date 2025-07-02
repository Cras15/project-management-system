import { Button, FormControl, FormLabel, Input, Link, Sheet, Typography } from "@mui/joy"
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const EditEmployeePage = () => {
    const token = useAuthStore((state) => state.token);
    const { id } = useParams();
    const navigation = useNavigate();

    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/employee/update/${id}`, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Çalışan eklendi:', response.data);
                navigation('/employees');
            })
            .catch(error => {
                console.error(error);
            });
    }

    const fetchEmployee = async () => {
        const { data } = await axios.get(`http://localhost:8080/employee/get/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || ''
        });
        return data;
    };
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employee'],
        queryFn: fetchEmployee,
    });

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
            <div>
                <Typography level="h4" component="h1">
                    <b>Çalışan Düzenleme</b>
                </Typography>
            </div>
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
                <Button sx={{ mt: 1 }} type="submit">Kaydet</Button>
            </form>
        </Sheet>
    )
}

export default EditEmployeePage