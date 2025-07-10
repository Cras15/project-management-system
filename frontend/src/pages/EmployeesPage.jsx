import { Box, Chip, Typography } from '@mui/joy'
import { useAuthStore } from '../stores/useAuthStore';
import axios from 'axios';
import { format } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';
import { usePaginatedQuery } from '../hooks/usePaginatedQuery';
import PaginatedTable from '../components/PaginatedTable';

const roleColors = {
    ROLE_ADMIN: 'danger',
    PROJECT_MANAGER: 'primary',
    DEVELOPER: 'success',
};

const employeeColumns = [
    {
        header: 'Ad Soyad',
        style: { textAlign: 'center' },
        render: (row) => <Typography level="body-md">{`${row.firstName} ${row.lastName}`}</Typography>,
    },
    {
        header: 'E-Mail',
        style: { textAlign: 'center' },
        render: (row) => <Typography level="body-sm">{row.email}</Typography>,
    },
    {
        header: 'Rol',
        style: { textAlign: 'center' },
        render: (row) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {row.roles.map((role) => (
                    <Chip key={role.id} variant="soft" size="sm" color={roleColors[role.name] || 'primary'} sx={{ fontSize: '0.75rem' }}>
                        {role.name.replace('ROLE_', '')}
                    </Chip>
                ))}
            </Box>
        ),
    },
    {
        header: 'Üyelik Tarihi',
        style: { textAlign: 'center' },
        render: (row) => (
            <Typography level="body-sm">
                {format(row.createTime, 'dd/MM/yyyy HH:mm')}
            </Typography>
        ),
    },
];

const fetchEmployees = async ({ page, pageSize, token, searchTerm }) => {
    const { data } = await axios.get(`http://localhost:8080/employee/get?page=${page}&size=${pageSize}&sort=firstName&search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return data;
};

const EmployeesPage = () => {
    const token = useAuthStore((state) => state.token);
    const { addNotification } = useNotification();
    const {
        refetch,
    } = usePaginatedQuery(
        ['employees'],
        ({ page, pageSize, searchTerm }) => fetchEmployees({ page, pageSize, token, searchTerm }),
    );

    const handleDelete = async (employeeId) => {
        try {
            if (!window.confirm('Çalışan silinecek, onaylıyor musunuz?')) return;
            await axios.post(`http://localhost:8080/employee/delete/${employeeId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            refetch();
            addNotification('Çalışan başarıyla silindi', { type: 'success' });
        } catch (error) {
            addNotification(error.response.data || 'Çalışan silinirken hata oluştu', { type: 'danger' });
        }
    };
    return (
        <PaginatedTable
            queryKey={['employees']}
            fetchFn={fetchEmployees}
            columns={employeeColumns}
            initialPageSize={5}
            pageSizeOptions={[5, 10, 20]}
            editLink="/employee"
            handleDelete={handleDelete}
            actionColumnHeader="İşlemler"
            renderActions
            renderSearch
            createLink="/employee/create"
            createText='Yeni Çalışan Ekle'
        />
    )
}

export default EmployeesPage