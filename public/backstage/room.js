const dialogs=document.querySelectorAll('dialog');
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.open)?.showModal()));
dialogs.forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
document.getElementById('lights').addEventListener('click',e=>{const b=e.currentTarget,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));document.body.classList.toggle('lights-dimmed',!on);b.firstChild.textContent=on?'Lights are on ':'A little atmosphere ';});
document.getElementById('reveal-answer')?.addEventListener('click',()=>{document.getElementById('quiz-answer').hidden=false;});
document.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-choice]').forEach(x=>x.classList.toggle('selected',x===b));document.getElementById('scenario-response').textContent='Now another fact: the assistant can’t show you any products outside its partner catalogue. Would you change your answer? That’s the conversation.';}));
const match=location.hash.match(/^#pass=([a-f0-9-]{36})\.([a-f0-9]{64})$/);
const id=match?.[1],token=match?.[2];
let pass=null,password='';
async function api(action,body){
  const opts={headers:{Authorization:`Bearer ${token}`,'X-Guest-Password':password}};
  if(action){opts.method='POST';if(body)opts.body=body;}
  const r=await fetch(`/api/backstage?id=${encodeURIComponent(id)}${action?`&action=${action}`:''}`,opts);
  const data=await r.json();if(!r.ok)throw new Error(data.error||'We couldn’t save that step.');return data;
}
function render(data){
  pass=data;const first=data.name.split(' ')[0];
  document.getElementById('greeting').textContent=first+',';document.getElementById('chair-name').textContent=first.toUpperCase();document.title=`${first}, your backstage pass | ${data.show}`;
  document.querySelectorAll('.guest-name').forEach(e=>e.textContent=first);
  document.getElementById('personal-brief').textContent=data.why;
  document.getElementById('scope').textContent=data.scope;
  document.getElementById('booking-link').href=data.bookingUrl;
  document.getElementById('pilot-notice').hidden=true;
  if(data.acceptedAt){document.getElementById('accept').textContent='You’re on the bus ✓';document.getElementById('accept-status').textContent='Next: choose your recording time and send your assets.';}
  const stages=[['accepted',!!data.acceptedAt,'Checked in'],['booked',!!data.bookedAt,data.bookedAt?new Intl.DateTimeFormat('en-IE',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Dublin'}).format(new Date(data.bookedAt))+' Dublin':'Pick a time'],['assets',data.bioReceived&&data.headshotReceived,data.bioReceived&&data.headshotReceived?'Headshot and bio received':`${data.headshotReceived?'Headshot ✓':'Headshot needed'} / ${data.bioReceived?'Bio ✓':'Bio needed'}`],['ready',data.ready,'All preparation received']];
  stages.forEach(([key,complete,text])=>{const el=document.getElementById('step-'+key);el.classList.toggle('complete',complete);if(complete||key==='assets')el.querySelector('small').textContent=text;});
  if(data.bookedAt)document.getElementById('booking-note').textContent='Recording booked ✓';
  if(data.bioReceived&&data.headshotReceived)document.getElementById('assets-note').textContent='Production has them ✓';
}
if(match){document.getElementById('pilot-notice').hidden=true;document.getElementById('access').showModal();}
document.getElementById('access-form').addEventListener('submit',async e=>{e.preventDefault();password=document.getElementById('guest-password').value;const message=document.getElementById('access-message'),b=e.currentTarget.querySelector('button');b.disabled=true;try{render(await api());document.getElementById('access').close();document.getElementById('guest-password').value='';}catch{password='';message.textContent='That password didn’t unlock this pass. Check the invitation or ask Vinny for help.';}finally{b.disabled=false;}});
function active(){if(pass)return true;if(match)document.getElementById('access').showModal();else document.getElementById('pilot-notice').scrollIntoView({behavior:'smooth',block:'center'});return false;}
document.getElementById('accept').addEventListener('click',async e=>{if(!active())return;const b=e.currentTarget;b.disabled=true;try{render(await api('accept'));document.getElementById('booking').showModal();}catch(err){document.getElementById('accept-status').textContent=err.message;}finally{b.disabled=false;}});
document.getElementById('verify-booking').addEventListener('click',async e=>{const message=document.getElementById('booking-message');if(!pass){message.textContent='Calendar verification is available through your personal backstage pass.';return;}const b=e.currentTarget;b.disabled=true;message.textContent='Checking the recording calendar…';try{const d=await api('booking');render(d);message.textContent=d.bookingMessage;}catch(err){message.textContent=err.message;}finally{b.disabled=false;}});
document.getElementById('asset-form').addEventListener('submit',async e=>{e.preventDefault();const message=document.getElementById('asset-message');if(!pass){message.textContent='This is a pilot preview. Use the personal pass from Vinny to send assets.';return;}const form=e.currentTarget,body=new FormData(form),f=body.get('headshot');if(f?.size>3*1024*1024){message.textContent='Please use a headshot under 3MB.';return;}if(!f?.size&&!String(body.get('bio')||'').trim()&&!String(body.get('notes')||'').trim()){message.textContent='Add a headshot, bio or preparation note first.';return;}const b=form.querySelector('button[type=submit]');b.disabled=true;message.textContent='Sending to production…';try{render(await api('assets',body));message.textContent='Received. Your call sheet is updated. Thank you!';form.reset();}catch(err){message.textContent=err.message;}finally{b.disabled=false;}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&pass)api().then(render).catch(()=>{});});
