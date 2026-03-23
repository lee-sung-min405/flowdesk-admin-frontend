import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetWebsiteResponse } from '../types/website.type';
import { getWebsiteApi } from '../api/get-website.api';

export function useWebsite(webCode: string) {
  return useQuery<GetWebsiteResponse, AxiosError<ErrorResponse>>({
    queryKey: ['websites', webCode],
    queryFn: () => getWebsiteApi(webCode),
    enabled: !!webCode,
  });
}
