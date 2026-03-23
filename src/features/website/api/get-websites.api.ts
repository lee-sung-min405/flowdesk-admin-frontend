import { axiosInstance } from '@shared/api/axios';
import type { GetWebsitesRequest, GetWebsitesResponse } from '../types/website.type';
import { WEBSITE_ENDPOINTS } from './website.endpoint';

export async function getWebsitesApi(params: GetWebsitesRequest): Promise<GetWebsitesResponse> {
  const response = await axiosInstance.get<GetWebsitesResponse>(WEBSITE_ENDPOINTS.LIST, { params });
  return response.data;
}
