import policy from '../config/features.json' with {type:'json'};
export function featureAccess(id,principal,grants=[]){
 const rule=policy.features[id];if(!rule)return false;
 if(rule.access==='public')return true;if(!principal)return false;
 if(rule.access==='member'||(rule.access==='paid'&&!policy.billingEnabled))return true;
 return rule.access==='paid'&&grants.some(g=>g.feature_id===id&&(g.expires_at===null||g.expires_at>Date.now()));
}
export function accessView(principal,grants=[]){return {billingEnabled:policy.billingEnabled,policyVersion:policy.version,features:Object.fromEntries(Object.entries(policy.features).map(([id,rule])=>[id,{label:rule.label,access:rule.access,effectiveAccess:rule.access==='paid'&&!policy.billingEnabled?'member':rule.access,allowed:featureAccess(id,principal,grants)}]))}}
export function projectHandbook(data,principal,grants=[]){const can=id=>featureAccess(id,principal,grants);return {pages:Object.fromEntries(Object.entries(data.pages).filter(([id])=>can('chapter.'+id))),templates:can('chapter.templates')&&can('templates.download')?data.templates:[],sources:can('chapter.sources')?data.sources:[],tasks:can('plan.save')?data.tasks.filter(t=>can('chapter.'+t.chapter)):[]}}
export async function entitlements(env,principal){if(!principal||!policy.billingEnabled)return [];const result=await env.DB.prepare('SELECT feature_id, expires_at FROM feature_entitlement WHERE user_id = ?').bind(principal.id).all();return result.results||[]}
