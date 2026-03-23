import { axiosInstance } from '@shared/api/axios';
import type { UpdateWebsiteRequest, UpdateWebsiteResponse } from '../types/website.type';
import { WEBSITE_ENDPOINTS } from './website.endpoint';

export async function updateWebsiteApi(webCode: string, data: UpdateWebsiteRequest): Promise<UpdateWebsiteResponse> {
  const response = await axiosInstance.patch<UpdateWebsiteResponse>(WEBSITE_ENDPOINTS.UPDATE(webCode), data);
  return response.data;
}
