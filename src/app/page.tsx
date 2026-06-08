"use client";

import { useState } from 'react';
import { CalendarClock, FileSpreadsheet, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WaitlistPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      size: formData.get('size'),
    };
    
    console.log("Waitlist submission:", data);
    
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Header / Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-900 tracking-tight">
            <CalendarClock className="text-blue-600 h-6 w-6" />
            Rotativa
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
          
          {/* Left Column: Copy & Form */}
          <div className="space-y-8 max-w-xl relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                Acceso Anticipado
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                El caos de los turnos rotativos se <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">acaba aquí</span>.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Coordina mallas horarias, predice ausencias y notifica a tu equipo por WhatsApp en minutos. No más Excel.
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              {success ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
                  <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">¡Estás en la lista!</h3>
                  <p className="text-slate-600">Te contactaremos pronto con acceso prioritario.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Correo corporativo
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="tu@empresa.com"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="size" className="text-sm font-medium text-slate-700">
                      Tamaño del equipo
                    </label>
                    <select
                      id="size"
                      name="size"
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50 focus:bg-white appearance-none"
                    >
                      <option value="" disabled>Selecciona una opción</option>
                      <option value="1-15">1 - 15 empleados</option>
                      <option value="16-50">16 - 50 empleados</option>
                      <option value="50+">Más de 50 empleados</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      <>
                        Solicitar Acceso Anticipado
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Visual Mockup (Vibe-coding) */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:pl-10">
            {/* Decorative background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-transform hover:scale-[1.02] duration-300">
              {/* Fake Browser/App Header */}
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-md shadow-sm border border-slate-200">
                  app.rotativa.io
                </div>
                <div className="w-12"></div> {/* Spacer for balance */}
              </div>
              
              {/* App Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Malla Semanal</h3>
                    <p className="text-sm text-slate-500">12 - 18 Octubre</p>
                  </div>
                  <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-red-100 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    1 Alerta Crítica
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-lg">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg font-semibold">Empleado</th>
                        <th className="px-4 py-3 font-semibold">Turno</th>
                        <th className="px-4 py-3 rounded-r-lg font-semibold whitespace-nowrap">Riesgo Ausencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: "Ana Silva", role: "Enfermera", shift: "Mañana (08:00 - 16:00)", risk: 15, riskColor: "bg-green-500" },
                        { name: "Carlos Ruiz", role: "Técnico", shift: "Tarde (16:00 - 00:00)", risk: 45, riskColor: "bg-amber-500" },
                        { name: "María Gómez", role: "Supervisora", shift: "Noche (00:00 - 08:00)", risk: 85, riskColor: "bg-red-500", alert: true },
                        { name: "Juan Pérez", role: "Enfermero", shift: "Mañana (08:00 - 16:00)", risk: 5, riskColor: "bg-green-500" },
                      ].map((emp, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-medium text-slate-900 whitespace-nowrap">{emp.name}</div>
                            <div className="text-xs text-slate-500">{emp.role}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 whitespace-nowrap">
                              {emp.shift}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px] min-w-[60px]">
                                <div className={`${emp.riskColor} h-2 rounded-full`} style={{ width: `${emp.risk}%` }}></div>
                              </div>
                              <span className={`text-xs font-medium w-8 ${emp.alert ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                {emp.risk}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Benefits Section */}
      <section className="bg-white border-t border-slate-200 py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Diseñado para simplificar tu operación</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Nuestra plataforma automatiza la coordinación de tu equipo para que tú te enfoques en lo que realmente importa.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ahorra horas de Excel</h3>
              <p className="text-slate-600 leading-relaxed">
                Genera mallas horarias automáticamente respetando reglas de negocio, descansos y preferencias del equipo en segundos.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Evita multas laborales</h3>
              <p className="text-slate-600 leading-relaxed">
                El sistema valida automáticamente que tu planificación cumpla con la normativa laboral vigente y horas máximas.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Se integra con WhatsApp</h3>
              <p className="text-slate-600 leading-relaxed">
                Notifica turnos, cambios de última hora y recibe confirmaciones directamente en el WhatsApp de tus empleados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 border-t border-slate-800 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-white tracking-tight mb-4">
            <CalendarClock className="text-blue-500 h-6 w-6" />
            Rotativa
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Rotativa. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
