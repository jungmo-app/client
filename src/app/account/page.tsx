'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { PARTICIPANTS } from '@/mocks/appointment';

// 메뉴 아이템 데이터
const myActivities = [
  { label: '신용 및 체크카드', info: '2개 카드', href: '/cards' },
  { label: '은행 계좌', info: '1개 계좌', href: '/accounts' },
];

const mySubscriptions = [{ label: '로그아웃', href: '/logout' }];

export default function AccountPage() {
  const user = PARTICIPANTS[0];

  return (
    <div className="h-full bg-white">
      <Header title="메뉴" />

      {/* 프로필 섹션 */}
      <div className="mb-6 mt-6 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <Link href="/account/edit">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-500">눌러서 내 정보 편집</div>
          </Link>
          <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* 알림 배너 */}
      <div className="mx-4 mb-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div>결제 내역 관리 서비스</div>
            <div className="text-sm text-gray-500">일부 기능 임시 중지 안내 😢</div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* 내 연동 섹션 */}
      <div className="mb-6">
        <h2 className="mb-2 px-4 text-base font-semibold">내 연동</h2>
        {myActivities.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="flex items-center justify-between px-4 py-3">
              <div>{item.label}</div>
              <div className="flex items-center">
                <span className="text-sm text-blue-500">{item.info}</span>
                <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 내 구독 섹션 */}
      <div>
        {mySubscriptions.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="flex items-center justify-between px-4 py-3">
              <div>{item.label}</div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
