import { apiPaths } from '@/constants/apis';
import { extractAxiosData, privateAxios } from '@/libs/baseAxios';
import { ApiResponse } from '@/types/apis';
import { UserDataResponse } from '@/types/user';

export const userApis = {
  search: async (userCode: string) => {
    try {
      const { data } = await extractAxiosData<ApiResponse<UserDataResponse[]>>(
        privateAxios.get(`${apiPaths.user.search}?userCode=${userCode}`)
      );

      if (!data) {
        throw new Error('데이터를 불러올 수 없습니다');
      }
      return data;
    } catch {
      return null;
    }
  },
  getInfo: async () => {
    try {
      const { data } = await extractAxiosData<ApiResponse<UserDataResponse>>(privateAxios.get(apiPaths.user.userInfo));
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
