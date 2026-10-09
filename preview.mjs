import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes} from 'node:crypto';
import {statSync,mkdirSync,readFileSync,readdirSync} from 'node:fs';
mkdirSync('.sites-runtime',{recursive:true});
const db=new DatabaseSync('.sites-runtime/preview.sqlite');db.exec('PRAGMA foreign_keys=ON');
db.exec('CREATE TABLE IF NOT EXISTS _preview_migrations (name TEXT PRIMARY KEY)');
for(const name of readdirSync('drizzle').filter(n=>n.endsWith('.sql')).sort()){
 if(db.prepare('SELECT name FROM _preview_migrations WHERE name=?').get(name))continue;
 const existingBase=name.startsWith('0000_')&&db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='prep_plans'").get();
 if(!existingBase)db.exec(readFileSync('drizzle/'+name,'utf8'));
 db.prepare('INSERT INTO _preview_migrations(name) VALUES (?)').run(name);
}
const DB={prepare(sql){const make=args=>({bind(...next){return make(next)},async first(column){const row=db.prepare(sql).get(...args);return column?row?.[column]??null:row??null},async all(){return{results:db.prepare(sql).all(...args),success:true}},async raw(){const stmt=db.prepare(sql);stmt.setReturnArrays(true);return stmt.all(...args)},async run(){const r=db.prepare(sql).run(...args);return{success:true,meta:{changes:Number(r.changes)}}}});return make([])},async batch(statements){db.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.all());db.exec('COMMIT');return result}catch(e){db.exec('ROLLBACK');throw e}}};
const secret=randomBytes(48).toString('base64url');
const server=http.createServer(async(req,res)=>{try{
 const origin='http://127.0.0.1:4173',headers=new Headers();for(const [key,value]of Object.entries(req.headers))if(value!==undefined)headers.set(key,String(value));
 for(const key of ['oai-authenticated-user-id','oai-authenticated-user-email','cf-connecting-ip'])headers.delete(key);
 headers.set('cf-connecting-ip','127.0.0.1');
 if(process.env.PREVIEW_SIWC==='1'){headers.set('oai-authenticated-user-id','local-preview');headers.set('oai-authenticated-user-email','legacy-preview@example.test')}
 const chunks=[];for await(const c of req)chunks.push(c);
 const request=new Request(origin+req.url,{method:req.method,headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});
 const {default:worker}=await import('./dist/server/index.js?v='+statSync('dist/server/index.js').mtimeMs);
 const response=await worker.fetch(request,{DB,PREVIEW_ONLY_ORIGIN:origin,BETTER_AUTH_SECRET:secret});
 const outputHeaders=Object.fromEntries(response.headers);const cookies=response.headers.getSetCookie();if(cookies.length)outputHeaders['set-cookie']=cookies;
 res.writeHead(response.status,outputHeaders);res.end(Buffer.from(await response.arrayBuffer()));
}catch(e){console.error(e);res.writeHead(500);res.end('Preview error')}});
server.listen(4173,'127.0.0.1',()=>console.log('Preview http://127.0.0.1:4173/'));
