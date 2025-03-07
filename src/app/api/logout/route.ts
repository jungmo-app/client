import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiPaths } from '@/constants/apis';
import { baseAxios, extractAxiosData } from '@/libs/baseAxios';
import { ApiResponse } from '@/types/apis';
import { resetCookie } from '@/utils/cookie';

export async function POST() {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;
  try {
    const response = await extractAxiosData<ApiResponse>(
      baseAxios.post(
        apiPaths.auth.logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Cookie: `refreshToken=${refreshToken}`,
          },
          withCredentials: true,
        }
      )
    );
    if (response) {
      const res = NextResponse.json({ message: '로그아웃 되었습니다' }, { status: 200 });
      resetCookie(res, 'accessToken');
      resetCookie(res, 'refreshToken');
      return res;
    }
    throw new Error('logout api 실패');
  } catch {
    return NextResponse.json({ message: '로그아웃에 실패하였습니다' }, { status: 500 });
  }
}
