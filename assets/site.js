
function toast(msg){
  let t=document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);
}
function copyText(id){
  const el=document.getElementById(id);
  if(!el)return;
  const text=el.innerText || el.value || '';
  navigator.clipboard.writeText(text).then(()=>toast('Texto copiado'));
}
function filterCards(inputId, cardSelector){
  const q=(document.getElementById(inputId)?.value||'').toLowerCase();
  document.querySelectorAll(cardSelector).forEach(card=>{
    card.style.display=card.innerText.toLowerCase().includes(q)?'':'none';
  });
}
function showActor(id){
  const cards=document.querySelectorAll('.actor-detail');
  cards.forEach(c=>c.style.display=c.dataset.actor===id?'block':'none');
  document.getElementById('actor-detail-zone')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function setActive(){
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.menu a').forEach(a=>{
    if(a.getAttribute('href')===page) a.classList.add('active');
  });
}
document.addEventListener('DOMContentLoaded',setActive);
