# Imprimir exámenes en NEST IB SUPPORT (v2.1)

## Opciones disponibles

1. **Examen sin respuestas**: en `Exámenes → Explorar exámenes` o `Mis exámenes`, pulsa **🖨️ Imprimir**. Incluye título, autor, asignatura, nivel, tipo de prueba, duración, instrucciones, imágenes disponibles, preguntas, subapartados, puntajes y espacios para respuestas escritas. No contiene las soluciones.
2. **Imprimir un borrador**: abre `Crear / editar` y pulsa **🖨️ Imprimir borrador**. Se incluyen los cambios escritos en el formulario aunque aún no los hayas guardado en la nube.
3. **Solucionario del autor**: en el editor de tu propio borrador pulsa **📄 Imprimir solucionario**. Incluye las respuestas recomendadas y los criterios de las rúbricas.
4. **Solucionario del estudiante**: después de **Enviar examen**, aparece **📄 Imprimir solucionario** en la vista de resolución.
5. **Imprimir mi intento**: después de enviar el examen aparece **📝 Imprimir mi intento**, que incluye las respuestas escritas, soluciones y autoevaluación disponible.

Todas las opciones abren una vista previa independiente en blanco y negro, optimizada para A4. Pulsa **Imprimir / Guardar PDF** y elige una impresora o **Guardar como PDF**. No necesitas crear el PDF en un servidor.

## Consideraciones

- La impresión **no envía, pausa ni altera** el examen en curso. Si imprimes mientras el temporizador corre, **continúa contando tiempo**.
- La vista previa intenta recuperar las imágenes almacenadas en Google Drive a través de `/api/drive-file`, utilizando la sesión cuando existe. Las imágenes se incrustan en la vista para que aparezcan al imprimir. Si una imagen no se puede recuperar, aparecerá un aviso visible: **no imprimas preguntas incompletas**.
- Para imprimir exámenes con imágenes, primero configura la integración de Drive y Vercel de `docs/GOOGLE_DRIVE.md`. Al probar mediante Live Server sin esa API, las imágenes de Drive pueden no cargarse.
- Si el navegador bloquea la ventana emergente, habilítala para la dirección local o el dominio Vercel de tu aplicación.
- El solucionario de un examen comunitario solo tiene un botón visible **después de enviarlo**. El autor puede imprimir el suyo desde el editor.
- El archivo `js/exam-print.js` genera la impresión, sin alterar `support_exams`, `support_attempts` ni la base de datos.
- La función no convierte exámenes en PDF en el servidor: utiliza la función de impresión del navegador, con formato A4.

## Instalación de una actualización sobre la versión 2.0

Copia estos archivos dentro de la carpeta del proyecto en VS Code:

- `examenes.html` → reemplazar.
- `js/exams.js` → reemplazar.
- `js/exam-print.js` → crear nuevo.

**No borres** `auth.js`, `config.js`, `index.html`, `flashcards.html` ni los archivos SQL. Esta mejora no requiere nuevas tablas ni migración SQL. Conserva una copia antes de reemplazar si has realizado cambios propios.

### Pruebas rápidas

1. Abre `examenes.html` con Live Server y crea un examen de prueba con dos subpreguntas de 4 y 2 puntos.
2. Comprueba que **Imprimir borrador** muestra las dos preguntas sin las soluciones.
3. Comprueba que **Imprimir solucionario** muestra las soluciones y criterios.
4. Guarda un examen, abre `Mis exámenes` y prueba **Imprimir**.
5. Entra a resolver, finaliza, registra puntos y comprueba **Imprimir mi intento**.
6. En la vista previa, pulsa **Imprimir / Guardar PDF** y elige **Guardar como PDF** en Chrome.

Para verificación sin navegador, ejecuta `npm run check` en la carpeta del proyecto; revisa también `docs/PRUEBAS_Y_LIMITES.md`.
