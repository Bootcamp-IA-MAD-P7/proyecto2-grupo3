// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full bg-[#0B1120] border-t border-slate-800 py-4 px-4 md:px-6 relative overflow-hidden z-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent opacity-30"></div>
      
      <div className="w-full flex flex-row justify-between items-center gap-4">
        
        <div className="flex flex-col items-start text-left">
          <p className="font-black text-white text-[10px] tracking-widest uppercase leading-none">
            Escape Room Engine
          </p>
          <p className="text-slate-500 text-[9px] mt-1 font-medium">
            © {new Date().getFullYear()} FACTORÍA 5. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-[#FF5A00] text-white rounded font-black text-[9px] tracking-wider shadow-[0_0_8px_rgba(255,90,0,0.3)] border border-[#FF7A33]">
            FACTORÍA 5
          </div>
          <div className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded font-bold text-[9px] shadow-inner">
            PROMOCIÓN 7
          </div>
        </div>

      </div>
    </footer>
  );
}