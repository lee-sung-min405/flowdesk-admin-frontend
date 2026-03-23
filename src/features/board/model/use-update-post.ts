import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdatePostRequest, UpdatePostResponse } from '../types/board.type';
import { updatePostApi } from '../api/update-post.api';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdatePostResponse,
    AxiosError<ErrorResponse>,
    { boardId: number; postId: number; data: UpdatePostRequest }
  >({
    mutationFn: ({ boardId, postId, data }) => updatePostApi(boardId, postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
