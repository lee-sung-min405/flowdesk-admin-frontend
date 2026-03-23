import { axiosInstance } from '@shared/api/axios';
import type { UpdateWebsiteStatusRequest, UpdateWebsiteStatusResponse } from '../types/website.type';
import { WEBSITE_ENDPOINTS } from './website.endpoint';

export async function updateWebsiteStatusApi(
  webCode: string,
  data: UpdateWebsiteStatusRequest,
): Promise<UpdateWebsiteStatusResponse> {
  const response = await axiosInstance.patch<UpdateWebsiteStatusResponse>(WEBSITE_ENDPOINTS.STATUS(webCode), data);
  return response.data;
}
