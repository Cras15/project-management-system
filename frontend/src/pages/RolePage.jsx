import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { useNotification } from '../contexts/NotificationContext';
import { Box, Chip, Typography } from '@mui/joy';
import { usePaginatedQuery } from '../hooks/usePaginatedQuery';
import PaginatedTable from '../components/PaginatedTable';

const fetchRoles = async ({ page, pageSize, token, searchTerm }) => {
    const { data } = await axios.get(`http://localhost:8080/admin/role?page=${page}&size=${pageSize}&sort=name&search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return data;
};

const RolePage = () => {
    const token = useAuthStore((state) => state.token);
    const { addNotification } = useNotification();

    const {
        refetch,
    } = usePaginatedQuery(
        ['roles'],
        ({ page, pageSize,searchTerm }) => fetchRoles({ page, pageSize, token,searchTerm }),
    );

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
        <PaginatedTable
            queryKey={['roles']}
            fetchFn={fetchRoles}
            columns={roleColumns}
            initialPageSize={5}
            pageSizeOptions={[5, 10, 20]}
            editLink="/role/edit"
            handleDelete={handleDelete}
            renderActions={true}
            renderSearch
            createLink="/role/edit"
            createText='Yeni Rol Ekle'
        />
    )
}

export default RolePage