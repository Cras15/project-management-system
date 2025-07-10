import { Box, Button, Checkbox, FormControl, FormLabel, Grid, Input, Sheet, Typography } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuthStore } from '../stores/useAuthStore';
import { useNotification } from '../contexts/NotificationContext';

const EditRole = () => {
    const id = useParams().id;
    const token = useAuthStore((state) => state.token);
    const [formData, setFormData] = React.useState({ name: '', permissions: [] });
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        let url = id ? `http://localhost:8080/admin/role/${id}` : `http://localhost:8080/admin/role`;
        let method = id ? 'put' : 'post';
        e.preventDefault();

        axios({
            method: method,
            url: url,
            data: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            addNotification('Rol başarıyla güncellendi', { type: 'success' });
            navigate(`/role`);
        }).catch(err => {
            addNotification(err.response.data || 'Rol güncellenirken bir hata oluştu', { type: 'danger' });
        });
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['role', id],
        queryFn: async () => await axios.get(`http://localhost:8080/admin/role/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => res.data),
        enabled: !!id,
    });

    const { data: permissions } = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => await axios.get(`http://localhost:8080/admin/permissions`,
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => res.data.content),
    });

    React.useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                permissions: data.permissions || [],
            });
        }

    }, [data]);

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
            <Typography level="title-md">Rolü Düzenle: {data?.name}</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }} onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>Rol Adı</FormLabel>
                    <Input name="name" placeholder="Rol adı girin" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </FormControl>

                <Typography level="title-md" sx={{ mt: 2 }}>Yetkiler</Typography>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {permissions?.map((row, index) => (
                        <Grid xs={12} sm={6} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox label={row.name} variant="soft" sx={{ textAlign: 'left' }}
                                checked={!!formData?.permissions?.find((p) => p.id === row.id)}
                                name="permissions"
                                value={row.name}
                                onChange={(e) => {
                                    const newPermissions = e.target.checked
                                        ? [...(formData.permissions || []), { id: row.id, name: row.name }]
                                        : formData?.permissions?.filter(p => p.id !== row.id);
                                    setFormData({ ...formData, permissions: newPermissions });
                                    console.log(formData);
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Button type="submit" variant="solid" color="primary">Kaydet</Button>
            </Box>
        </Sheet>
    )
}

export default EditRole