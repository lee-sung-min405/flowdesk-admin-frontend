import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deletePostApi } from '../api/delete-post.api';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, { boardId: number; postId: number }>({
    mutationFn: ({ boardId, postId }) => deletePostApi(boardId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
