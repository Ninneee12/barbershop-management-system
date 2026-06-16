import { Clock, ChevronRight } from 'lucide-react';

export default function Services({ services, navigate, preSelectService, text }) {
  function handleBookNow(service) {
    preSelectService(service);
    navigate('booking');
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{text.title}</h2>
          <p className="text-zinc-400 text-sm md:text-base">
            {text.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(serv => (
            <div
              key={serv.id}
              className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-6 hover:border-gold-500/50 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-serif text-xl font-bold text-white">{serv.name}</h3>
                  <span className="text-gold-400 font-bold text-lg">${serv.price}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{serv.description}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-800/60 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {serv.duration} {text.mins}
                </span>
                <button
                  onClick={() => handleBookNow(serv)}
                  className="text-gold-400 font-semibold hover:text-white transition flex items-center gap-1 bg-transparent border-0 p-0 text-xs"
                >
                  {text.bookNow} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
