import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateProfileRequest, UpdateProfileResponse } from '../types/auth.type';
import { updateProfileApi } from '../api/update-profile.api';
import { authStorage } from '../lib/auth-storage';
import { useAuthStore } from './auth.store';

export function useUpdateProfile() {
  return useMutation<UpdateProfileResponse, AxiosError<ErrorResponse>, UpdateProfileRequest>({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      const currentMe = useAuthStore.getState().me;
      if (!currentMe) return;

      const mergedMe = {
        ...currentMe,
        user: { ...currentMe.user, ...data },
      };

      authStorage.setMe(mergedMe);
      useAuthStore.getState().setMe(mergedMe);
    },
  });
}
