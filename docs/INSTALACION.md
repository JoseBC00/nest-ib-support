# Instalación guiada — VS Code, Supabase y Vercel

> **Regla de seguridad:** trabaja en una copia; no reemplaces sin respaldo tu web vigente. Tus usuarios, cuentas y tarjetas reales no se borran por esta entrega.

## A. Preparar VS Code

1. Descarga y descomprime `NEST_IB_SUPPORT_2_2.zip` en **una carpeta nueva** llamada `NEST_IB_SUPPORT_2_2`.
2. Abre Visual Studio Code → **File → Open Folder** → `NEST_IB_SUPPORT_2_2`.
3. Deja todos los archivos y subcarpetas en la estructura actual. `index.html` y el directorio `api/` deben estar en la raíz.
4. Ejecuta Live Server sobre `index.html` o usa una terminal en esa carpeta y ejecuta `python -m http.server 5500`.
5. Abre `http://127.0.0.1:5500/` en el navegador. Comprueba Inicio, Flashcards, Exámenes y Prompts. Es normal que al principio no se vean publicaciones de otras personas.
6. Prueba añadir una tarjeta, guardarla localmente e imprimirla. Crea un examen de prueba, resuélvelo y crea un prompt. **Antes de conectar la nube**, todas estas acciones de prueba son locales.

## B. Preparar Supabase (obligatorio para comunidad)

1. Entra en el mismo proyecto Supabase donde ya funciona `login.html`.
2. Comprueba que existen la tabla `public.profiles` y la función de registro que ya usabas. **No vuelvas a ejecutar los SQL anteriores de cero.**
3. Descarga un respaldo de lo importante. En **SQL Editor → New query**, pega el contenido de `database/01_support_schema.sql`. Ejecuta **Run UNA vez**.
4. En Table Editor deben verse `support_staff`, `support_categories`, `support_decks`, `support_cards`, `support_packages`, `support_package_items`, `support_exams`, `support_attempts`, `support_prompts`, `support_favorites`, `support_links`, `support_media`, `support_drive_upload_log`.
5. En **Authentication → Users**, copia **tu propio UUID**. En SQL Editor ejecuta (sustituyendo el marcador):

   ```sql
   INSERT INTO public.support_staff (user_id,role)
   VALUES ('TU_UUID', 'admin')
   ON CONFLICT (user_id) DO UPDATE SET role='admin';
   ```

6. En `config.js`, pon `cloudEnabled: true`. Las URL y clave publicable deben corresponder al proyecto existente. **La clave publishable puede estar en frontend**; no copies ninguna clave `service_role`.
7. Recarga la web y prueba que `Mi cuenta` inicia sesión. En `admin.html` debe aparecer el panel si la cuenta tiene rol admin.
8. Prueba desde **dos cuentas diferentes**: autor crea, envía a revisión; administrador aprueba; visitante ve la publicación, pero no puede modificarla. Verifica que un usuario no puede leer borradores ajenos.

**Importante:** la tabla de perfiles y la migración anterior no se eliminan. Las tablas `support_*` son un nuevo modelo para evitar cambios destructivos. En Flashcards existe **Importar versiones anteriores**, que agrega copias locales desde las claves antiguas `nest-support-decks-v04` y `nest-support-user-UUID`, y, cuando hay permisos, desde `decks`/`flashcards` anteriores. Pulsa Guardar para sincronizar cada copia nueva. No hay migración automática que destruya el origen.

## C. Publicar Vercel

1. En GitHub crea un nuevo repositorio privado o rama de pruebas **sin sustituir tu web actual** hasta verificarlo.
2. Sube los archivos de la carpeta `NEST_IB_SUPPORT_2_2` **sin subir `.env` real**.
3. Abre https://vercel.com/new → **Add New Project** → importa tu repositorio.
4. Selecciona **Framework: Other**, **Root directory: `./`**. No necesitas comando de compilación para la web estática.
5. Pulsa **Deploy**. Las páginas estarán en `/`, `/flashcards.html`, `/examenes.html`, `/prompts.html`, `/login.html`, `/admin.html`.
6. En Supabase → **Authentication → URL Configuration**, añade a Redirect URLs: `https://TU-SITIO.vercel.app/login.html`. Establece la Site URL principal según el alojamiento que utilices.
7. Prueba registro, inicio/cierre de sesión y guardar decks **antes de compartir la URL**.

## D. Publicar Google Drive (opcional, tras validar la nube)

Consulta `docs/GOOGLE_DRIVE.md`. La web, flashcards de texto, prompts y exámenes sin imágenes funcionan sin Drive. **No actives `driveEnabled` si no has configurado OAuth y las variables de entorno**.

## E. Actualizaciones seguras

Usa ramas de GitHub y despliegues Preview de Vercel. Verifica primero el SQL en un proyecto de Supabase de pruebas si ya tienes datos valiosos. Valida el estado de la migración y las funciones antes de cambiar el despliegue principal. No uses copiar/pegar de viejos scripts SQL destructivos.

## F. Errores comunes

| Síntoma | Revisión |
|---|---|
| Página en blanco | F12 → Console, rutas de `js/*.js`, recarga `Ctrl+Shift+R`. |
| Se ve la web pero no la comunidad | Ejecuta el SQL, habilita `cloudEnabled` y comprueba sesión. |
| `Invalid API key` | Usa la clave publishable correcta, sin comillas internas. |
| `permission denied` | Revisa rol admin y políticas RLS; no uses claves secretas en navegador. |
| `function not found` | Confirma migración en el proyecto Supabase correcto. |
| Importar Excel falla | Comprueba la red y que SheetJS cargue. CSV funciona sin esa biblioteca. |
| PDF no genera tarjetas | Puede estar escaneado o tener líneas sin pares; edita la vista previa. |
| Error Drive 503 | Variables de Vercel incompletas, OAuth sin consentimiento o refresh token expirado. |
| Tarjetas antiguas no aparecen | Activa «Importar versiones anteriores»; no estaban sincronizadas automáticamente. |

## G. Antes de lanzar a estudiantes

Completa la revisión de `docs/PRUEBAS_Y_LIMITES.md`, verificación de derechos de recursos y políticas de privacidad/menores. La aplicación todavía no está verificada en el proyecto Supabase real ni con el Drive real del usuario.


### Actualización 2.1: impresión de exámenes

La actualización incorpora `js/exam-print.js` y botones en `examenes.html` / `js/exams.js`. Usa la impresión de Chrome (impresora o Guardar PDF), sin nuevas tablas SQL, sin instalación de servicios de pago y sin modificar los datos existentes. Consulta `docs/IMPRIMIR_EXAMENES.md`.


## Cambios de diseño v2.2

La marca SUPPORT es más visible, el asterisco del logo gira, la portada usa tarjetas académicas (sin mascota protagonista), el carrusel muestra 8 recursos iniciales más enlaces personalizados desde `support_links`, y el footer contiene la atribución autorizada. Para estos cambios visuales **no hay que ejecutar SQL**. Actualiza `index.html`, `css/app.css`, `js/core.js`, `js/home.js`; el resto se conserva.
