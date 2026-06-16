import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import { createAppointment, createService, deleteService, fetchAppointments, fetchServices, updateAppointmentStatus } from './services/api';
import { TRANSLATIONS } from './i18n';

export default function App() {
  const [page, setPage] = useState('home');
  const [lang, setLang] = useState('en');
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preSelectedService, setPreSelectedService] = useState(null);
  const text = TRANSLATIONS[lang];

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError('');
        const [servicesData, appointmentsData] = await Promise.all([
          fetchServices(),
          fetchAppointments(),
        ]);
        setServices(servicesData);
        setAppointments(appointmentsData);
      } catch {
        setError('Unable to connect to API. Check backend server and database.');
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  function navigate(target) {
    if (target !== 'booking') setPreSelectedService(null);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function preSelectAndBook(service) {
    setPreSelectedService(service);
  }

  async function handleBookingConfirmed(appt) {
    const saved = await createAppointment(appt);
    setAppointments(current => [saved, ...current]);
    navigate('home');
  }

  async function handleStatusChange(id, status) {
    const updatedAppt = await updateAppointmentStatus(id, status);
    setAppointments(current => current.map(a => (a.id === id ? updatedAppt : a)));
  }

  async function handleAddService(svc) {
    const saved = await createService(svc);
    setServices(current => [...current, saved]);
    return saved;
  }

  async function handleDeleteService(id) {
    await deleteService(id);
    setServices(current => current.filter(s => s.id !== id));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-zinc-300 text-sm">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
        <p className="text-red-400 text-sm text-center">{error}</p>
      </div>
    );
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
          />
        )}
      </main>
      <Footer text={text.footer} />
    </div>
  );
}
