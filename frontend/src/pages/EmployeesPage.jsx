import { Box, Button, Card, Chip, Sheet, Skeleton, Table, Typography } from '@mui/joy'
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import axios from 'axios';
import { Group } from '@mui/icons-material';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { useNotification } from '../contexts/NotificationContext';

const roleColors = {
    'EMPLOYEE': 'primary',
    'PROJECT_MANAGER': 'danger',
};
const roleText = {
    'EMPLOYEE': 'Çalışan',
    'PROJECT_MANAGER': 'Proje Yöneticisi',
};

const EmployeesPage = () => {
    const token = useAuthStore((state) => state.token);
    const { addNotification } = useNotification();

    const fetchEmployees = async () => {
        const { data } = await axios.get('http://localhost:8080/employee/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    };
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['employees'],
        queryFn: fetchEmployees,
    });

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
        <>
            <Button
                variant="solid"
                color="primary"
                size="sm"
                sx={{ mb: 2 }}
                component={Link}
                to="/employee/create"
            >
                <Group sx={{ mr: 1 }} />
                Yeni Çalışan Ekle
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
                            <th>Ad Soyad</th>
                            <th>E-Mail</th>
                            <th>Rol</th>
                            <th>Üyelik Tarihi</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((row) => (
                                <tr key={row.id}>
                                    <td><Typography level="body-md" textAlign="left">{row.firstName} {row.lastName}</Typography></td>
                                    <td><Typography level="body-md" textAlign="left">{row.email}</Typography></td>
                                    <td style={{ textAlign: 'left' }}>
                                        <Chip
                                            variant="soft"
                                            size="sm"
                                            color={roleColors[row.role] || 'neutral'}>
                                            {roleText[row.role] || 'Bilinmiyor'}
                                        </Chip>
                                    </td>
                                    <td><Typography level="body-md" textAlign="left">{format(row.createTime, 'dd/MM/yyyy HH:mm')}</Typography></td>
                                    <td>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button variant="plain" color="primary" size="sm" component={Link} to={`/employee/${row.id}`}>Düzenle</Button>
                                            <Button variant="plain" color="danger" size="sm" onClick={() => handleDelete(row.id)}>Sil</Button>
                                        </Box>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Sheet>
        </>
    )
}

export default EmployeesPage