import { axiosInstance } from '@shared/api/axios';
import type { GetBoardTypeResponse } from '../types/board-type.type';
import { BOARD_TYPE_ENDPOINTS } from './board-type.endpoint';

export async function getBoardTypeApi(boardId: number): Promise<GetBoardTypeResponse> {
  const response = await axiosInstance.get<GetBoardTypeResponse>(BOARD_TYPE_ENDPOINTS.DETAIL(boardId));
  return response.data;
}
