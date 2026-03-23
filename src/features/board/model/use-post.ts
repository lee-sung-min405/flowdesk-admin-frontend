import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetPostResponse } from '../types/board.type';
import { getPostApi } from '../api/get-post.api';

export function usePost(boardId: number, postId: number) {
  return useQuery<GetPostResponse, AxiosError<ErrorResponse>>({
    queryKey: ['posts', boardId, postId],
    queryFn: () => getPostApi(boardId, postId),
    enabled: !!boardId && !!postId,
  });
}
