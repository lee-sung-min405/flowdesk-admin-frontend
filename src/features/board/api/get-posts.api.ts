import { axiosInstance } from '@shared/api/axios';
import type { GetPostsRequest, GetPostsResponse } from '../types/board.type';
import { BOARD_ENDPOINTS } from './board.endpoint';

export async function getPostsApi({ boardId, ...params }: GetPostsRequest): Promise<GetPostsResponse> {
  const response = await axiosInstance.get<GetPostsResponse>(BOARD_ENDPOINTS.POSTS(boardId), { params });
  return response.data;
}
