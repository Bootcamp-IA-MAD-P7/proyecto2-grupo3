import { useState } from 'react';
import { useEscapeRoom } from '../../services/ScapeRoom/useEscapeRoom';

export default function GameMasterPanel() {
  const { isConnected, sendAction } = useEscapeRoom();
  const [hintText, setHintText] = useState('');
  const [voiceType, setVoiceType] = useState('normal');

  const handleSendHint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hintText.trim()) return;

    sendAction({
      action: 'send_hint',
      text: hintText,
      voice_type: voiceType 
    });
    
    setHintText('');
  };

  return (
    <div className="min-h-[80vh] w-full bg-[#050B14] p-4 flex flex-col items-center justify-center text-slate-200">
      
      {/* Contenedor Compacto de Estado */}
      <div className="w-full max-w-3xl mb-4 flex justify-between items-center bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-white leading-none">Centro de Mando</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Control de sala en vivo</p>
        </div>
        <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded border border-slate-700">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]' : 'bg-red-500'}`}></div>
          <span className="text-xs font-mono tracking-widest text-slate-300">
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Contenedor Compacto de Control */}
      <div className="w-full max-w-3xl bg-[#0B1120] rounded-xl border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
        
        <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest flex items-center gap-2">
          Transmisión de IA
        </h3>

        <form onSubmit={handleSendHint} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Textarea más pequeño (rows={3}) */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Mensaje Cifrado:</label>
              <textarea
                rows={3}
                value={hintText}
                onChange={(e) => setHintText(e.target.value)}
                placeholder="Ej: La respuesta yace en las sombras..."
                className="w-full bg-[#050B14] border border-slate-700 rounded-md p-3 text-cyan-400 font-mono text-sm placeholder:text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none shadow-inner"
              />
            </div>
            
            {/* Selectores más limpios */}
            <div className="w-full md:w-1/3 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Frecuencia:</label>
              <select 
                value={voiceType}
                onChange={(e) => setVoiceType(e.target.value)}
                className="w-full bg-[#050B14] border border-slate-700 rounded-md p-3 text-white text-sm font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="normal">🟢 Normal</option>
                <option value="tenebroso">🔴 Tenebrosa (Flicker)</option>
                <option value="hackeado">🟣 Interceptado (Glitch)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isConnected || !hintText.trim()}
            className={`w-full py-3 rounded-md font-black text-sm tracking-[0.2em] uppercase transition-all duration-300 ${
              isConnected && hintText.trim()
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            Transmitir Pista a Sala
          </button>
        </form>
      </div>
    </div>
  );
}