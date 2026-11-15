import {authUser,validId,getOne,dbRequest,tokenGoogle,handleError} from '../server/drive-common.js';
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).end();
 try{
  const id=String(req.query?.id||'');if(!validId(id))return res.status(400).end();
  const media=await getOne('support_media',id);
  if(!media)return res.status(404).end();
  const exam=await getOne('support_exams',media.exam_id);
  if(!exam)return res.status(404).end();
  const user=await authUser(req);
  let staff=false; if(user){const rows=await dbRequest('support_staff',`select=role&user_id=eq.${encodeURIComponent(user.id)}&limit=1`);staff=rows.length>0;}if(exam.status!=='published'&&(!user||(user.id!==media.owner_id&&!staff)))return res.status(403).end();
  const token=await tokenGoogle();
  const r=await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(media.drive_file_id)}?alt=media`,{headers:{Authorization:`Bearer ${token}`}});
  if(!r.ok)return res.status(502).end();
  const buffer=Buffer.from(await r.arrayBuffer());res.setHeader('Content-Type',media.mime_type);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control',exam.status==='published'?'public, max-age=180':'private, no-store');return res.status(200).send(buffer);
 }catch(e){return handleError(res,e);}
}
