"""Pruebas estáticas sin navegador ni credenciales externas."""
from pathlib import Path
import json,re,csv,subprocess,sys
r=Path(__file__).resolve().parents[1]
htmls=list(r.glob('*.html'))
assert len(htmls)>=8
for html in htmls:
  txt=html.read_text(encoding='utf-8')
  for target in re.findall(r'(?:src|href)=[\"\']([^\"\']+)',txt):
    if target.startswith(('http://','https://','mailto:','#')):continue
    assert (r/target).exists(),f'{html.name} -> {target} inexistente'
for js,page in [('flashcards','flashcards.html'),('exams','examenes.html'),('prompts','prompts.html'),('admin','admin.html'),('library','biblioteca.html')]:
  source=(r/'js'/f'{js}.js').read_text(encoding='utf-8')
  declared=set(re.findall(r'\bid=[\"\']([\w-]+)',(r/page).read_text()))
  referenced=set(re.findall(r'\$\([\"\']#([\w-]+)',source))
  assert not referenced-declared, f'{js}: referencias inexistentes: {referenced-declared}'
for path in list((r/'js').glob('*.js'))+list((r/'api').glob('*.js'))+list((r/'server').glob('*.js'))+[r/'auth.js',r/'config.js',r/'extension'/'popup.js']:
  result=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
  assert result.returncode==0, f'Error sintaxis {path}: {result.stderr}'
with (r/'samples'/'notebooklm_flashcards.csv').open(encoding='utf-8-sig',newline='') as f:
  csvrows=list(csv.reader(f))
assert len(csvrows)==90 and all(len(row)==2 for row in csvrows)
with (r/'extension'/'manifest.json').open(encoding='utf-8') as f:
  manifest=json.load(f)
assert manifest['manifest_version']==3
for name in ['nest-ib-logo.png','string-tag-ib.png']:
  assert (r/'assets'/name).stat().st_size>1000
print(f'OK: {len(htmls)} páginas; JS válido; referencias íntegras; CSV NotebookLM {len(csvrows)}x2; extensión Manifest V3.')
print('No se han verificado SQL, Supabase, OAuth, Drive, Vercel ni el renderizado de navegador real.')
