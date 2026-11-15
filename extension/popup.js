const $=id=>document.getElementById(id);
const defaultUrl='https://nest-ib-support.vercel.app/'; // sustituye por tu URL real, o guárdala abajo.
let base=defaultUrl,links=[];
function message(s){$('status').textContent=s;}
function safeUrl(s){try{const u=new URL(s);if(u.protocol!=='https:')throw Error('HTTPS requerido');return u.href.replace(/\/$/,'')+'/';}catch{throw Error('Escribe una URL HTTPS válida');}}
function open(url){chrome.tabs.create({url});}
function render(){const list=$('links');list.replaceChildren();for(const item of links){const li=document.createElement('li');const a=document.createElement('a');a.href='#';a.textContent=item.title;a.onclick=e=>{e.preventDefault();open(item.url);};const remove=document.createElement('button');remove.textContent='×';remove.title='Quitar';remove.onclick=async()=>{links=links.filter(x=>x.url!==item.url);await chrome.storage.local.set({links});render();};li.append(a,remove);list.append(li);}}
async function init(){const data=await chrome.storage.local.get(['supportUrl','links']);base=data.supportUrl||defaultUrl;links=data.links||[];$('support-url').value=base;render();}
$('original').onclick=()=>open('https://nest-ib.vercel.app/');
$('support').onclick=()=>open(base);
$('library').onclick=()=>open(base+'biblioteca.html');
$('save-url').onclick=async()=>{try{base=safeUrl($('support-url').value);await chrome.storage.local.set({supportUrl:base});message('Dirección guardada.');}catch(e){message(e.message);}};
$('bookmark').onclick=async()=>{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});if(!tab?.url?.startsWith('https://'))return message('Solo se pueden guardar páginas HTTPS.');if(links.some(x=>x.url===tab.url))return message('Ya está guardada.');links.unshift({title:tab.title||tab.url,url:tab.url});links=links.slice(0,100);await chrome.storage.local.set({links});render();message('Página guardada localmente.');};
init();
