import { Clock, Wrench } from "lucide-react";

interface ModuleUnderDevelopmentProps {
  readonly titulo: string;
}

export default function ModuleUnderDevelopment({
  titulo,
}: ModuleUnderDevelopmentProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto py-16 px-6 text-center">
      <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-slate-200 flex flex-col items-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <Wrench className="w-10 h-10 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          {titulo}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed text-lg">
          Estamos recopilando datos y diseñando las estrategias para esta
          sección. Muy pronto el análisis estará disponible.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold border border-slate-200">
          <Clock className="w-4 h-4" />
          <span>Módulo en construcción</span>
        </div>
      </div>
    </div>
  );
}
