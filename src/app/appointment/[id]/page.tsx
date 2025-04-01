import { apis } from '@/apis';
import { Header } from '@/components';
import AppointmentDetail from './appointmentDetail';
import HeaderTool from './headerTool';

export const dynamic = 'force-dynamic';

interface AppointmentProps {
  params: Record<string, string>;
}

export default async function Appointment({ params }: AppointmentProps) {
  const { id } = params;

  const appointment = (await apis.serverGathering.getDetail(Number(id))) ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header title="약속 상세" routeUrl="/">
        <HeaderTool id={Number(id)} appointmentDate={new Date(appointment?.startDate ?? '')} />
      </Header>
      <AppointmentDetail id={Number(id)} appointment={appointment} />
    </div>
  );
}
