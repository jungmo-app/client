/* eslint-disable max-len */

import { gatheringApis } from '@/apis/gathering';
import Footer from '@/components/Footer';
import { LOCATION_TAGS, PLACES } from '@/mocks/appointment';
import MainInfoSection from './mainInfoSection';
import MainLocation from './mainLocation';
import ParticipantAvatars from './participantAvatars';
import PlacesToVisit from './placesToVisit';

interface AppointmentDetailProps {
  id: string;
}

export default async function AppointmentDetail({ id }: AppointmentDetailProps) {
  const appointment = await gatheringApis.getDetail(id);

  if (!appointment) {
    return <div className="flex h-screen items-center justify-center">존재하지 않는 약속입니다.</div>;
  }

  return (
    <main className="px-4 pb-20 pt-14">
      <div className="space-y-6 py-4">
        <div>
          <MainInfoSection
            description={appointment.memo}
            title={appointment.title}
            datetime={`${appointment.startDate} ${appointment.startDate}`}
          />
          <ParticipantAvatars participants={appointment.gatheringUsers} />
          {/* <Link href="/expenses" className="mt-6 block">
            <TotalAmountSummary totalAmount={0} size="sm" />
          </Link> */}
        </div>
        <MainLocation location={appointment.meetingLocation} tags={LOCATION_TAGS} />

        <PlacesToVisit places={PLACES} />
      </div>
      <Footer />
    </main>
  );
}
