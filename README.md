# Entrena — MVP 0.1

Prototipo móvil instalable (PWA) para Android.

## Qué incluye
- Rutina inicial de cuatro días (Torso A, Pierna A, Torso B, Pierna B).
- Registro de peso, repeticiones y series completadas.
- Guarda el último peso utilizado por ejercicio.
- Historial local de sesiones.
- Exportación de datos a JSON.
- Interfaz adaptada a móvil y caché básica offline.

## Importante
Esta versión guarda los datos en el almacenamiento del navegador del dispositivo. No hay cuenta, sincronización en la nube ni copia de seguridad automática. Si borras los datos del navegador, podrías perder los registros. Usa Exportar mis datos para guardar una copia.

## Cómo probarla
Para instalarla como PWA, los archivos deben servirse desde una dirección HTTPS (o localhost). Una forma sencilla es desplegar esta carpeta en un hosting estático como Netlify, Vercel o GitHub Pages. Después abre la URL en Chrome para Android y elige **Añadir a pantalla de inicio** / **Instalar aplicación**.

Para desarrollo local, sirve la carpeta con cualquier servidor estático. Por ejemplo, con Node instalado:
`npx serve .`

## Próximas fases
1. Ajustar ejercicios, series y descansos a la rutina definitiva.
2. Añadir Supabase para cuentas y sincronización entre dispositivos.
3. Añadir gráficas de cargas, volumen y peso corporal.
4. Añadir recomendaciones de progresión basadas en el historial.
