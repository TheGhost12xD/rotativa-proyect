"use client";

import { 
  Users, AlertTriangle, Clock, CalendarClock, Bell, UserCircle, 
  BrainCircuit, ArrowRightLeft, CheckCircle2, ChevronRight, RefreshCw,
  Upload, Settings
} from 'lucide-react';
import { useState } from 'react';
import Papa from 'papaparse';

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [optimized, setOptimized] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isMallaVisible, setIsMallaVisible] = useState(false);
  
  // Parámetros de Configuración
  const [dias, setDias] = useState('Lunes a Viernes');
  const [turnosHabilitados, setTurnosHabilitados] = useState({ manana: true, tarde: true, noche: true });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newEmployees = results.data.map((row: any, index: number) => {
          return {
            id: index + 1,
            name: row['Nombre'] || `Empleado ${index + 1}`,
            excepciones: row['Excepciones'] || '',
            monday: 'Libre',
            tuesday: 'Libre',
            wednesday: 'Libre',
            thursday: 'Libre',
            friday: 'Libre',
            saturday: 'Libre',
            sunday: 'Libre',
            risk_percentage: 0
          };
        });
        setData(newEmployees);
        setOriginalData(newEmployees);
        setOptimized(false);
      }
    });
  };

  const handleOptimize = async (e?: any) => {
    console.log('Iniciando optimización...');
    if (e && e.preventDefault) e.preventDefault();

    if (!originalData || originalData.length === 0) {
      alert('Faltan datos para optimizar: No hay empleados cargados');
      return;
    }
    
    try {
      setLoadingAI(true);
      
      const turnosActivos = Object.entries(turnosHabilitados)
        .filter(([_, active]) => active)
        .map(([name]) => name === 'manana' ? 'Mañana' : name === 'tarde' ? 'Tarde' : 'Noche')
        .join(', ');

      const payload = {
        employees: originalData,
        dias: dias,
        turnos: turnosActivos
      };
      
      console.log('Payload a enviar:', payload);

      const response = await fetch('/api/optimize-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('Respuesta RECIBIDA:', data);
      
      if (data.horario) {
        setData(data.horario);
        setOptimized(true);
      }
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  const calculateTotalHours = (emp: any) => {
    let weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (dias === 'Lunes a Viernes') {
      weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    }
    
    return weekDays.reduce((acc, day) => {
      if (['Mañana', 'Tarde', 'Noche'].includes(emp[day])) {
        return acc + 8;
      }
      return acc;
    }, 0);
  };

  const criticalEmployee = originalData.length > 0 ? (originalData.find(e => e.risk_percentage > 50) || originalData[0]) : null;
  const activeHoursProjected = data.reduce((acc, emp) => acc + calculateTotalHours(emp), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-xl text-blue-900 tracking-tight">
              <CalendarClock className="text-blue-600 h-6 w-6" />
              Rotativa
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-500 relative transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="hidden sm:block text-right">
                <span className="block text-sm font-bold text-slate-700 leading-tight">Administrador</span>
              </div>
              <UserCircle className="h-9 w-9 text-slate-300 hover:text-slate-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control General</h1>
          <span className="block text-slate-500 mt-1 font-medium">Resumen operativo semanal (Sincronizado en tiempo real)</span>
        </div>

        {/* Panel de Configuración */}
        <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Parámetros del Horario</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Días a programar</label>
              <select 
                value={dias}
                onChange={(e) => setDias(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-sm bg-slate-50"
              >
                <option value="Lunes a Viernes">Lunes a Viernes</option>
                <option value="Lunes a Domingo">Lunes a Domingo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tipos de turno habilitados</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={turnosHabilitados.manana} onChange={(e) => setTurnosHabilitados({...turnosHabilitados, manana: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" /> Mañana
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={turnosHabilitados.tarde} onChange={(e) => setTurnosHabilitados({...turnosHabilitados, tarde: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" /> Tarde
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={turnosHabilitados.noche} onChange={(e) => setTurnosHabilitados({...turnosHabilitados, noche: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" /> Noche
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Carga de Personal (CSV)</label>
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer bg-slate-50 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-colors rounded-lg px-4 py-2 flex items-center justify-center gap-2 text-sm text-slate-600 font-medium">
                  <Upload className="h-4 w-4" />
                  Subir Excel / CSV
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center mb-8">
            <div className="bg-blue-50 text-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aún no hay datos</h3>
            <p className="text-slate-500 max-w-sm">Sube tu archivo CSV con los empleados y sus excepciones en el panel superior para comenzar a generar mallas.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Personal Activo Hoy</span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-extrabold text-slate-900">{data.length}</h3>
                    <span className="text-xl text-slate-400 font-medium tracking-normal"> emp</span>
                  </div>
                </div>
                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-7 w-7" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Alertas Críticas</span>
                  <div className="flex items-center gap-3">
                    <h3 className="text-4xl font-extrabold text-red-600">
                      {optimized ? '0' : originalData.filter(e => e.risk_percentage > 50).length}
                    </h3>
                  </div>
                </div>
                <div className="h-14 w-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wide">Horas Asignadas (Totales)</span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-extrabold text-slate-900">{activeHoursProjected}</h3>
                    <span className="text-xl text-slate-400 font-medium tracking-normal"> hrs</span>
                  </div>
                </div>
                <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Clock className="h-7 w-7" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Optimizador de Turnos</h2>
                      <span className="block text-sm text-slate-500 font-medium">Malla generada en base a parámetros</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setData([]);
                          setOriginalData([]);
                          setOptimized(false);
                        }} 
                        disabled={loadingAI}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> 
                        Limpiar Datos
                      </button>
                      <button 
                        onClick={() => setIsMallaVisible(!isMallaVisible)}
                        className="hidden sm:flex text-sm font-bold text-blue-600 hover:text-blue-700 items-center gap-1 transition-colors group"
                      >
                        {isMallaVisible ? 'Ocultar Malla' : 'Ver Malla'}
                        <ChevronRight className={`h-4 w-4 transition-transform ${isMallaVisible ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
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
                          <th className="px-3 py-4 font-bold tracking-wider text-center">Total Horas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {data.map((emp) => {
                          const originalEmp = originalData.find(e => e.id === emp.id) || emp;
                          const isRiskRow = originalEmp.risk_percentage > 50 && !optimized;
                          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                          
                          return (
                            <tr key={emp.id} className={`hover:bg-slate-50/80 transition-colors ${isRiskRow ? 'bg-red-50/20' : ''}`}>
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-900 whitespace-nowrap">{emp.name}</div>
                                {emp.excepciones && (
                                  <div className="text-[10px] font-medium mt-1 text-slate-500 max-w-[120px] truncate">
                                    Exc: {emp.excepciones}
                                  </div>
                                )}
                                {emp.risk_percentage > 0 && (
                                  <div className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${emp.risk_percentage > 50 && !optimized ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                                    Riesgo: {emp.risk_percentage}%
                                  </div>
                                )}
                              </td>
                              {days.map((day, j) => {
                                const shift = emp[day] || 'Libre';
                                const initialShift = originalEmp[day] || 'Libre';
                                
                                let badgeClass = "bg-slate-100 text-slate-600 border-slate-200";
                                
                                if (shift === "Mañana") badgeClass = "bg-sky-50 text-sky-700 border-sky-200";
                                if (shift === "Tarde") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                                if (shift === "Noche") badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                                if (shift === "Libre") badgeClass = "bg-slate-50 text-slate-400 border-slate-200 border-dashed";
                                
                                if (isRiskRow && shift === "Noche" && !optimized) {
                                  badgeClass = "bg-red-50 text-red-700 border-red-300 font-bold shadow-sm shadow-red-100";
                                }
                                
                                if (optimized && shift !== initialShift && shift !== 'Libre') {
                                  badgeClass = "bg-green-50 text-green-700 border-green-300 font-bold ring-2 ring-green-100 ring-offset-1";
                                }

                                return (
                                  <td key={j} className="px-2 py-4 text-center">
                                    <span className={`inline-flex items-center justify-center px-2 py-1.5 rounded-lg text-[11px] font-semibold border min-w-[60px] transition-all ${badgeClass}`}>
                                      {shift}
                                    </span>
                                  </td>
                                );
                              })}
                              <td className={`px-3 py-4 text-center font-bold ${calculateTotalHours(emp) === 40 ? 'text-green-600' : 'text-red-600'}`}>
                                {calculateTotalHours(emp)}h
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-indigo-950 rounded-2xl shadow-xl border border-blue-800 overflow-hidden text-white relative h-full">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-overlay filter blur-2xl opacity-40 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-overlay filter blur-2xl opacity-40"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                        <BrainCircuit className="h-5 w-5 text-blue-300" />
                      </div>
                      <h2 className="text-lg font-bold text-white tracking-tight">Análisis Predictivo IA</h2>
                    </div>
                    <span className="block text-sm text-blue-200/80 mb-6 font-medium">Monitoreando patrones de asistencia y fatiga.</span>
                    
                    {!optimized && criticalEmployee && criticalEmployee.risk_percentage > 50 ? (
                      <div className="bg-white/[0.08] backdrop-blur-md border border-white/10 rounded-xl p-5 mb-6 shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-white text-base">{criticalEmployee.name}</h4>
                            <span className="block text-xs text-blue-200 mt-0.5">Sobrecarga detectada</span>
                          </div>
                          <div className="bg-red-500/20 text-red-300 px-2.5 py-1 rounded-md text-xs font-extrabold border border-red-500/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            {criticalEmployee.risk_percentage}% Riesgo
                          </div>
                        </div>
                        
                        <span className="block text-sm text-blue-100/90 mb-5 leading-relaxed font-medium">
                          Patrón de ausentismo histórico crítico para este empleado debido a alta acumulación de turnos complejos.
                        </span>

                        <button 
                          onClick={handleOptimize}
                          disabled={loadingAI}
                          className="w-full bg-white text-indigo-950 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {loadingAI ? (
                            <>
                              <RefreshCw className="h-4 w-4 text-indigo-950 animate-spin" />
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
                        <h4 className="font-bold text-white mb-2 text-lg">Malla Generada Exitosa</h4>
                        <span className="block text-sm text-green-100/90 leading-relaxed font-medium">
                          Los turnos han sido asignados por la IA respetando parámetros y excepciones.
                        </span>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 text-center text-white/50">
                        <CheckCircle2 className="h-8 w-8 mx-auto mb-4 opacity-50" />
                        <span className="block text-sm font-medium mb-4 text-white">Configuración Lista.</span>
                        <button 
                          onClick={handleOptimize}
                          disabled={loadingAI}
                          className="w-full bg-white text-indigo-950 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {loadingAI ? (
                            <>
                              <RefreshCw className="h-4 w-4 text-indigo-950 animate-spin" />
                              Generando Malla...
                            </>
                          ) : (
                            <>
                              <ArrowRightLeft className="h-4 w-4" />
                              Optimizar Turnos con IA
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {isMallaVisible && (
              <div className="mt-8 bg-white rounded-2xl shadow-sm shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Malla Completa (Vista Detallada)</h2>
                  <span className="block text-sm text-slate-500 font-medium">Horario detallado de todos los empleados de la semana</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Empleado</th>
                        <th className="px-3 py-4 font-bold tracking-wider text-center">Lunes</th>
                        <th className="px-3 py-4 font-bold tracking-wider text-center">Martes</th>
                        <th className="px-3 py-4 font-bold tracking-wider text-center">Miércoles</th>
                        <th className="px-3 py-4 font-bold tracking-wider text-center">Jueves</th>
                        <th className="px-3 py-4 font-bold tracking-wider text-center">Viernes</th>
                        <th className="px-3 py-4 font-bold tracking-wider text-center">Sábado</th>
                        <th className="px-3 py-4 font-bold tracking-wider text-center">Domingo</th>
                        <th className="px-6 py-4 font-bold tracking-wider text-center bg-blue-50/50">Total Hrs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {data.map((emp) => {
                        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{emp.id}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{emp.name}</td>
                            {days.map((day, j) => (
                              <td key={j} className="px-2 py-4 text-center">
                                <span className="inline-flex items-center justify-center px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 min-w-[70px]">
                                  {emp[day] || 'Libre'}
                                </span>
                              </td>
                            ))}
                            <td className={`px-6 py-4 font-bold text-center ${calculateTotalHours(emp) === 40 ? 'text-green-600 bg-green-50/30' : 'text-red-600 bg-red-50/30'}`}>
                              {calculateTotalHours(emp)}h
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
