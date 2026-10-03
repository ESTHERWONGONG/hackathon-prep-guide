window.PlanStore={
 mode:'cloud',
 async load(){const r=await fetch('/api/prep-plan',{credentials:'same-origin',cache:'no-store'});const d=await r.json();if(r.status===401){this.mode='guest';return null}if(!r.ok)throw Error(d.error||'进度读取失败');this.mode=d.preview?'preview':'cloud';return d.state},
 async patch(patch){const r=await fetch('/api/prep-plan',{method:'PATCH',keepalive:true,credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify(patch)});const d=await r.json();if(!r.ok)throw Error(d.error||'进度保存失败');return d}
};
