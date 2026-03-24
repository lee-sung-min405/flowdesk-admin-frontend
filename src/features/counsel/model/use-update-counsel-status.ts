import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateCounselStatusRequest } from '../types/counsel.type';
import { updateCounselStatusApi } from '../api/update-counsel-status.api';

export function useUpdateCounselStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateCounselStatusRequest }
  >({
    mutationFn: ({ id, data }) => updateCounselStatusApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsels'] });
      queryClient.invalidateQueries({ queryKey: ['counsel-dashboard'] });
    },
  });
}
