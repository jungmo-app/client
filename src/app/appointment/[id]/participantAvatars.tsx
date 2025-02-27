import { Avatar, AvatarImage, Badge } from '@/components/ui';
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
        <div key={participant.userId} className="group relative">
          <Avatar className="relative h-8 w-8 border-2 border-white">
            <AvatarImage src={participant.profileImagE} alt={participant.userName} />
          </Avatar>
          <Badge
            variant="outline"
            className="invisible absolute left-1/2 top-0 z-[99999] -translate-x-1/2 -translate-y-7 text-nowrap group-hover:visible"
          >
            {participant.userName}
          </Badge>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-sm text-gray-600">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
