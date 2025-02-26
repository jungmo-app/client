import Header from '@/components/Header';
import AppointmentDetail from './appointmentDetail';

interface AppointmentProps {
  params: Record<string, string>;
}

export default function Appointment({ params }: AppointmentProps) {
  const { id } = params;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <AppointmentDetail id={Number(id)} />
    </div>
  );
}
