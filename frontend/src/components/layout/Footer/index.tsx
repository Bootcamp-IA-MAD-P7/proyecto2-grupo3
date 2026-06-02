export default function Footer() {
  return (
    <footer className="w-full bg-[#0B1120] border-t border-slate-800 py-6 px-6 md:px-10 relative overflow-hidden z-10 mt-auto">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent opacity-30 blur-sm"></div>
      
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <p className="font-black text-white text-base tracking-widest uppercase">
            Escape Room Engine
          </p>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            © {new Date().getFullYear()} FACTORÍA 5 - PROMOCIÓN 7. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-black text-xs tracking-wider shadow-[0_0_10px_rgba(255,90,0,0.3)] border border-[#FF7A33]">
            FACTORÍA 5
          </div>
          <div className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold text-xs shadow-inner">
            PROMOCIÓN 7
          </div>
        </div>

      </div>
    </footer>
  );
}