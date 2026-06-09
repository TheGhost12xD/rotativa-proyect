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
          content: `Eres un algoritmo estricto de optimización. Tu única salida debe ser un objeto JSON con la propiedad "horario" que contenga el array de empleados. > REGLAS ABSOLUTAS E INQUEBRANTABLES:
1. NO INVENTES EMPLEADOS. Tienes prohibido agregar personas. Solo puedes usar los IDs y Nombres que vienen en el input.
2. ESTRUCTURA DE DATOS OBLIGATORIA. Tienes prohibido cambiar los nombres de las llaves. Cada empleado devuelto DEBE tener exactamente estas llaves en minúscula: "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday".
3. Asigna 5 turnos y 2 días "Libre" a los empleados existentes para acercarte a las 40 horas. Si matemáticamente no es perfecto por falta de personal, asigna lo mejor posible pero NUNCA violes la regla 1 y 2.
FORMATO DE SALIDA ESTRICTO: { "horario": [ { "id": 1, "name": "Ejemplo", "monday": "Mañana", "tuesday": "Libre" ... } ] }

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
