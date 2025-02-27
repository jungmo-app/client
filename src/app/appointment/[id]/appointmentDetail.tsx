import { apis } from '@/apis';
import { LOCATION_TAGS } from '@/mocks/appointment';
import { VisitLocationDataType } from '@/types/gathering';
import MainInfoSection from './mainInfoSection';
import MainLocation from './mainLocation';
import ParticipantAvatars from './participantAvatars';
import PlacesToVisit from './placesToVisit';

interface AppointmentDetailProps {
  id: number;
}

export default async function AppointmentDetail({ id }: AppointmentDetailProps) {
  const appointment = await apis.gathering.getDetail(id);

  if (appointment === null) {
    return <div className="flex h-screen items-center justify-center">존재하지 않는 약속입니다.</div>;
  }

  if (appointment === undefined) {
    return <div className="flex h-screen items-center justify-center">해당 약속을 불러올 수 없습니다.</div>;
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
    appointment.locations.map(async position => {
      const data = await apis.serverPlace.getDetail(position.placeId, [
        'name',
        'formatted_address',
        'icon_background_color',
        'geometry',
        'photo',
        'type',
        'place_id',
      ]);
      if (data) {
        return { id: position.id, place: data };
      }
      return null;
    })
  );

  return (
    <main className={`flex w-full flex-grow px-4 pb-${isEditable ? '20' : '14'} pt-14`}>
      <div className="flex w-full flex-col space-y-6 py-4">
        <MainInfoSection appointment={appointment} isEditable={isEditable} />
        <ParticipantAvatars participants={appointment.gatheringUsers} />
        <MainLocation appointment={appointment} location={locationData} tags={LOCATION_TAGS} isEditable={isEditable} />
        <PlacesToVisit
          appointmentId={id}
          visitPlaces={visitLocationData.filter(location => location !== null) as VisitLocationDataType[]}
          point={point}
          isEditable={isEditable}
        />
      </div>
    </main>
  );
}
