import { Button, FormControl, FormLabel, Input, Link, Sheet, Typography } from '@mui/joy'
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useRef } from 'react'
import { useAuthStore } from '../stores/useAuthStore';
import { useNotification } from '../contexts/NotificationContext';

const LoginPage = () => {
    const formRef = useRef();
    const { login, setUser } = useAuthStore((state) => state);
    const { addNotification } = useNotification();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        loginRequest.mutate({
            email: data.email,
            password: data.password
        });
    }

    const loginRequest = useMutation({
        mutationFn: (data) => {
            return axios.post('http://localhost:8080/auth/login', data);
        },
        onSuccess: (res) => {
            login(res.data.token);
            setUser({
                id: res.data.id,
                email: res.data.email,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                role: res.data.role,
            });
            console.log(res)
            addNotification('Giriş başarılı', { type: 'success' });
        },
        onError: (err) => {
            console.log(err)
            addNotification(err.response.data || 'Giriş yapılırken hata oluştu', { type: 'danger' });
        }
    })
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100%' }}>
            <Sheet
                sx={{
                    width: 300,
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
                        <b>Hoşgeldin!</b>
                    </Typography>
                    <Typography level="body-sm">Giriş yap ve devam et.</Typography>
                </div>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            name="email"
                            type="email"
                            placeholder="mail@pms.com"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Şifre</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            placeholder="şifre"
                        />
                    </FormControl>
                    <Button sx={{ mt: 1 }} type='submit'>Giriş Yap</Button>
                </form>
            </Sheet>
        </div>
    )
}

export default LoginPage