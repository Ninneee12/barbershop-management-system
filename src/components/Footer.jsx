import { Scissors } from 'lucide-react';

export default function Footer({ text }) {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 text-center text-zinc-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Scissors className="w-5 h-5 text-gold-500" />
          <span className="font-serif text-lg font-bold text-white tracking-widest">THE SHARP CUT</span>
        </div>
        <p>&copy; {new Date().getFullYear()} {text.text}</p>
      </div>
    </footer>
  );
}
