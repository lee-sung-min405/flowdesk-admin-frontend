import { axiosInstance } from '@shared/api/axios';
import type { CreatePostRequest, CreatePostResponse } from '../types/board.type';
import { BOARD_ENDPOINTS } from './board.endpoint';

export async function createPostApi(boardId: number, data: CreatePostRequest): Promise<CreatePostResponse> {
  const response = await axiosInstance.post<CreatePostResponse>(BOARD_ENDPOINTS.POST_CREATE(boardId), data);
  return response.data;
}
