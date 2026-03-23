import { axiosInstance } from '@shared/api/axios';
import type { CreateWebsiteRequest, CreateWebsiteResponse } from '../types/website.type';
import { WEBSITE_ENDPOINTS } from './website.endpoint';

export async function createWebsiteApi(data: CreateWebsiteRequest): Promise<CreateWebsiteResponse> {
  const response = await axiosInstance.post<CreateWebsiteResponse>(WEBSITE_ENDPOINTS.CREATE, data);
  return response.data;
}
