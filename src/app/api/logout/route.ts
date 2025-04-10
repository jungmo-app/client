import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiPaths } from '@/constants/apis';
import { resetCookie } from '@/libs/serverAction';

export async function POST() {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const cookieHeader = [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`].join('; ');
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.logout.slice(1)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
        },
      }
    );

    const res = NextResponse.json({ message: '로그아웃 되었습니다' }, { status: 200 });
    resetCookie(res, 'accessToken');
    resetCookie(res, 'refreshToken');

    return res;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status } = error.response;
      const { code, message } = error.response.data;
      return NextResponse.json({ message, code }, { status });
    }
    return NextResponse.json({ message: '로그아웃 서버 오류', code: 'LS001' }, { status: 500 });
  }
}
