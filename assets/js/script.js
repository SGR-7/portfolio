const pages=[...document.querySelectorAll('.page')];
let current=0;
const portfolio=document.getElementById('portfolio');
const pageTitle=document.getElementById('pageTitle');
if(pageTitle && pages[0]) pageTitle.textContent=pages[0].dataset.title;

function setCurrent(index,behavior='smooth'){
  current=Math.max(0,Math.min(index,pages.length-1));
  pages[current].scrollIntoView({behavior,block:'start'});
  pageTitle.textContent=pages[current].dataset.title;
}
function next(){setCurrent(current+1)}
function prev(){setCurrent(current-1)}
document.getElementById('nextBtn')?.addEventListener('click',next);
document.getElementById('prevBtn')?.addEventListener('click',prev);
document.querySelector('.next-trigger').onclick=next;
document.querySelectorAll('[data-scroll]').forEach(b=>b.onclick=()=>setCurrent(pages.findIndex(p=>p.id===b.dataset.scroll)));

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='PageDown'){e.preventDefault();next()}
  if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();prev()}
  if(e.key==='Escape')closeModal();
});
portfolio.addEventListener('scroll',()=>{
  const center=portfolio.scrollTop+portfolio.clientHeight*.5;
  let nearest=0,best=Infinity;
  pages.forEach((p,i)=>{const d=Math.abs((p.offsetTop+p.offsetHeight*.5)-center);if(d<best){best=d;nearest=i}});
  if(nearest!==current){current=nearest;pageTitle.textContent=pages[current].dataset.title;}
},{passive:true});


document.querySelectorAll('.skill-card').forEach(card=>card.onclick=()=>{document.querySelectorAll('.skill-card').forEach(x=>x.classList.remove('active-skill'));card.classList.add('active-skill');});

const counts=document.querySelectorAll('[data-count]');
let counted=false;
function animateCounts(){
  if(counted||pages[current].id!=='about')return;
  counted=true;
  counts.forEach(el=>{const target=+el.dataset.count;let n=0;const timer=setInterval(()=>{n=Math.min(target,n+1);el.textContent=n;if(n>=target)clearInterval(timer)},55)});
}
portfolio.addEventListener('scroll',animateCounts,{passive:true});

const modal=document.getElementById('projectModal');
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('click',()=>{
  const title=card.dataset.title || card.querySelector('h3')?.textContent || 'Project';
  const description=card.dataset.description || card.querySelector('p')?.textContent || '';
  const metrics=card.dataset.metrics || card.querySelector('.project-stats')?.textContent?.trim() || '';
  const repository=card.dataset.repository || '';
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalText').textContent=description;
  const metricsBox=document.querySelector('.modal-metrics');
  metricsBox.replaceChildren();
  if(metrics){
    const metric=document.createElement('div');
    const strong=document.createElement('b');
    strong.textContent=metrics;
    metric.appendChild(strong);
    metricsBox.appendChild(metric);
  }
  if(repository){
    const repo=document.createElement('div');
    const link=document.createElement('a');
    link.className='modal-link'; link.href=repository; link.target='_blank'; link.rel='noopener';
    link.textContent='View Project';
    const caption=document.createElement('span'); caption.textContent='GitHub repository';
    repo.append(link,caption); metricsBox.appendChild(repo);
  }
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}));
document.getElementById('modalClose').onclick=closeModal;
modal.onclick=e=>{if(e.target===modal)closeModal()};

const toast=document.getElementById('toast');
function showToast(t){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1700)}
document.getElementById('copyEmail').onclick=async()=>{try{await navigator.clipboard.writeText('sgpendem7@gmail.com');showToast('Email copied!')}catch{showToast('sgpendem7@gmail.com')}};


function initTilt(){
  if(!window.matchMedia('(pointer:fine)').matches)return;
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      const max=card.classList.contains('data-panel')?7:9;
      card.style.transform=`perspective(900px) rotateX(${(-y*max).toFixed(2)}deg) rotateY(${(x*max).toFixed(2)}deg) translateZ(4px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}
initTilt();

const canvas=document.getElementById('particleCanvas');
const ctx=canvas.getContext('2d');
let particles=[];
function resizeCanvas(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);const count=Math.min(75,Math.max(32,Math.floor(innerWidth/22)));particles=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.5+.5,a:Math.random()*.35+.1}))}
function drawParticles(){ctx.clearRect(0,0,innerWidth,innerHeight);const dot='117,247,178';particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;if(p.y<0)p.y=innerHeight;if(p.y>innerHeight)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${dot},${p.a})`;ctx.fill()});for(let i=0;i<particles.length;i++){for(let j=i+1;j<particles.length;j++){const a=particles[i],b=particles[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<105){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(${dot},${(1-d/105)*.08})`;ctx.lineWidth=1;ctx.stroke()}}}requestAnimationFrame(drawParticles)}
resizeCanvas();addEventListener('resize',resizeCanvas);drawParticles();
