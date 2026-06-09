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

    const prompt = `
Eres un optimizador de turnos experto. Debes crear un horario para los días solicitados (${dias}) usando SOLO los turnos permitidos (${turnos}). REGLA DE ORO: Respeta estrictamente las excepciones de cada empleado (ej. si dice Libre el lunes, no le asignes turno ese día). Devuelve un JSON donde cada empleado tenga su turno por día.
Devuelve ÚNICAMENTE un objeto JSON válido con la propiedad "employees" que contenga el arreglo de empleados actualizado.
Mantén estrictamente el mismo esquema exacto para cada empleado devuelto: id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday, risk_percentage.
Baja el 'risk_percentage' a un número menor a 10.
Asegúrate de que los valores para los turnos asignados sean únicamente los permitidos en (${turnos}) o "Libre".
Los empleados y sus excepciones/turnos actuales son:
${JSON.stringify(employees, null, 2)}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    const newShifts = JSON.parse(content);
    
    return NextResponse.json({ success: true, newShifts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
