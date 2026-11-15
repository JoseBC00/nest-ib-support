# Arquitectura técnica v2.0

```text
Navegador  ──HTML/CSS/JavaScript──► Vercel Hobby (estáticos)
    │                                     │
    │ Supabase JS + JWT                   │ funciones privadas /api/drive-*
    ▼                                     ▼
Supabase Auth + PostgreSQL <──verificación y metadata── Google Drive API (OAuth propietario)
    │                                                              │
    ├─ profiles, support_staff, support_categories                   ├─ EXAMENES / imágenes
    ├─ support_decks, support_cards, support_packages                └─ PROMPTS / TXT (copia)
    ├─ support_exams, support_attempts
    ├─ support_prompts, support_favorites, support_links
    └─ support_media (IDs de Drive)
```

**Fuente de verdad:** Supabase para textos, relaciones, estado de publicación y resultados. Drive es almacenamiento de imágenes y copias opcionales. Las consultas y filtros se hacen en PostgreSQL.

**Niveles:** NM, NS y CORE. Categorías: tabla única administrable `support_categories` con índice normalizado contra duplicados de mayúsculas y espacios.

**Publicación:** `draft → pending → published / rejected`. `support_submit` valida propiedad y `support_review` exige rol de moderador en base. RLS filtra registros públicos y privados.

**Autores:** `profiles.nickname` existente; la política nueva permite acceder públicamente a seudónimos de autores con contenidos aprobados, no a correos. La cuenta real sigue siendo `auth.users.id`.

**Sincronización:** `support_save_deck` sustituye todas las tarjetas de un deck en una sola transacción y compara `revision`; si cambió desde otro dispositivo, rechaza el guardado para evitar sobrescribir sin avisar. Exámenes y prompts usan edición de borradores en Supabase. Los intentos se guardan cada 15 segundos y al pausar/enviar.

**Temporizador:** el tiempo activo se calcula con timestamp de inicio en lugar de depender de que el navegador permanezca abierto. La pausa conserva los segundos restantes. Es una experiencia de práctica, no un sistema anti-trampa o un examen oficial supervisado.

**Importación:** CSV RFC4180 básico con comillas y separadores, SheetJS (XLS/XLSX), texto tabulado, PDF text-layer mediante pdf.js como asistencia. No se incluye OCR para PDF escaneado.

**Escala:** en el plan gratuito de Supabase hay aproximadamente 500 MB de base de datos y 1 GB de Storage, sujetos a la documentación vigente; Drive ofrece 15 GB compartidos con otros servicios de Google. Para 100, 1000 y 10000 usuarios deben medirse tamaño promedio de tarjeta, número de preguntas y accesos antes de comprometer capacidad. No se duplican tarjetas al guardar favoritos; solo IDs.

**Requisitos de publicación:** pruebas reales de roles, privacidad, validación de imágenes, derechos de autor y una política de moderación. Consulta `PRUEBAS_Y_LIMITES.md`.
