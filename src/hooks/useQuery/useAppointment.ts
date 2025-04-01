import { useQuery } from '@tanstack/react-query';
import { apis } from '@/apis';
import { DetailGatheringType } from '@/types/gathering';

export const useAppointment = (initialData: DetailGatheringType) => {
  const id = initialData.id;

  return useQuery<DetailGatheringType | null | undefined>({
    queryKey: ['appointment', id],
    initialData: initialData,
    queryFn: () => apis.gathering.getDetail(id),
    enabled: false,
  });
};
