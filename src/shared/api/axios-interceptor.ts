// src/shared/api/axios-interceptor.ts
import { axiosInstance } from './axios';
import { authStorage } from '../../features/auth/lib/auth-storage';
import { refreshTokenApi } from '../../features/auth/api/refresh-token.api';
import { authService } from '../../features/auth/model/auth.service';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authStorage.getRefreshToken()
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = authStorage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');
        const data = await refreshTokenApi({ refreshToken });
        authService.loginSuccess(data);
        processQueue(null, data.accessToken);
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authStorage.clearTokens();
        authStorage.clearMe();
        // TODO: 로그아웃/리다이렉트 등 추가 처리
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
