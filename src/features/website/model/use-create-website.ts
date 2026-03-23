import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateWebsiteRequest, CreateWebsiteResponse } from '../types/website.type';
import { createWebsiteApi } from '../api/create-website.api';

export function useCreateWebsite() {
  const queryClient = useQueryClient();

  return useMutation<CreateWebsiteResponse, AxiosError<ErrorResponse>, CreateWebsiteRequest>({
    mutationFn: createWebsiteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}
