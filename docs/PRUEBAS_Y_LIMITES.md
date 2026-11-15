# Pruebas, cobertura y puntos pendientes

## Verificado en esta entrega

- `npm run check`: sintaxis de todos los módulos JS y funciones Vercel, y verificación unitaria de las tres plantillas de impresión de exámenes (sin spoilers, solucionario, intento).
- Verificación estática de rutas locales y nombres de archivos de la aplicación.
- Comparación del ZIP original y conservación de un respaldo en `legacy/`.
- Diseño implementado con logos y la mascota de las imágenes proporcionadas.
- SQL de migración aditiva creado, **sin ejecutarse en una base Supabase real**.

## Actualización v2.1 — impresión de exámenes

- Plantillas comprobadas sin navegador mediante `tests/print_check.mjs`.
- No se pudo probar la vista previa en un navegador automatizado: acceso de Chromium a localhost bloqueado administrativamente en el entorno de pruebas.
- Requiere prueba manual del diálogo de impresión A4, las imágenes de Drive y la salida PDF en Chrome.

## No verificado en esta entrega

- No se ejecutó la migración SQL en tu Supabase real.
- No se realizaron pruebas de RLS contra múltiples cuentas conectadas.
- No se enlazó tu repositorio real ni se desplegó Vercel en tu cuenta.
- No se obtuvo consentimiento OAuth ni se subió un archivo a tu Drive real.
- No se probó la experiencia gráfica en un navegador real en esta sesión por bloqueo del navegador automatizado del entorno; usa Live Server para confirmar la presentación.

## Prueba manual de aceptación

1. Entrar a Inicio y comprobar la marca, la mascota String Tag IB, el tema oscuro/claro/sistema y la sección FAQ.
2. Abrir Flashcards, crear un deck, añadir y eliminar filas, crear columnas, importar un CSV NotebookLM de dos columnas sin encabezado.
3. Importar un Excel de varias columnas y verificar la segunda columna de respuesta + información adicional.
4. Imprimir como tabla A4 con y sin columnas extra. Descargar CSV y XLSX.
5. Mezclar cinco decks, desmarcar filas y guardar una copia sin modificar originales.
6. Iniciar sesión y sincronizar un deck; abrir otro navegador con la misma cuenta y recuperar el contenido.
7. Crear dos cuentas y verificar que la B no puede editar decks borrador de la A (intentar API directa).
8. Publicar deck desde A; aprobar desde admin; comprobar su visibilidad como visitante.
9. Construir un paquete con decks ya aprobados, enviarlo a revisión y comprobar que aparece tras aprobación.
10. Crear examen con subapartados de 4 y 2 puntos, usar lectura de cinco minutos, pausar, recargar y continuar; autoevaluar 4 y 1; comprobar total 5/6.
11. Crear examen con rúbrica y comprobar suma de criterios, historial y segundo intento independiente.
12. Crear prompt, clasificar exigencia, copiar texto, exportar TXT y enviarlo a revisión.
13. Verificar que solo administrador crea categorías; intentar Historia/HISTORIA y confirmar rechazo por duplicado.
14. Activar Drive opcional con OAuth, pegar imagen con Ctrl+V en examen editable, verificar permisos de lectura antes/después de publicar.
15. Verificar en Vercel los enlaces de recursos y que el correo y WhatsApp funcionen.

## Riesgos que deben resolverse antes de abrir al público

- RLS: revisar grants, RPCs `SECURITY DEFINER`, políticas de acceso y caso de múltiples usuarios.
- Moderación: pruebas de contenido malicioso, revisión de imágenes, denuncias y derechos de autor.
- Pruebas de carga, cuotas, concurrencia, back-ups de Supabase y Drive y recuperación ante fallos.
- OAuth: consentimiento, política de tokens, verificación, permisos mínimos y límites de Drive API.
- Control de publicación: evitar SPAM y publicaciones repetidas; se pueden añadir límites por cuenta.
- Accesibilidad: navegación por teclado, lectores de pantalla y pruebas en móviles.
- Legislación de privacidad y medidas apropiadas si se registran menores.
- Seudónimos: actualmente no se fuerza unicidad; deben definirse nombres reservados y prevención de suplantación.
- Esta versión usa tablas `support_*` aditivas. El importador anterior es voluntario y puede crear duplicados si se ejecuta varias veces; guarda un respaldo antes.

No presentar como "listo para producción masiva" hasta cerrar estas pruebas.
