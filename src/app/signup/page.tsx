import { Header } from '@/components';
import SignupForm from './signupForm';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header routeUrl="/login" />
      <div className="mx-auto w-full max-w-md flex-grow space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-gray-500">계정 정보를 입력해주세요</p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
