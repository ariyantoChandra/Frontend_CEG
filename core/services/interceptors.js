import axios from 'axios';

export const setupInterceptorsTo = (axiosInstance, options = {}) => {
    const { onUnauthorized, disableErrorToast = false } = options;

    axiosInstance.interceptors.request.use(
        (config) => {
            try {
                if (typeof window !== 'undefined') {
                    // Prefer cookie, fallback to localStorage
                    const tokenFromCookie = document.cookie
                        ?.split('; ')
                        ?.find((c) => c.startsWith('token='))
                        ?.split('=')[1];
                    const token = tokenFromCookie || localStorage.getItem('token');
                    if (token && !config.headers?.Authorization) {
                        config.headers = {
                            ...config.headers,
                            Authorization: `Bearer ${decodeURIComponent(token)}`,
                        };
                    }
                }
            } catch { }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error?.response?.status;
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.removeItem('token');
                        document.cookie = 'token=; path=/; max-age=0';
                    } catch { }
                    if (onUnauthorized) onUnauthorized();
                    else window.location.replace('/login');
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export const createHandleRequest = () => {
    return async (promise) => {
        try {
            const res = await promise;
            return res;
        } catch (err) {
            throw err;
        }
    };
};
