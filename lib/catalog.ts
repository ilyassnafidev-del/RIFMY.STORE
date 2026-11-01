export const products=[
{id:'vanilla-dream',name:'Vanilla Dream',family:'Warm',notes:'Sweet · Creamy · Warm',description:'A sweet, creamy, warm scent that makes your room feel cozy and comfortable.',color:'#c4ac78',image:'/brand/vanilla-dream.webp'},
{id:'lavender-calm',name:'Lavender Calm',family:'Floral',notes:'Fresh · Floral · Peaceful',description:'A fresh floral scent for peaceful evenings and relaxing moments.',color:'#a598ab',image:'/brand/lavender-calm.webp'},
{id:'royal-oud',name:'Royal Oud',family:'Woody',notes:'Deep · Woody · Luxurious',description:'A deep, woody fragrance inspired by luxury perfumes and warm interiors.',color:'#885b38',image:'/brand/royal-oud.webp'},
{id:'citrus-glow',name:'Citrus Glow',family:'Fresh',notes:'Bright · Fresh · Energetic',description:'A bright, fresh scent that brings an energetic and clean feeling to a room.',color:'#bd9b31',image:'/brand/citrus-glow.webp'},
{id:'rose-romance',name:'Rose Romance',family:'Floral',notes:'Soft · Romantic · Floral',description:'A soft, romantic floral fragrance with a sophisticated touch.',color:'#9e555c',image:'/brand/rose-romance.webp'},
{id:'midnight-coffee',name:'Midnight Coffee',family:'Warm',notes:'Rich · Comforting · Coffee',description:'A rich, comforting scent inspired by freshly brewed coffee.',color:'#665044',image:'/brand/midnight-coffee.webp'}
].map(p=>({...p,image:'/products/'+p.id+'-front.webp',images:['/products/'+p.id+'-front.webp','/products/'+p.id+'-angle.webp','/products/'+p.id+'-detail.webp'],price:8000,stock:0,active:true}));
export type Product=(typeof products)[number];
export const money=(amount:number)=>new Intl.NumberFormat('en-MA',{style:'currency',currency:'MAD',maximumFractionDigits:2}).format(amount/100);
export function calculate(lines:{quantity:number;price:number}[],delivery=2500,percent=0){const subtotal=lines.reduce((s,l)=>s+l.quantity*l.price,0);const discount=Math.round(subtotal*percent/100);return {subtotal,discount,delivery:subtotal?delivery:0,total:subtotal-discount+(subtotal?delivery:0)}}
