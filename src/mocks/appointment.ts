export const PARTICIPANTS = [
  { id: 1, name: 'User 1', image: 'https://picsum.photos/id/517/200/200', email: 'user1@example.com' },
  { id: 2, name: 'User 2', image: 'https://picsum.photos/id/517/200/200', email: 'user2@example.com' },
  { id: 3, name: 'User 3', image: 'https://picsum.photos/id/517/200/200', email: 'user3@example.com' },
  { id: 4, name: 'User 4', image: 'https://picsum.photos/id/517/200/200', email: 'user4@example.com' },
  { id: 5, name: 'User 5', image: 'https://picsum.photos/id/517/200/200', email: 'user5@example.com' },
];

export const LOCATION_TAGS = ['카페', '맛집', '숙소', '주차장'];

export const PLACES = [
  {
    name: '세다지 음식점',
    distance: '8.7km',
    address: '서울 성동구 성수이로22길 37',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    name: '규스홈 레스토랑',
    distance: '5.5km',
    address: '서울 서초구 방배천로 62',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
  },
];

export const APPOINTMENT_DATA = [
  {
    id: 1,
    title: '프로젝트 오프라인 회의',
    datetime: '2024.11.27 13:00',
    description: '와이어프레임 완성하기',
    image: 'https://picsum.photos/id/517/200/200',
    totalAmount: 100000,
    location: {
      name: '이마트 용산점',
      address: '서울 용산구 한강대로23길 55',
    },
  },
  {
    id: 2,
    title: '프로젝트 오프라인 회의2',
    datetime: '2024.11.27 13:00',
    description: '와이어프레임 완성하기',
    image: 'https://picsum.photos/id/513/200/200',
    totalAmount: 100000,
    location: {
      name: '이마트 용산점',
      address: '서울 용산구 한강대로23길 55',
    },
  },
];
