import { axiosInstance } from '@shared/api/axios';
import type { GetBoardTypesResponse } from '../types/board-type.type';
import { BOARD_TYPE_ENDPOINTS } from './board-type.endpoint';

export async function getBoardTypesApi(): Promise<GetBoardTypesResponse> {
  const response = await axiosInstance.get<GetBoardTypesResponse>(BOARD_TYPE_ENDPOINTS.LIST);
  return response.data;
}
