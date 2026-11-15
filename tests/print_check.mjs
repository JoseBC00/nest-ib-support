// Comprobación sin servidor: plantillas HTML de impresión.
import assert from 'node:assert/strict';
const rendered = [];
function fakePage() {
  const doc = {
    html: '',
    body: { textContent: '' },
    open() { this.html = ''; },
    write(s) { this.html += s; },
    close() {},
    getElementById() { return { onclick: null }; }
  };
  const win = { document: doc, closed: false, focus() {}, close() {}, print() {} };
  rendered.push(win);
  return win;
}
globalThis.window = { NEST_CONFIG: {}, open: fakePage };
const { printExamPreview } = await import('../js/exam-print.js');
const exam = { title:'Examen <demostración>', description:'Una prueba de 60 minutos', category_id:1, level:'NM',paper:'Paper 1',duration_minutes:60,reading_minutes:5,
  questions:[{id:'q1',prompt:'Resuelve: 2 + 2',imageIds:[],parts:[{id:'p1',label:'a) i)',prompt:'Calcula el resultado',solution:'4; <script>alert(1)</script>',max:4,rubric:[]},{id:'p2',label:'a) ii)',prompt:'Explica el procedimiento',solution:'Suma dos y dos',max:2,rubric:[{id:'crit1',label:'Método',max:1},{id:'crit2',label:'Claridad',max:1}]}]}] };
await printExamPreview(exam);
let html = rendered.at(-1).document.html;
assert.match(html,/Examen &lt;demostración&gt;/);
assert.match(html,/Calcula el resultado/);
assert.match(html,/4 puntos/);
assert.doesNotMatch(html,/4; &lt;script&gt;/);
assert.doesNotMatch(html,/<script>alert/);
await printExamPreview(exam, { mode:'answers' });
html = rendered.at(-1).document.html;
assert.match(html,/Respuesta recomendada/);
assert.match(html,/4; &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.match(html,/Criterio de evaluación/);
await printExamPreview(exam, { mode:'attempt', attempt: { score:5,max_score:6,payload:{ answers:{ p1:'4',p2:'por suma'}, scores:{ p1:4,crit1:1,crit2:0} } }});
html = rendered.at(-1).document.html;
assert.match(html,/5 \/ 6 puntos/);
assert.match(html,/por suma/);
console.log('Impresión: examen sin spoilers, solucionario, intento y escape HTML OK');
