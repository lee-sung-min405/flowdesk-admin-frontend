import { axiosInstance } from '@shared/api/axios';
import type { UpdatePostRequest, UpdatePostResponse } from '../types/board.type';
import { BOARD_ENDPOINTS } from './board.endpoint';

export async function updatePostApi(
  boardId: number,
  postId: number,
  data: UpdatePostRequest,
): Promise<UpdatePostResponse> {
  const response = await axiosInstance.patch<UpdatePostResponse>(BOARD_ENDPOINTS.POST_UPDATE(boardId, postId), data);
  return response.data;
}
