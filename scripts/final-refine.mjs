import fs from 'node:fs';
const f='app/store.tsx';let s=fs.readFileSync(f,'utf8');
s=s.replace("let key=sessionStorage.getItem('rifmy-checkout-key');if(!key){key=crypto.randomUUID();sessionStorage.setItem('rifmy-checkout-key',key)}", "const fingerprint=JSON.stringify({cart,customer,coupon});let previous:any=null;try{previous=JSON.parse(sessionStorage.getItem('rifmy-checkout-key')||'null')}catch{}const key=previous?.fingerprint===fingerprint?previous.key:crypto.randomUUID();sessionStorage.setItem('rifmy-checkout-key',JSON.stringify({key,fingerprint}))");
// Gallery detail resets are naturally handled on full page navigation.
fs.writeFileSync(f,s);
