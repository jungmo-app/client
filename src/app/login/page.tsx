import Link from 'next/link';
import { Button } from '@/components/ui';
import { redirectMain } from '@/utils/cookie';
import LoginForm from './loginForm';

export default function LoginPage() {
  redirectMain();
  return (
    <div className="flex min-h-screen flex-col justify-center bg-white p-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="text-gray-500">계정 정보를 입력해주세요</p>
        </div>
        <LoginForm />
        <div className="relative" style={{ marginTop: '16px', marginBottom: '12px' }}>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Link href="">
          <Button
            variant="outline"
            className="h-12 w-full rounded-full border-2 border-yellow-400 bg-yellow-400 font-semibold text-black hover:bg-yellow-500"
          >
            카카오로 로그인하기
          </Button>
        </Link>

        <div className="flex h-fit items-center justify-center gap-2">
          <Link href="/find" className="text-sm text-blue-500 hover:underline">
            비밀번호 찾기
          </Link>
          <div className="h-3 w-1 border-l border-neutral-400" />
          <Link href="/signup" className="text-sm text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
