import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { employees, riskEmployee } = body;
    
    if (!employees || !riskEmployee) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const prompt = `
Eres un experto en RRHH. Un empleado (${riskEmployee}) tiene alto riesgo de faltar. 
Reasigna los turnos de la semana para los demás empleados de forma justa para cubrir su puesto. 
Devuelve ÚNICAMENTE un objeto JSON válido con la propiedad "employees" que contenga el arreglo de empleados actualizado.
Mantén las propiedades: name, role, shifts, y opcionalmente isRisk u optimizedShift.
Los empleados y sus turnos actuales son:
${JSON.stringify(employees, null, 2)}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    const newShifts = JSON.parse(content);
    
    return NextResponse.json({ success: true, newShifts });
  } catch (error: any) {
    console.error('Groq Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
