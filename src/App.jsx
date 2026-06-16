import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import { INITIAL_SERVICES, INITIAL_APPOINTMENTS, getStored, setStored } from './data';
import { TRANSLATIONS } from './i18n';

export default function App() {
  const [page, setPage] = useState('home');
  const [lang, setLang] = useState('en');
  const [services, setServices] = useState(() => getStored('barber_services', INITIAL_SERVICES));
  const [appointments, setAppointments] = useState(() => getStored('barber_appointments', INITIAL_APPOINTMENTS));
  const [preSelectedService, setPreSelectedService] = useState(null);
  const text = TRANSLATIONS[lang];

  function navigate(target) {
    if (target !== 'booking') setPreSelectedService(null);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function preSelectAndBook(service) {
    setPreSelectedService(service);
  }

  function handleBookingConfirmed(appt) {
    const updated = [appt, ...appointments];
    setAppointments(updated);
    setStored('barber_appointments', updated);
    navigate('home');
  }

  function handleStatusChange(id, status) {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    setAppointments(updated);
    setStored('barber_appointments', updated);
  }

  function handleAddService(svc) {
    const updated = [...services, svc];
    setServices(updated);
    setStored('barber_services', updated);
  }

  function handleDeleteService(id) {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    setStored('barber_services', updated);
  }

  return (
    <div className="flex flex-col min-h-screen text-zinc-100">
      <Navbar
        currentPage={page}
        navigate={navigate}
        lang={lang}
        setLang={setLang}
        text={text.nav}
      />
      <main className="flex-grow">
        {page === 'home' && <Home navigate={navigate} text={text.home} />}
        {page === 'services' && (
          <Services services={services} navigate={navigate} preSelectService={preSelectAndBook} text={text.services} />
        )}
        {page === 'booking' && (
          <Booking
            services={services}
            appointments={appointments}
            onBookingConfirmed={handleBookingConfirmed}
            preSelected={preSelectedService}
            text={text.booking}
          />
        )}
        {page === 'dashboard' && (
          <Dashboard
            appointments={appointments}
            services={services}
            onStatusChange={handleStatusChange}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
            text={text.dashboard}
            lang={lang}
          />
        )}
      </main>
      <Footer text={text.footer} />
    </div>
  );
}
