import { axiosInstance } from '@shared/api/axios';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function deleteBlockWordApi(id: number): Promise<void> {
  await axiosInstance.delete(SECURITY_ENDPOINTS.BLOCK_WORD_DELETE(id));
}
