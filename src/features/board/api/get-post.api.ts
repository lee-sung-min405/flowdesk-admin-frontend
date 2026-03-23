import { axiosInstance } from '@shared/api/axios';
import type { GetPostResponse } from '../types/board.type';
import { BOARD_ENDPOINTS } from './board.endpoint';

export async function getPostApi(boardId: number, postId: number): Promise<GetPostResponse> {
  const response = await axiosInstance.get<GetPostResponse>(BOARD_ENDPOINTS.POST_DETAIL(boardId, postId));
  return response.data;
}
