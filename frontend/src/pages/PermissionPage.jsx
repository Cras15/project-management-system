import React from 'react'
import CustomTable from '../components/CustomTable'
import { hasPermission } from '../utils/PermissionControl'
import { useAuthStore } from '../stores/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useNotification } from '../contexts/NotificationContext'

const PermissionPage = () => {
    const { user, token } = useAuthStore((state) => state);
    const {addNotification} = useNotification();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:8080/admin/permissions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            return response.data;
        },
        enabled: hasPermission(user, 'PERMISSION_GET')
    });

    const handleDelete = async (permissionId) => {
        if (!window.confirm('Yetki silinecek, onaylıyor musunuz?')) return;
        try {
            await axios.post(`http://localhost:8080/admin/permission/delete/${permissionId}`,{}, {
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
        <CustomTable
            columns={[
                { header: 'Yetki Adı', accessor: 'name', render: (row) => <span>{row.name}</span>, style: { textAlign: 'center' } },
            ]}
            renderActions={hasPermission(user, 'PERMISSION_EDIT') || hasPermission(user, 'PERMISSION_DELETE')}
            data={data}
            handleDelete={handleDelete}
            editLink={hasPermission(user, 'PERMISSION_EDIT') ? '/permission/edit' : null}
            createLink={hasPermission(user, 'PERMISSION_ADD') ? '/permission/edit' : null}
            createText='Yeni Yetki Ekle'
        />
    )
}

export default PermissionPage