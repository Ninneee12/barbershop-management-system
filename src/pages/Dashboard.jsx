import { useState } from 'react';
import { Calendar, CheckCircle, DollarSign, Archive, Check, X, Trash2, MessageSquare } from 'lucide-react';

function StatusBadge({ status, text }) {
  const classes = {
    Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  const statusLabels = {
    Pending: text.statusPending,
    Completed: text.statusCompleted,
    Cancelled: text.statusCancelled,
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full border ${classes[status] || classes.Pending}`}>
      {statusLabels[status] || status}
    </span>
  );
}

export default function Dashboard({ appointments, services, onStatusChange, onAddService, onDeleteService, text }) {
  const [activeTab, setActiveTab] = useState('appointments');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newService, setNewService] = useState({ name: '', price: '', duration: '', desc: '' });

  const total = appointments.length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const revenue = appointments
    .filter(a => a.status === 'Completed')
    .reduce((sum, a) => sum + Number(a.servicePrice), 0);

  const filtered = appointments.filter(a => filterStatus === 'all' || a.status === filterStatus);

  async function handleAddService(e) {
    e.preventDefault();
    const svc = {
      name: newService.name,
      price: Number(newService.price),
      duration: Number(newService.duration),
      desc: newService.desc,
    };
    try {
      const saved = await onAddService(svc);
      setNewService({ name: '', price: '', duration: '', desc: '' });
      alert(text.addSuccess.replace('{name}', saved.name));
    } catch {
      alert('Unable to add service. Please try again.');
    }
  }

  async function handleDelete(id) {
    if (confirm(text.deleteConfirm)) {
      try {
        await onDeleteService(id);
      } catch {
        alert('Unable to delete service. Please try again.');
      }
    }
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-800 pb-6 mb-8 gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold">{text.title}</h2>
            <p className="text-zinc-400 text-sm">{text.subtitle}</p>
          </div>
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded border-0 transition ${activeTab === 'appointments' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {text.appointments}
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded border-0 transition ${activeTab === 'services' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              {text.manageServices}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">{text.totalBookings}</span>
              <span className="text-3xl font-bold block mt-1">{total}</span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-gold-500">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">{text.completedSessions}</span>
              <span className="text-3xl font-bold block mt-1">{completed}</span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">{text.earnings}</span>
              <span className="text-3xl font-bold text-gold-400 block mt-1">${revenue.toFixed(2)}</span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-gold-500">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
            <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-semibold text-lg text-white">{text.bookingLog}</h3>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg text-xs p-2.5 focus:outline-none focus:border-gold-500"
              >
                <option value="all">{text.allStatuses}</option>
                <option value="Pending">{text.statusPending}</option>
                <option value="Completed">{text.statusCompleted}</option>
                <option value="Cancelled">{text.statusCancelled}</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <Archive className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">{text.noBookings}</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-950/50 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-4">{text.customer}</th>
                      <th className="p-4">{text.selectedCut}</th>
                      <th className="p-4">{text.barberAssigned}</th>
                      <th className="p-4">{text.scheduledDate}</th>
                      <th className="p-4">{text.status}</th>
                      <th className="p-4 text-right">{text.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/55">
                    {filtered.map(appt => (
                      <tr key={appt.id} className="hover:bg-zinc-900/40 transition duration-150">
                        <td className="p-4">
                          <div className="font-semibold text-white">{appt.clientName}</div>
                          <div className="text-xs text-zinc-500">{appt.clientPhone} &bull; {appt.clientEmail}</div>
                          {appt.notes && (
                            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> {appt.notes}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="block text-sm font-medium text-zinc-200">{appt.serviceName}</span>
                          <span className="text-xs text-gold-400 font-bold">${appt.servicePrice}</span>
                        </td>
                        <td className="p-4 text-zinc-300 text-sm font-medium">{appt.barberName}</td>
                        <td className="p-4">
                          <span className="text-sm text-zinc-200 block">{appt.date}</span>
                          <span className="text-xs text-zinc-500 block">{appt.time}</span>
                        </td>
                        <td className="p-4"><StatusBadge status={appt.status} text={text} /></td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => onStatusChange(appt.id, 'Completed').catch(() => alert('Unable to update appointment status.'))}
                              title={text.markCompleted}
                              className="p-2 bg-zinc-800 text-zinc-400 hover:text-green-500 rounded transition border-0"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onStatusChange(appt.id, 'Cancelled').catch(() => alert('Unable to update appointment status.'))}
                              title={text.cancelAppointment}
                              className="p-2 bg-zinc-800 text-zinc-400 hover:text-red-500 rounded transition border-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add form */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-md h-fit">
              <h3 className="font-semibold text-lg text-white mb-4">{text.addCustomService}</h3>
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">{text.serviceTitle}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skin Fade Haircut"
                    value={newService.name}
                    onChange={e => setNewService(s => ({ ...s, name: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">{text.price}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="35"
                      value={newService.price}
                      onChange={e => setNewService(s => ({ ...s, price: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">{text.duration}</label>
                    <input
                      type="number"
                      required
                      min="5"
                      placeholder="30"
                      value={newService.duration}
                      onChange={e => setNewService(s => ({ ...s, duration: e.target.value }))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-2.5 text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">{text.briefDescription}</label>
                  <textarea
                    required
                    placeholder="Describe what is offered in this specific service..."
                    value={newService.desc}
                    onChange={e => setNewService(s => ({ ...s, desc: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg p-2.5 text-sm h-20 focus:outline-none focus:border-gold-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gold-500 text-zinc-950 font-semibold rounded-lg text-sm hover:bg-gold-400 transition border-0"
                >
                  {text.saveService}
                </button>
              </form>
            </div>

            {/* Services table */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="font-semibold text-lg text-white">{text.activeCatalog}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-950/50 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-4">{text.service}</th>
                      <th className="p-4">{text.duration}</th>
                      <th className="p-4 text-right">{text.price}</th>
                      <th className="p-4 text-right">{text.delete}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/55">
                    {services.map(serv => (
                      <tr key={serv.id} className="hover:bg-zinc-900/40 transition duration-150">
                        <td className="p-4">
                          <div className="font-medium text-white">{serv.name}</div>
                          <p className="text-xs text-zinc-500 truncate max-w-sm" title={serv.desc}>{serv.desc}</p>
                        </td>
                        <td className="p-4 text-zinc-300 text-sm">{serv.duration} {text.mins}</td>
                        <td className="p-4 text-right font-bold text-gold-400 text-sm">${serv.price}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(serv.id)}
                            className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded transition border-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
