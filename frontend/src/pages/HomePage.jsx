import { Box, Button, Card, Chip, Sheet, Skeleton, Table, Typography } from '@mui/joy'
import React from 'react'
import { useAuthStore } from '../stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Group } from '@mui/icons-material';
import { Link } from 'react-router';

const statusColors = {
    'NEW': 'primary',
    'IN_PROGRESS': 'warning',
    'COMPLETED': 'success',
};
const statusText = {
    'NEW': 'Yeni',
    'IN_PROGRESS': 'Devam Ediyor',
    'COMPLETED': 'Tamamlandı',
};


const HomePage = () => {
    const token = useAuthStore((state) => state.token);

    const fetchProjects = async () => {
        const { data } = await axios.get('http://localhost:8080/project/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    };
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    });

    const handleDelete = async (projectId) => {
        try {
            if (!window.confirm('Proje silinecek, onaylıyor musunuz?')) return;
            await axios.delete(`http://localhost:8080/project/delete/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button
                variant="solid"
                color="primary"
                size="sm"
                sx={{ mb: 2 }}
                component={Link}
                to="/project/create"
            >
                <Group sx={{ mr: 1 }} />
                Yeni Proje Ekle
            </Button>
            <Sheet
                variant="outlined"
                sx={{
                    width: '100%',
                    borderRadius: 'sm',
                    boxShadow: 'sm',
                    overflow: 'auto',
                }}
            >
                <Table
                    stripe="odd"
                    hoverRow
                >
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Proje Adı</th>
                            <th>Proje Durumu</th>
                            <th>Çalışan Sayısı</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <Typography level="body-md" textAlign="left">{row.projectName}</Typography>
                                </td>
                                <td style={{ textAlign: 'left' }}>
                                    <Chip
                                        variant="soft"
                                        size="sm"
                                        color={statusColors[row.status] || 'neutral'}
                                    >
                                        {statusText[row.status] || 'Bilinmiyor'}
                                    </Chip>
                                </td>
                                <td>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <Group color='primary' />
                                        <Typography level="body-sm">{row.assignedEmployees?.length || 0}</Typography>
                                    </Box>
                                </td>
                                <td>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="plain" color="primary" size="sm" component={Link} to={`/project/${row.id}`}>Düzenle</Button>
                                        <Button variant="plain" color="danger" size="sm" onClick={() => handleDelete(row.id)}>Sil</Button>
                                    </Box>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </>
    );
}

export default HomePage