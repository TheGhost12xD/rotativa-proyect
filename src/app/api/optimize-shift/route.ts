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
          content: `Eres un optimizador de turnos. Tu única salida debe ser un objeto JSON con la propiedad "horario" que contenga el array de empleados actualizados. Intenta asignar 5 turnos de 8 horas y 2 días libres. Contexto - Días activos: ${dias}, Turnos permitidos: ${turnos}.`
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
