import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateWebsiteStatusRequest, UpdateWebsiteStatusResponse } from '../types/website.type';
import { updateWebsiteStatusApi } from '../api/update-website-status.api';

export function useUpdateWebsiteStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateWebsiteStatusResponse,
    AxiosError<ErrorResponse>,
    { webCode: string; data: UpdateWebsiteStatusRequest }
  >({
    mutationFn: ({ webCode, data }) => updateWebsiteStatusApi(webCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}
