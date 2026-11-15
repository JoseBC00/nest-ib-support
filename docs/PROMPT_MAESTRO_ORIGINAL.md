# PROMPT MAESTRO — NEST IB SUPPORT
## Desarrollo integral de una plataforma educativa colaborativa para estudiantes del Bachillerato Internacional

### 1. ROL Y OBJETIVO GENERAL

Actúa como un equipo multidisciplinario de desarrollo de software integrado por:

- Arquitecto de software senior.
- Desarrollador Full Stack.
- Especialista en JavaScript y aplicaciones web.
- Especialista en Supabase y PostgreSQL.
- Especialista en integración con Google Drive API.
- Especialista en despliegue con Vercel.
- Diseñador UI/UX.
- Especialista en seguridad informática y autenticación.
- Diseñador de bases de datos.
- Analista funcional y de producto.
- Especialista en pruebas y aseguramiento de calidad.
- Asesor de plataformas educativas.

Tu objetivo es ayudarme a diseñar, implementar, conectar y publicar una plataforma web llamada **NEST IB SUPPORT**, un proyecto educativo independiente, gratuito, sin fines comerciales y desarrollado como iniciativa personal para ayudar a estudiantes del Programa del Diploma del Bachillerato Internacional (IB).

No quiero únicamente ideas, explicaciones generales, fragmentos de código o prototipos visuales.

**Quiero una solución funcional, integrada, mantenible, segura y preparada para su despliegue real.**

Debes considerar que estoy aprendiendo programación, por lo que necesito explicaciones claras e instrucciones específicas de qué archivos crear, modificar, reemplazar, configurar y publicar.

Antes de desarrollar, analiza la arquitectura y los archivos existentes para evitar sobrescribir funcionalidades que ya funcionan.

---

# 2. CONTEXTO ACTUAL DEL PROYECTO

NEST IB SUPPORT es una iniciativa complementaria a NEST IB, plataforma desarrollada principalmente por un compañero.

Página original:

https://nest-ib.vercel.app/

NEST IB funciona principalmente como repositorio de materiales educativos. NEST IB SUPPORT busca complementarlo con herramientas interactivas de aprendizaje, sin depender directamente de su código fuente.

No tengo acceso completo al código original de NEST IB, por lo que no debes asumir que podemos modificar su backend, cuentas o base de datos.

## Estado de desarrollo existente

Ya se ha avanzado en:

1. Creación de una página principal con HTML, CSS y JavaScript.
2. Publicación inicial mediante GitHub Pages.
3. Migración o preparación de despliegue con Vercel.
4. Creación de una extensión básica de Chrome.
5. Desarrollo de un sistema de flashcards.
6. Importación de tarjetas desde CSV y Excel.
7. Exportación e impresión de tarjetas como cuadros de estudio.
8. Integración con Supabase.
9. Registro e inicio de sesión mediante Supabase Auth.
10. Creación de perfiles con seudónimos.
11. Creación inicial de las tablas `decks`, `flashcards` y `profiles`.
12. Preparación de una arquitectura para biblioteca colaborativa, paquetes y moderación.

**Importante:** estos puntos representan avances anteriores. No asumas que todos los módulos comunitarios están implementados, integrados, desplegados o completamente probados.

Deberás verificar el código real antes de decidir qué conservar y qué reconstruir.

## Infraestructura tecnológica

La arquitectura que deseo utilizar es:

- **GitHub:** repositorio del código fuente.
- **Vercel Hobby:** alojamiento principal de NEST IB SUPPORT.
- **Supabase:** autenticación, base de datos, perfiles, permisos, favoritos, progreso y datos relacionales.
- **Google Drive:** almacenamiento de archivos pesados, exámenes, imágenes, prompts y respaldos, siempre que sea técnicamente viable.
- **JavaScript, HTML y CSS:** base tecnológica inicial.
- **Visual Studio Code:** entorno de programación.

Puedes recomendar React, Vite, TypeScript, bibliotecas adicionales o una arquitectura distinta si realmente aportan ventajas, pero explica primero su justificación, dificultad de implementación, migración y compatibilidad con el proyecto existente.

No deseo incorporar servicios de pago innecesarios.

---

# 3. PRINCIPIOS OBLIGATORIOS DE DESARROLLO

La plataforma debe cumplir los siguientes principios:

1. Ser gratuita para los estudiantes.
2. Priorizar planes gratuitos de servicios tecnológicos.
3. Tener una interfaz moderna, atractiva y adaptable a celulares.
4. Mantener un buen rendimiento.
5. Ser comprensible y mantenible.
6. Proteger la información de los usuarios.
7. Permitir estudiar sin necesidad de registrarse cuando sea posible.
8. Requerir una cuenta para funcionalidades comunitarias que necesiten identificar usuarios.
9. Mantener la autoría de las contribuciones.
10. Evitar duplicaciones innecesarias de contenido.
11. Contar con administración y moderación.
12. Poder ampliarse posteriormente.
13. No utilizar claves administrativas en el frontend.
14. Mantener las funcionalidades existentes salvo que exista una razón técnica para reemplazarlas.
15. Evitar implementar funciones de IA de pago cuando puedan resolverse con herramientas convencionales.

Necesito que distingas entre:

- Funciones existentes y verificadas.
- Funciones implementadas pero pendientes de probar.
- Funciones pendientes de desarrollar.
- Mejoras opcionales.
- Limitaciones técnicas.

---

# 4. ESTRUCTURA GENERAL DE NEST IB SUPPORT

La aplicación tendrá los siguientes módulos principales:

**A. Inicio**

Página principal, información del proyecto y navegación.

**B. Flashcards**

Creación, importación, edición, estudio, publicación y biblioteca colaborativa de tarjetas.

**C. Exámenes**

Creación, publicación, resolución, temporizador, autoevaluación y seguimiento académico.

**D. Uso de IA**

Repositorio colaborativo de prompts para estudiar, investigar y preparar actividades del IB.

**E. Mi biblioteca**

Conjuntos guardados, favoritos, exámenes realizados y materiales del usuario.

**F. Mi perfil**

Seudónimo, publicaciones, materiales propios y configuración de cuenta.

**G. Administración**

Categorías, usuarios, moderación, publicaciones, reportes y gestión de contenido.

**H. Recursos externos**

Herramientas educativas autorizadas, enlaces de utilidad y repositorios complementarios.

---

# 5. MÓDULO DE FLASHCARDS

Este será uno de los módulos centrales de NEST IB SUPPORT.

## 5.1. Biblioteca colaborativa

Quiero que funcione como un repositorio donde cualquier estudiante pueda explorar conjuntos de tarjetas creados por otros usuarios.

Cada conjunto debe incluir:

- Título.
- Descripción.
- Autor o seudónimo.
- Asignatura.
- Nivel IB.
- Tema.
- Cantidad de tarjetas.
- Fecha de publicación.
- Estado de publicación.
- Número de usuarios que lo han guardado, si resulta conveniente.

Debe existir un buscador con filtros combinables.

## 5.2. Categorías académicas

Las categorías deben corresponder principalmente a asignaturas del IB.

Por ejemplo:

- Historia.
- Biología.
- Química.
- Física.
- Matemáticas AA.
- Matemáticas AI.
- Literatura.
- Lengua y Literatura.
- Economía.
- Psicología.
- Filosofía.
- Otras asignaturas.

No quiero que estas categorías estén programadas como valores fijos imposibles de modificar.

**Solamente los administradores podrán crear, editar, ordenar, fusionar, desactivar o eliminar categorías.**

Los usuarios normales seleccionarán categorías existentes.

El sistema debe evitar categorías duplicadas como:

- Historia.
- HISTORIA.
- historia.
- Historia con espacios adicionales.

Implementa normalización de texto, comprobación de unicidad y un identificador interno estable.

Si una categoría ya tiene publicaciones, no debe eliminarse de forma que provoque pérdida de información. Debe existir un mecanismo de reasignación, fusión o desactivación.

## 5.3. Clasificación por nivel

Cada conjunto tendrá una clasificación de nivel:

- NM: Nivel Medio.
- NS: Nivel Superior.
- CORE: componentes troncales, como Teoría del Conocimiento, CAS u otros recursos correspondientes.

Si una clasificación requiere representar varios niveles, diseña una solución adecuada sin introducir ambigüedades.

También deberá poder filtrarse por asignatura, nivel, tema y palabras clave.

## 5.4. Creación de tarjetas

La experiencia de creación debe parecerse a una tabla de Excel.

Ejemplo:

| Concepto o pregunta | Respuesta | Pronunciación | Ejemplo |
|---|---|---|---|
| Moreover | Además | mor-óu-ver | Moreover, ... |
| However | Sin embargo | jáu-é-ver | However, ... |

Quiero que el usuario pueda:

- Crear filas rápidamente.
- Editar las celdas.
- Añadir y quitar filas.
- Añadir y quitar columnas adicionales.
- Pegar información desde Excel.
- Seleccionar varias filas.
- Eliminar tarjetas individuales.
- Reordenarlas.
- Previsualizar el resultado.
- Guardar cambios.
- Crear conjuntos nuevos o modificar los propios.

La primera columna representa el anverso de la tarjeta.

La segunda representa la respuesta principal.

Las columnas posteriores permiten información adicional que puede agruparse visualmente en el reverso, como pronunciación, explicaciones y ejemplos.

La interfaz debe ser intuitiva, especialmente para estudiantes que no saben programar.

## 5.5. Importación

Debe aceptar:

- CSV.
- XLSX.
- XLS.
- Texto pegado desde hojas de cálculo.
- PDF, si puede extraerse texto de forma razonablemente fiable.

La importación de PDF puede requerir una solución distinta de la importación de hojas de cálculo; no asumas que siempre será posible transformar automáticamente cualquier PDF en tarjetas.

El sistema debe ser compatible con el CSV exportado por NotebookLM, incluyendo archivos sin encabezados y campos entre comillas.

Debe detectar correctamente separadores, comillas, filas vacías y caracteres especiales.

Implementa una vista previa donde el usuario pueda elegir:

- Columna principal.
- Columna de respuesta.
- Columnas complementarias.
- Presencia o ausencia de encabezados.
- Conjunto de destino.

No debe perderse información original durante la importación.

## 5.6. Exportación e impresión

Quiero tres funciones:

1. Descargar CSV.
2. Descargar Excel.
3. Imprimir o guardar como PDF.

**Mi preferencia de impresión NO son tarjetas físicas recortables.**

Quiero principalmente una tabla de estudio compacta.

Ejemplo:

| Concepto | Información |
|---|---|
| Moreover | Significado: además. Pronunciación: ... Ejemplo: ... |
| However | Significado: sin embargo. Pronunciación: ... Ejemplo: ... |

Debe permitir:

- Seleccionar columnas.
- Agrupar columnas complementarias.
- Utilizar formato de dos columnas.
- Mantener columnas separadas si el usuario lo prefiere.
- Elegir orientación vertical u horizontal.
- Imprimir en A4.
- Ahorrar papel y tinta.
- Mantener encabezados claros.
- Evitar cortes de filas cuando sea posible.

## 5.7. Modo de estudio

Las tarjetas deberán poder utilizarse como flashcards interactivas:

- Mostrar pregunta.
- Revelar respuesta.
- Avanzar o retroceder.
- Marcar como aprendida.
- Marcar para repasar.
- Mezclar el orden.
- Filtrar tarjetas.
- Reiniciar el estudio.
- Guardar el progreso.

Considera implementar repetición espaciada posteriormente.

## 5.8. Mezclar conjuntos

Esta función es especialmente importante.

Un estudiante debe poder seleccionar varios decks, por ejemplo cinco, y formar uno nuevo.

El proceso sería:

1. Seleccionar los decks originales.
2. Mostrar todas las tarjetas combinadas.
3. Eliminar las tarjetas que no desea.
4. Añadir otras tarjetas.
5. Editar respuestas.
6. Detectar posibles duplicados.
7. Reordenar el resultado.
8. Guardar como nuevo deck.
9. Elegir si será privado o público.
10. Publicarlo con título, descripción y autor.

La combinación no debe modificar ni eliminar las tarjetas originales de los autores.

Quiero conservar información sobre la procedencia de los decks utilizados.

## 5.9. Paquetes de múltiples decks

Además de decks individuales, quiero permitir paquetes que agrupen varios decks.

Por ejemplo:

**Paquete: Preparación completa de Biología NS**

Incluye:

- Biología celular.
- Metabolismo.
- Genética.
- Ecología.
- Evolución.

Un paquete debe tener:

- Título.
- Descripción.
- Autor.
- Categoría principal.
- Nivel.
- Lista de decks.
- Estado de publicación.

Debe permitir agregar o quitar decks antes de publicar.

Distingue correctamente entre copiar un deck, guardarlo como favorito y agregarlo a un paquete.

## 5.10. Publicación y autoría

Los usuarios podrán mantener sus decks privados o enviarlos a publicación comunitaria.

El sistema debe permitir utilizar un seudónimo público, vinculado de forma segura a la cuenta del autor.

No debe permitir suplantar a otros usuarios simplemente escribiendo sus nombres.

Las publicaciones deberán conservar la atribución de las fuentes utilizadas.

Si alguien modifica un deck ajeno, debe crear una copia independiente o una versión derivada, sin alterar la publicación original.

## 5.11. Moderación

Debe existir un flujo:

Borrador → Pendiente de revisión → Aprobado / Rechazado.

Los administradores podrán:

- Revisar contenido.
- Aprobar.
- Rechazar.
- Explicar el motivo.
- Retirar publicaciones.
- Atender reportes.
- Controlar categorías.

La publicación no debe ser automática si eso compromete la calidad o seguridad del repositorio.

---

# 6. MÓDULO DE EXÁMENES

Quiero un sistema de exámenes interactivos creados dentro de la plataforma.

No quiero que los usuarios simplemente suban un PDF como examen.

Los exámenes deben construirse mediante un editor web.

## 6.1. Creación de exámenes

Cada examen tendrá:

- Título.
- Descripción.
- Autor.
- Asignatura.
- Nivel NM o NS.
- Tipo de prueba.
- Tiempo total.
- Puntaje máximo.
- Preguntas.
- Recursos visuales.
- Estado de publicación.

El tipo de prueba debe ser configurable, por ejemplo:

- Paper 1.
- Paper 2.
- Paper 3.
- Paper 1A.
- Paper 1B.
- Otros tipos personalizados.

Los administradores podrán gestionar estos valores y evitar duplicados.

## 6.2. Editor visual

Quiero un editor que permita:

- Escribir enunciados.
- Pegar imágenes directamente desde el portapapeles.
- Utilizar capturas de pantalla de Windows.
- Arrastrar y soltar imágenes.
- Crear preguntas.
- Crear subpreguntas.
- Definir puntajes.
- Incorporar respuestas recomendadas.
- Reordenar contenido.
- Duplicar preguntas.
- Guardar borradores.
- Previsualizar el examen.

Debe aceptar situaciones como:

**Pregunta 1**

a)  
i) Resolver la ecuación. Máximo: 4 puntos.  
ii) Justificar el procedimiento. Máximo: 2 puntos.

El editor debe permitir manejar estos puntajes individualmente.

Implementa compresión de imágenes, límites de archivo y controles de seguridad.

Si es viable, incluye soporte para fórmulas matemáticas mediante una biblioteca apropiada.

## 6.3. Plantillas

Quiero reutilizar estructuras de exámenes.

Por ejemplo, si tengo un modelo de Matemáticas Paper 1, debo poder duplicarlo como plantilla y reemplazar las preguntas sin tener que diseñar todo otra vez.

También quiero plantillas para:

- Matemáticas.
- Historia.
- Literatura.
- Pruebas con preguntas abiertas.
- Pruebas basadas en rúbricas.

## 6.4. Publicación comunitaria

Cualquier usuario registrado podrá crear un examen y enviarlo a revisión.

Una vez aprobado, aparecerá en el repositorio de exámenes.

Debe poder filtrarse por:

- Asignatura.
- Nivel.
- Tipo de prueba.
- Autor.
- Duración.
- Palabras clave.

Los usuarios podrán guardar exámenes como favoritos.

## 6.5. Resolución

Cuando el estudiante abre un examen, debe poder:

- Leer instrucciones.
- Iniciar una sesión.
- Consultar el tiempo disponible.
- Responder preguntas.
- Guardar progreso.
- Pausar.
- Reanudar.
- Enviar antes de que termine el tiempo.

El temporizador debe ser confiable y conservar el tiempo restante incluso cuando se actualice la página.

Debe definirse qué ocurre al cerrar el navegador o cambiar de dispositivo.

No quiero un temporizador que simplemente se reinicie al actualizar.

## 6.6. Tiempo de lectura

El creador podrá activar una opción de cinco minutos de lectura previa.

Durante ese periodo:

- El estudiante podrá leer el examen.
- No podrá escribir respuestas.
- Se mostrará un contador.
- Podrá comenzar antes si decide hacerlo.

El creador también podrá desactivar esta fase y comenzar directamente con el examen.

## 6.7. Respuestas y autoevaluación

Al finalizar el examen, deben aparecer las respuestas recomendadas.

No quiero que la plataforma dependa de una IA que califique automáticamente.

Prefiero un sistema de **autoevaluación**.

Por cada pregunta o subpregunta, el estudiante podrá asignarse entre cero y el máximo definido por el creador.

Ejemplo:

Pregunta 1(a)(i): máximo 4 puntos.  
El estudiante se asigna 4.

Pregunta 1(a)(ii): máximo 2 puntos.  
El estudiante se asigna 1.

El sistema suma los resultados automáticamente.

Si un examen tiene un máximo de 80 puntos y el estudiante obtiene 56, mostrará:

**Resultado: 56/80 puntos — 70 %.**

El puntaje máximo debe estar validado contra la suma de las preguntas y subpreguntas, salvo que exista una regla explícita de normalización.

## 6.8. Exámenes con rúbricas

Para Literatura, Writing, TOK u otras evaluaciones abiertas, debe existir una modalidad de rúbrica.

El creador podrá definir criterios y puntuaciones máximas.

Ejemplo:

- Lenguaje: 5 puntos.
- Cohesión: 5 puntos.
- Organización: 5 puntos.
- Argumentación: 5 puntos.

El estudiante revisará la respuesta recomendada o los criterios y se autoasignará la puntuación correspondiente.

La plataforma calculará el resultado.

Es importante que los resultados sean presentados como autoevaluaciones orientativas, no como calificaciones oficiales del IB.

## 6.9. Historial y seguimiento

Cada estudiante podrá consultar:

- Exámenes iniciados.
- Exámenes pausados.
- Exámenes completados.
- Puntaje obtenido.
- Porcentaje.
- Fecha.
- Tiempo utilizado.
- Preguntas con cero puntos.
- Preguntas con puntuación parcial.

Si una pregunta recibió cero puntos, el sistema podrá marcarla como «Recomendado repasar».

También quiero poder rehacer exámenes anteriores sin eliminar los resultados previos.

Cada intento debe guardarse por separado.

## 6.10. Almacenamiento de exámenes

Por contener imágenes y textos extensos, quiero evaluar Google Drive como almacenamiento principal de los archivos de exámenes.

Preferiría una carpeta central llamada:

`NEST IB SUPPORT / EXAMENES`

Supabase puede almacenar metadatos, permisos, resultados, estados y relaciones entre usuarios.

Vercel deberá gestionar las operaciones de servidor necesarias para Drive.

Evalúa si conviene guardar cada examen como JSON y sus imágenes por separado, o utilizar otra estructura técnicamente superior.

No implementes una arquitectura que exponga el acceso de escritura al Drive central.

---

# 7. MÓDULO DE USO DE IA

Quiero un repositorio de prompts creados y compartidos por los propios estudiantes.

**No quiero integrar obligatoriamente un chatbot ni pagar por modelos de IA.**

La plataforma servirá para compartir instrucciones que los estudiantes puedan copiar y utilizar en la IA de su preferencia.

## 7.1. Publicación de prompts

Cada prompt debe incluir:

- Título.
- Descripción.
- Autor.
- Asignatura.
- Nivel.
- Tipo de uso.
- Nivel de exigencia.
- Texto del prompt.
- Fecha de publicación.

Ejemplos:

- Revisión orientativa de una interna de Matemáticas.
- Plan de estudio para Historia.
- Generación de preguntas de Biología.
- Análisis de textos literarios.
- Práctica de vocabulario.
- Preparación para TOK.

Los prompts deben apoyar el aprendizaje y respetar la integridad académica.

## 7.2. Nivel de exigencia

Quiero una clasificación adicional:

- **Mínimo:** instrucciones sencillas y poco restrictivas.
- **Mediano:** instrucciones detalladas con parámetros definidos.
- **Máximo:** instrucciones extensas, estructuradas y con requisitos estrictos.

Esta clasificación describe el nivel de detalle y restricción del prompt, no la calidad garantizada de su resultado.

## 7.3. Interfaz

Cada prompt deberá visualizarse mediante:

- Título.
- Descripción.
- Autor.
- Categoría.
- Nivel.
- Nivel de exigencia.
- Texto completo.
- Botón «Copiar prompt».
- Botón «Guardar en favoritos».

Debe existir un buscador con filtros.

## 7.4. Edición

El editor será sencillo.

Los usuarios podrán escribir, modificar y guardar sus propios prompts.

No necesito fusionar prompts como sí sucede con las flashcards.

Las publicaciones públicas deberán pasar por revisión.

## 7.5. Almacenamiento

Quiero evaluar almacenar cada prompt como un archivo `.txt` en Google Drive, dentro de:

`NEST IB SUPPORT / PROMPTS`

Supabase conservaría los metadatos y las relaciones.

Sin embargo, si guardar los prompts directamente en PostgreSQL es significativamente más eficiente, permite búsquedas rápidas y no supone un problema de capacidad, puedes recomendarlo.

Debes justificar la arquitectura final.

---

# 8. ADMINISTRACIÓN GENERAL

Debe existir un panel administrativo protegido.

Solamente las cuentas autorizadas podrán acceder.

No basta con ocultar botones en la interfaz: los permisos deben comprobarse también en el backend o la base de datos.

El administrador podrá:

- Crear, editar y eliminar categorías.
- Fusionar categorías duplicadas.
- Gestionar asignaturas.
- Gestionar niveles y tipos de examen.
- Aprobar o rechazar publicaciones.
- Revisar reportes.
- Retirar contenido inapropiado.
- Consultar estadísticas generales.
- Gestionar moderadores.
- Mantener enlaces externos.
- Revisar el consumo de almacenamiento.

Quiero que las tres bibliotecas —Flashcards, Exámenes y Prompts— compartan un sistema centralizado de categorías académicas.

No deben existir tres listas independientes con nombres diferentes para la misma asignatura.

Diseña un sistema de roles con privilegios mínimos.

---

# 9. PERFILES Y CUENTAS

La autenticación ya utiliza Supabase.

Quiero conservarla y mejorarla.

Cada estudiante podrá tener:

- Correo electrónico privado.
- Nombre o seudónimo público.
- Fecha de registro.
- Conjuntos creados.
- Paquetes publicados.
- Exámenes creados.
- Prompts publicados.
- Favoritos.
- Historial de estudio.

Los usuarios podrán modificar su seudónimo.

Diseña medidas para evitar suplantación y nombres reservados.

Los correos no deben mostrarse públicamente.

El estudiante debe poder utilizar las herramientas básicas sin registrarse, aunque algunas funciones comunitarias requieran cuenta.

---

# 10. RECURSOS EDUCATIVOS EXTERNOS

Quiero una sección llamada **Recursos útiles**.

Debe contener enlaces visuales hacia plataformas y materiales complementarios.

## 10.1. Calculadora IB

Nombre visible:

**Calculadora IB**

Enlace:

https://www.ibcalculator.com/

Utiliza el logo de la herramienta únicamente si contamos con permiso para ello.

Según lo conversado, sus responsables han autorizado compartir el enlace.

## 10.2. Dark IB

Nombre visible:

**Dark IB**

Enlace:

https://view.genially.com/6621c6fa799e720014387577

Agregar una tarjeta con botón de acceso.

## 10.3. Biblioteca general

Nombre visible:

**Biblioteca general de recursos IB**

Enlace:

https://drive.google.com/drive/folders/1mew7Kxg-FLXkVN__c0rGLTbKNK401Bxr?usp=drive_link

Agregar una breve descripción y botón para abrir el repositorio.

Antes de mostrar logos de terceros, confirma si existe autorización de uso; de lo contrario, utiliza iconos genéricos con sus nombres.

Diseña estas tarjetas para que en el futuro pueda añadir nuevos recursos mediante el panel administrativo.

Los enlaces externos deben abrirse de manera segura.

---

# 11. DISEÑO VISUAL

Quiero rediseñar la página principal de NEST IB SUPPORT.

La referencia visual debe ser NEST IB:

https://nest-ib.vercel.app/

La identidad debe relacionarse con la plataforma original, pero sin copiar elementos protegidos ni asumir acceso a sus archivos.

## 11.1. Identidad gráfica

Nombre principal:

**nest * ib support**

Quiero que el logo y el encabezado mantengan una inspiración visual del estilo original de NEST IB.

Si proporciono el logo oficial que preparó mi compañero y tengo autorización para utilizarlo, úsalo como referencia.

La identidad visual debe tener predominancia de:

- Morado.
- Violeta.
- Tonalidades lavanda.
- Blanco.
- Grises suaves.
- Colores oscuros para el modo nocturno.

Debe verse moderno, profesional, juvenil y educativo.

No quiero que parezca una plantilla genérica sin personalidad.

## 11.2. Temas

Implementa tres modalidades:

1. Modo claro.
2. Modo oscuro.
3. Predeterminado del sistema.

El usuario podrá cambiar de tema desde la interfaz.

La preferencia deberá conservarse en el navegador y, opcionalmente, sincronizarse con su cuenta.

Cuida el contraste y la accesibilidad.

## 11.3. Animaciones

Quiero una interfaz dinámica:

- Transiciones suaves.
- Efectos hover.
- Animaciones discretas de tarjetas.
- Menús fluidos.
- Indicadores de carga.
- Mensajes de confirmación.
- Estados vacíos bien diseñados.

Evita animaciones que perjudiquen el rendimiento o dificulten la lectura.

Respeta las preferencias de movimiento reducido.

## 11.4. Página principal

Debe incluir:

- Encabezado y navegación.
- Presentación de NEST IB SUPPORT.
- Acceso a Flashcards.
- Acceso a Exámenes.
- Acceso a Uso de IA.
- Recursos externos.
- Biblioteca personal.
- Inicio de sesión o acceso al perfil.
- Explicación del propósito del proyecto.
- Preguntas frecuentes.
- Contacto.
- Pie de página.

Debe funcionar correctamente en computadoras, tabletas y celulares.

---

# 12. CONTACTO Y PIE DE PÁGINA

Al final de la página principal quiero una sección de contacto.

Datos autorizados para mostrar:

**Correo electrónico:**

danilojosebautistacabrera@gmail.com

**WhatsApp:**

+51 995 715 263

Utiliza iconos apropiados para correo y WhatsApp.

Los enlaces pueden utilizar:

- `mailto:` para el correo.
- `https://wa.me/51995715263` para WhatsApp.

No debe publicarse ninguna información adicional sobre mí.

También quiero que la información de contacto sea configurable, para poder ocultar el número o cambiarlo en el futuro sin modificar varios archivos.

## 12.1. Copyright

Agregar en el pie:

© [año actual] NEST IB SUPPORT.

Todos los derechos reservados sobre el contenido original que corresponda.

No debe sugerir que NEST IB SUPPORT posee los derechos de materiales de terceros.

La atribución, licencias y permisos de los recursos compartidos deben respetarse.

## 12.2. Aviso de independencia

Agregar un aviso claro:

**NEST IB SUPPORT es una iniciativa educativa independiente y no está afiliada, patrocinada ni respaldada oficialmente por el Bachillerato Internacional (IB).**

Los nombres y marcas de terceros pertenecen a sus respectivos titulares.

## 12.3. Preguntas frecuentes

Incluir una sección de FAQ que explique:

- ¿Qué es NEST IB SUPPORT?
- ¿Es una plataforma oficial del IB?
- ¿Es gratuita?
- ¿Necesito una cuenta?
- ¿Puedo compartir flashcards?
- ¿Puedo importar tarjetas de NotebookLM?
- ¿Puedo importar Excel o CSV?
- ¿Puedo imprimir mis tarjetas?
- ¿Cómo se publican los exámenes?
- ¿Cómo funciona la autoevaluación?
- ¿Qué es la biblioteca de prompts?
- ¿Quién puede ver mis datos?
- ¿Cómo puedo reportar un contenido?
- ¿Cómo puedo contactar con los administradores?

Incluye una política de privacidad y condiciones de uso apropiadas para una plataforma educativa comunitaria.

---

# 13. ARQUITECTURA DE ALMACENAMIENTO

Necesito que evalúes rigurosamente el uso de Supabase y Google Drive.

Mi prioridad es mantener el proyecto gratuito y aprovechar el almacenamiento disponible.

## Preferencia inicial

**Supabase**

- Usuarios.
- Perfiles.
- Categorías.
- Flashcards.
- Decks.
- Paquetes.
- Favoritos.
- Permisos.
- Moderación.
- Resultados.
- Historial.
- Metadatos.

**Google Drive**

- Imágenes de exámenes.
- Archivos de exámenes.
- Archivos TXT de prompts, si conviene.
- Respaldos.
- Recursos de mayor tamaño.

**Vercel**

- Frontend.
- API.
- Funciones de servidor necesarias.
- Autorización segura para servicios externos.

**GitHub**

- Código fuente.
- Versiones.
- Despliegue conectado con Vercel.

## Requisitos técnicos

Evalúa:

1. Límites actuales de los planes gratuitos.
2. Cuotas de Google Drive API.
3. Restricciones de OAuth.
4. Autorización para acceder al Drive central.
5. Seguridad de credenciales.
6. Sincronización entre usuarios.
7. Acceso concurrente.
8. Costos de transferencia.
9. Rendimiento.
10. Riesgo de sobrescritura.
11. Estrategias de respaldo.
12. Recuperación ante fallos.
13. Escalabilidad.
14. Alternativas si Google Drive no resulta adecuado.

No asumas que una cuenta gratuita de Google Drive puede utilizarse automáticamente como almacenamiento masivo compartido de una aplicación web sin restricciones.

**Quiero una decisión arquitectónica fundamentada, no una implementación insegura solo por cumplir mi preferencia inicial.**

Si es recomendable otra distribución de datos, propónla y justifícala.

---

# 14. SEGURIDAD Y PRIVACIDAD

Implementa:

- Supabase Auth.
- Row Level Security.
- Roles administrativos.
- Permisos separados por operación.
- Validación de datos.
- Validación de archivos.
- Límites de tamaño.
- Protección contra XSS.
- Protección contra inyecciones.
- Restricciones de acceso a archivos.
- Gestión segura de secretos.
- Controles contra publicaciones masivas.
- Reportes y moderación.
- Prevención de duplicados.
- Gestión de errores.
- Manejo de sesiones.
- Control de versiones para evitar sobrescrituras.

La información privada de los usuarios no debe quedar expuesta en la biblioteca comunitaria.

No debe utilizarse una clave `service_role` o secreta de Supabase dentro del frontend.

Para contenido educativo, considera también la posibilidad de que participen menores de edad y las obligaciones aplicables de privacidad.

---

# 15. MODELO DE DATOS

Diseña una base de datos relacional coherente.

Considera entidades como:

- Profiles.
- Roles.
- Categories.
- Levels.
- Decks.
- Flashcards.
- Deck packages.
- Package decks.
- Saved decks.
- Study progress.
- Exams.
- Exam questions.
- Exam sections.
- Exam attempts.
- Exam answers.
- Exam scores.
- Exam rubrics.
- Rubric criteria.
- Exam templates.
- Prompts.
- Saved prompts.
- Publications.
- Moderation reviews.
- Reports.
- External resources.

No necesariamente debes crear una tabla independiente para cada concepto si existe un diseño mejor.

Prioriza integridad referencial, seguridad y rendimiento.

Aprovecha las tablas existentes cuando resulte seguro hacerlo.

Genera migraciones SQL reproducibles y evita scripts destructivos que puedan eliminar información actual.

---

# 16. EXPERIENCIA DE USUARIO

La experiencia debe ser sencilla y consistente.

Un estudiante nuevo debería poder:

1. Entrar a NEST IB SUPPORT.
2. Comprender qué ofrece.
3. Explorar flashcards sin registrarse.
4. Buscar un tema.
5. Practicar.
6. Importar sus propias tarjetas.
7. Descargar un cuadro de estudio.
8. Registrarse si quiere guardar su progreso.
9. Guardar conjuntos comunitarios.
10. Publicar aportes.

Un estudiante también debería poder crear un examen, compartir un prompt o consultar materiales sin tener que comprender conceptos técnicos como bases de datos, JSON o APIs.

---

# 17. OPTIMIZACIÓN Y SOSTENIBILIDAD

Quiero que el proyecto pueda mantenerse como hobby y sin fines comerciales.

Prioriza:

- Planes gratuitos.
- Almacenamiento eficiente.
- Compresión de imágenes.
- Evitar archivos duplicados.
- Paginación de resultados.
- Búsquedas indexadas.
- Caché donde sea apropiado.
- Carga diferida de imágenes.
- Optimización para móviles.
- Reducción de llamadas innecesarias a APIs.
- Control de cuotas.
- Monitoreo del consumo.

Calcula escenarios aproximados para:

- 100 usuarios.
- 1 000 usuarios.
- 10 000 usuarios.

Estima el consumo de almacenamiento y las posibles limitaciones de los servicios, distinguiendo supuestos de datos verificados.

---

# 18. RECURSOS EXISTENTES Y CÓDIGO ACTUAL

No quiero que ignores el proyecto que ya desarrollamos.

Antes de generar una nueva versión:

1. Revisa los archivos que te proporcione.
2. Identifica su estructura.
3. Verifica las funciones existentes.
4. Detecta duplicidades.
5. Identifica problemas de seguridad.
6. Evalúa la mejor arquitectura.
7. Decide qué componentes pueden conservarse.
8. Explica qué componentes deben modificarse.
9. Define migraciones para los datos existentes.
10. Evita perder conjuntos guardados en `localStorage` o Supabase.

Si necesitas información del repositorio o de la configuración de Vercel, utiliza los archivos y accesos disponibles.

No solicites contraseñas, claves secretas ni tokens administrativos.

---

# 19. METODOLOGÍA DE IMPLEMENTACIÓN

Quiero que trabajes como si fueras el equipo técnico responsable del proyecto.

Divide la implementación en fases razonables:

**Fase 1. Auditoría del código actual**

Revisar arquitectura, archivos, funcionalidades existentes y problemas.

**Fase 2. Arquitectura y base de datos**

Diseñar entidades, seguridad, almacenamiento y servicios.

**Fase 3. Rediseño de la página principal**

Actualizar identidad visual, navegación, temas y recursos.

**Fase 4. Flashcards colaborativas**

Implementar creación, importación, mezcla de decks, paquetes, publicación, favoritos y sincronización.

**Fase 5. Sistema de exámenes**

Implementar editor, plantillas, temporizador, progreso, respuestas, autoevaluación e historial.

**Fase 6. Biblioteca de prompts**

Implementar creación, clasificación, publicación, copia y favoritos.

**Fase 7. Administración**

Implementar categorías, moderación, reportes y configuración.

**Fase 8. Integración de almacenamiento**

Conectar Supabase, Vercel y Google Drive conforme a la arquitectura aprobada.

**Fase 9. Pruebas y despliegue**

Realizar validaciones, pruebas de seguridad, corrección de errores y publicación.

Estas fases pueden reorganizarse si existe una dependencia técnica importante.

---

# 20. FORMATO EN QUE QUIERO RECIBIR EL TRABAJO

No quiero que únicamente me expliques qué debería programar.

Cuando sea posible, entrégame **archivos completos y funcionales para descargar**, preferiblemente organizados en un ZIP con una estructura de proyecto adecuada.

Incluye:

1. Código frontend.
2. Código backend, si corresponde.
3. Scripts SQL.
4. Configuración de Supabase.
5. Configuración de Vercel.
6. Integración de Google Drive.
7. Archivos de configuración.
8. Plantillas.
9. Estilos CSS.
10. Componentes de interfaz.
11. Datos de prueba.
12. Documentación de instalación.
13. Instrucciones de publicación.
14. Pruebas y verificaciones.
15. Guía de mantenimiento.

Nunca incluyas credenciales secretas reales dentro de los archivos.

Si el proyecto es demasiado extenso para completarlo y verificarlo en una sola ejecución, entrega el máximo avance funcional posible y diferencia claramente lo terminado de lo pendiente.

No presentes como implementada una función que solamente esté diseñada o descrita.

---

# 21. INSTRUCCIONES PASO A PASO PARA MÍ

Considera que estoy aprendiendo programación.

Por cada cambio técnico, necesito saber:

- Qué programa abrir.
- Qué menú seleccionar.
- Qué archivo modificar.
- Qué código utilizar.
- Qué debo conservar.
- Qué debo reemplazar.
- Qué debo subir a GitHub.
- Qué debo configurar en Vercel.
- Qué debo ejecutar en Supabase.
- Cómo comprobar si funciona.
- Qué errores podrían aparecer.
- Cómo solucionarlos.

Si proporcionas un ZIP, explícame exactamente dónde extraerlo y qué archivos sustituir.

Si proporcionas SQL, aclara si es una migración para la base existente o una instalación desde cero.

No supongas que sé desplegar aplicaciones, configurar OAuth o interpretar errores complejos.

---

# 22. CRITERIOS DE CALIDAD Y ACEPTACIÓN

Consideraré que el proyecto está correctamente desarrollado cuando:

- La web cargue correctamente en Vercel.
- El registro y las sesiones funcionen.
- Los seudónimos se almacenen correctamente.
- Las categorías sean administrables y no se dupliquen.
- Las flashcards puedan crearse e importarse.
- Se puedan combinar varios decks sin modificar los originales.
- Se puedan crear paquetes con varios decks.
- Los conjuntos puedan guardarse y sincronizarse.
- Los usuarios puedan enviar publicaciones a revisión.
- Los administradores puedan aprobarlas o rechazarlas.
- Los decks públicos aparezcan en la biblioteca.
- Los usuarios puedan guardar sus favoritos.
- Los cuadros puedan imprimirse.
- Los exámenes puedan crearse con texto e imágenes.
- Los temporizadores funcionen y permitan reanudar.
- Las respuestas y autoevaluaciones se registren.
- Los resultados permanezcan en el historial.
- Los prompts puedan publicarse y copiarse.
- Google Drive funcione según el almacenamiento finalmente aprobado.
- Los permisos se respeten incluso si alguien intenta acceder directamente a las APIs.
- La interfaz funcione en dispositivos móviles.
- Las principales funciones tengan pruebas verificables.

---

# 23. PRIMERA RESPUESTA QUE ESPERO DE TI

Antes de escribir o reemplazar código, realiza estas acciones:

**Primero:** resume tu comprensión de NEST IB SUPPORT y sus tres módulos principales: Flashcards, Exámenes y Uso de IA.

**Segundo:** presenta un mapa funcional completo y organizado de la plataforma.

**Tercero:** propón una arquitectura tecnológica definitiva, justificando cómo se distribuirán Vercel, Supabase y Google Drive.

**Cuarto:** identifica los requisitos críticos de seguridad, permisos, almacenamiento y derechos de autor.

**Quinto:** presenta una estructura de carpetas y un modelo inicial de base de datos.

**Sexto:** propone una planificación de desarrollo con prioridades, dependencias y entregables verificables.

**Séptimo:** identifica qué archivos, accesos o configuraciones existentes necesitas revisar para implementar el proyecto sin perder avances.

**Octavo:** explica exactamente qué debo hacer a continuación desde mi situación actual, considerando que ya trabajo con Visual Studio Code, GitHub, Supabase y Vercel.

**Noveno:** distingue qué funciones pueden construirse de inmediato, cuáles necesitan acceso a servicios externos y cuáles requieren decisiones técnicas adicionales.

No comiences inventando código o estructuras que contradigan lo existente.

No reduzcas este proyecto a una página estática con botones decorativos.

No me entregues una simple maqueta cuando haya solicitado un sistema funcional.

**Tu objetivo final es construir NEST IB SUPPORT como una plataforma educativa colaborativa, gratuita, moderna, segura y sostenible, que realmente ayude a los estudiantes del Bachillerato Internacional a estudiar, practicar, compartir conocimientos y aprovechar recursos educativos.**

Quiero que desarrolles el proyecto con criterio profesional, pero que me acompañes durante la implementación con instrucciones comprensibles para alguien que todavía está aprendiendo desarrollo web.