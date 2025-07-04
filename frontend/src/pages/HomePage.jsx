import { Box, Button, Card, Chip, Sheet, Skeleton, Table, Typography } from '@mui/joy'
import React from 'react'
import { useAuthStore } from '../stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Group } from '@mui/icons-material';
import { Link } from 'react-router';
import { useNotification } from '../contexts/NotificationContext';
import CustomTable from '../components/CustomTable';
import { hasPermission } from '../utils/PermissionControl';

const HomePage = () => {
    const { token, user } = useAuthStore((state) => state);
    const { addNotification } = useNotification();

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
        //enabled: hasPermission(user, 'PROJECT_GET'),
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
            addNotification('Proje başarıyla silindi', { type: 'success' });
        } catch (error) {
            addNotification(error.response.data || 'Proje silinirken hata oluştu', { type: 'danger' });
        }
    };

    const columns = [
        {
            header: 'Proje Adı',
            style: { width: '40%', textAlign: 'center' },
            render: (row) => <Typography level="body-md">{row.projectName}</Typography>,
        },
        {
            header: 'Proje Durumu',
            style: { textAlign: 'center' },
            render: (row) => {
                const statusColors = { IN_PROGRESS: 'warning', COMPLETED: 'success', NEW: 'primary' };
                const statusText = { IN_PROGRESS: 'Devam Ediyor', COMPLETED: 'Tamamlandı', NEW: 'Yeni' };
                return (
                    <Chip color={statusColors[row.status] || 'neutral'} size="sm" variant="soft">
                        {statusText[row.status] || 'Bilinmiyor'}
                    </Chip>
                );
            },
        },
        {
            header: 'Çalışan Sayısı',
            render: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group color="primary" />
                    <Typography level="body-sm">{row.assignedEmployees?.length || 0}</Typography>
                </Box>
            ),
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                data={data}
                editLink="/project"
                handleDelete={handleDelete}
                renderActions={hasPermission(user, 'PROJECT_DELETE') || hasPermission(user, 'PROJECT_EDIT')}
                createLink={hasPermission(user, 'PROJECT_ADD') && "/project/create"}
                createText='Yeni Proje Ekle'
            />
        </>
    );
}

export default HomePage