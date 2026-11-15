# nest✳ib. SUPPORT — Versión 2.2 (entrega de desarrollo)

Plataforma hobby de apoyo al Bachillerato Internacional. **Independiente del IB**. Interfaz morada basada en las referencias del usuario; utiliza los archivos originales del logotipo y la mascota **String Tag IB**, un **cordel** morado, no un animal. Los derechos de recursos ajenos pertenecen a sus autores.

## Qué trae este proyecto

| Función | Estado del código | Dependencia para usarla con cuentas reales |
|---|---|---|
| Página principal adaptativa, temas claro/oscuro/sistema, mascota motivacional, FAQ, contactos y recursos | Incluida | Ninguna |
| Flashcards locales: editor de tabla, CSV/Excel, PDF con texto extraíble (asistido), estudio, exportación CSV/XLSX, impresión A4 | Incluida | Excel: biblioteca SheetJS por CDN; PDF: pdf.js por CDN |
| Mezcla de decks y copias con procedencia, paquete de decks | Incluida | Supabase para compartir con usuarios |
| Búsqueda, categorías, NM/NS/CORE, favoritos y publicación con aprobación | Incluida | Migración SQL, cuentas y moderación |
| Exámenes: editor, subapartados, plantilla, lectura, pausa/reanudación, respuestas recomendadas, rúbricas, autoevaluación | Incluida | Supabase para sincronizar intentos; Drive para persistir imágenes |
| Biblioteca de prompts: creación, niveles de exigencia, favoritos, copia y TXT | Incluida | Supabase para comunidad; Drive opcional para copia TXT |
| Panel administración: categorías, fusión, aprobación, rechazo, enlaces | Incluido | Rol administrador/moderador vía SQL |
| API de Vercel para imágenes de exámenes y TXT de prompts en Drive | Incluida, **no conectada por defecto** | Credenciales OAuth y carpetas privadas en Vercel |
| Extensión Chrome con accesos y enlaces guardados localmente | Incluida | Instalar carpeta `extension/` manualmente |
| Integración con GitHub/Vercel real y Supabase real | Preparada; **sin despliegue realizado desde este chat** | Debes ejecutar migración y desplegar tú |
| Prueba real de permisos de Supabase, subida real a Drive y pruebas de varios usuarios | **Pendientes** | Acceso a tu proyecto real, credenciales y usuarios de prueba |

La interfaz puede ejecutarse localmente sin nube como **demo funcional de creación**; las bibliotecas públicas aparecen vacías hasta conectar Supabase y aprobar publicaciones.

## Qué contiene

`index.html`, `flashcards.html`, `examenes.html`, `prompts.html`, `biblioteca.html`, `login.html`, `admin.html`, `privacidad.html`, `terminos.html`, `config.js`, `auth.js`, `css/app.css`, `js/*.js`, `database/01_support_schema.sql`, `api/drive-upload.js`, `api/drive-file.js`, `server/drive-common.js`, `docs/*`, `assets/*`, `legacy/*`.

## Empieza por aquí

**Lee [docs/INSTALACION.md](docs/INSTALACION.md) y síguelo en orden.**

No sustituyas tu proyecto publicado antes de probar esta entrega en una carpeta separada y hacer respaldo. Si has ejecutado migraciones anteriores, esta crea **nuevas tablas `support_*`**, no borra `decks`, `flashcards`, `collections` o `profiles` previas. Importa tus decks mediante la acción "Importar versiones anteriores" en Flashcards.

En `config.js` vienen `cloudEnabled: false` y `driveEnabled: false` de forma intencional. Habilita la nube después del SQL y las pruebas de roles. No pongas `service_role`, tokens OAuth, contraseñas ni secretos de Google dentro de `config.js` o archivos frontend.

## Comandos opcionales

```bash
node --version
npm run check
python -m http.server 5500
```

En VS Code también puedes usar Live Server. Para Vercel selecciona **Other**, raíz del repositorio y despliegue de archivos estáticos.

## Alcance y límites conocidos

- Sin cuenta, los borradores y resultados son locales en el mismo navegador. La nube exige usuario autenticado.
- La sincronización ocurre al guardar/recargar; no es coedición simultánea de una misma tarjeta. Los decks tienen revisión optimista al guardarse.
- Las publicaciones quedan pendientes hasta aprobación. Un deck aprobado es inmutable; se duplica para corregir.
- Un paquete público requiere decks aprobados. La copia o mezcla nunca modifica la fuente.
- Un PDF escaneado sin texto seleccionable requiere OCR externo; no se garantiza extracción automática.
- Excel y PDF dependen de bibliotecas CDN; no se garantiza trabajo sin conexión para esos importadores.
- En los exámenes, las notas son **autoevaluaciones**, no puntuaciones oficiales IB. El temporizador conserva el tiempo restante según reloj y sesión, pero una web de práctica sin supervisión no es un entorno de examen inviolable.
- No se ha instalado ni autorizado Google Drive. Los archivos pesados solo pueden persistirse allí después de completar OAuth.
- La privacidad y términos incluidos son **borradores**, requieren revisión antes de apertura pública a menores y grupos grandes.

## Seguridad

Las tablas nuevas tienen RLS; las autorizaciones de moderación se comprueban mediante RPCs en PostgreSQL. Los secretos de Drive residen solo en variables del servidor Vercel, y las subidas comprueban identidad, titularidad, formato y tamaño. Es obligatorio probar RLS con dos cuentas distintas antes de lanzar a terceros.

© 2026 NEST IB SUPPORT — sitio educativo independiente. Recursos originales y de terceros conservan sus derechos.


## Novedad v2.1 — Imprimir exámenes

Desde **Exámenes** ahora puedes imprimir cada examen como hoja A4 sin soluciones, imprimir el solucionario de tus borradores y, una vez enviado un intento, imprimir las respuestas recomendadas o el intento con su autoevaluación. El nuevo módulo `js/exam-print.js` incorpora imágenes desde Drive cuando están disponibles. Consulta `docs/IMPRIMIR_EXAMENES.md`.

**No requiere ninguna modificación SQL ni nuevas credenciales.**


## Cambios visuales v2.2 — NEST IB SUPPORT

- Marca `nest✳ib.` reescrita en HTML para poder girar SOLO el asterisco y resaltar SUPPORT; se conserva el PNG original en `assets/` como referencia.
- Acceso a NEST IB original en cabecera y portada.
- Portada sin la mascota como elemento principal: tarjetas de estudio flotantes. La mascota String Tag IB sigue en un panel discreto de acompañamiento.
- Carrusel continuo con enlaces NEST IB, Dojo, English Practice Test, Pirate IB, IB Resources, Calculadora IB, Dark IB y Biblioteca general. Enlace en pausa con cursor/foco; con movimiento reducido, desplazamiento manual.
- Tarjetas de funcionalidades con interacción hover/foco.
- Pie de página con autoría de Danilo Jose Bautista Cabrera y apoyo de Aprendices PE, @Aprendices_PE.
- Cambios exclusivamente visuales: **NO hace falta ejecutar nuevamente ningún SQL en Supabase** ni cambiar credenciales para instalar v2.2. La nube y Google Drive conservan las condiciones de configuración explicadas en la instalación previa.
