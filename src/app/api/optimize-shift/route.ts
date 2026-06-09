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
REGLAS:
1. USA SOLO ESTAS LLAVES: "id", "name", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday".
2. PROHIBIDO STRINGS VACÍOS: Ningún día puede quedar vacío (""). Cada día DEBE decir "Mañana", "Tarde", "Noche" o "Libre".
3. MATEMÁTICA DE 40 HORAS: Todos DEBEN tener exactamente 5 días de trabajo y 2 días "Libre".
4. PERMISO DE COLISIÓN: SÍ ESTÁ PERMITIDO asignar a 2 o más empleados al MISMO turno el MISMO día si es necesario para que todos lleguen a 40 horas.

EJEMPLO DE SALIDA PERFECTA:
{ "horario": [ { "id": 1, "name": "Carlos", "monday": "Mañana", "tuesday": "Tarde", "wednesday": "Mañana", "thursday": "Libre", "friday": "Tarde", "saturday": "Libre", "sunday": "Mañana" } ] }

Contexto - Días activos: ${dias}, Turnos permitidos: ${turnos}.`
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
