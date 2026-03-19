export { default as AdminPageTable } from './ui/admin-page-table/admin-page-table.tsx';
export { default as AdminPageDetail } from './ui/admin-page-detail/admin-page-detail.tsx';
export { default as AdminPageCreateForm } from './ui/admin-page-create-form/admin-page-create-form.tsx';
export { default as AdminPageEditForm } from './ui/admin-page-edit-form/admin-page-edit-form.tsx';

export { useAdminPages } from './model/use-admin-pages';
export { useAdminPage } from './model/use-admin-page';
export { useCreateAdminPage } from './model/use-create-admin-page';
export { useUpdateAdminPage } from './model/use-update-admin-page';
export { useUpdateAdminPageStatus } from './model/use-update-admin-page-status';
export { useDeleteAdminPage } from './model/use-delete-admin-page';

export { createAdminPageSchema } from './model/create-admin-page.schema';
export { updateAdminPageSchema } from './model/update-admin-page.schema';

export * from './types/admin-page.type';
