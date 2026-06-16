import { Scissors, Clock, Sparkles, Calendar } from 'lucide-react';

const featureIcons = [
  <Scissors key="f1" className="w-6 h-6" />,
  <Clock key="f2" className="w-6 h-6" />,
  <Sparkles key="f3" className="w-6 h-6" />,
];

export default function Home({ navigate, text }) {
  return (
    <div>
      <div className="relative py-24 md:py-32 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-3 py-1 bg-zinc-800 text-gold-400 text-xs font-semibold tracking-widest rounded-full uppercase mb-4 border border-zinc-700">
            {text.badge}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            {text.title1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600">
              {text.title2}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base md:text-lg mb-10 leading-relaxed">
            {text.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('booking')}
              className="bg-gold-500 hover:bg-gold-400 text-zinc-950 font-semibold px-8 py-4 rounded-lg text-base transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 border-0"
            >
              {text.ctaBook} <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('services')}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 px-8 py-4 rounded-lg text-base transition duration-300"
            >
              {text.ctaServices}
            </button>
          </div>
        </div>
      </div>

      <div className="py-16 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {text.features.map((feature, index) => (
              <div key={feature.title} className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800/60">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-gold-400 mb-4">
                  {featureIcons[index]}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
