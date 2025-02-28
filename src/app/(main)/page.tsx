import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import { DateContexProvider } from '@/contexts/DateProvider';
import AppointmentCalendar from './appointmentCalendar';
import AppointmentList from './appointmentList';
import Header from './header';

export default async function Main() {
  const accessToken = cookies().get('accessToken')?.value;

  if (!accessToken) {
    redirect('login');
  }

  const appointmentData = await apis.gathering.getList(new Date());
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
