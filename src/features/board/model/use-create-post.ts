import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreatePostRequest, CreatePostResponse } from '../types/board.type';
import { createPostApi } from '../api/create-post.api';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<
    CreatePostResponse,
    AxiosError<ErrorResponse>,
    { boardId: number; data: CreatePostRequest }
  >({
    mutationFn: ({ boardId, data }) => createPostApi(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
