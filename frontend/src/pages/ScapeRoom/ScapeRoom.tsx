import { useEscapeRoom } from "../../services/ScapeRoom/useEscapeRoom";

const EscapeRoom = () => {
  const { currentHint } = useEscapeRoom();

  const getEffectClass = (type: string) => {
    if (type === "hackeado") return "fx-glitch";
    if (type === "tenebroso") return "fx-tenebroso";
    return "text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]"; 
  };

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center overflow-hidden relative">
      
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50 opacity-60"></div>
      
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-40"></div>

      {currentHint ? (
        <div className="relative z-30 max-w-5xl px-10">
          <div className="absolute -top-10 left-10 text-red-600/50 font-mono text-sm tracking-widest animate-pulse">
            SYS.OVERRIDE // INCOMING_TRANSMISSION
          </div>

          <h1
            className={`font-mono text-4xl md:text-2xl font-black text-center tracking-[0.15em] uppercase leading-tight ${getEffectClass(
              currentHint.type
            )}`}
          >
            {currentHint.text}
          </h1>
          
          <div className="absolute -bottom-10 right-10 text-red-600/50 font-mono text-sm tracking-widest">
            {currentHint.type.toUpperCase()}_PROTOCOL_ACTIVE
          </div>
        </div>
      ) : (
        <div className="w-4 h-4 rounded-full bg-red-900/20 animate-ping absolute"></div>
      )}
    </div>
  );
};

export default EscapeRoom;