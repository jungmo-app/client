import { apis } from '@/apis';
import { DateContexProvider } from '@/contexts/DateProvider';
import { redirectLogin } from '@/utils/cookie';
import AppointmentCalendar from './appointmentCalendar';
import AppointmentList from './appointmentList';
import Header from './header';

export default async function Main() {
  redirectLogin();
  const appointmentData = await apis.serverGathering.getList(new Date());

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
          {appointmentList ? (
            <AppointmentList appointmentData={appointmentList} />
          ) : (
            <div className="flex flex-1 items-center justify-center">일정을 불러올 수 없습니다</div>
          )}
        </main>
      </div>
    </DateContexProvider>
  );
}
