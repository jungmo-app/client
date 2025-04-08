import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiPaths } from '@/constants/apis';
import { resetCookie } from '@/utils/cookie';

export async function POST() {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  const cookieHeader = [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`].join('; ');
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiPaths.auth.logout.slice(1)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: cookieHeader,
        },
      }
    );

    if (response) {
      const res = NextResponse.json({ message: '로그아웃 되었습니다' }, { status: 200 });
      resetCookie(res, 'accessToken');
      resetCookie(res, 'refreshToken');
      return res;
    }
    throw new Error('logout api 실패');
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: '로그아웃에 실패하였습니다' }, { status: 500 });
  }
}
