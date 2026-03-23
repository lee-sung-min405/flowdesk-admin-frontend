import { axiosInstance } from '@shared/api/axios';
import type { GetWebsiteResponse } from '../types/website.type';
import { WEBSITE_ENDPOINTS } from './website.endpoint';

export async function getWebsiteApi(webCode: string): Promise<GetWebsiteResponse> {
  const response = await axiosInstance.get<GetWebsiteResponse>(WEBSITE_ENDPOINTS.DETAIL(webCode));
  return response.data;
}
