import { axiosInstance } from '@shared/api/axios';
import { USER_ENDPOINTS } from './user.endpoint';

export async function invalidateUserTokensApi(id: number): Promise<void> {
  await axiosInstance.post(USER_ENDPOINTS.INVALIDATE_TOKENS(id));
}
