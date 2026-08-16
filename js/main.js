const toggle=document.querySelector('[data-nav-toggle]');
const nav=document.querySelector('[data-nav]');
const header=document.querySelector('[data-header]');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});nav.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('open')})}
const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});reveals.forEach(el=>observer.observe(el))}else{reveals.forEach(el=>el.classList.add('visible'))}
