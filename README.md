# Rotativa 🕒

**Acaba con el caos de administrar turnos rotativos en Excel.**

Rotativa es una aplicación web impulsada por Inteligencia Artificial diseñada para optimizar, generar y gestionar mallas de turnos rotativos para empresas. Usando el poder del modelo Llama 3 de 70 Billones de parámetros (vía Groq), resuelve el complejo problema matemático de asignar horarios respetando restricciones legales (40 horas semanales), excepciones médicas/personales y garantizando la cobertura de los turnos operativos.

## 🚀 Características Principales

- **Automatización Impulsada por IA:** Asignación automática de turnos (Mañana, Tarde, Noche, Libre) garantizando cobertura en todos los días activos.
- **Resolución de Restricciones (40 Horas):** Algoritmo estricto que asegura matemáticamente que cada empleado cumpla exactamente con 5 turnos laborables y 2 días libres por semana.
- **Carga Masiva vía CSV:** Interfaz fluida para importar datos de empleados, incluyendo sus excepciones o días libres pre-aprobados, directamente desde Excel/CSV (gracias a PapaParse).
- **Prevención de Fatiga:** Indicadores visuales y alertas de sobrecarga de horas para el personal crítico.
- **Gestión de Fines de Semana:** Configuración dinámica para operar de Lunes a Viernes (descanso obligatorio sábados y domingos) o de Lunes a Domingo.
- **Lista de Espera Integrada:** Landing page de alta conversión conectada a Supabase para captar leads y prospectos.

## 💻 Stack Tecnológico

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend/IA:** Next.js Route Handlers, Groq SDK (`llama-3.3-70b-versatile`) para inferencia lógica rápida y potente.
- **Base de Datos:** Supabase (PostgreSQL) para persistencia de la Waitlist.
- **Procesamiento de Datos:** PapaParse para lectura de CSV en el lado del cliente (sin saturar el servidor).

## 🛠️ Configuración Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TheGhost12xD/rotativa-proyect.git
   cd rotativa-proyect
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno. Crea un archivo `.env.local` en la raíz del proyecto y añade:
   ```env
   # Base de datos (Lista de espera)
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

   # Motor de Inteligencia Artificial (Optimización de turnos)
   GROQ_API_KEY=tu_groq_api_key
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 🧠 ¿Cómo funciona la Inteligencia Artificial?

El núcleo de Rotativa vive en `app/api/optimize-shift/route.ts`. Utilizamos **Few-Shot Prompting** y directrices dictatoriales (System Prompts inquebrantables) para forzar al modelo Llama a comportarse como un motor de CSP (Constraint Satisfaction Problem). 

La IA evalúa:
1. Las **excepciones** de los empleados pasadas por el CSV.
2. Los **días operativos** (e.g. Lunes a Viernes).
3. Los **turnos habilitados**.
4. Y retorna un objeto JSON estricto con los días rellenados, permitiendo colisiones (varias personas en un mismo turno) si es matemáticamente necesario para evitar que alguien se quede con días vacíos o trabaje menos de 40 horas.

## 👨‍💻 Autor

Desarrollado con foco en resolver el dolor real de la administración de RRHH y recursos físicos.
