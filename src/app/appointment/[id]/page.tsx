import { QueryClient, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import { Header } from '@/components';
import QueryClientProvider from '@/components/common/queryProvider';
import { DetailGatheringType } from '@/types/gathering';
import { ApiError } from '@/utils/error';
import AppointmentDetail from './appointmentDetail';
import HeaderTool from './headerTool';

export const dynamic = 'force-dynamic';

interface AppointmentProps {
  params: Record<string, string>;
}

export default async function Appointment({ params }: AppointmentProps) {
  const { id } = params;
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery<DetailGatheringType, ApiError>({
      queryKey: ['appointment', Number(id)],
      queryFn: () => apis.serverGathering.getDetail(Number(id), queryClient),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && error.code.startsWith('T')) {
      redirect(`/login?refer=/appointment/${id}&date=${Date.now()}`);
    }
    console.error(error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryClientProvider dehydratedState={dehydratedState}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header title="약속 상세" routeUrl="/">
          <HeaderTool />
        </Header>
        <AppointmentDetail />
      </div>
    </QueryClientProvider>
  );
}
