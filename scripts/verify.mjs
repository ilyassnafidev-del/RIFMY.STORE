const origin='http://127.0.0.1:5173';
async function call(path,body){const r=await fetch(origin+'/api/'+path,body?{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)}:{});return {status:r.status,data:await r.json()}}
let c=await call('catalog');console.log('catalog',c.status,c.data.products?.length,c.data.config);
console.log('admin denied',(await call('admin')).status);
const payload={items:[{id:'vanilla-dream',quantity:2}],customer:{name:'Test Customer',email:'test@example.invalid',countryCode:'+212',phone:'600000000',address:'Test address only',apartment:'',city:'Rabat',postal:'10000'},code:'',idempotencyKey:crypto.randomUUID()};
const first=await call('checkout',payload);const second=await call('checkout',payload);console.log('test order',first.status,first.data,'idempotent',first.data.orderId===second.data.orderId);
console.log('invalid coupon',(await call('coupon',{code:'UNAUTHORIZED20',email:'test@example.invalid',items:payload.items})).status);
console.log('bad quantity',(await call('checkout',{...payload,idempotencyKey:crypto.randomUUID(),items:[{id:'vanilla-dream',quantity:-1}]})).status);
console.log('forged webhook',(await call('webhook',{type:'checkout.session.completed'})).status);
if(c.status!==200||first.status!==200||first.data.orderId!==second.data.orderId)process.exitCode=1;
