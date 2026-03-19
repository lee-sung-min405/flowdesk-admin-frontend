import { axiosInstance } from '@shared/api/axios';
import type { GetPermissionCatalogResponse } from '../types/permission-catalog.type';
import { PERMISSION_CATALOG_ENDPOINTS } from './permission-catalog.endpoint';

export async function getPermissionCatalogApi(): Promise<GetPermissionCatalogResponse> {
  const response = await axiosInstance.get<GetPermissionCatalogResponse>(PERMISSION_CATALOG_ENDPOINTS.CATALOG);
  return response.data;
}
