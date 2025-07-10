import { Box, Chip, Typography } from '@mui/joy'
import { useAuthStore } from '../stores/useAuthStore';
import axios from 'axios';
import { Group } from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationContext';
import { hasPermission } from '../utils/PermissionControl';
import PaginatedTable from '../components/PaginatedTable';
import { usePaginatedQuery } from '../hooks/usePaginatedQuery';

const HomePage = () => {
    const { token, user } = useAuthStore((state) => state);
    const { addNotification } = useNotification();

    const fetchProjects = async ({ page, pageSize, token, searchTerm }) => {
        const { data } = await axios.get(`http://localhost:8080/project/get?page=${page}&size=${pageSize}&sort=projectName&search=${searchTerm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return data;
    };
    const {
        refetch,
    } = usePaginatedQuery(
        ['projects'],
        ({ page, pageSize, searchTerm }) => fetchProjects({ page, pageSize, token, searchTerm }),
    );

    const handleDelete = async (projectId) => {
        try {
            if (!window.confirm('Proje silinecek, onaylıyor musunuz?')) return;
            await axios.post(`http://localhost:8080/project/delete/${projectId}`, {
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
        <PaginatedTable
            queryKey={['projects']}
            fetchFn={fetchProjects}
            columns={columns}
            initialPageSize={5}
            pageSizeOptions={[5, 10, 20]}
            editLink="/project"
            handleDelete={handleDelete}
            renderActions={hasPermission(user, 'PROJECT_DELETE') || hasPermission(user, 'PROJECT_EDIT')}
            renderSearch
            createLink={hasPermission(user, 'PROJECT_ADD') && "/project/create"}
            createText='Yeni Proje Ekle'
            viewLink={hasPermission(user, 'PROJECT_VIEW') && "/project/view"}
        />
    );
}

export default HomePage