import { hasPermission } from '../utils/PermissionControl'
import { useAuthStore } from '../stores/useAuthStore'
import axios from 'axios'
import { useNotification } from '../contexts/NotificationContext'
import { usePaginatedQuery } from '../hooks/usePaginatedQuery'
import PaginatedTable from '../components/PaginatedTable'

const fetchPermissions = async ({ page, pageSize, token, searchTerm }) => {
    const { data } = await axios.get(`http://localhost:8080/admin/permissions?page=${page}&size=${pageSize}&sort=name&search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return data;
};

const PermissionPage = () => {
    const { user, token } = useAuthStore((state) => state);
    const { addNotification } = useNotification();

    const {
        refetch,
    } = usePaginatedQuery(
        ['permissions'],
        ({ page, pageSize, searchTerm }) => fetchPermissions({ page, pageSize, token, searchTerm }),
    );

    const handleDelete = async (permissionId) => {
        if (!window.confirm('Yetki silinecek, onaylıyor musunuz?')) return;
        try {
            await axios.post(`http://localhost:8080/admin/permission/delete/${permissionId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            refetch();
            addNotification('Yetki başarıyla silindi', { type: 'success' });
        } catch (error) {
            addNotification(error.response.data || 'Yetki silinirken hata oluştu', { type: 'danger' });
        }
    }

    return (
        <PaginatedTable
            queryKey={['permissions']}
            fetchFn={fetchPermissions}
            columns={[
                { header: 'Yetki Adı', accessor: 'name', render: (row) => <span>{row.name}</span>, style: { textAlign: 'center' } },
            ]}
            initialPageSize={5}
            pageSizeOptions={[5, 10, 20]}
            renderActions={hasPermission(user, 'PERMISSION_EDIT') || hasPermission(user, 'PERMISSION_DELETE')}
            renderSearch
            handleDelete={handleDelete}
            editLink={hasPermission(user, 'PERMISSION_EDIT') ? '/permission/edit' : null}
            createLink={hasPermission(user, 'PERMISSION_ADD') ? '/permission/edit' : null}
            createText='Yeni Yetki Ekle'
        />
    )
}

export default PermissionPage