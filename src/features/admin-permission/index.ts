export { default as AdminPermissionTable } from './ui/admin-permission-table/admin-permission-table.tsx';
export { default as AdminPermissionDetail } from './ui/admin-permission-detail/admin-permission-detail.tsx';
export { default as AdminPermissionCreateForm } from './ui/admin-permission-create-form/admin-permission-create-form.tsx';
export { default as AdminPermissionEditForm } from './ui/admin-permission-edit-form/admin-permission-edit-form.tsx';

export { useAdminPermissions } from './model/use-admin-permissions';
export { useAdminPermission } from './model/use-admin-permission';
export { useCreateAdminPermission } from './model/use-create-admin-permission';
export { useUpdateAdminPermission } from './model/use-update-admin-permission';
export { useUpdateAdminPermissionStatus } from './model/use-update-admin-permission-status';
export { useDeleteAdminPermission } from './model/use-delete-admin-permission';

export { createAdminPermissionSchema } from './model/create-admin-permission.schema';
export { updateAdminPermissionSchema } from './model/update-admin-permission.schema';

export * from './types/admin-permission.type';
