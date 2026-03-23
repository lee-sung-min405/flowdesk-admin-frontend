import { axiosInstance } from '@shared/api/axios';
import { BOARD_TYPE_ENDPOINTS } from './board-type.endpoint';

export async function deleteBoardTypeApi(boardId: number): Promise<void> {
  await axiosInstance.delete(BOARD_TYPE_ENDPOINTS.DELETE(boardId));
}
