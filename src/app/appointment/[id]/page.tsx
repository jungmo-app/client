import Header from '@/components/Header';
import AppointmentDetail from './appointmentDetail';

interface AppointmentProps {
  params: Record<string, string>;
}

export default function Appointment({ params }: AppointmentProps) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AppointmentDetail id={id} />
    </div>
  );
}
