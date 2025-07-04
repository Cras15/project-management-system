import axios from 'axios';
import CustomTable from '../components/CustomTable'
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { useNotification } from '../contexts/NotificationContext';
import { Box, Chip, Typography } from '@mui/joy';

const RolePage = () => {
    const token = useAuthStore((state) => state.token);
    const { addNotification } = useNotification();
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:8080/admin/role', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        },
    });
    const roleColumns = [
        {
            header: 'Rol Adı',
            style: { textAlign: 'center' },
            render: (row) => <span>{row.name}</span>,
        },
        {
            header: 'İzinler',
            style: { textAlign: 'center', width: '60%' },
            render: (row) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {row.permissions.map((permission, index) => (
                        index < 22 &&
                        <Chip key={permission.id} variant="soft" size="sm" color="primary" sx={{ fontSize: '0.75rem' }}>
                            {permission.name}
                        </Chip>
                    ))}
                    {row?.permissions?.length > 22 && <Typography>...</Typography>}
                </Box>
            ),
        },
    ];
    const handleDelete = async (roleId) => {
        try {
            if (!window.confirm('Rol silinecek, onaylıyor musunuz?')) return;
            await axios.post(`http://localhost:8080/admin/role/delete/${roleId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            refetch();
            addNotification('Rol başarıyla silindi', { type: 'success' });
        } catch (error) {
            addNotification(error.response.data || 'Rol silinirken hata oluştu', { type: 'danger' });
        }
    };

    return (
        <CustomTable
            columns={roleColumns}
            data={data}
            editLink="/role/edit"
            handleDelete={handleDelete}
            renderActions={true}
            createLink="/role/edit"
            createText='Yeni Rol Ekle'
        />
    )
}

export default RolePage