
interface PantallaTerminalProps {
  codigo: string;
  mensaje: string;
}

export default function PantallaTerminal({
  codigo,
  mensaje,
}: PantallaTerminalProps) {
  return (
    <div className="w-full min-h-screen bg-[#020202] flex flex-col items-center justify-center overflow-hidden relative">
      {/* CRT Efectos */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50 opacity-60"></div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.95)] z-40"></div>

      <div className="relative z-30 text-center flex flex-col items-center gap-6 opacity-70">
        <div className="w-24 h-24 border-4 border-red-900/50 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 bg-red-600 rounded-full"></div>
        </div>
        <div>
          <h1 className="font-mono text-3xl font-black text-red-600 tracking-[0.3em] uppercase mb-2">
            {codigo}
          </h1>
          <p className="font-mono text-sm text-red-800 tracking-widest">
            {mensaje}
          </p>
        </div>
      </div>
    </div>
  );
}
