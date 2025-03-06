import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import { DateContexProvider } from '@/contexts/DateProvider';
import { redirectLogin } from '@/utils/cookie';
import AppointmentCalendar from './appointmentCalendar';
import AppointmentList from './appointmentList';
import Header from './header';

export default async function Main() {
  redirectLogin();
  const appointmentData = await apis.serverGathering.getList(new Date());
  if (appointmentData === undefined) {
    redirect(`/login?refer=/&date=${Date.now()}`);
  }
  const appointmentList = await Promise.all(
    (appointmentData ?? []).map(async item => {
      const place = await apis.serverPlace.getDetail(item.meetingLocation, ['name']);
      return { ...item, meetingLocation: place?.name ?? '' };
    })
  );

  return (
    <DateContexProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col bg-background">
          <AppointmentCalendar />
          <AppointmentList appointmentData={appointmentList} />
        </main>
      </div>
    </DateContexProvider>
  );
}
