import AppointmentCalendar from './appointmentCalendar';
import AppointmentList from './appointmentList';
import Header from './header';

export default async function Main() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col bg-background">
        <AppointmentCalendar />
        <AppointmentList />
      </main>
    </div>
  );
}
