
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function copyText(id){const el=document.getElementById(id);if(!el)return;const text=el.innerText||el.value||'';navigator.clipboard.writeText(text).then(()=>toast('Texto copiado'))}
function filterCards(inputId, cardSelector){const q=(document.getElementById(inputId)?.value||'').toLowerCase();document.querySelectorAll(cardSelector).forEach(card=>{card.style.display=card.innerText.toLowerCase().includes(q)?'':'none'})}
function showActor(id){const cards=document.querySelectorAll('.actor-detail');cards.forEach(c=>c.style.display=c.dataset.actor===id?'block':'none');document.getElementById('actor-detail-zone')?.scrollIntoView({behavior:'smooth',block:'start'})}
function setActive(){const page=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.menu a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active')})}
function initCoach(){
  const body=document.body; const steps=(body.dataset.helpSteps||'').split('||').filter(Boolean); if(!steps.length) return;
  const title=body.dataset.helpTitle||'Ayuda guiada'; const text=body.dataset.helpText||''; const page=location.pathname.split('/').pop()||'index.html'; let idx=0;
  const toggle=document.createElement('button'); toggle.className='coach-toggle'; toggle.textContent='? Ayuda';
  const panel=document.createElement('div'); panel.className='coach-panel';
  panel.innerHTML=`<div class="coach-head"><strong>${title}</strong><button class="coach-close" type="button">×</button></div><div class="coach-body">${text?`<div class="coach-hint">${text}</div>`:''}<div id="coachSteps"></div></div><div class="coach-progress"></div><div class="coach-actions"><button type="button" id="coachPrev">Anterior</button><button type="button" class="primary" id="coachNext">Siguiente</button></div>`;
  document.body.appendChild(panel); document.body.appendChild(toggle);
  const stepsBox=panel.querySelector('#coachSteps'); const prog=panel.querySelector('.coach-progress');
  stepsBox.innerHTML=steps.map((s,i)=>`<div class="coach-step" data-i="${i}"><span class="coach-step-num">Paso ${i+1}</span><p>${s}</p></div>`).join('');
  function render(){panel.querySelectorAll('.coach-step').forEach((e,i)=>e.classList.toggle('active',i===idx));prog.textContent=`${idx+1} de ${steps.length}`;panel.querySelector('#coachPrev').style.visibility=idx===0?'hidden':'visible';panel.querySelector('#coachNext').textContent=idx===steps.length-1?'Entendido':'Siguiente'}
  function show(){panel.classList.add('show');render()} function hide(){panel.classList.remove('show');localStorage.setItem('coachSeen:'+page,'1')}
  toggle.addEventListener('click',()=>panel.classList.contains('show')?hide():show()); panel.querySelector('.coach-close').addEventListener('click',hide); panel.querySelector('#coachPrev').addEventListener('click',()=>{idx=Math.max(0,idx-1);render()}); panel.querySelector('#coachNext').addEventListener('click',()=>{if(idx<steps.length-1){idx++;render()}else hide()});
  if(!localStorage.getItem('coachSeen:'+page)){setTimeout(show,700); setTimeout(()=>{if(panel.classList.contains('show')) hide()},12000)}
}
document.addEventListener('DOMContentLoaded',()=>{setActive();initCoach()});
