/**
 * NEST IB SUPPORT — impresión de exámenes
 * Renderiza una hoja A4 independiente de la interfaz. No modifica
 * borradores, intentos, tiempos ni resultados del estudiante.
 */
import { escapeHtml, state, insist, categoryName } from './core.js';

const safe = value => escapeHtml(String(value ?? ''));
const paragraph = value => safe(value).replace(/\r\n?/g, '\n');
const pts = value => Number.isFinite(+value) ? +value : 0;
const maxForPart = part => (part.rubric?.length
  ? part.rubric.reduce((total, item) => total + pts(item.max), 0)
  : pts(part.max));
const total = exam => (exam.questions || []).reduce((sum, q) =>
  sum + (q.parts || []).reduce((s, p) => s + maxForPart(p), 0), 0);

function readBlobAsDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(blob);
  });
}

async function imageData(id) {
  const headers = {};
  if (state.user && state.db) {
    const { data, error } = await state.db.auth.getSession();
    if (!error && data?.session) headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  const response = await fetch(`/api/drive-file?id=${encodeURIComponent(id)}`, { headers });
  if (!response.ok) throw new Error(`Imagen no disponible (HTTP ${response.status})`);
  const blob = await response.blob();
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(blob.type)) {
    throw new Error('Tipo de imagen no permitido');
  }
  return readBlobAsDataURL(blob);
}

async function renderImages(imageIds, warnings) {
  const images = await Promise.all((imageIds || []).map(async id => {
    try {
      const dataUrl = await imageData(id);
      return `<figure class="figure"><img alt="Imagen del enunciado" src="${dataUrl}"></figure>`;
    } catch (err) {
      warnings.push(`No se pudo cargar una imagen del examen: ${err.message}`);
      return '<div class="image-missing">⚠ Imagen del examen no disponible. Comprueba la conexión con Google Drive antes de imprimir.</div>';
    }
  }));
  return images.join('');
}

function rubricTable(part) {
  if (!part.rubric?.length) return '';
  return `<table class="rubric"><thead><tr><th>Criterio de evaluación</th><th>Máximo</th></tr></thead><tbody>${part.rubric.map(r =>
    `<tr><td>${safe(r.label)}</td><td class="number">${pts(r.max)}</td></tr>`
  ).join('')}</tbody></table>`;
}

function answerSection(part, attempt, mode) {
  if (mode === 'questions') return '<div class="writing-area" aria-label="Espacio para responder"></div>';
  if (mode === 'answers') {
    return `<div class="answer-block"><strong>Respuesta recomendada:</strong><div class="preserve">${paragraph(part.solution || 'No se proporcionó una respuesta modelo.')}</div></div>${rubricTable(part)}`;
  }
  const answer = attempt?.payload?.answers?.[part.id] ?? '';
  const details = part.rubric?.length ? part.rubric : [{ id: part.id, label: 'Puntuación', max: part.max }];
  const scoring = details.map(r => `<li>${safe(r.label)}: ${pts(attempt?.payload?.scores?.[r.id] ?? 0)} / ${pts(r.max)}</li>`).join('');
  return `<div class="answer-block"><strong>Mi respuesta:</strong><div class="preserve">${paragraph(answer || '(Sin respuesta)')}</div></div>
    <div class="answer-block"><strong>Respuesta recomendada:</strong><div class="preserve">${paragraph(part.solution || 'No se proporcionó una respuesta modelo.')}</div></div>
    <ul class="scoring">${scoring}</ul>${rubricTable(part)}`;
}

async function questionsHTML(exam, mode, attempt, warnings) {
  const chunks = await Promise.all((exam.questions || []).map(async (q, index) => {
    const pictures = await renderImages(q.imageIds, warnings);
    const subparts = (q.parts || []).map(p => `<div class="subpart">
      <div class="subpart-title"><strong>${safe(p.label || 'Apartado')}</strong><span>${maxForPart(p)} puntos</span></div>
      <div class="preserve">${paragraph(p.prompt)}</div>
      ${answerSection(p, attempt, mode)}
    </div>`).join('');
    return `<section class="question">
      <h2>Pregunta ${index + 1} <span>${(q.parts || []).reduce((v,p) => v+maxForPart(p),0)} puntos</span></h2>
      <div class="preserve">${paragraph(q.prompt)}</div>${pictures}${subparts}
    </section>`;
  }));
  return chunks.join('');
}

function css() {
  return `
  @page { size: A4 portrait; margin: 15mm 14mm; }
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font: 11.2pt/1.42 Arial, Helvetica, sans-serif; color: #181827; background: #f1eff6; margin: 0; }
  .toolbar { max-width: 210mm; margin: 15px auto; display:flex; align-items:center; gap:10px; justify-content:center; flex-wrap:wrap; }
  .toolbar button { background: #6c42bd; border:0; padding:11px 18px; border-radius:9px; color:#fff; font-weight:bold; cursor:pointer; }
  .toolbar .secondary { background:#47435d; }
  .toolbar small { width:100%; text-align:center; color:#555; }
  .sheet { width: min(210mm, calc(100vw - 24px)); background:white; margin: 0 auto 24px; padding:15mm 14mm; box-shadow:0 8px 35px #20123c23; }
  .header { border-bottom: 2px solid #4c287c; padding-bottom: 12px; margin-bottom: 14px; }
  .brand { font-weight:900; font-size: 12pt; letter-spacing:.3px; color:#4c287c; }
  h1 { font-size: 21pt; line-height:1.12; margin: 9px 0 12px; }
  h2 { font-size:13pt; margin:0 0 10px; padding-bottom:6px; border-bottom:1px solid #c7c1d2; display:flex; justify-content:space-between; gap:10px; }
  h2 span { font-size:10pt; font-weight:normal; white-space:nowrap; }
  .details { display:flex; flex-wrap:wrap; column-gap:19px; row-gap:5px; font-size:10pt; }
  .details strong { color:#342c42; }
  .intro { margin: 15px 0; padding:10px 12px; background:#f5f2fa; border-left:3px solid #7e52b5; }
  .notice { color:#5b5265; font-size:9pt; }
  .question { margin: 20px 0; break-inside:auto; }
  .question h2 { break-after:avoid; page-break-after:avoid; }
  .preserve { white-space:pre-wrap; overflow-wrap:anywhere; margin: 7px 0; }
  .subpart { margin: 16px 0 12px 12px; break-inside:avoid-page; page-break-inside:avoid; }
  .subpart-title { display:flex; justify-content:space-between; gap:12px; border-top:1px dotted #a9a1b3; padding-top:8px; font-size:10pt; }
  .subpart-title span { white-space:nowrap; }
  .figure { margin:12px 0; text-align:center; break-inside:avoid; page-break-inside:avoid; }
  .figure img { max-width:100%; max-height:170mm; width:auto; height:auto; object-fit:contain; }
  .writing-area { height:37mm; margin: 8px 0 10px; background: repeating-linear-gradient(to bottom,transparent 0,transparent 8mm,#e5e1eb 8.1mm,#e5e1eb 8.3mm); }
  .answer-block { padding:8px 10px; margin:10px 0; border:1px solid #d5cfdf; border-radius:5px; }
  .answer-block strong { font-size:9pt; color:#403254; }
  .rubric { width:100%; border-collapse:collapse; margin:10px 0; font-size:9pt; }
  .rubric td,.rubric th { padding:6px 8px; border:1px solid #c2bfca; text-align:left; }
  .rubric th { background:#f2eff7; }
  .rubric .number { text-align:center; width:75px; }
  .scoring { margin:8px 0; font-size:9pt; }
  .image-missing { padding:9px; border:2px dashed #b84343; color:#7f1616; font-size:9pt; }
  .warning { padding:10px; border:1px solid #b84343; background:#fff0f0; color:#7f1616; margin:12px 0; font-size:9pt; }
  .footer-note { margin-top:24px; font-size:8pt; border-top:1px solid #d8d3df; padding-top:9px; color:#625b6b; }
  @media(max-width:650px) { .sheet { padding:24px 18px; } }
  @media print { body { background:#fff !important; }
    .toolbar { display:none!important; }
    .sheet { width:auto; box-shadow:none; margin:0; padding:0; }
    .header, .intro { break-inside:avoid-page; }
    .question, .subpart, .figure { break-inside:avoid-page; }
    .warning { display:block!important; }
    h1,h2 { color:#181827; }
    .rubric th,.intro { print-color-adjust:exact; -webkit-print-color-adjust:exact; }
  }`;
}

/**
 * @param {object} exam - examen tomado del editor, biblioteca o intento
 * @param {{mode?: 'questions'|'answers'|'attempt', attempt?: object}} options
 */
export async function printExamPreview(exam, { mode = 'questions', attempt = null } = {}) {
  if (!exam) throw new Error('Selecciona un examen antes de imprimir.');
  if (mode === 'attempt' && !attempt) throw new Error('No hay un intento para imprimir.');
  const preview = window.open('', '_blank');
  if (!preview) throw new Error('El navegador bloqueó la vista de impresión. Permite las ventanas emergentes para este sitio.');
  preview.opener = null;
  preview.document.open();
  preview.document.write('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Preparando impresión</title></head><body style="font:16px Arial;padding:30px">Preparando versión imprimible, incluidas las imágenes…</body></html>');
  preview.document.close();
  const labels = { questions:'Examen para resolver', answers:'Solucionario / respuestas recomendadas', attempt:'Mi intento y autoevaluación' };
  const warnings = [];
  try {
    const content = await questionsHTML(exam, mode, attempt, warnings);
    if (preview.closed) return;
    const author = exam.author || 'Estudiante IB';
    const score = mode === 'attempt' && attempt
      ? `<p><strong>Resultado:</strong> ${pts(attempt.score)} / ${pts(attempt.max_score || total(exam))} puntos (autoevaluación orientativa)</p>` : '';
    const warningHtml = warnings.length ? `<div class="warning"><strong>Atención:</strong> faltan ${warnings.length} imágenes. No imprimas hasta resolver el acceso a Drive. Algunas preguntas pueden quedar incompletas.</div>` : '';
    const doc = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safe(exam.title)} — ${labels[mode]}</title><style>${css()}</style></head>
      <body><div class="toolbar"><button type="button" id="print-action">🖨️ Imprimir / Guardar PDF</button><button type="button" id="close-action" class="secondary">Cerrar</button><small>${mode === 'questions' ? 'Examen sin respuestas recomendadas.' : labels[mode]} Usa «Guardar como PDF» en el destino de impresión de Chrome.</small></div>
      <main class="sheet"><header class="header"><div class="brand">nest✳ib. SUPPORT</div><h1>${safe(exam.title || 'Examen sin título')}</h1>
      <div class="details"><span><strong>Asignatura:</strong> ${safe(categoryName(exam.category_id) || 'Sin categoría')}</span><span><strong>Nivel:</strong> ${safe(exam.level || '—')}</span><span><strong>Prueba:</strong> ${safe(exam.paper || '—')}</span><span><strong>Tiempo:</strong> ${pts(exam.duration_minutes)} min</span><span><strong>Lectura:</strong> ${pts(exam.reading_minutes)} min</span><span><strong>Máximo:</strong> ${total(exam)} puntos</span><span><strong>Autor:</strong> ${safe(author)}</span></div>
      <p class="notice">${labels[mode]} · Material de práctica independiente, no oficial del IB.</p></header>
      ${exam.description ? `<div class="intro"><strong>Instrucciones:</strong><div class="preserve">${paragraph(exam.description)}</div></div>` : ''}${score}${warningHtml}${content}
      <footer class="footer-note">NEST IB SUPPORT · Uso académico y de repaso. Las puntuaciones son orientativas y no constituyen calificaciones oficiales del IB.</footer></main></body></html>`;
    preview.document.open();
    preview.document.write(doc);
    preview.document.close();
    preview.document.getElementById('print-action').onclick = () => preview.print();
    preview.document.getElementById('close-action').onclick = () => preview.close();
    preview.focus();
  } catch (error) {
    if (!preview.closed) {
      preview.document.body.textContent = `No se pudo preparar la impresión: ${error.message}`;
    }
    throw error;
  }
}
