import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useNavigate, useParams } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';
import { Box, Button, FormControl, FormLabel, Input, Sheet, Typography } from '@mui/joy';
import { useNotification } from '../contexts/NotificationContext';

const EditPermission = () => {
    const [permissionName, setPermissionName] = React.useState('')
    const { id } = useParams();
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['permission', id],
        queryFn: async () => await axios.get(`http://localhost:8080/admin/permission/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => res.data),
        enabled: !!id,
    });

    React.useEffect(() => {
        if (data) {
            setPermissionName(data.name || '');
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = id ? `http://localhost:8080/admin/permission/${id}` : `http://localhost:8080/admin/permission`;
        let method = id ? 'put' : 'post';

        await axios({
            method,
            url,
            data: {
                name: permissionName
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            addNotification('Yetki başarıyla güncellendi', { type: 'success' })
            navigate(`/permission`);
        }).catch(err => {
            addNotification(err.response.data || 'Yetki güncellenirken bir hata oluştu', { type: 'danger' })
            console.error(err);
        });
    }
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <Sheet sx={{
            width: 500,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
            margin: 'auto',
            my: 4,
        }}
            variant="outlined">
            <Typography level="title-md">Yetkiyi Düzenle: {permissionName}</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }} onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>Rol Adı</FormLabel>
                    <Input name="name" placeholder="Rol adı girin" value={permissionName} onChange={(e) => setPermissionName(e.target.value)} />
                </FormControl>
                <Button type="submit" variant="solid" color="primary">Kaydet</Button>
            </Box>
        </Sheet>
    )
}

export default EditPermission