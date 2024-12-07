import { PARTICIPANTS } from '@/mocks/appointment';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type Participant = (typeof PARTICIPANTS)[number];

const ParticipantAvatars = ({ participants }: { participants: Participant[] }) => {
  const visibleParticipants = participants.slice(0, 3);
  const remainingCount = participants.length - 3;

  return (
    <div className="flex -space-x-2 px-4">
      {visibleParticipants.map(participant => (
        <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
          <AvatarImage src={participant.image} alt={participant.name} />
          <AvatarFallback>{participant.name[0]}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-sm text-gray-600">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default ParticipantAvatars;
