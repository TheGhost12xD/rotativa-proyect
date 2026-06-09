import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GROQ_API_KEY in environment variables' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    
    const body = await req.json();
    const { employees, dias, turnos } = body;
    
    if (!employees || !Array.isArray(employees)) {
      return NextResponse.json({ error: 'Missing or invalid employees data' }, { status: 400 });
    }

    const prompt = `Eres un optimizador de turnos. Tu única salida debe ser un objeto JSON con la propiedad "horario" que contenga el array de empleados actualizados. NUNCA devuelvas texto fuera del JSON. Intenta asignar 5 turnos y 2 días libres por empleado basándote en los datos enviados, respetando sus excepciones.

Contexto:
- Días activos: ${dias}
- Turnos permitidos: ${turnos}

Mantén el mismo esquema para cada empleado: id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday, risk_percentage.
Baja el risk_percentage a un número menor a 10.

Los empleados y sus excepciones/turnos actuales son:
${JSON.stringify(employees, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    let cleanText = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanText);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error general en endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
