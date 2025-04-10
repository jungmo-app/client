import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiPaths } from '@/constants/apis';
import { baseAxios, extractAxiosData } from '@/libs/baseAxios';
import { resetCookie } from '@/libs/serverAction';
import { ApiResponse } from '@/types/apis';

export async function POST() {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: '권한이 없습니다' }, { status: 401 });
  }

  try {
    await extractAxiosData<ApiResponse>(
      baseAxios.delete(apiPaths.user.deleteAccount, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `refreshToken=${refreshToken}`,
        },
        withCredentials: true,
      })
    );

    const res = NextResponse.json({ message: '계정이 삭제되었습니다' }, { status: 200 });
    resetCookie(res, 'accessToken');
    resetCookie(res, 'refreshToken');

    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      const { code, message } = error.response.data;
      return NextResponse.json({ message, code }, { status });
    }
    return NextResponse.json({ message: '계정 삭제 서버 오류류', code: 'DA001' }, { status: 500 });
  }
}
