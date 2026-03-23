import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetPostsRequest, GetPostsResponse } from '../types/board.type';
import { getPostsApi } from '../api/get-posts.api';

export function usePosts(params: GetPostsRequest) {
  return useQuery<GetPostsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['posts', params.boardId, params.page, params.limit],
    queryFn: () => getPostsApi(params),
    enabled: !!params.boardId,
  });
}
