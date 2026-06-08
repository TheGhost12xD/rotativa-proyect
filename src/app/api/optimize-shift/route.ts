import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { employees } = body;
    
    if (!employees) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const prompt = `
Eres un experto en RRHH de una clínica. 
Revisa la lista de empleados y sus turnos de la semana.
Algunos empleados tienen un 'risk_percentage' muy alto (>50), lo que indica fatiga extrema o alta probabilidad de ausentismo.
Tu objetivo es reasignar los turnos de la semana entre todos los empleados de forma justa para asegurar la cobertura médica, dándole días libres (Libre) o turnos menos pesados a los empleados con alto riesgo.
Devuelve ÚNICAMENTE un objeto JSON válido con la propiedad "employees" que contenga el arreglo de empleados actualizado.
Mantén estrictamente el mismo esquema exacto para cada empleado: id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday, risk_percentage.
Baja el 'risk_percentage' a un número menor a 10 para los empleados cuyo riesgo hayas mitigado.
Asegúrate de que los valores para los turnos sean únicamente: "Mañana", "Tarde", "Noche" o "Libre".
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
