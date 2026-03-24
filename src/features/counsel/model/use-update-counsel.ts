import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateCounselRequest, UpdateCounselResponse } from '../types/counsel.type';
import { updateCounselApi } from '../api/update-counsel.api';

export function useUpdateCounsel() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCounselResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateCounselRequest }
  >({
    mutationFn: ({ id, data }) => updateCounselApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsels'] });
    },
  });
}
