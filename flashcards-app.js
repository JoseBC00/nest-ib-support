/* NEST IB SUPPORT · Flashcards local-first v0.4 */
(() => {
  'use strict';
  const KEY = 'nest-support-decks-v04';
  const $ = (id) => document.getElementById(id);
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
  let decks = [], active = '', index = 0, incoming = null;
  const status = (message) => { $('status').textContent = message; };
  const make = (tag, text, parent) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); if (parent) parent.appendChild(el); return el; };

  function load() {
    try { const val = JSON.parse(localStorage.getItem(KEY) || '[]'); decks = Array.isArray(val) ? val : []; }
    catch { decks = []; status('No se pudieron leer los conjuntos guardados.'); }
    if (!decks.length) decks = [{ id: uid(), name: 'Mi primer conjunto', subject: 'General', cards: [] }];
    active = decks[0].id;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(decks)); return true; }
    catch { status('El navegador no pudo guardar los datos. Descarga una copia CSV o libera espacio.'); return false; }
  }
  const current = () => decks.find((d) => d.id === active);
  function renderDecks() {
    const s = $('deckSelect'); s.replaceChildren();
    decks.forEach(d => { const opt = new Option(`${d.name} (${d.cards.length})`, d.id); s.add(opt); });
    s.value = active;
    $('storageCount').textContent = `${decks.length} conjunto(s)`;
    renderCards(); renderStudy(); renderPrint();
  }
  function showTab(tab) {
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden', p.id !== `tab-${tab}`));
    if (tab === 'print') renderPrint();
  }
  function details(card, parent, includeExtras = true) {
    const p = make('p', card.back, parent); p.className = 'detail-line';
    if (includeExtras && card.extra) {
      const ex = make('p', card.extra, parent); ex.className = 'detail-line';
    }
  }
  function renderCards() {
    const d = current(), list = $('cardList'); list.replaceChildren();
    $('cardCount').textContent = `${d.cards.length} tarjeta(s)`;
    if (!d.cards.length) { make('p', 'Aún no hay tarjetas. Crea una o importa un archivo.', list); return; }
    d.cards.forEach((c, i) => {
      const wrap = make('div', undefined, list); wrap.className = 'carditem';
      const left = make('div', undefined, wrap);
      make('strong', `${i + 1}. ${c.front}`, left);
      const para = make('p', c.back, left); para.className = 'muted';
      if (c.extra) { const x = make('p', c.extra, left); x.className = 'muted'; }
      const btn = make('button', 'Quitar', wrap); btn.className = 'secondary danger';
      btn.onclick = () => { d.cards.splice(i, 1); if (index >= d.cards.length) index = 0; save(); renderDecks(); };
    });
  }
  function renderStudy() {
    const cards = current().cards;
    const has = cards.length > 0;
    ['revealBtn', 'reviewBtn', 'knownBtn', 'skipBtn'].forEach(id => $(id).disabled = !has);
    $('studyAnswer').classList.add('hidden'); $('revealBtn').textContent = 'Mostrar respuesta';
    if (!has) { $('studyCounter').textContent = '0 tarjetas'; $('studyFront').textContent = 'Crea o importa tarjetas para empezar.'; $('studyAnswer').textContent = ''; $('studyStats').textContent = ''; return; }
    index %= cards.length;
    const c = cards[index];
    $('studyCounter').textContent = `Tarjeta ${index + 1} de ${cards.length}`;
    $('studyFront').textContent = c.front;
    $('studyAnswer').replaceChildren(); details(c, $('studyAnswer'));
    const known = cards.filter(c => c.rating === 'known').length;
    const review = cards.filter(c => c.rating === 'review').length;
    $('studyStats').textContent = `${known} sabidas · ${review} para repasar · ${cards.length - known - review} sin evaluar`;
  }
  function next(rating) {
    const cards = current().cards; if (!cards.length) return;
    if (rating) cards[index].rating = rating;
    index = (index + 1) % cards.length;
    save(); renderStudy();
  }
  function renderPrint() {
    const d = current(); $('printTitle').textContent = d.name;
    $('printSubject').textContent = `${d.subject || 'General'} · ${d.cards.length} tarjetas`;
    const table = $('printTable'); table.replaceChildren();
    const thead = make('thead', undefined, table), header = make('tr', undefined, thead);
    make('th', 'Concepto / pregunta', header); make('th', 'Significado / respuesta', header);
    const tbody = make('tbody', undefined, table);
    d.cards.forEach(c => {
      const tr = make('tr', undefined, tbody); make('td', c.front, tr);
      const value = make('td', undefined, tr); details(c, value, $('printExtras').value === 'yes');
    });
    if (!d.cards.length) { const tr = make('tr', undefined, tbody); const td = make('td', 'Este conjunto todavía no contiene tarjetas.', tr); td.colSpan = 2; }
  }
  // CSV RFC4180-style parser: quote escaping, embedded commas, CRLF and newlines.
  function parseCSV(text) {
    const data = []; let row = [], cell = '', quoted = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
        else quoted = !quoted;
      } else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
      else if ((ch === '\n' || ch === '\r') && !quoted) {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); if (row.some(v => v.trim())) data.push(row);
        row = []; cell = '';
      } else { cell += ch; }
    }
    if (quoted) throw new Error('Comillas incompletas en el CSV.');
    row.push(cell); if (row.some(v => v.trim())) data.push(row);
    return data;
  }
  function headerGuess(row) {
    const t = row.map(v => String(v || '').trim().toLowerCase());
    const head = ['pregunta','respuesta','concepto','significado','palabra','definición','definition','question','answer','front','back','term','meaning','pronunciación','ejemplo'];
    return t.filter(v => head.includes(v)).length >= 2;
  }
  function mapPreview() {
    if (!incoming) return;
    const rows = incoming.rows;
    const hasHeader = $('hasHeader').checked;
    const width = Math.max(...rows.map(r => r.length), 2);
    const columns = Array.from({ length: width }, (_, i) => hasHeader ? (rows[0][i] || `Columna ${i + 1}`) : `Columna ${i + 1}`);
    const front = $('frontCol').value, back = $('backCol').value;
    for (const id of ['frontCol', 'backCol']) {
      const s = $(id); s.replaceChildren();
      columns.forEach((name, i) => s.add(new Option(`${i + 1}: ${name}`, String(i))));
      const desired = id === 'frontCol' ? front : back;
      s.value = desired && Number(desired) < width ? desired : id === 'frontCol' ? '0' : '1';
    }
    const table = $('preview'); table.replaceChildren();
    const hr = make('tr', undefined, make('thead', undefined, table));
    columns.forEach(c => make('th', c, hr));
    const body = make('tbody', undefined, table);
    rows.slice(hasHeader ? 1 : 0, (hasHeader ? 1 : 0) + 4).forEach(r => {
      const tr = make('tr', undefined, body);
      columns.forEach((_, i) => make('td', String(r[i] || '').slice(0, 300), tr));
    });
    $('fileInfo').textContent = `${incoming.name} · ${Math.max(0, rows.length - (hasHeader ? 1 : 0))} filas detectadas`;
  }
  async function readFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    let rows;
    if (extension === 'csv') { rows = parseCSV(await file.text()); }
    else if (['xlsx','xls'].includes(extension)) {
      if (typeof XLSX === 'undefined') throw new Error('No se cargó el lector de Excel. Comprueba tu conexión a Internet y vuelve a abrir esta página.');
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, blankrows: false });
    } else throw new Error('Usa un archivo .csv, .xlsx o .xls');
    rows = rows.filter(r => Array.isArray(r) && r.some(x => String(x ?? '').trim())).map(r => r.map(x => String(x ?? '')));
    if (!rows.length || Math.max(...rows.map(r => r.length)) < 2) throw new Error('No se encontraron al menos dos columnas.');
    incoming = { name: file.name, rows };
    $('hasHeader').checked = headerGuess(rows[0]);
    $('mapping').classList.remove('hidden'); mapPreview();
    status('Archivo leído. Comprueba la vista previa antes de importar.');
  }
  function importRows() {
    if (!incoming) return;
    const f = Number($('frontCol').value), b = Number($('backCol').value);
    if (f === b) { status('Selecciona dos columnas diferentes.'); return; }
    const rows = incoming.rows.slice($('hasHeader').checked ? 1 : 0);
    let valid = 0, skipped = 0;
    rows.forEach(row => {
      const front = (row[f] || '').trim(), back = (row[b] || '').trim();
      if (!front || !back) { skipped++; return; }
      const extras = $('extraMode').value === 'all' ? row.map((v,i) => ({ value: v.trim(), i })).filter(x => x.i !== f && x.i !== b && x.value).map(x => {
        const name = $('hasHeader').checked ? (incoming.rows[0][x.i] || `Dato ${x.i+1}`) : `Dato ${x.i+1}`;
        return `${name}: ${x.value}`;
      }).join('\n') : '';
      current().cards.push({ id: uid(), front, back, extra: extras, rating: '' }); valid++;
    });
    save(); renderDecks(); $('mapping').classList.add('hidden'); $('fileInput').value = ''; incoming = null;
    status(`Importaste ${valid} tarjetas. ${skipped} filas omitidas por datos faltantes.`);
  }
  function quoteCSV(x) { return `"${String(x ?? '').replace(/"/g, '""')}"`; }
  function exportCSV() {
    const d = current();
    const lines = [['Pregunta','Respuesta','Detalles'], ...d.cards.map(c => [c.front,c.back,c.extra || ''])];
    const csv = '\uFEFF' + lines.map(r => r.map(quoteCSV).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob), a = make('a');
    a.href = url; a.download = d.name.replace(/[^a-z0-9áéíóúñ_-]/gi, '_').slice(0,50) + '.csv';
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  load(); renderDecks();
  $('deckSelect').addEventListener('change', e => { active = e.target.value; index = 0; renderDecks(); });
  $('newDeck').onclick = () => $('deckForm').classList.remove('hidden');
  $('cancelDeck').onclick = () => $('deckForm').classList.add('hidden');
  $('deckForm').onsubmit = e => { e.preventDefault(); const name = $('deckName').value.trim(); if (!name) return; const d = { id: uid(), name, subject: $('deckSubject').value.trim() || 'General', cards: [] }; decks.push(d); active = d.id; index = 0; save(); renderDecks(); e.target.reset(); e.target.classList.add('hidden'); status('Conjunto creado.'); };
  $('deleteDeck').onclick = () => { if (!confirm(`¿Eliminar el conjunto «${current().name}» y todas sus tarjetas?`)) return; decks = decks.filter(d => d.id !== active); if (!decks.length) decks.push({id:uid(),name:'Mi primer conjunto',subject:'General',cards:[]}); active = decks[0].id; index = 0; save(); renderDecks(); };
  document.querySelectorAll('.tab').forEach(b => b.onclick = () => showTab(b.dataset.tab));
  $('cardForm').onsubmit = e => { e.preventDefault(); const front=$('cardFront').value.trim(),back=$('cardBack').value.trim(); if (!front || !back) return; current().cards.push({ id:uid(),front,back,extra:$('cardExtra').value.trim(),rating:'' }); save(); renderDecks(); e.target.reset(); status('Tarjeta agregada.'); };
  $('revealBtn').onclick = () => { $('studyAnswer').classList.toggle('hidden'); $('revealBtn').textContent = $('studyAnswer').classList.contains('hidden') ? 'Mostrar respuesta' : 'Ocultar respuesta'; };
  $('reviewBtn').onclick = () => next('review'); $('knownBtn').onclick = () => next('known'); $('skipBtn').onclick = () => next('');
  $('fileInput').onchange = async e => { const file=e.target.files[0]; if (!file) return; try { await readFile(file); } catch(err) { status(err.message); $('mapping').classList.add('hidden'); } };
  $('hasHeader').onchange = mapPreview; $('importBtn').onclick = importRows;
  $('printExtras').onchange = renderPrint;
  $('printBtn').onclick = () => { renderPrint(); if (!current().cards.length) { status('Agrega tarjetas antes de imprimir.'); return; } let style = document.getElementById('page-orientation'); if (!style) { style = document.createElement('style'); style.id = 'page-orientation'; document.head.appendChild(style); } style.textContent = $('printOrientation').value === 'landscape' ? '@media print { @page { size: A4 landscape; margin: 12mm; } }' : '@media print { @page { size: A4 portrait; margin: 12mm; } }'; window.print(); };
  $('csvBtn').onclick = exportCSV;
})();
