"use client";

import { 
  Users, AlertTriangle, Clock, CalendarClock, Bell, UserCircle, 
  BrainCircuit, ArrowRightLeft, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const INITIAL_EMPLOYEES = [
  { name: "Carlos Ruiz", role: "Técnico", shifts: ["Mañana", "Mañana", "Tarde"], isRisk: false },
  { name: "Ana Silva", role: "Enfermera", shifts: ["Tarde", "Tarde", "Libre"], isRisk: false },
  { name: "María Gómez", role: "Supervisora", shifts: ["Libre", "Noche", "Noche"], isRisk: false },
  { name: "Juan Pérez", role: "Enfermero", shifts: ["Noche", "Libre", "Mañana"], isRisk: true },
];

export default function DashboardPage() {
  const [optimized, setOptimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>(INITIAL_EMPLOYEES);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/optimize-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employees,
          riskEmployee: "Juan Pérez"
        })
      });

      if (!response.ok) {
        throw new Error('Error en la API');
      }

      const data = await response.json();
      
      if (data.newShifts && data.newShifts.employees) {
        setEmployees(data.newShifts.employees);
      } else {
        throw new Error('Formato de respuesta inválido de Groq');
      }
      
      setOptimized(true);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar la IA. Verifica tu API Key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-xl text-blue-900 tracking-tight">
              <CalendarClock className="text-blue-600 h-6 w-6" />
              Rotativa
            </div>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Modo Demostración Activo
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-500 relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-700 leading-tight">Administrador</p>
                <p className="text-xs text-slate-500 font-medium">Clínica San José</p>
              </div>
              <UserCircle className="h-9 w-9 text-slate-300 hover:text-slate-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control General</h1>
          <p className="text-slate-500 mt-1 font-medium">Resumen operativo para hoy, 15 de Octubre</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Personal Activo Hoy</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-slate-900">14<span className="text-xl text-slate-400 font-medium tracking-normal">/18</span></h3>
              </div>
            </div>
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 flex items-center justify-between hover:border-red-200 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Alertas de Ausentismo</p>
              <div className="flex items-center gap-3">
                <h3 className="text-4xl font-extrabold text-red-600">2</h3>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-md border border-red-200">
                  Críticas
                </span>
              </div>
            </div>
            <div className="h-14 w-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 flex items-center justify-between hover:border-indigo-200 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Horas Extra Proyectadas</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-slate-900">5.5<span className="text-xl text-slate-400 font-medium tracking-normal"> hrs</span></h3>
              </div>
            </div>
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Clock className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Table Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Optimizador de Turnos</h2>
                  <p className="text-sm text-slate-500 font-medium">Planificación Semanal Interactiva</p>
                </div>
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors group">
                  Ver Malla Completa 
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Empleado</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-center">Lunes</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-center">Martes</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-center">Miércoles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {employees.map((emp, i) => {
                      const isRiskRow = emp.isRisk && !optimized;
                      
                      return (
                        <tr key={i} className={`hover:bg-slate-50/80 transition-colors ${isRiskRow ? 'bg-red-50/20' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{emp.name}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">{emp.role}</div>
                          </td>
                          {emp.shifts.map((shift: string, j: number) => {
                            let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                            
                            // Visual color assignments
                            if (shift === "Mañana") badgeClass = "bg-sky-50 text-sky-700 border-sky-200";
                            if (shift === "Tarde") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                            if (shift === "Noche") badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                            if (shift === "Libre") badgeClass = "bg-slate-50 text-slate-400 border-slate-200 border-dashed";
                            
                            // If it's a risk shift not optimized yet
                            if (emp.isRisk && j === 2 && !optimized) {
                              badgeClass = "bg-red-50 text-red-700 border-red-300 font-bold shadow-sm shadow-red-100 animate-pulse";
                            }
                            
                            // Highlight changes dynamically based on AI output (Comparing with initial state)
                            const initialShift = INITIAL_EMPLOYEES[i].shifts[j];
                            if (optimized && shift !== initialShift) {
                              badgeClass = "bg-green-50 text-green-700 border-green-300 font-bold ring-2 ring-green-100 ring-offset-1";
                            }

                            return (
                              <td key={j} className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold border w-20 transition-all ${badgeClass}`}>
                                  {shift}
                               </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Predictive Module (Side Panel) */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-indigo-950 rounded-2xl shadow-xl border border-blue-800 overflow-hidden text-white relative h-full">
              {/* Abstract decorative background elements */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-overlay filter blur-2xl opacity-40 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-overlay filter blur-2xl opacity-40"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                    <BrainCircuit className="h-5 w-5 text-blue-300" />
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Análisis Predictivo IA</h2>
                </div>
                <p className="text-sm text-blue-200/80 mb-6 font-medium">Monitoreando patrones de asistencia y fatiga en tiempo real.</p>
                
                {!optimized ? (
                  <div className="bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-xl p-5 mb-6 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-white text-base">Juan Pérez</h4>
                        <p className="text-xs text-blue-200 mt-0.5">Enfermero • Turno Mañana</p>
                      </div>
                      <div className="bg-red-500/20 text-red-300 px-2.5 py-1 rounded-md text-xs font-extrabold border border-red-500/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        85% Riesgo
                      </div>
                    </div>
                    
                    <p className="text-sm text-blue-100/90 mb-5 leading-relaxed font-medium">
                      El motor ha detectado un patrón de ausentismo histórico crítico (85%) para este empleado los días Miércoles post-turno de Noche.
                    </p>

                    <button 
                      onClick={handleOptimize}
                      disabled={loading}
                      className="w-full bg-white text-indigo-950 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-indigo-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando IA...
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="h-4 w-4" />
                          Reasignar preventivamente
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-xl p-5 mb-6 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0"></div>
                    <div className="flex justify-center mb-4">
                      <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 ring-4 ring-green-500/10">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">Riesgo Mitigado</h4>
                    <p className="text-sm text-green-100/90 leading-relaxed font-medium">
                      Los turnos de la semana han sido reasignados por la IA de forma inteligente. Se han enviado notificaciones por WhatsApp a los involucrados.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-blue-300/70 uppercase tracking-widest">Otros perfiles en observación</h4>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-800/80 border border-blue-700 flex items-center justify-center text-xs font-bold text-blue-200">
                        CR
                      </div>
                      <div>
                        <p className="text-sm font-bold">Carlos Ruiz</p>
                        <p className="text-xs text-blue-300/80 font-medium mt-0.5">Retrasos frecuentes</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md">45%</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
