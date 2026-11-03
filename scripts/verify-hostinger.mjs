import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const origin='http://127.0.0.1:5193';
const adminHeaders={'oai-authenticated-user-id':'hostinger-smoke-admin','x-rifmy-auth-secret':'hostinger-smoke-only'};
async function api(path,body,admin=false){const r=await fetch(origin+'/api/'+path,{...(body?{method:'POST',body:JSON.stringify(body)}:{}),headers:{Origin:origin,'Content-Type':'application/json',...(admin?adminHeaders:{})}});return {status:r.status,body:await r.json()}}
const home=await fetch(origin);assert.equal(home.status,200);const html=await home.text();assert.ok(html.includes('RIFMY'));
const css=html.match(/href="([^"]+\.css[^\"]*)"/);assert.ok(css);assert.equal((await fetch(new URL(css[1].replaceAll('&amp;','&'),origin))).status,200);
assert.equal((await fetch(origin+'/products/vanilla-dream-front.webp')).status,200);
assert.equal((await fetch(origin+'/product/vanilla-dream')).status,200);
const catalog=await api('catalog');assert.equal(catalog.status,200);assert.equal(catalog.body.products.length,6);assert.equal(catalog.body.config.payments,false);
const denied=await fetch(origin+'/api/admin',{headers:{'oai-authenticated-user-id':'hostinger-smoke-admin'}});assert.equal(denied.status,403);
const order={items:[{id:'vanilla-dream',quantity:2}],customer:{name:'Hostinger Test',email:'hostinger@example.invalid',countryCode:'+212',phone:'600000000',address:'Fictional test address',apartment:'',city:'Rabat',postal:'10000'},code:'',idempotencyKey:crypto.randomUUID()};
const crossSite=await fetch(origin+'/api/checkout',{method:'POST',headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},body:JSON.stringify(order)});assert.equal(crossSite.status,403);
const first=await api('checkout',order);assert.equal(first.status,200,JSON.stringify(first.body));assert.equal(first.body.status,'test_pending');const retry=await api('checkout',order);assert.equal(retry.body.orderId,first.body.orderId);
const admin=await api('admin',undefined,true);assert.equal(admin.status,200);const stored=admin.body.orders.find(o=>o.id===first.body.orderId);assert.equal(stored.total,18500);
const bytes=await readFile(new URL('../public/products/vanilla-dream-front.webp',import.meta.url));const form=new FormData();form.append('file',new File([bytes],'fixture.webp',{type:'image/webp'}));const upload=await fetch(origin+'/api/upload',{method:'POST',headers:{Origin:origin,...adminHeaders},body:form});assert.equal(upload.status,200);const file=await upload.json();const downloaded=await fetch(origin+file.url);assert.equal(downloaded.status,200);assert.deepEqual(new Uint8Array(await downloaded.arrayBuffer()),new Uint8Array(bytes));
for(const route of ['/robots.txt','/sitemap.xml'])assert.equal((await fetch(origin+route)).status,200,route);
console.log('PASS: standalone pages, CSS/images, six products, persistent test order, totals, duplicate prevention, admin protection, uploads and SEO routes.');
