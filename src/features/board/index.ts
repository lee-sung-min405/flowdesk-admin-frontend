export { default as PostTable } from './ui/post-table/post-table.tsx';
export { default as PostDetail } from './ui/post-detail/post-detail.tsx';
export { default as PostCreateForm } from './ui/post-create-form/post-create-form.tsx';
export { default as PostEditForm } from './ui/post-edit-form/post-edit-form.tsx';

export { usePosts } from './model/use-posts';
export { usePost } from './model/use-post';
export { useCreatePost } from './model/use-create-post';
export { useUpdatePost } from './model/use-update-post';
export { useDeletePost } from './model/use-delete-post';

export { createPostSchema } from './model/create-post.schema';
export { updatePostSchema } from './model/update-post.schema';

export * from './types/board.type';
