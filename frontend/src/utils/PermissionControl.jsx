export const hasPermission = (user, permissionName) => {
    if (!user || !user.role)
        return false;
    if (user.role.length === 0)
        return false;
    if (user.role.map(role => role.name).includes('ROLE_ADMIN'))
        return true;

    return user.role.some(role => {
        const permissions = role?.permissions || [];
        return permissions.some(permission => permission.name === permissionName);
    });
};