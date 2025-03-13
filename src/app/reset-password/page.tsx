import { Header } from '@/components';
import ResetConfirm from './resetConfirm';
import ResetRequest from './resetRequest';

interface ResetPasswordProps {
  searchParams: Record<string, string | undefined>;
}

export default function resetPasswordPage({ searchParams }: ResetPasswordProps) {
  const token = searchParams.token;

  return (
    <div>
      <Header />
      <div className="mx-auto w-full max-w-md space-y-6 p-2">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">비밀번호 초기화</h1>
        </div>
        {token ? <ResetConfirm token={token} /> : <ResetRequest />}
      </div>
    </div>
  );
}
