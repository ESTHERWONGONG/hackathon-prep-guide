import {emailAuth,principalFor,siteOrigin} from './auth.mjs';
import {featureAccess,accessView,projectHandbook,entitlements} from './access.mjs';
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
function assetBody(asset){if(asset.encoding!=='base64')return asset.body;const raw=atob(asset.body),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return bytes}


const sessionCookie=(value,env)=>'prep_guest='+value+'; Path=/; HttpOnly; SameSite=Lax; '+(!env.PREVIEW_ONLY_ORIGIN?'Secure; ':'')+'Max-Age='+(value==='1'?'2592000':'0');
const providerCookie=(value,env)=>'prep_auth_provider='+value+'; Path=/; HttpOnly; SameSite=Lax; '+(!env.PREVIEW_ONLY_ORIGIN?'Secure; ':'')+'Max-Age=31536000';
const authPaths=new Set(['/api/auth/sign-up/email','/api/auth/sign-in/email','/api/auth/sign-out','/api/auth/change-password']);
export function createWorker(assets,taskIds,handbook={pages:{},templates:[],sources:[],tasks:[]},exportBuilder=null){
 return {async fetch(request,env){
  const url=new URL(request.url),method=request.method;
  try{
   if(url.pathname==='/account/chatgpt'){const headers=new Headers({location:'/signin-with-chatgpt?return_to=%2F','cache-control':'no-store'});headers.append('set-cookie',sessionCookie('0',env));headers.append('set-cookie',providerCookie('chatgpt',env));return new Response(null,{status:302,headers})}
   if(url.pathname.startsWith('/api/auth/')){
    if(!authPaths.has(url.pathname)||method!=='POST')return json({error:'此账户操作尚未开放'},404);
    if(request.headers.get('origin')!==siteOrigin(env))return json({error:'请求来源不匹配'},403);
    if(!(request.headers.get('content-type')||'').startsWith('application/json'))return json({error:'只接受JSON'},415);
    const body=await request.text();if(body.length>16000)return json({error:'请求内容过长'},413);
    const auth=emailAuth(env);if(!auth)return json({error:'邮箱登录服务暂不可用，请稍后重试'},503);
    const result=await auth.handler(new Request(request.url,{method,headers:request.headers,body}));
    const headers=new Headers(result.headers);headers.set('cache-control','no-store');
    if(result.ok){const signout=url.pathname.endsWith('/sign-out');headers.append('set-cookie',sessionCookie(signout?'1':'0',env));headers.append('set-cookie',providerCookie(signout?'guest':'email',env));}
    return new Response(result.body,{status:result.status,headers});
   }
   const principal=url.pathname.startsWith('/api/')||url.pathname.startsWith('/templates/')||url.pathname.startsWith('/vendor/')?await principalFor(request,env):null;
   const grants=await entitlements(env,principal),can=id=>featureAccess(id,principal,grants);
   if(url.pathname==='/api/session'){
    if(method!=='GET')return json({error:'不支持此操作'},405);
    return json({user:principal?{name:principal.name,email:principal.email,provider:principal.provider,emailVerified:principal.emailVerified}:null,emailAuthAvailable:!!emailAuth(env),mailVerificationEnabled:false,access:accessView(principal,grants)});
   }
   if(url.pathname==='/api/handbook'){
    if(method!=='GET')return json({error:'不支持此操作'},405);
    return json(projectHandbook(handbook,principal,grants));
   }
   if(url.pathname==='/api/export-model'){
    if(method!=='POST')return json({error:'不支持此操作'},405);
    if(!can('plan.export'))return json({error:principal?'当前账户暂不可使用方案导出':'登录后可生成方案'},principal?403:401);
    if(request.headers.get('origin')!==siteOrigin(env))return json({error:'请求来源不匹配'},403);
    if(!(request.headers.get('content-type')||'').startsWith('application/json'))return json({error:'只接受JSON'},415);
    const body=await request.text();if(body.length>8000)return json({error:'请求内容过长'},413);
    let options;try{options=JSON.parse(body)}catch{return json({error:'无效导出参数'},400)}
    if(!object(options)||Object.keys(options).some(k=>!['title','groups','details','templates'].includes(k))||typeof options.title!=='string'||options.title.length>80||!Array.isArray(options.groups)||options.groups.length<1||options.groups.length>6||options.groups.some(id=>typeof id!=='string'||!handbook.nav.some(g=>g.id===id))||typeof options.details!=='boolean'||typeof options.templates!=='boolean')return json({error:'请检查导出名称与所选模块'},400);
    for(const id of options.groups){const g=handbook.nav.find(g=>g.id===id);if(g.chapters.some(([chapter])=>!can('chapter.'+chapter)))return json({error:'所选模块包含当前账户不可用的章节'},403)}
    if(options.templates&&!can('templates.download'))return json({error:'当前账户暂不可导出表单'},403);
    const row=await env.DB.prepare('SELECT state_json FROM prep_plans WHERE user_id = ?').bind(principal.id).first();
    if(!exportBuilder)return json({error:'方案生成暂不可用'},503);
    const safeData={...handbook,...projectHandbook(handbook,principal,grants),tasks:handbook.tasks.map(t=>can('chapter.'+t.chapter)?t:{...t,label:'受限章节待办（内容未开放）'})};
    return json(exportBuilder(row?JSON.parse(row.state_json):{},options,safeData));
   }
   if(url.pathname==='/api/prep-plan'){
    if(!can('plan.save'))return json({error:'请登录后保存筹备进度'},principal?403:401);
    if(!env.DB)return json({error:'进度存储暂不可用，请稍后重试'},503);
    if(method==='GET'){
     const row=await env.DB.prepare('SELECT state_json, updated_at FROM prep_plans WHERE user_id = ?').bind(principal.id).first();
     return json({state:row?JSON.parse(row.state_json):{},updatedAt:row?.updated_at??null,preview:!!env.PREVIEW_ONLY_ORIGIN});
    }
    if(method==='PATCH'){
     if(request.headers.get('origin')!==siteOrigin(env))return json({error:'请求来源不匹配'},403);
     if(!(request.headers.get('content-type')||'').startsWith('application/json'))return json({error:'只接受JSON'},415);
     const body=await request.text();if(body.length>20000)return json({error:'计划过大'},413);
     let patch;try{patch=validatePatch(JSON.parse(body),handbook.tasks.filter(t=>can('chapter.'+t.chapter)).map(t=>t.id))}catch(e){return json({error:e.message},400)}
     const now=Date.now();
     await env.DB.prepare('INSERT INTO prep_plans (user_id,state_json,updated_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET state_json=json_patch(prep_plans.state_json,excluded.state_json),updated_at=excluded.updated_at').bind(principal.id,JSON.stringify(patch),now).run();
     return json({saved:true,updatedAt:now});
    }
    return json({error:'不支持此操作'},405);
   }
   if(url.pathname.startsWith('/api/'))return json({error:'接口不存在'},404);
   if(!['GET','HEAD'].includes(method))return new Response('Method not allowed',{status:405});
   if(['/data.js','/operations-data.js','/prep-tasks.js','/server/index.js'].includes(url.pathname))return new Response('Not found',{status:404});
   const restricted=url.pathname.startsWith('/templates/')?'templates.download':url.pathname.startsWith('/vendor/')?'plan.export':null;
   if(restricted&&(!can(restricted)||(restricted==='templates.download'&&!can('chapter.templates'))))return json({error:principal?'当前功能不可用':'请登录后继续'},principal?403:401);
   const key=url.pathname==='/'?'/index.html':url.pathname,asset=assets[key];if(!asset)return new Response('Not found',{status:404});
   return new Response(method==='HEAD'?null:assetBody(asset),{headers:{'content-type':asset.type,'cache-control':restricted?'private, no-store':'no-cache','x-content-type-options':'nosniff'}});
  }catch(e){console.error('Request failed',url.pathname,e?.name||'Error');return json({error:'服务暂不可用，请稍后重试；当前页面的改动仍保留'},503)}
 }};
}
