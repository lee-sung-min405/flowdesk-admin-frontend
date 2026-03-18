import { axiosInstance } from './axios';

export interface AuthInterceptorDeps {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onRefresh: (refreshToken: string) => Promise<{ accessToken: string }>;
  onRefreshFailure: () => void;
}

export function setupAuthInterceptor(deps: AuthInterceptorDeps) {
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  function processQueue(error: unknown, token: string | null = null) {
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
      const token = deps.getAccessToken();
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        deps.getRefreshToken()
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
          const refreshToken = deps.getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token');
          const data = await deps.onRefresh(refreshToken);
          processQueue(null, data.accessToken);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          }
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          deps.onRefreshFailure();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );
}
