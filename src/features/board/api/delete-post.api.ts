import { axiosInstance } from '@shared/api/axios';
import { BOARD_ENDPOINTS } from './board.endpoint';

export async function deletePostApi(boardId: number, postId: number): Promise<void> {
  await axiosInstance.delete(BOARD_ENDPOINTS.POST_DELETE(boardId, postId));
}
