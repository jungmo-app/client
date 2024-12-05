import axios, { type AxiosPromise } from 'axios';
import { getSession } from '@/libs/auth/session';

const axiosConfig = {
  baseURL: '/api',
  timeout: 50000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const baseAxios = axios.create(axiosConfig);
export const privateAxios = axios.create(axiosConfig);

privateAxios.interceptors.request.use(async config => {
  config.headers.Authorization = `Bearer ${await getSession()}`;
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
