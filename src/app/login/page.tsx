import Link from 'next/link';
import LoginForm from './loginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="text-gray-500">계정 정보를 입력해주세요</p>
        </div>
        <LoginForm />

        <div className="flex h-fit items-center justify-center gap-2">
          <Link href="/reset-password" className="text-sm text-blue-500 hover:underline">
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
