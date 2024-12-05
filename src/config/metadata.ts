import { SiteConfig } from '@/types/config';

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

export const siteConfig: SiteConfig = {
  name: '정모 : Jungmo',
  author: 'jungmo',
  description: '일정을 한번에 관리하는 올인원 플랫폼',
  keywords: [
    '모임 관리',
    '일정 공유',
    '약속 관리',
    '여행 계획',
    '모임 일정',
    '친구 일정',
    '일정 관리 앱',
    '모임 플래너',
    '단체 일정',
    '일정 조율',
    '모임 정산',
  ],
  url: {
    base: baseUrl,
    author: 'https://github.com/jungmo-app',
  },
  ogImage: `${baseUrl}/og.png`,
};
