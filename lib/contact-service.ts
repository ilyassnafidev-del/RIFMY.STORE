import {z} from 'zod';
type Configuration={RESEND_API_KEY?:string;CONTACT_FROM_EMAIL?:string;BUSINESS_EMAIL?:string;CONTACT_FORM_SECRET?:string};
const encoder=new TextEncoder();
const secret=(env:Configuration)=>env.CONTACT_FORM_SECRET||env.RESEND_API_KEY||'';
const configured=(env:Configuration)=>!!(env.RESEND_API_KEY&&(env.CONTACT_FROM_EMAIL||env.BUSINESS_EMAIL));
const key=(env:Configuration)=>crypto.subtle.importKey('raw',encoder.encode(secret(env)),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
const hex=(value:ArrayBuffer)=>Array.from(new Uint8Array(value)).map(v=>v.toString(16).padStart(2,'0')).join('');
export async function contactConfiguration(env:Configuration){if(!configured(env))return {configured:false,token:''};const value=Date.now()+'.'+crypto.randomUUID();return {configured:true,token:value+'.'+hex(await crypto.subtle.sign('HMAC',await key(env),encoder.encode(value)))}}
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(200),subject:z.string().trim().min(3).max(120).refine(v=>!/[\r\n]/.test(v)),message:z.string().trim().min(20).max(4000),website:z.string().max(200).default(''),token:z.string().max(200)});
export async function sendContact(body:unknown,env:Configuration,rateLimit:(key:string,max:number)=>Promise<void>,transport:typeof fetch=fetch){
 const value=schema.parse(body);
 if(value.website)throw Object.assign(new Error('Your message could not be accepted. Please contact us by email.'),{status:400});
 if(!configured(env))throw Object.assign(new Error('Online message delivery is not configured. Please email support@rifmy.store.'),{status:503});
 const parts=value.token.split('.');const issued=Number(parts[0]);const age=Date.now()-issued;
 if(parts.length!==3||!Number.isFinite(issued)||age<2000||age>7200000||!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(parts[1])||!/^[a-f0-9]{64}$/.test(parts[2]))throw new Error('Please wait a moment or reload the contact form and try again.');
 const signature=Uint8Array.from(parts[2].match(/../g)!.map(pair=>parseInt(pair,16)));
 if(!await crypto.subtle.verify('HMAC',await key(env),signature,encoder.encode(parts[0]+'.'+parts[1])))throw new Error('The contact form has expired. Please reload and try again.');
 const emailHash=hex(await crypto.subtle.digest('SHA-256',encoder.encode(value.email.toLowerCase())));await rateLimit('contact-email:'+emailHash,3);
 const id=hex(await crypto.subtle.digest('SHA-256',encoder.encode(value.token+JSON.stringify(value))));
 const response=await transport('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'contact-'+id},body:JSON.stringify({from:env.CONTACT_FROM_EMAIL||env.BUSINESS_EMAIL,to:['support@rifmy.store'],reply_to:value.email,subject:'RIFMY enquiry — '+value.subject,text:'Name: '+value.name+'\nEmail: '+value.email+'\nSubject: '+value.subject+'\n\n'+value.message})});
 if(!response.ok)throw Object.assign(new Error('Your message could not be sent. Please try again or email support@rifmy.store.'),{status:502});
 const accepted=await response.json() as {id?:string};if(!accepted.id)throw new Error('Message delivery could not be confirmed. Please email support@rifmy.store.');
 return {accepted:true};
}
