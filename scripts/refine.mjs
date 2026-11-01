import fs from 'node:fs';
const f='app/api/[...path]/route.ts';let s=fs.readFileSync(f,'utf8');
s=s.replace("return products.map(p=>({...p,...(changes.get(p.id) as any||{})}))","const stock=await db().prepare('SELECT id,available FROM inventory').all<any>();const quantities=new Map(stock.results.map((r:any)=>[r.id,r.available]));return products.map(p=>({...p,...(changes.get(p.id) as any||{}),stock:quantities.get(p.id)??0}))");
s=s.replace("await db().batch([db().prepare('INSERT INTO orders", "await db().batch([...(mode()==='live'?order.items.map(l=>db().prepare('UPDATE inventory SET available=available-? WHERE id=?').bind(l.quantity,l.id)):[]),db().prepare('INSERT INTO orders");
s=s.replace("await write('product:'+b.id,'product',b)","await db().batch([db().prepare(\"INSERT INTO records(id,kind,value,created) VALUES(?,'product',?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value\").bind('product:'+b.id,JSON.stringify(b),Date.now()),db().prepare('INSERT INTO inventory(id,available) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET available=excluded.available').bind(b.id,b.stock)])");
// Do not allow a late paid event to silently leave a cancelled live order unfulfilled.
s=s.replace("pending:['cancelled'],test_pending:['cancelled']","test_pending:['cancelled']");
fs.writeFileSync(f,s);
