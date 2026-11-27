document.addEventListener('DOMContentLoaded',()=>{const menu=document.querySelector('#menu'),nav=document.querySelector('#navlinks');if(menu&&nav){const close=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu'};menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?(document.documentElement.lang==='en'?'Close':'Fechar'):'Menu'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();menu.focus()}});document.addEventListener('click',e=>{if(!e.target.closest('.nav'))close()})}document.querySelectorAll('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());document.querySelectorAll('img').forEach(img=>{const fail=()=>{if(img.closest('.visual'))img.hidden=true;else {const fig=img.closest('figure');if(fig){img.hidden=true;const caption=fig.querySelector('figcaption');if(caption)caption.textContent=document.documentElement.lang==='en'?'Screenshot unavailable. See the project repository.':'Captura indisponível. Consulte o repositório do projeto.';}}};img.addEventListener('error',fail);if(img.complete&&!img.naturalWidth)fail()});});
// Preserve links shared before the redesign.
const legacyProjects=['queueflow','pratoja','conferevision','autociclo','eventpass','pentefino',"taskflow","consumo-energia","sistema-estoque","calculadora-python","mountrack","devjourney","dona-joana","cofre"];
const legacyId=location.hash.slice(8);
if(location.hash.startsWith('#estudo-')&&legacyProjects.includes(legacyId)&&/^(\/|\/index\.html)$/.test(location.pathname))location.replace('/projetos/'+legacyId+'/');

// #221: efeitos de interface sem dependências. Cursor só com ponteiro fino; sem movimento se o usuário pedir menos movimento.
(function(){
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)'),calm=window.matchMedia('(prefers-reduced-motion:reduce)'),raf=0,last=null;
  function apply(){
    raf=0;var e=last;if(!e)return;
    var t=e.target&&e.target.closest?e.target:null;if(!t)return;
    var host=t.closest('.tile,.skill,.contact');
    if(host){var r=host.getBoundingClientRect();host.style.setProperty('--mx',(e.clientX-r.left)+'px');host.style.setProperty('--my',(e.clientY-r.top)+'px');}
    if(!calm.matches){
      var cv=t.closest('.project-cover-link');
      if(cv){var c=cv.getBoundingClientRect(),px=(e.clientX-c.left)/c.width-.5,py=(e.clientY-c.top)/c.height-.5,m=cv.querySelector('.uniform-cover-media');if(m){m.style.setProperty('--ry',(px*7).toFixed(2)+'deg');m.style.setProperty('--rx',(-py*7).toFixed(2)+'deg');}}
      var b=t.closest('.hero .btn.main,.contact .btn.main');
      if(b){var q=b.getBoundingClientRect();b.style.setProperty('--tx',(((e.clientX-q.left)/q.width-.5)*8).toFixed(1)+'px');b.style.setProperty('--ty',(((e.clientY-q.top)/q.height-.5)*6).toFixed(1)+'px');}
    }
  }
  document.addEventListener('pointermove',function(e){if(!fine.matches||e.pointerType==='touch')return;last=e;if(!raf)raf=requestAnimationFrame(apply);},{passive:true});
  document.addEventListener('pointerout',function(e){
    var t=e.target;if(!t||!t.closest||(e.relatedTarget&&t.contains(e.relatedTarget)))return;
    var m=t.closest('.project-cover-link');if(m&&!(e.relatedTarget&&m.contains(e.relatedTarget))){var x=m.querySelector('.uniform-cover-media');if(x){x.style.removeProperty('--rx');x.style.removeProperty('--ry');}}
    var b=t.closest('.btn.main');if(b&&!(e.relatedTarget&&b.contains(e.relatedTarget))){b.style.removeProperty('--tx');b.style.removeProperty('--ty');}
  },{passive:true});
  var tl=document.querySelector('.timeline'),tick=0;
  function trace(){tick=0;if(!tl)return;var r=tl.getBoundingClientRect(),h=window.innerHeight,p=calm.matches?1:Math.max(0,Math.min(1,(h*.65-r.top)/r.height));tl.style.setProperty('--p',p.toFixed(3));}
  if(tl){trace();window.addEventListener('scroll',function(){if(!tick)tick=requestAnimationFrame(trace);},{passive:true});window.addEventListener('resize',trace,{passive:true});}
})();
