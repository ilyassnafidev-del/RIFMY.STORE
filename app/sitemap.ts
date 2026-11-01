import {products} from '../lib/catalog';
export default function sitemap(){return ['','/shop','/about','/craft','/faq','/contact','/shipping','/returns',...products.map(p=>'/product/'+p.id)].map(path=>({url:'https://rifmy-artisan-candles-ilyas.sevenproject244.chatgpt.site'+path,lastModified:new Date()}))}
