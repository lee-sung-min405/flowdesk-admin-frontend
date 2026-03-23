import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateWebsiteRequest, UpdateWebsiteResponse } from '../types/website.type';
import { updateWebsiteApi } from '../api/update-website.api';

export function useUpdateWebsite() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateWebsiteResponse,
    AxiosError<ErrorResponse>,
    { webCode: string; data: UpdateWebsiteRequest }
  >({
    mutationFn: ({ webCode, data }) => updateWebsiteApi(webCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}
