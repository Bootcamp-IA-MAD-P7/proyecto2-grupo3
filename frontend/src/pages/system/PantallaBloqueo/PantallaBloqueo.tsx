import { AlertTriangle } from 'lucide-react';

interface PantallaBloqueoProps {
  titulo: string;
  mensaje: string;
  onVolver: () => void;
}

export default function PantallaBloqueo({ titulo, mensaje, onVolver }: PantallaBloqueoProps) {
  return (
    <div className="flex-1 w-full bg-[#050B14] flex flex-col items-center justify-center min-h-full p-6 text-center">
      <div className="bg-[#0B1120] border border-red-900/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(127,29,29,0.3)] max-w-md w-full flex flex-col items-center">
        <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6 border border-red-800">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">{titulo}</h2>
        <p className="text-slate-400 text-sm mb-8">{mensaje}</p>
        <button 
          onClick={onVolver}
          type="button"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors border border-slate-700 text-sm uppercase tracking-wider w-full"
        >
          Volver al Panel Central
        </button>
      </div>
    </div>
  );
}