import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteCounselApi } from '../api/delete-counsel.api';

export function useDeleteCounsel() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteCounselApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsels'] });
    },
  });
}
