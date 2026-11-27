import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
const ids=["queueflow","pratoja","conferevision","autociclo","eventpass","pentefino","taskflow","consumo-energia","sistema-estoque","calculadora-python","mountrack","devjourney","dona-joana","cofre"];
const output='dist';
rmSync(output,{recursive:true,force:true});
mkdirSync(output,{recursive:true});
for(const path of ['index.html','en','assets','projetos','acesso','robots.txt','sitemap.xml','og-image.png']) cpSync(path,join(output,path),{recursive:true});
const enriched=(await import('./enrich-cases.mjs')).applyEnrichment(output);
console.log('Estudos de caso enriquecidos:',enriched);
for(const id of ids){
 const svg=readFileSync(join('assets','og',id+'.svg'),'utf8');
 const renderer=new Resvg(svg,{fitTo:{mode:'width',value:1200},font:{loadSystemFonts:true,defaultFontFamily:'DejaVu Sans'}});
 const png=renderer.render();
 if(png.width!==1200||png.height!==630) throw Error('Dimensão OG inválida: '+id);
 writeFileSync(join(output,'assets','og',id+'.png'),png.asPng());
}
console.log('Build estático: 30 páginas e 14 imagens OG de 1200 × 630.');


// Generate lightweight card thumbnails without altering the original evidence images.
const coverSources=[["pentefino","assets/projects/pentefino/interface.png"],["queueflow","assets/projects/queueflow/02-dashboard.png"],["conferevision","assets/projects/conferevision/entrada.png"],["eventpass","assets/projects/eventpass/area-publica.png"],["pratoja","assets/projects/pratoja/inicio.png"],["autociclo","assets/projects/autociclo/inicio.png"],["mountrack","assets/projects/mountrack/interface.png"],["dona-joana","assets/projects/dona-joana/interface.png"],["taskflow","assets/projects/taskflow/login.png"],["sistema-estoque","assets/projects/sistema-estoque/painel.png"],["consumo-energia","assets/projects/consumo-energia/simulador.png"],["calculadora-python","assets/projects/calculadora-python/calculadora-web.png"]];
for(const [id,source] of coverSources){
 const original=readFileSync(source);
 if(original.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid screenshot: '+id);
 const w=original.readUInt32BE(16),h=original.readUInt32BE(20);
 if(!w||!h)throw Error('Invalid dimensions: '+id);
 const scale=Math.min(1,720/w,480/h),tw=Math.max(1,Math.round(w*scale)),th=Math.max(1,Math.round(h*scale));
 const svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+tw+'" height="'+th+'"><image width="'+tw+'" height="'+th+'" xlink:href="data:image/png;base64,'+original.toString('base64')+'"/></svg>';
 const resized=new Resvg(svg).render().asPng();
 const useOriginal=scale===1&&original.length<=resized.length;
 const result=useOriginal?original:resized;
 if(result.readUInt32BE(16)>720||result.readUInt32BE(20)>480)throw Error('Thumbnail oversized: '+id);
 writeFileSync(join(output,'assets','projects',id,'cover-optimized.png'),result);
 console.log('Thumbnail',id,original.length,'->',result.length,'bytes');
}
