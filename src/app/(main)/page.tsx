import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apis } from '@/apis';
import AppointmentCalendar from './appointmentCalendar';
import AppointmentList from './appointmentList';
import Header from './header';

export default async function Main() {
  const accessToken = cookies().get('accessToken')?.value;
  if (!accessToken) {
    redirect(`/login?refer=/&date=${Date.now()}`);
  }

  const appointmentData = await apis.serverGathering.getList(new Date());
  if (!appointmentData) {
    redirect(`/login?refer=/&date=${Date.now()}`);
  }
  const appointmentList = await Promise.all(
    (appointmentData ?? []).map(async item => {
      const place = await apis.serverPlace.getDetail(item.meetingLocation, ['name']);
      return { ...item, meetingLocation: place?.name ?? '' };
    })
  );

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col bg-background">
        <AppointmentCalendar />
        {appointmentList ? (
          <AppointmentList appointmentData={appointmentList} />
        ) : (
          <div className="flex flex-1 items-center justify-center">일정을 불러올 수 없습니다</div>
        )}
      </main>
    </div>
  );
}
