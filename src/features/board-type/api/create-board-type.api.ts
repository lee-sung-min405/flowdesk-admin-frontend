import { axiosInstance } from '@shared/api/axios';
import type { CreateBoardTypeRequest, CreateBoardTypeResponse } from '../types/board-type.type';
import { BOARD_TYPE_ENDPOINTS } from './board-type.endpoint';

export async function createBoardTypeApi(data: CreateBoardTypeRequest): Promise<CreateBoardTypeResponse> {
  const response = await axiosInstance.post<CreateBoardTypeResponse>(BOARD_TYPE_ENDPOINTS.CREATE, data);
  return response.data;
}
