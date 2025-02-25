/* eslint-disable max-len */

import { apis } from '@/apis';
import Footer from '@/components/Footer';
import { LOCATION_TAGS } from '@/mocks/appointment';
import MainInfoSection from './mainInfoSection';
import MainLocation from './mainLocation';
import ParticipantAvatars from './participantAvatars';
import PlacesToVisit from './placesToVisit';

interface AppointmentDetailProps {
  id: string;
}

export default async function AppointmentDetail({ id }: AppointmentDetailProps) {
  const appointment = await apis.gathering.getDetail(id);

  if (!appointment) {
    return <div className="flex h-screen items-center justify-center">존재하지 않는 약속입니다.</div>;
  }

  const isEditable = appointment.authority === 'WRITE';

  const locationData = await apis.serverPlace.getDetail(appointment.meetingLocation.placeId, [
    'name',
    'formatted_address',
    'geometry',
  ]);

  const point =
    locationData?.geometry?.location?.lat && locationData.geometry.location.lng
      ? [
          locationData.geometry.location.lat as unknown as number,
          locationData.geometry.location.lng as unknown as number,
        ]
      : null;

  const visitLocationData = await Promise.all(
    appointment.locations.map(
      async position =>
        await apis.serverPlace.getDetail(position.placeId, [
          'name',
          'formatted_address',
          'icon_background_color',
          'geometry',
          'photo',
          'type',
          'place_id',
        ])
    )
  );

  return (
    <main className="px-4 pb-20 pt-14">
      <div className="space-y-6 py-4">
        <div>
          <MainInfoSection appointment={appointment} isEditable={isEditable} />
          <ParticipantAvatars participants={appointment.gatheringUsers} />
          {/* <Link href="/expenses" className="mt-6 block">
            <TotalAmountSummary totalAmount={0} size="sm" />
          </Link> */}
        </div>
        <MainLocation appointment={appointment} location={locationData} tags={LOCATION_TAGS} isEditable={isEditable} />
        <PlacesToVisit
          places={visitLocationData.filter(location => location !== null)}
          point={point}
          isEditable={isEditable}
        />
      </div>
      <Footer />
    </main>
  );
}
