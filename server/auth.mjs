import {betterAuth} from 'better-auth/minimal';
import {drizzleAdapter} from 'better-auth/adapters/drizzle';
import {drizzle} from 'drizzle-orm/d1';
import {authUser,authSession,authAccount,authVerification,authRateLimit} from '../db/schema.ts';
export const SITE_ORIGIN='https://online-hackathon-fieldbook.estherwongong.chatgpt.site';
export const siteOrigin=env=>env.PREVIEW_ONLY_ORIGIN||env.SITE_ORIGIN||SITE_ORIGIN;
export function emailAuth(env){
 if(!env.DB||!env.BETTER_AUTH_SECRET)return null;
 const schema={user:authUser,session:authSession,account:authAccount,verification:authVerification,rateLimit:authRateLimit};
 return betterAuth({appName:'筹备黑客松指北',secret:env.BETTER_AUTH_SECRET,baseURL:siteOrigin(env),basePath:'/api/auth',
  database:drizzleAdapter(drizzle(env.DB,{schema}),{provider:'sqlite',schema,transaction:false}),
  emailAndPassword:{enabled:true,minPasswordLength:12,maxPasswordLength:128,autoSignIn:true},
  account:{accountLinking:{enabled:false}},session:{expiresIn:60*60*24*7,disableSessionRefresh:true,cookieCache:{enabled:false}},
  advanced:{useSecureCookies:!env.PREVIEW_ONLY_ORIGIN,ipAddress:{ipAddressHeaders:['cf-connecting-ip']}},
  rateLimit:{enabled:true,storage:'database',window:60,max:60,customRules:{'/sign-in/email':{window:60,max:5},'/sign-up/email':{window:60,max:3},'/change-password':{window:60,max:5}}},
 });
}
export async function principalFor(request,env){
 const cookies=request.headers.get('cookie')||'',provider=/(?:^|;\s*)prep_auth_provider=(email|chatgpt|guest)(?:;|$)/.exec(cookies)?.[1];
 if(provider==='guest')return null;
 if(provider!=='chatgpt'){
  const auth=emailAuth(env);if(auth){const session=await auth.api.getSession({headers:request.headers});if(session?.user)return {id:'email:'+session.user.id,email:session.user.email,name:session.user.name,provider:'email',emailVerified:session.user.emailVerified};}
  // An expired email session must never silently write into a platform account.
  if(provider==='email')return null;
 }
 if(!provider&&/(?:^|;\s*)prep_guest=1(?:;|$)/.test(cookies))return null;
 const id=request.headers.get('oai-authenticated-user-id');if(!id)return null;
 return {id,email:request.headers.get('oai-authenticated-user-email')||'',name:'',provider:'chatgpt'};
}
