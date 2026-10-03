import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {statSync,mkdirSync,readFileSync} from 'node:fs';

mkdirSync('.sites-runtime',{recursive:true});
const db=new DatabaseSync('.sites-runtime/preview.sqlite');
// Local preview only. Production schema is managed by the hosting migration workflow.
if(!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='prep_plans'").get())db.exec(readFileSync('drizzle/0000_parallel_leader.sql','utf8'));
const DB={prepare(sql){return {bind(...args){return {async first(){return db.prepare(sql).get(...args)},async run(){db.prepare(sql).run(...args);return {success:true}}}}}}};
const server=http.createServer(async(req,res)=>{try{const origin='http://127.0.0.1:4173',headers=new Headers();for(const [key,value]of Object.entries(req.headers))if(value!==undefined)headers.set(key,String(value));headers.delete('oai-authenticated-user-id');if(process.env.PREVIEW_GUEST!=='1')headers.set('oai-authenticated-user-id','local-preview');const chunks=[];for await(const c of req)chunks.push(c);const request=new Request(origin+req.url,{method:req.method,headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});const {default:worker}=await import('./dist/server/index.js?v='+statSync('dist/server/index.js').mtimeMs);const response=await worker.fetch(request,{DB,PREVIEW_ONLY_ORIGIN:origin});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch(e){res.writeHead(500);res.end('Preview error: '+e.message)}});
server.listen(4173,'127.0.0.1',()=>console.log('Preview http://127.0.0.1:4173/'));
