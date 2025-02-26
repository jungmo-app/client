import Header from '@/components/Header';
import AppointmentDetail from './appointmentDetail';
import HeaderTool from './headerTool';

interface AppointmentProps {
  params: Record<string, string>;
}

export default function Appointment({ params }: AppointmentProps) {
  const { id } = params;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="약속 상세">
        <HeaderTool id={Number(id)} />
      </Header>
      <AppointmentDetail id={Number(id)} />
    </div>
  );
}
