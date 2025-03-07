import Link from 'next/link';
import { Button } from '@/components/ui';

export default function authPage() {
  return (
    <div>
      <div>카카오 로그인 redirect</div>
      <Link href="/">
        <Button>메인 페이지로 돌아가기</Button>
      </Link>
    </div>
  );
}
