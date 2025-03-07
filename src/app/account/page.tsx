import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import { Header } from '@/components';
import ChangePasswordSheet from './changePasswordSheet';
import DeleteAccountSheet from './deleteAccountSheet';
import InfoForm from './infoForm';
import LogoutButton from './logoutButton';

export default async function AccountPage() {
  const userData = await apis.serverUser.getInfo();
  if (!userData) {
    redirect(`/login?refer=/account&date=${Date.now()}`);
  }
  return (
    <div className="h-full bg-white">
      <Header title="메뉴" />

      {/* 알림 배너 */}
      {/* <div className="mx-4 mb-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div>결제 내역 관리 서비스</div>
            <div className="text-sm text-gray-500">일부 기능 임시 중지 안내 😢</div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div> */}
      <InfoForm userData={userData} />
      <div className="my-8 flex flex-col items-center gap-2">
        {userData.provider === 'email' && <ChangePasswordSheet />}
        <DeleteAccountSheet />
        <LogoutButton />
      </div>
    </div>
  );
}
