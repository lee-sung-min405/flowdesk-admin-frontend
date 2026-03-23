import { axiosInstance } from '@shared/api/axios';
import type { UpdateBoardTypeRequest, UpdateBoardTypeResponse } from '../types/board-type.type';
import { BOARD_TYPE_ENDPOINTS } from './board-type.endpoint';

export async function updateBoardTypeApi(
  boardId: number,
  data: UpdateBoardTypeRequest,
): Promise<UpdateBoardTypeResponse> {
  const response = await axiosInstance.patch<UpdateBoardTypeResponse>(BOARD_TYPE_ENDPOINTS.UPDATE(boardId), data);
  return response.data;
}
