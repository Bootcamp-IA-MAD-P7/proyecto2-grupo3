// src/components/layout/Header.tsx
import factoriaLogo from "../../../assets/factoria.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1120] border-b border-slate-800 py-2.5 px-4 md:px-6 shadow-md">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative p-[1px] rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <img
              src={factoriaLogo}
              alt="Factoria Logo"
              className="w-9 h-9 object-cover rounded-[8px]"
            />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-extrabold tracking-widest uppercase text-[9px] mb-0 block leading-none">
              Promoción 7
            </span>
            <h1 className="text-lg md:text-xl font-black text-white tracking-tight leading-tight">
              Factoria
            </h1>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-base md:text-lg font-bold text-slate-200 leading-tight">
            Sistema <span className="text-[#FF5A00]">Escape Room</span>
          </h2>
          <div className="mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-800/50 border border-slate-700 rounded-full">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-wide">
              Módulo:{" "}
              <span className="text-white font-bold">Game Master WS</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}