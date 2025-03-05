import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiPaths } from '@/constants/apis';
import { baseAxios, extractAxiosData } from '@/libs/baseAxios';
import { ApiResponse } from '@/types/apis';
import { resetCookie } from '@/utils/cookie';

export async function POST() {
  const accessToken = cookies().get('accessToken')?.value;
  const refreshToken = cookies().get('refreshToken')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: '권한이 없습니다' }, { status: 401 });
  }

  try {
    const response = await extractAxiosData<ApiResponse>(
      baseAxios.delete(apiPaths.user.deleteAccount, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `refreshToken=${refreshToken}`,
        },
        withCredentials: true,
      })
    );

    if (response) {
      const res = NextResponse.json({ message: '계정이 삭제되었습니다' }, { status: 200 });
      resetCookie(res, 'accessToken');
      resetCookie(res, 'refreshToken');
      return res;
    }
    throw new Error('계정 삭제 api 오류');
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: '계정 삭제에 실패하였습니다' }, { status: 500 });
  }
}
