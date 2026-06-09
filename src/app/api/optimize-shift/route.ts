import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dias, turnos, employees } = body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Eres un algoritmo estricto de RRHH. Devuelve un objeto JSON con la propiedad "horario" que contenga el array de empleados.
    CONTEXTO: Días de operación: ${dias}. Turnos: ${turnos}.
    
    REGLAS INQUEBRANTABLES:
    1. LLAVES EXACTAS: "id", "name", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday".
    2. NO INVENTES EMPLEADOS. Solo usa los que te pasé.
    3. FIN DE SEMANA: Si Días de operación es "Lunes a Viernes", entonces "saturday" y "sunday" DEBEN ser "Libre" para todos.
    4. 40 HORAS: Todo empleado DEBE trabajar exactamente 5 turnos a la semana y tener 2 días "Libre".
    5. COBERTURA: Ningún día activo puede quedar sin empleados. Puedes poner a 2 personas en el mismo turno si es necesario para llegar a las 40 horas. NO dejes días vacíos ("").
    
    EJEMPLO DE SALIDA PERFECTA: { "horario": [ { "id": 1, "name": "Carlos", "monday": "Mañana", "tuesday": "Tarde", "wednesday": "Mañana", "thursday": "Libre", "friday": "Tarde", "saturday": "Libre", "sunday": "Libre" } ] }`
        },
        {
          role: 'user',
          content: JSON.stringify(employees)
        }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    return NextResponse.json(JSON.parse(content));

  } catch (error: any) {
    console.error('Error con Groq:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
