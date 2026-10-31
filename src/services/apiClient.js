import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // IMPORTANT: keep Axios cancellation errors intact.
    // React StrictMode intentionally aborts the first effect request in development.
    // Converting that error to `new Error('canceled')` makes the UI show a false error state.
    if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    // Preserve the original AxiosError (status, code, response, etc.) while making
    // the server's message available to the UI when one exists.
    const apiMessage = error?.response?.data?.message;
    if (apiMessage && error && typeof error === 'object') {
      error.message = apiMessage;
    }

    return Promise.reject(error);
  },
);

export default apiClient;
