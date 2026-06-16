import { useState } from 'react';
import { ArrowRight, Check, Ticket, Scissors, Sparkles } from 'lucide-react';
import { BARBERS, TIME_SLOTS, getFutureDate } from '../data';
import { interpolate } from '../i18n';

const TOTAL_STEPS = 4;

const barberIcons = {
  Scissors: <Scissors className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Brush: <span className="text-xs font-bold">B</span>,
};

function StepTab({ num, label, active }) {
  return (
    <div className={`py-4 text-center border-b-2 text-xs font-semibold tracking-wider transition ${active ? 'border-gold-500 text-gold-400' : 'border-transparent text-zinc-500'}`}>
      {num}. {label}
    </div>
  );
}

export default function Booking({ services, appointments, onBookingConfirmed, preSelected, text }) {
  const tomorrow = getFutureDate(1);

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preSelected || null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

  function reset() {
    setStep(1);
    setSelectedService(preSelected || null);
    setSelectedBarber(null);
    setSelectedDate(tomorrow);
    setSelectedTime('');
    setForm({ name: '', phone: '', email: '', notes: '' });
  }

  function nextStep() {
    if (step === 1 && !selectedService) { alert(text.alertSelectService); return; }
    if (step === 2 && !selectedBarber) { alert(text.alertSelectBarber); return; }
    if (step === 3 && (!selectedDate || !selectedTime)) { alert(text.alertSelectDateTime); return; }
    if (step === 4) { handleSubmit(); return; }
    setStep(s => s + 1);
  }

  function prevStep() {
    setStep(s => Math.max(1, s - 1));
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.email) { alert(text.alertFillRequired); return; }

    const newAppt = {
      id: 'a_' + Date.now(),
      clientName: form.name,
      clientPhone: form.phone,
      clientEmail: form.email,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      date: selectedDate,
      time: selectedTime,
      notes: form.notes,
      status: 'Pending',
    };

    try {
      await onBookingConfirmed(newAppt);
      alert(interpolate(text.confirmMessage, {
        name: form.name,
        barber: selectedBarber.name,
        date: selectedDate,
        time: selectedTime,
      }));
      reset();
    } catch {
      alert('Unable to save appointment. Please try again.');
    }
  }

  const reservedSlots = appointments
    .filter(a => a.date === selectedDate && a.barberId === selectedBarber?.id && a.status !== 'Cancelled')
    .map(a => a.time);

  const showSummary = selectedService || selectedBarber || selectedDate || selectedTime;

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold mb-2">{text.title}</h2>
          <p className="text-zinc-400 text-sm">{text.subtitle}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-4 border-b border-zinc-800 bg-zinc-950/40">
            <StepTab num={1} label={text.stepService} active={step === 1} />
            <StepTab num={2} label={text.stepBarber} active={step === 2} />
            <StepTab num={3} label={text.stepTime} active={step === 3} />
            <StepTab num={4} label={text.stepClient} active={step === 4} />
          </div>

          <div className="p-6 md:p-8">
            {step === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-zinc-200">{text.selectService}</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {services.map(serv => {
                    const isSelected = selectedService?.id === serv.id;
                    return (
                      <div
                        key={serv.id}
                        onClick={() => setSelectedService(serv)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex justify-between items-center ${isSelected ? 'bg-gold-500/10 border-gold-500' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-gold-400">
                            <Scissors className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-medium text-white block">{serv.name}</span>
                            <span className="text-zinc-500 text-xs block">{serv.duration} {text.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gold-400 text-lg">${serv.price}</span>
                          <span className="text-[10px] uppercase text-zinc-600 tracking-wider block">{text.fee}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-zinc-200">{text.chooseBarber}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BARBERS.map(b => {
                    const isSelected = selectedBarber?.id === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => { setSelectedBarber(b); setSelectedTime(''); }}
                        className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-4 ${isSelected ? 'bg-gold-500/10 border-gold-500' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-zinc-800 text-gold-400 flex items-center justify-center border border-zinc-700">
                          {barberIcons[b.icon] || <Scissors className="w-5 h-5" />}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{b.name}</span>
                          <span className="text-xs text-zinc-500">{b.specialty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-zinc-200">{text.chooseDateTime}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">{text.chooseDate}</label>
                    <input
                      type="date"
                      min={getFutureDate(0)}
                      value={selectedDate}
                      onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">{text.availableSlots}</label>
                    {!selectedDate ? (
                      <p className="text-zinc-500 text-xs py-4 text-center">{text.chooseDateFirst}</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(slot => {
                          const reserved = reservedSlots.includes(slot);
                          const active = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={reserved}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2.5 px-1 text-xs rounded-lg transition border-0 ${
                                reserved
                                  ? 'bg-zinc-950/40 text-zinc-700 cursor-not-allowed'
                                  : active
                                  ? 'bg-gold-500 text-zinc-950 font-bold shadow-md shadow-gold-500/10'
                                  : 'bg-zinc-950 border border-zinc-800 hover:border-gold-500 text-zinc-300'
                              }`}
                            >
                              {reserved ? `${slot} ${text.bookedSuffix}` : slot}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-zinc-200">{text.contactTitle}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">{text.fullName}</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">{text.phone}</label>
                      <input
                        type="tel"
                        required
                        placeholder="(123) 456-7890"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">{text.email}</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">{text.notes}</label>
                    <textarea
                      placeholder={text.notesPlaceholder}
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-3 h-24 focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center pt-6 border-t border-zinc-800">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="px-5 py-2.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-sm font-semibold transition disabled:opacity-30 border-0"
              >
                {text.back}
              </button>
              {step < TOTAL_STEPS ? (
                <button
                  onClick={nextStep}
                  className="px-5 py-2.5 bg-gold-500 text-zinc-950 hover:bg-gold-400 rounded-lg text-sm font-semibold transition flex items-center gap-2 border-0"
                >
                  {text.next} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-green-500/10 border-0"
                >
                  {text.complete} <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {showSummary && (
          <div className="mt-6 bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-xl">
            <h4 className="text-xs uppercase tracking-widest text-gold-400 font-bold mb-3 flex items-center gap-1">
              <Ticket className="w-4 h-4" /> {text.summaryTitle}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-zinc-500 block text-xs">{text.summaryService}</span>
                <span className="font-medium text-white">{selectedService?.name || '-'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">{text.summaryBarber}</span>
                <span className="font-medium text-white">{selectedBarber?.name || '-'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">{text.summaryTime}</span>
                <span className="font-medium text-white">
                  {selectedTime ? `${selectedDate} @ ${selectedTime}` : selectedDate || '-'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block text-xs">{text.summaryPrice}</span>
                <span className="font-bold text-gold-400">{selectedService ? `$${selectedService.price}` : '-'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
