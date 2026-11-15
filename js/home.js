import {initApp, state, isCloud} from './core.js';

// Catálogo base: enlaces externos, no integraciones ni avales oficiales.
const defaultResources = [
  {name:'NEST IB original',type:'PLATAFORMA BASE',description:'Biblioteca original de materiales, asignaturas y recursos para estudiantes del IB.',url:'https://nest-ib.vercel.app/',glyph:'✳'},
  {name:'Dojo · notas IB',type:'APUNTES Y PRÁCTICA',description:'Espacio de apuntes y herramientas de estudio, con opciones principalmente gratuitas. ¡Ojalá siga en línea mucho tiempo! 💜',url:'https://dojo.pirateib.sh/ib/notes',glyph:'◎'},
  {name:'English Practice Test',type:'IDIOMAS',description:'Ejercicios de inglés por nivel: grammar, vocabulary, listening, reading y preparación de exámenes.',url:'https://englishpracticetest.net/',glyph:'Aa'},
  {name:'Pirate IB',type:'COMUNIDAD Y ENLACES',description:'Directorio comunitario con enlaces y recursos de repaso para el IB. Comprueba las condiciones de uso de cada material.',url:'https://pirateib.sh/',glyph:'⌁'},
  {name:'IB Resources',type:'AGREGADOR',description:'Directorio de plataformas y enlaces educativos relacionados con el Programa del Diploma del IB.',url:'https://ibresources.cc/',glyph:'◇'},
  {name:'Calculadora IB',type:'HERRAMIENTA',description:'Calculadora externa para explorar escenarios orientativos de calificaciones del IB.',url:'https://www.ibcalculator.com/',glyph:'∑'},
  {name:'Dark IB',type:'RECURSO INTERACTIVO',description:'Actividad interactiva alojada en Genially para complementar tus sesiones de estudio.',url:'https://view.genially.com/6621c6fa799e720014387577',glyph:'✦'},
  {name:'Biblioteca general IB',type:'REPOSITORIO',description:'Carpeta compartida con materiales educativos y recursos de consulta en Google Drive.',url:'https://drive.google.com/drive/folders/1mew7Kxg-FLXkVN__c0rGLTbKNK401Bxr?usp=drive_link',glyph:'▤'}
];

await initApp();
const resources = [...defaultResources];
if (isCloud()) {
  const {data, error} = await state.db.from('support_links').select('name,description,url,active,position').eq('active',true).order('position');
  if (!error && data) {
    const seen = new Set(resources.map(x => new URL(x.url).origin + new URL(x.url).pathname.replace(/\/$/,'')));
    for (const item of data) {
      try {
        const url = new URL(item.url);
        if(url.protocol !== 'https:') continue;
        const key = url.origin + url.pathname.replace(/\/$/,'');
        if(seen.has(key)) continue;
        resources.push({name:item.name,description:item.description,url:url.href,type:'RECURSO COMUNITARIO',glyph:'↗'});
        seen.add(key);
      } catch { /* URL externa no válida: se omite */ }
    }
  }
}

const track = document.getElementById('resources-track');
const marquee = document.getElementById('resource-marquee');
function buildSet(items) {
  const set = document.createElement('div');
  set.className = 'resource-set';
  for(const item of items){
    const a=document.createElement('a'); a.className='resource-mini'; a.href=item.url;
    a.target='_blank'; a.rel='noopener noreferrer';
    const symbol=document.createElement('span');symbol.className='resource-glyph';symbol.setAttribute('aria-hidden','true');symbol.textContent=item.glyph;
    const category=document.createElement('span');category.className='resource-kind';category.textContent=item.type;
    const title=document.createElement('strong');title.textContent=item.name;
    const p=document.createElement('span');p.className='resource-description';p.textContent=item.description;
    const action=document.createElement('em');action.textContent='Visitar sitio ↗';
    a.append(symbol,category,title,p,action);
    set.appendChild(a);
  }
  return set;
}
if(track && marquee){
  const first=buildSet(resources);
  const copy=buildSet(resources);
  copy.setAttribute('aria-hidden','true');
  for(const a of copy.querySelectorAll('a')) a.tabIndex=-1;
  track.replaceChildren(first,copy);
  marquee.classList.add('ready');
  // El carrusel se detiene al poner el cursor o navegar con teclado.
}
