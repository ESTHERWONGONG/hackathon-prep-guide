const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function object(x){return x!==null&&typeof x==='object'&&!Array.isArray(x)}
export function validatePatch(patch,taskIds){
 if(!object(patch)||Object.keys(patch).length===0||Object.keys(patch).some(k=>!['durationHours','startLocal','plan','done','scoringPreset','deliveryMode'].includes(k)))throw Error('无效计划字段');
 if(own(patch,'deliveryMode')&&!['online','onsite','hybrid'].includes(patch.deliveryMode))throw Error('无效活动形式');
 if(own(patch,'scoringPreset')&&![60,70,50].includes(patch.scoringPreset))throw Error('无效评分方案');
 if(own(patch,'durationHours')&&![24,48,72,96].includes(patch.durationHours))throw Error('无效周期');
 if(own(patch,'startLocal')){
  if(typeof patch.startLocal!=='string'||(patch.startLocal!==''&&(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(patch.startLocal)||!Number.isFinite(Date.parse(patch.startLocal+':00+08:00')))))throw Error('无效日期');
  if(patch.startLocal&&new Date(Date.parse(patch.startLocal+':00+08:00')+8*3600000).toISOString().slice(0,16)!==patch.startLocal)throw Error('无效日期');
 }
 if(own(patch,'plan')){
  const ranges={teams:[6,120,1],reviewMinutes:[1,60,.5],switchMinutes:[0,15,.5],openingMinutes:[0,60,.5],closingMinutes:[0,60,.5],bufferMinutes:[0,60,.5]};
  if(!object(patch.plan)||Object.keys(patch.plan).some(k=>!own(ranges,k)))throw Error('无效测算字段');
  for(const [key,value] of Object.entries(patch.plan)){const [min,max,step]=ranges[key];if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||Math.abs(value/step-Math.round(value/step))>1e-8)throw Error('无效测算值')}
 }
 if(own(patch,'done')&&(!object(patch.done)||Object.entries(patch.done).some(([k,v])=>!taskIds.includes(k)||typeof v!=='boolean')))throw Error('无效任务');
 return patch;
}
export function createWorker(assets,taskIds){
 return {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/prep-plan'){
   const user=request.headers.get('oai-authenticated-user-id');
   if(!user)return json({error:'请登录后保存筹备进度'},401);
   if(!env.DB)return json({error:'进度存储暂不可用，请稍后重试'},503);
   try{
    if(request.method==='GET'){
     const row=await env.DB.prepare('SELECT state_json, updated_at FROM prep_plans WHERE user_id = ?').bind(user).first();
     return json({state:row?JSON.parse(row.state_json):{},updatedAt:row?.updated_at??null,preview:!!env.PREVIEW_ONLY_ORIGIN});
    }
    if(request.method==='PATCH'){
     const origin=request.headers.get('origin');
     const permittedOrigin=env.PREVIEW_ONLY_ORIGIN||env.SITE_ORIGIN||'https://online-hackathon-fieldbook.estherwongong.chatgpt.site';
     if(origin!==permittedOrigin)return json({error:'请求来源不匹配'},403);
     if(!(request.headers.get('content-type')||'').startsWith('application/json'))return json({error:'只接受JSON'},415);
     const text=await request.text();if(text.length>20000)return json({error:'计划过大'},413);
     let patch;try{patch=validatePatch(JSON.parse(text),taskIds)}catch(e){return json({error:e.message},400)}
     const now=Date.now();
     await env.DB.prepare('INSERT INTO prep_plans (user_id,state_json,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET state_json=json_patch(prep_plans.state_json,excluded.state_json),updated_at=excluded.updated_at').bind(user,JSON.stringify(patch),now).run();
     return json({saved:true,updatedAt:now});
    }
    return json({error:'不支持此操作'},405);
   }catch(e){console.error('prep-plan storage failure',e.message);return json({error:'读取或保存失败，请重试；当前页面的改动仍保留'},500)}
  }
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  const key=url.pathname==='/'?'/index.html':url.pathname;
  const asset=assets[key];if(!asset)return new Response('Not found',{status:404});
  return new Response(request.method==='HEAD'?null:asset.encoding==='base64'?Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)):asset.body,{headers:{'content-type':asset.type,'cache-control':'no-cache','x-content-type-options':'nosniff'}});
 }};
}
