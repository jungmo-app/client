'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function KakaoMobileRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      window.location.href = `jungmo://oauthredirect?code=${code}`;
      return;
    }

    window.location.href = `jungmo://oauthredirect?error=missing_code`;
  }, [searchParams]);
  return (
    <div className="flex size-full items-center justify-center">
      <p>카카오 로그인 중입니다... 앱으로 돌아가는 중입니다.</p>
    </div>
  );
}
