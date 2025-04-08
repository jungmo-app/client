import { Header } from '@/components';
import Footer from './footer';
import InfoForm from './infoForm';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  return (
    <div className="h-screen bg-background">
      <Header title="메뉴" routeUrl="/" />

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
      <InfoForm />
      <Footer />
    </div>
  );
}
