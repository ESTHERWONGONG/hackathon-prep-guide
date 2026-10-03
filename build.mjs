import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
const root=path.resolve('dist'),assets={};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8'};
function walk(dir){for(const ent of readdirSync(dir,{withFileTypes:true})){if(['server','.openai'].includes(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else{const rel='/'+path.relative(root,p).split(path.sep).join('/');assets[rel]={body:readFileSync(p,'utf8'),type:types[path.extname(p)]||'application/octet-stream'}}}}
const indexFile=path.join(root,'index.html');let html=readFileSync(indexFile,'utf8');html=html.replace(/(src|href)="([^"?]+\.(?:js|css))(?:\?[^"]*)?"/g,(_,attr,file)=>attr+'="'+file+'?v='+createHash('sha256').update(readFileSync(path.join(root,file))).digest('hex').slice(0,10)+'"');writeFileSync(indexFile,html);
walk(root);const c={window:{}};vm.createContext(c);vm.runInContext(readFileSync('dist/prep-tasks.js','utf8'),c);
const ids=c.window.PREP_TASKS.map(t=>t.id);
const source=readFileSync('server/worker.mjs','utf8');
mkdirSync('dist/server',{recursive:true});
writeFileSync('dist/server/index.js',source+'\nconst assets='+JSON.stringify(assets)+';\nexport default createWorker(assets,'+JSON.stringify(ids)+');\n');
console.log('Built Worker with '+Object.keys(assets).length+' assets and '+ids.length+' task IDs.');
