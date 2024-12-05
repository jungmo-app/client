import { apiPaths } from '@/constants/apis';
import { baseAxios, extractAxiosData, privateAxios } from '@/libs/baseAxios';
import { ApiResponse } from '@/types/apis';
import { ChangePasswordRequest, LoginRequest, RegisterRequest } from '@/types/auth';

export const authApis = {
  login: async (payload: LoginRequest) => {
    const response = await extractAxiosData<ApiResponse>(baseAxios.post(apiPaths.auth.login, payload));

    return response;
  },
  register: async (payload: RegisterRequest) => {
    const response = await extractAxiosData<ApiResponse>(baseAxios.post(apiPaths.auth.register, payload));

    return response;
  },
  changePassword: async (payload: ChangePasswordRequest) => {
    const response = await extractAxiosData<ApiResponse>(privateAxios.patch(apiPaths.auth.changePassword, payload));

    return response;
  },
  deleteAccount: async () => {
    const response = await extractAxiosData<ApiResponse>(privateAxios.delete(apiPaths.auth.deleteAccount));

    return response;
  },
} as const;
