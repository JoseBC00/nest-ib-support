# Integrar una cuenta Google Drive central con Vercel (opcional)

## Decisión técnica

Los datos de texto, búsquedas, usuarios, favoritos y resultados viven en **Supabase**. Los archivos opcionales de exámenes (imágenes PNG/JPEG/WEBP) pueden guardarse en **Google Drive** mediante funciones privadas de Vercel. Al guardar un prompt, su texto se mantiene consultable en Supabase y se puede enviar también un `.txt` al Drive central como copia. **No se utiliza Google Drive como base de datos relacional**.

## Condiciones importantes

- Google Drive tiene 15 GB gratuitos compartidos entre Gmail, Fotos y Drive; no equivalen a una base de datos sin límites de API.
- Para usar **el Drive personal del propietario** desde Vercel necesitas **OAuth 2.0 con refresh token del propietario**. Las service accounts no disponen de cuota de almacenamiento propia en My Drive personal para convertirse por sí solas en un Drive de 15 GB.
- Google aplica cuotas, controles de consentimiento y posibles requisitos de verificación. Con una aplicación OAuth externa en modo Testing, el refresh token puede expirar a los 7 días. Comprueba los requisitos vigentes en Google Cloud antes de confiar en la integración en producción.
- Los archivos quedan **privados** en Drive. No pongas la carpeta principal como pública. Las imágenes autorizadas son servidas por `/api/drive-file` tras comprobar permisos en la base.
- Esta entrega contiene la API, pero **no realiza la autorización OAuth por ti**: necesitas crear tu proyecto Google Cloud y autorizar tu propia cuenta. Nunca compartas client secret ni refresh token en el chat o GitHub.

## Configuración de alto nivel

1. En Google Drive, crea una carpeta raíz `NEST IB SUPPORT` y dentro `EXAMENES` y `PROMPTS`.
2. Copia los ID de ambas carpetas desde sus URL.
3. En Google Cloud Console, crea un proyecto de hobby, habilita la **Google Drive API** y configura la pantalla de consentimiento OAuth (un administrador autoriza su propia cuenta).
4. Crea un **OAuth client ID** para la integración. Genera un refresh token **para el propietario del Drive**, con el ámbito adecuado que permita a la app crear archivos en esas carpetas. La opción de `drive.file` es preferible por permisos mínimos si la app tiene acceso autorizado a carpetas/archivos creados o seleccionados por la aplicación; para gestionar carpetas ya existentes puede requerirse autorización adicional. Revisa la guía oficial antes de decidir el alcance.
5. En Vercel → Project → Settings → Environment Variables, configura:

   ```text
   SUPABASE_URL
   SUPABASE_PUBLISHABLE_KEY
   SUPABASE_SERVICE_ROLE_KEY
   GOOGLE_OAUTH_CLIENT_ID
   GOOGLE_OAUTH_CLIENT_SECRET
   GOOGLE_OAUTH_REFRESH_TOKEN
   DRIVE_EXAMS_FOLDER_ID
   DRIVE_PROMPTS_FOLDER_ID
   ```

6. En `config.js`, cambia `driveEnabled: true` **solo cuando todos los valores estén configurados**. Despliega de nuevo.
7. Inicia sesión, crea y guarda un examen borrador con al menos un subapartado. Pega una captura PNG/JPG/WEBP en el enunciado. Debe aparecer dentro del examen tras su carga; comprueba que se crea archivo en Drive y registro en `support_media`.
8. Crea y guarda un prompt. Si Drive está habilitado, su TXT será respaldado en la carpeta PROMPTS; si esa copia falla, Supabase sigue siendo la fuente de verdad del prompt.

## Seguridad del puente

`/api/drive-upload` verifica un JWT real de Supabase; comprueba la propiedad del examen o prompt, el estado editable del examen, la firma del tipo de imagen y el tamaño máximo de 1,5 MB. Aplica un límite simple de 25 cargas por usuario/hora mediante una tabla de registros; para lanzamientos grandes conviene incorporar un límite atómico y protección adicional antiabuso.

`/api/drive-file?id=<UUID>` no acepta un ID arbitrario de Google Drive: únicamente permite IDs registrados y asociados a un examen visible para el solicitante. No devuelve tokens OAuth ni enlaces compartidos.

El control de archivos de prompts crea copias TXT cuando se guardan; la versión inicial **no mantiene sincronización bidireccional con Drive ni elimina automáticamente copias antiguas**. Implementa limpieza de huérfanos y retención antes de crecer.

## Alternativa

Si OAuth resulta demasiado complejo para el hobby, puedes dejar las imágenes en Supabase Storage (1 GB gratis con sus cuotas) y utilizar Drive solo para respaldos administrativos. Esa alternativa será más sencilla; el espacio real y los costos deben medirse antes de migrar.

Fuentes oficiales:
- https://developers.google.com/workspace/drive/api/guides/create-file
- https://developers.google.com/workspace/drive/api/guides/about-shareddrives
- https://developers.google.com/workspace/drive/api/guides/limits
- https://vercel.com/docs/plans/hobby
