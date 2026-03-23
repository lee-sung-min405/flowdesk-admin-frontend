import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteWebsiteApi } from '../api/delete-website.api';

export function useDeleteWebsite() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, string>({
    mutationFn: deleteWebsiteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
}
