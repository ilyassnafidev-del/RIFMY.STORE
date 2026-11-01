import sharp from 'sharp';
const source='public/brand/original-7.png';
const boxes=[['citrus-glow',48,109,145,77],['lavender-calm',239,109,105,76],['royal-oud',418,109,142,77],['vanilla-dream',63,229,102,72],['rose-romance',229,229,145,72],['midnight-coffee',422,228,139,74]];
for(const [name,left,top,width,height] of boxes)await sharp(source).extract({left,top,width,height}).resize({width:700}).webp({quality:92}).toFile('public/brand/'+name+'.webp');
await sharp('public/brand/original-3.png').extract({left:386,top:57,width:117,height:131}).webp({quality:95}).toFile('public/brand/emblem.webp');
await sharp('public/brand/original-6.png').extract({left:409,top:41,width:164,height:163}).resize({width:700}).webp({quality:90}).toFile('public/brand/craft.webp');
await sharp('C:/Users/ilyas/.codex/generated_images/01a19690-9a25-7880-a74d-6b065f2c2619/exec-278b3f4b-81c9-405e-8da3-d88dcdf5d5c3.png').resize({width:1600}).webp({quality:86}).toFile('public/brand/hero.webp');
