import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    console.log('¿La API KEY existe?', !!process.env.GROQ_API_KEY);
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GROQ_API_KEY in environment variables' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    
    const body = await req.json();
    console.log('Recibiendo datos en API:', body);
    const { employees, dias, turnos } = body;
    
    if (!employees || !Array.isArray(employees)) {
      return NextResponse.json({ error: 'Missing or invalid employees data' }, { status: 400 });
    }

    const prompt = `
Eres un algoritmo estricto de optimización de Recursos Humanos. Tu única función es devolver un arreglo JSON válido con la asignación de turnos. Cero texto adicional.
Contexto:
- Días activos: ${dias}
- Turnos permitidos: ${turnos}

REGLAS MATEMÁTICAS INQUEBRANTABLES:
1. COBERTURA OBLIGATORIA: En cada día activo, DEBE haber obligatoriamente al menos 1 empleado asignado a CADA UNO de los turnos permitidos. NUNCA dejes un turno vacío (ej. nadie en la mañana).
2. MATEMÁTICA DE 40 HORAS (5 TURNOS): Cada empleado DEBE trabajar exactamente 5 días. Si los Días Activos son "Lunes a Viernes" (5 días), entonces TODOS los empleados deben trabajar de lunes a viernes. NO les des días "Libre" entre semana (Sábado y Domingo serán "Libre"). Si los Días Activos son "Lunes a Domingo", entonces debes asignarles exactamente 2 días "Libre" para que queden en 40 horas.
3. EXCEPCIONES PESAN MÁS: Si un empleado tiene una excepción (ej. "Libre el viernes"), debes respetarla poniéndole "Libre" ese día, pero DEBES asignar a otro empleado para cubrir su puesto y que no quede vacío.

Genera el JSON respetando estas reglas al 100%.

Mantén estrictamente el mismo esquema exacto para cada empleado devuelto: id, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday, risk_percentage.
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
    console.log('Respuesta de Groq:', content);
    const newShifts = JSON.parse(content);
    
    return NextResponse.json({ success: true, newShifts });
  } catch (error: any) {
    return NextResponse.json({ error: 'Fallo en IA' }, { status: 500 });
  }
}
