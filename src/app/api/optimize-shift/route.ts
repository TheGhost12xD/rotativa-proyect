import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dias, turnos, employees } = body;
    
    // Usamos gemini-1.5-pro y forzamos salida JSON nativa
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro',
        generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Eres un algoritmo estricto de RRHH. Devuelve un objeto JSON con la propiedad "horario" que contenga el array de empleados.
    CONTEXTO: Días de operación: ${dias}. Turnos: ${turnos}.
    DATOS EMPLEADOS: ${JSON.stringify(employees)}
    
    REGLAS INQUEBRANTABLES:
    1. LLAVES EXACTAS: "id", "name", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday".
    2. NO INVENTES EMPLEADOS. Solo usa los que te pasé.
    3. FIN DE SEMANA: Si Días de operación es "Lunes a Viernes", entonces "saturday" y "sunday" DEBEN ser "Libre" para todos.
    4. 40 HORAS: Todo empleado DEBE trabajar exactamente 5 turnos a la semana y tener 2 días "Libre".
    5. COBERTURA: Ningún día activo puede quedar sin empleados. Puedes poner a 2 personas en el mismo turno si es necesario para llegar a las 40 horas. NO dejes días vacíos ("").
    
    EJEMPLO DE SALIDA: { "horario": [ { "id": 1, "name": "Carlos", "monday": "Mañana", "tuesday": "Tarde", "wednesday": "Mañana", "thursday": "Libre", "friday": "Tarde", "saturday": "Libre", "sunday": "Libre" } ] }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error('Error con Gemini:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
