'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PlacesToVisit } from '@/components/places-to-visit';
import { APPOINTMENT_DATA, LOCATION_TAGS, PARTICIPANTS, PLACES } from '@/mocks/appointment';
import Footer from './Footer';
import Header from './Header';
import MainInfoSection from './MainInfoSection';
import MainLocation from './MainLocation';
import ParticipantAvatars from './ParticipantAvatars';
import TotalAmountSummary from './TotalAmountSummary';

const AppointmentDetail = () => {
  const params = useParams();
  const appointment = APPOINTMENT_DATA.find(appointment => appointment.id === Number(params.id));

  if (!appointment) {
    return <div>존재하지 않는 약속입니다.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="px-4 pb-20 pt-14">
        <div className="space-y-6 py-4">
          <div>
            <MainInfoSection
              title={appointment.title}
              datetime={appointment.datetime}
              description={appointment.description}
            />
            <ParticipantAvatars participants={PARTICIPANTS} />
            <Link href="/expenses" className="mt-6 block">
              <TotalAmountSummary totalAmount={appointment.totalAmount} size="sm" />
            </Link>
          </div>
          <MainLocation location={appointment.location} tags={LOCATION_TAGS} />
          <PlacesToVisit places={PLACES} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentDetail;
