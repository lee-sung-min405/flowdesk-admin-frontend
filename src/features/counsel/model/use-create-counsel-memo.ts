import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateMemoRequest, CreateMemoResponse } from '../types/counsel.type';
import { createCounselMemoApi } from '../api/create-counsel-memo.api';

export function useCreateCounselMemo() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateMemoResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: CreateMemoRequest }
  >({
    mutationFn: ({ id, data }) => createCounselMemoApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsels'] });
    },
  });
}
