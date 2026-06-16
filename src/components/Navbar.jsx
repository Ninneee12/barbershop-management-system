import { useState } from 'react';
import { Scissors, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar({ currentPage, navigate, lang, setLang, text }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'home', label: text.home },
    { id: 'services', label: text.services },
    { id: 'booking', label: text.booking },
  ];

  function handleNav(page) {
    navigate(page);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center space-x-3 bg-transparent border-0 p-0">
            <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center text-zinc-950">
              <Scissors className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="text-left">
              <span className="font-serif text-xl font-bold tracking-wide text-white block">THE SHARP CUT</span>
              <span className="text-xs uppercase tracking-[0.2em] text-gold-400 block -mt-1">Barbershop</span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium transition border-0 bg-transparent ${currentPage === item.id ? 'text-gold-400' : 'text-zinc-300 hover:text-gold-400'}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('dashboard')}
              className={`text-sm font-medium transition border-0 bg-transparent flex items-center gap-1 ${currentPage === 'dashboard' ? 'text-gold-400' : 'text-zinc-300 hover:text-gold-400'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> {text.dashboard}
            </button>
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('booking')}
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-zinc-950 hover:from-gold-400 hover:to-gold-500 font-semibold px-6 py-2.5 rounded-lg text-sm transition shadow-lg shadow-gold-500/10 border-0"
            >
              {text.booking}
            </button>
            <button
              onClick={() => setLang(prev => (prev === 'en' ? 'pt' : 'en'))}
              className="px-3 py-2 rounded-lg text-xs font-bold tracking-wider border border-zinc-700 text-zinc-300 hover:text-white hover:border-gold-500 transition bg-zinc-900/60"
              title={lang === 'en' ? 'Traduzir para Portugues' : 'Translate to English'}
            >
              {lang === 'en' ? 'PT' : 'US'}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setLang(prev => (prev === 'en' ? 'pt' : 'en'))}
              className="px-2.5 py-1.5 rounded-md text-[11px] font-bold tracking-wider border border-zinc-700 text-zinc-300 hover:text-white transition bg-zinc-900/60"
              title={lang === 'en' ? 'Traduzir para Portugues' : 'Translate to English'}
            >
              {lang === 'en' ? 'PT' : 'US'}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="text-zinc-400 hover:text-white bg-transparent border-0 p-0"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900 px-4 py-4 space-y-3">
          {navItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)} className="block w-full text-left text-zinc-300 py-2 bg-transparent border-0">
              {item.label}
            </button>
          ))}
          <button onClick={() => handleNav('dashboard')} className="flex items-center gap-2 text-zinc-300 py-2 bg-transparent border-0 w-full text-left">
            <LayoutDashboard className="w-4 h-4" /> {text.dashboard}
          </button>
        </div>
      )}
    </header>
  );
}
