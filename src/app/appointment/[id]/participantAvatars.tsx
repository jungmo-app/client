import { User2 } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui';
import { GatheringUsers } from '@/types/gathering';

interface ParticipantAvatarsProps {
  participants: GatheringUsers[];
}

export default function ParticipantAvatars({ participants }: ParticipantAvatarsProps) {
  const visibleParticipants = participants.slice(0, 3);
  const remainingCount = participants.length - 3;

  return (
    <div className="flex -space-x-2 px-4">
      {visibleParticipants.map(participant => (
        <Avatar key={participant.userId} className="h-8 w-8 border-2 border-white">
          {participant.profileImagE ? (
            <AvatarImage src={participant.profileImagE} alt={participant.userName} />
          ) : (
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              <User2 />
            </div>
          )}
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-sm text-gray-600">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
