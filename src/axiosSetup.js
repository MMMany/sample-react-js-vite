// api/axios.js
import axios from "axios";
import { useAuthStore } from "./stores";

axios.defaults.baseURL = "/api";
axios.defaults.withCredentials = true;

// 요청 인터셉터: 토큰 첨부
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 토큰 리프레시 대기용 큐
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// 응답 인터셉터: 401 처리
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore.getState();
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 && error.response?.data?.message === "token expired" && !originalRequest._retry;

    if (isTokenExpired) {
      originalRequest._retry = true;

      if (!authStore.isRefreshing) {
        authStore.setIsRefreshing(true);

        try {
          const response = await axios.post("/auth/v1/refresh", {}, { withCredentials: true });

          const { accessToken } = response.data;
          authStore.setAccessToken(accessToken);
          authStore.setIsRefreshing(false);

          // 대기 중 요청 재시도
          onRefreshed(accessToken);
        } catch (e) {
          authStore.logout();
          return Promise.reject(e);
        }
      }

      // 토큰 갱신 완료 후 재시도
      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }

    // 토큰 만료가 아닌 다른 401
    if (error.response?.status === 401) {
      authStore.logout();
    }

    return Promise.reject(error);
  },
);
