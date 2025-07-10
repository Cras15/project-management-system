import { useAuthStore } from '../stores/useAuthStore';
import { Link, useNavigate, useParams } from 'react-router';
import { useNotification } from '../contexts/NotificationContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Autorenew, CheckCircle, DeleteForever, Edit, NewReleases, People } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Sheet, Table, Typography } from '@mui/joy';
import { hasPermission } from '../utils/PermissionControl';

const roleColors = {
    ROLE_ADMIN: 'danger',
    ROLE_PROJECT_MANAGER: 'warning',
    ROLE_EMPLOYEE: 'primary',
    ROLE_DEVELOPER: 'success',
};

const getStatusChipProps = (status) => {
    switch (status) {
        case 'NEW':
            return { color: 'primary', icon: <NewReleases />, label: 'Yeni' };
        case 'IN_PROGRESS':
            return { color: 'warning', icon: <Autorenew />, label: 'Devam Ediyor' };
        case 'COMPLETED':
            return { color: 'success', icon: <CheckCircle />, label: 'Tamamlandı' };
        default:
            return { color: 'neutral', label: status };
    }
};

const ViewProjectPage = () => {
    const { token, user } = useAuthStore((state) => state);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['project'],
        queryFn: async () => await axios.get(`http://localhost:8080/project/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.data),
        enabled: !!id,
    });

    const handleDelete = async (projectId) => {
        try {
            if (!window.confirm('Proje silinecek, onaylıyor musunuz?')) return;
            await axios.post(`http://localhost:8080/project/delete/${projectId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            refetch();
            addNotification('Proje başarıyla silindi', { type: 'success' });
            navigate("/");
        } catch (error) {
            addNotification(error.response.data || 'Proje silinirken hata oluştu', { type: 'danger' });
        }
    };

    const statusProps = getStatusChipProps(data != null && data?.status);

    return (
        <Sheet
            variant="outlined"
            sx={{
                maxWidth: 1000,
                width: '100%',
                mx: 'auto',
                my: 4,
                p: 3,
                borderRadius: 'md',
                boxShadow: 'lg',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography level="h2" component="h1">
                        {data?.projectName}
                    </Typography>
                    <Chip
                        variant="soft"
                        color={statusProps.color}
                        startDecorator={statusProps.icon}
                    >
                        {statusProps.label}
                    </Chip>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {hasPermission(user, 'PROJECT_EDIT') &&
                        <Button variant="outlined" color="primary" startDecorator={<Edit />} component={Link} to={`/project/${data?.id}`}>
                            Projeyi Düzenle
                        </Button>
                    }
                    {hasPermission(user, 'PROJECT_DELETE') &&
                        <Button variant="solid" color="danger" startDecorator={<DeleteForever />} onClick={() => handleDelete(data?.id)}>
                            Sil
                        </Button>
                    }
                </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography level="h4" component="h2" startDecorator={<People />} sx={{ mb: 2 }}>
                    Projeye Atanan Çalışanlar
                </Typography>
                <Sheet
                    variant="outlined"
                    sx={{
                        borderRadius: 'sm',
                        overflow: 'auto',
                    }}
                >
                    <Table
                        aria-label="Atanan çalışanlar tablosu"
                        stickyHeader
                    >
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Çalışan</th>
                                <th>E-posta</th>
                                <th>Roller</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.assignedEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar size="sm">
                                                {employee.firstName[0]}{employee.lastName[0]}
                                            </Avatar>
                                            <Typography level="body-sm" fontWeight="lg">
                                                {employee.firstName} {employee.lastName}
                                            </Typography>
                                        </Box>
                                    </td>
                                    <td>
                                        <Typography level="body-sm" textAlign="left">{employee.email}</Typography>
                                    </td>
                                    <td>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {employee.roles.map((role) => (
                                                <Chip key={role.id} variant="soft" size="sm" color={roleColors[role.name]}>
                                                    {role.name.replace('ROLE_', '')}
                                                </Chip>
                                            ))}
                                        </Box>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Sheet>
            </Box>
        </Sheet>
    )
}

export default ViewProjectPage;