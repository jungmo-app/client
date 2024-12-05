import { PlacesToVisit } from '@/components/places-to-visit';
import Footer from './Footer';
import Header from './Header';
import MainInfoSection from './MainInfoSection';
import MainLocation from './MainLocation';
import ParticipantAvatars from './ParticipantAvatars';

const APPOINTMENT_DATA = {
  title: '프로젝트 오프라인 회의',
  datetime: '2024.11.27 13:00',
  description: '와이어프레임 완성하기',
  location: {
    name: '이마트 용산점',
    address: '서울 용산구 한강대로23길 55',
  },
};

const LOCATION_TAGS = ['카페', '맛집', '숙소', '주차장'];

const PLACES = [
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

export const PARTICIPANTS = [
  { id: 1, name: 'User 1', image: 'https://picsum.photos/id/517/200/200' },
  { id: 2, name: 'User 2', image: 'https://picsum.photos/id/517/200/200' },
  { id: 3, name: 'User 3', image: 'https://picsum.photos/id/517/200/200' },
  { id: 4, name: 'User 4', image: 'https://picsum.photos/id/517/200/200' },
  { id: 5, name: 'User 5', image: 'https://picsum.photos/id/517/200/200' },
];

const AppointmentDetail = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-4 pb-20 pt-14">
        <div className="space-y-6 py-4">
          <div>
            <MainInfoSection
              title={APPOINTMENT_DATA.title}
              datetime={APPOINTMENT_DATA.datetime}
              description={APPOINTMENT_DATA.description}
            />
            <ParticipantAvatars participants={PARTICIPANTS} />
          </div>
          <MainLocation location={APPOINTMENT_DATA.location} tags={LOCATION_TAGS} />
          <PlacesToVisit places={PLACES} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentDetail;
