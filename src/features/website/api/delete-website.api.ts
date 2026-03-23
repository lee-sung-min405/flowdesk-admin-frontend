import { axiosInstance } from '@shared/api/axios';
import { WEBSITE_ENDPOINTS } from './website.endpoint';

export async function deleteWebsiteApi(webCode: string): Promise<void> {
  await axiosInstance.delete(WEBSITE_ENDPOINTS.DELETE(webCode));
}
