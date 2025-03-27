import Link from 'next/link';
import { Button } from '@/components/ui';

export default function RequestInfo() {
  return (
    <div className="flex flex-grow items-center justify-center">
      <div className="rounded-lg bg-background p-8 text-center shadow-xl">
        <p className="text-slate-600">
          비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해주세요. 만약 몇 분이 지나도 안 보인다면 스팸 폴더를
          확인해보세요.
        </p>
        <Link href="/login" className="mt-4 inline-block rounded px-4 py-2 font-semibold">
          <Button size="sm">로그인 페이지로 이동</Button>
        </Link>
      </div>
    </div>
  );
}
