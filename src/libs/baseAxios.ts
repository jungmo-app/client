import axios, { type AxiosPromise } from 'axios';
import { getCookie } from '@/libs/auth/session';

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 50000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const baseAxios = axios.create(axiosConfig);
export const privateAxios = axios.create(axiosConfig);

privateAxios.interceptors.request.use(async config => {
  config.headers.Authorization = `Bearer ${await getCookie('accessToken')}`;
  return config;
});

export const extractAxiosData = async <T>(axiosPromise: AxiosPromise<T>) => {
  try {
    const result = await axiosPromise;
    return result.data;
  } catch (error) {
    console.error('Error extracting axios data:', error);
    throw error;
  }
};
