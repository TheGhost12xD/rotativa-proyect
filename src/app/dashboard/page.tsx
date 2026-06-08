"use client";

import { 
  Users, AlertTriangle, Clock, CalendarClock, Bell, UserCircle, 
  BrainCircuit, ArrowRightLeft, CheckCircle2, ChevronRight, RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [optimized, setOptimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [originalEmployees, setOriginalEmployees] = useState<any[]>([]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('demo_shifts')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setEmployees(data);
        setOriginalEmployees(JSON.parse(JSON.stringify(data)));
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoadingData(false);
      setOptimized(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOptimize = async () => {
    if (employees.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch('/api/optimize-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employees: originalEmployees
        })
      });

      if (!response.ok) {
        throw new Error('Error en la API');
      }

      const data = await response.json();
      
      if (data.newShifts && data.newShifts.employees) {
        setEmployees(data.newShifts.employees);
        setOptimized(true);
      } else {
        throw new Error('Formato de respuesta inválido de Groq');
      }
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar la IA. Verifica tu API Key.');
    } finally {
      setLoading(false);
    }
  };

  // Find if there is any critical employee currently loaded
  const criticalEmployee = originalEmployees.find(e => e.risk_percentage > 50) || originalEmployees[0];

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
          <p className="text-slate-500 mt-1 font-medium">Resumen operativo semanal (Sincronizado en tiempo real)</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Personal Activo Hoy</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-extrabold text-slate-900">{employees.length > 0 ? employees.length : '-'}<span className="text-xl text-slate-400 font-medium tracking-normal"> emp</span></h3>
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
                <h3 className="text-4xl font-extrabold text-red-600">
                  {optimized ? '0' : originalEmployees.filter(e => e.risk_percentage > 50).length || '-'}
                </h3>
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
                <h3 className="text-4xl font-extrabold text-slate-900">{optimized ? '1.5' : '5.5'}<span className="text-xl text-slate-400 font-medium tracking-normal"> hrs</span></h3>
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
                  <p className="text-sm text-slate-500 font-medium">Conectado a Base de Datos en Tiempo Real</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={fetchData} 
                    disabled={loadingData || loading}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? 'animate-spin' : ''}`} /> 
                    Restaurar Datos
                  </button>
                  <button className="hidden sm:flex text-sm font-bold text-blue-600 hover:text-blue-700 items-center gap-1 transition-colors group">
                    Ver Malla Completa 
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Empleado</th>
                      <th className="px-3 py-4 font-bold tracking-wider text-center">Lun</th>
                      <th className="px-3 py-4 font-bold tracking-wider text-center">Mar</th>
                      <th className="px-3 py-4 font-bold tracking-wider text-center">Mié</th>
                      <th className="px-3 py-4 font-bold tracking-wider text-center">Jue</th>
                      <th className="px-3 py-4 font-bold tracking-wider text-center">Vie</th>
                      <th className="px-3 py-4 font-bold tracking-wider text-center">Sáb</th>
                      <th className="px-3 py-4 font-bold tracking-wider text-center">Dom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loadingData ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center">
                            <RefreshCw className="h-8 w-8 text-blue-300 animate-spin mb-3" />
                            <p className="font-medium text-sm">Cargando datos desde Supabase...</p>
                          </div>
                        </td>
                      </tr>
                    ) : employees.map((emp) => {
                      const originalEmp = originalEmployees.find(e => e.id === emp.id) || emp;
                      const isRiskRow = originalEmp.risk_percentage > 50 && !optimized;
                      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                      
                      return (
                        <tr key={emp.id} className={`hover:bg-slate-50/80 transition-colors ${isRiskRow ? 'bg-red-50/20' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 whitespace-nowrap">{emp.name}</div>
                            <div className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${emp.risk_percentage > 50 && !optimized ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                              Riesgo: {emp.risk_percentage || 0}%
                            </div>
                          </td>
                          {days.map((day, j) => {
                            const shift = emp[day] || 'Libre';
                            const initialShift = originalEmp[day] || 'Libre';
                            
                            let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                            
                            // Visual color assignments
                            if (shift === "Mañana") badgeClass = "bg-sky-50 text-sky-700 border-sky-200";
                            if (shift === "Tarde") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                            if (shift === "Noche") badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                            if (shift === "Libre") badgeClass = "bg-slate-50 text-slate-400 border-slate-200 border-dashed";
                            
                            // If it's a risk shift not optimized yet (Visual cue: Noche shifts for risk employees)
                            if (isRiskRow && shift === "Noche") {
                              badgeClass = "bg-red-50 text-red-700 border-red-300 font-bold shadow-sm shadow-red-100";
                            }
                            
                            // Highlight changes dynamically based on AI output
                            if (optimized && shift !== initialShift) {
                              badgeClass = "bg-green-50 text-green-700 border-green-300 font-bold ring-2 ring-green-100 ring-offset-1";
                            }

                            return (
                              <td key={j} className="px-2 py-4 text-center">
                                <span className={`inline-flex items-center justify-center px-2 py-1.5 rounded-lg text-xs font-semibold border min-w-[65px] transition-all ${badgeClass}`}>
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
                <p className="text-sm text-blue-200/80 mb-6 font-medium">Monitoreando patrones de asistencia y fatiga en tiempo real con Llama 3.</p>
                
                {!optimized && criticalEmployee ? (
                  <div className="bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-xl p-5 mb-6 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-white text-base">{criticalEmployee.name}</h4>
                        <p className="text-xs text-blue-200 mt-0.5">Sobrecarga detectada</p>
                      </div>
                      <div className="bg-red-500/20 text-red-300 px-2.5 py-1 rounded-md text-xs font-extrabold border border-red-500/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        {criticalEmployee.risk_percentage}% Riesgo
                      </div>
                    </div>
                    
                    <p className="text-sm text-blue-100/90 mb-5 leading-relaxed font-medium">
                      El motor ha detectado un patrón de ausentismo histórico crítico para este empleado debido a una alta acumulación de turnos complejos.
                    </p>

                    <button 
                      onClick={handleOptimize}
                      disabled={loading || loadingData || employees.length === 0}
                      className="w-full bg-white text-indigo-950 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-indigo-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Groq AI procesando...
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="h-4 w-4" />
                          Optimizar Turnos con IA
                        </>
                      )}
                    </button>
                  </div>
                ) : optimized ? (
                  <div className="bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-xl p-5 mb-6 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0"></div>
                    <div className="flex justify-center mb-4">
                      <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 ring-4 ring-green-500/10">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                    </div>
                    <h4 className="font-bold text-white mb-2 text-lg">Riesgo Mitigado</h4>
                    <p className="text-sm text-green-100/90 leading-relaxed font-medium">
                      Los turnos de la semana han sido reasignados por la IA de forma inteligente balanceando la carga laboral.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 text-center text-white/50">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Todos los perfiles estables. Sin alertas críticas.</p>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
