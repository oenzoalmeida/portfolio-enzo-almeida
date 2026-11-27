import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
const ids=["queueflow","pratoja","conferevision","autociclo","eventpass","pentefino","taskflow","consumo-energia","sistema-estoque","calculadora-python","mountrack","devjourney","dona-joana","cofre"];
const output='dist';
rmSync(output,{recursive:true,force:true});
mkdirSync(output,{recursive:true});
for(const path of ['index.html','en','assets','projetos','acesso','robots.txt','sitemap.xml','og-image.png']) cpSync(path,join(output,path),{recursive:true});
for(const id of ids){
 const svg=readFileSync(join('assets','og',id+'.svg'),'utf8');
 const renderer=new Resvg(svg,{fitTo:{mode:'width',value:1200},font:{loadSystemFonts:true,defaultFontFamily:'DejaVu Sans'}});
 const png=renderer.render();
 if(png.width!==1200||png.height!==630) throw Error('Dimensão OG inválida: '+id);
 writeFileSync(join(output,'assets','og',id+'.png'),png.asPng());
}
console.log('Build estático: 30 páginas e 14 imagens OG de 1200 × 630.');

