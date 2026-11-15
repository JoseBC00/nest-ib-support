import {authUser,validId,getOne,dbRequest,rateLimit,googleUpload,handleError} from '../server/drive-common.js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Método no permitido'});
 try{
  const user=await authUser(req);if(!user)return res.status(401).json({error:'Inicia sesión'});
  const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(!['image','prompt'].includes(body.kind))return res.status(400).json({error:'Tipo de archivo no permitido'});
  let mime,buffer,folder,name,examId;
  if(body.kind==='image'){
   examId=body.examId;
   if(!validId(examId))return res.status(400).json({error:'Examen inválido'});
   const exam=await getOne('support_exams',examId);
   if(!exam||exam.owner_id!==user.id||!['draft','rejected'].includes(exam.status))return res.status(403).json({error:'No tienes permiso para añadir imágenes a este examen'});
   if(!['image/png','image/jpeg','image/webp'].includes(body.mime))return res.status(400).json({error:'Solo PNG, JPG y WEBP'});
   if(typeof body.base64!=='string'||body.base64.length>2_100_000||!/^[\w+/=]+$/.test(body.base64))return res.status(413).json({error:'Imagen demasiado grande o inválida'});
   buffer=Buffer.from(body.base64,'base64');
   if(!buffer.length||buffer.length>1_500_000)return res.status(413).json({error:'Máximo 1,5 MB por imagen'});
   const magic=buffer.slice(0,12);
   const png=magic.slice(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
   const jpeg=magic[0]===255&&magic[1]===216&&magic[2]===255;
   const webp=magic.toString('ascii',0,4)==='RIFF'&&magic.toString('ascii',8,12)==='WEBP';
   if(!((body.mime==='image/png'&&png)||(body.mime==='image/jpeg'&&jpeg)||(body.mime==='image/webp'&&webp)))return res.status(400).json({error:'El contenido no coincide con el formato de imagen'});
   mime=body.mime;folder=process.env.DRIVE_EXAMS_FOLDER_ID;
   name=`exam_${examId}_${crypto.randomUUID()}.${mime.split('/')[1]==='jpeg'?'jpg':mime.split('/')[1]}`;
  }else{
   const id=body.promptId;
   if(!validId(id))return res.status(400).json({error:'Prompt inválido'});
   const p=await getOne('support_prompts',id);
   if(!p||p.owner_id!==user.id)return res.status(403).json({error:'Prompt ajeno o inexistente'});
   mime='text/plain';folder=process.env.DRIVE_PROMPTS_FOLDER_ID;
   name=`prompt_${p.id}_${new Date().toISOString().slice(0,10)}.txt`;
   buffer=Buffer.from(`${p.title}\n\n${p.description}\n\n${p.content}`,'utf8');
   if(buffer.length>40_000)return res.status(413).json({error:'Texto demasiado largo'});
  }
  await rateLimit(user.id,25);
  const saved=await googleUpload({name,folder,mime,buffer});
  if(body.kind==='image'){
    const rows=await dbRequest('support_media','','POST',{exam_id:examId,owner_id:user.id,drive_file_id:saved.id,mime_type:mime,size_bytes:buffer.length});
    return res.status(201).json({id:rows[0].id,mime});
  }
  return res.status(201).json({saved:true,fileId:saved.id});
 }catch(e){return handleError(res,e);}
}
