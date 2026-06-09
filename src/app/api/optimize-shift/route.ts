import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dias, turnos } = body;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `Eres un algoritmo estricto de asignación de turnos. Devuelve UNICAMENTE un objeto JSON con la propiedad "horario" que contenga el array de empleados.
CONTEXTO DEL NEGOCIO:
Días de operación: ${dias}
Turnos disponibles: ${turnos}

REGLAS INQUEBRANTABLES:
1. FORMATO: Usa exactamente las llaves: "id", "name", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday".
2. REGLA DE FIN DE SEMANA (CRÍTICA): Si los Días de operación son "Lunes a Viernes", ENTONCES tienes ESTRICTAMENTE PROHIBIDO asignar turnos en fin de semana. "saturday" y "sunday" DEBEN ser obligatoriamente "Libre" para TODOS los empleados.
3. REGLA DE 40 HORAS: Todos los empleados DEBEN tener exactamente 5 días con un turno (ej. "Mañana") y 2 días "Libre" en total a la semana.
4. PERMISO DE COLISIÓN: Puedes asignar a varias personas al mismo turno (ej. dos en la Mañana) para asegurar que todos trabajen exactamente 5 días.

EJEMPLO SI ES LUNES A VIERNES:
{ "horario": [ { "id": 1, "name": "Ana", "monday": "Mañana", "tuesday": "Tarde", "wednesday": "Mañana", "thursday": "Tarde", "friday": "Mañana", "saturday": "Libre", "sunday": "Libre" } ] }`
        },
        { 
          role: 'user', 
          content: JSON.stringify(body) 
        }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    return NextResponse.json(JSON.parse(content));

  } catch (error: any) {
    console.error('ERROR EN EL SERVIDOR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
