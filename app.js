const STATES=['SLEEP','ATTEND','LISTEN','THINK','SPEAK','ACKNOWLEDGE'];
const body=document.body,statusText=document.querySelector('.status b'),panel=document.querySelector('.panel');
const gazeX=document.querySelector('#gazeX'),gazeY=document.querySelector('#gazeY');
const demoControl=document.querySelector('#demoControl');
const DEMO_SEQUENCE=[['SLEEP',2500],['ATTEND',2000],['LISTEN',3000],['THINK',2200],['SPEAK',4000],['ACKNOWLEDGE',1500],['ATTEND',2500]];
let state='ATTEND', manualX=0, manualY=0, blinkTimer, saccadeTimer, demoTimer, demoIndex=0, demoRunning=false;
async function enterImmersive(){if(document.fullscreenElement||!document.documentElement.requestFullscreen)return;try{await document.documentElement.requestFullscreen({navigationUI:'hide'})}catch{}}
function setState(next){if(!STATES.includes(next))return;state=next;body.dataset.state=next;statusText.textContent=next;document.querySelectorAll('[data-set-state]').forEach(b=>b.classList.toggle('active',b.dataset.setState===next));if(next==='ACKNOWLEDGE'){body.animate([{transform:'translateY(0)'},{transform:'translateY(3px)'},{transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'})}scheduleBlink()}
function setGaze(x,y,updateInputs=true){manualX=Number(x);manualY=Number(y);document.documentElement.style.setProperty('--gx',manualX);document.documentElement.style.setProperty('--gy',manualY);if(updateInputs){gazeX.value=manualX;gazeY.value=manualY}document.querySelector('#xValue').value=manualX.toFixed(2);document.querySelector('#yValue').value=manualY.toFixed(2)}
function blink(){if(state==='SLEEP')return;document.documentElement.style.setProperty('--blink',1);setTimeout(()=>document.documentElement.style.setProperty('--blink',0),150)}
function scheduleBlink(){clearTimeout(blinkTimer);if(state==='SLEEP')return;blinkTimer=setTimeout(()=>{blink();if(Math.random()>.72)setTimeout(blink,260);scheduleBlink()},2400+Math.random()*3200)}
function saccade(){if(!['ATTEND','LISTEN','SPEAK'].includes(state)||body.classList.contains('panel-open')){scheduleSaccade();return}const dx=(Math.random()-.5)*.15,dy=(Math.random()-.5)*.09;document.documentElement.style.setProperty('--gx',Math.max(-1,Math.min(1,manualX+dx)));document.documentElement.style.setProperty('--gy',Math.max(-1,Math.min(1,manualY+dy)));setTimeout(()=>{document.documentElement.style.setProperty('--gx',manualX);document.documentElement.style.setProperty('--gy',manualY)},160);scheduleSaccade()}
function scheduleSaccade(){clearTimeout(saccadeTimer);saccadeTimer=setTimeout(saccade,1500+Math.random()*2300)}
function updateDemoControl(){demoControl.setAttribute('aria-pressed',String(demoRunning));demoControl.querySelector('em').textContent=demoRunning?'Stop sequence':'Start sequence'}
function runDemoStep(){if(!demoRunning)return;const [next,duration]=DEMO_SEQUENCE[demoIndex];setState(next);demoIndex=(demoIndex+1)%DEMO_SEQUENCE.length;demoTimer=setTimeout(runDemoStep,duration)}
function startDemo(){clearTimeout(demoTimer);demoRunning=true;demoIndex=0;updateDemoControl();runDemoStep();setTimeout(()=>body.classList.remove('panel-open'),350)}
function stopDemo(settle=true){clearTimeout(demoTimer);demoRunning=false;demoIndex=0;updateDemoControl();if(settle)setState('ATTEND')}
document.querySelectorAll('[data-set-state]').forEach(b=>b.addEventListener('click',()=>{stopDemo(false);setState(b.dataset.setState)}));
demoControl.addEventListener('click',()=>demoRunning?stopDemo():startDemo());
document.querySelector('.panel-trigger').addEventListener('click',()=>body.classList.toggle('panel-open'));
document.querySelector('.close').addEventListener('click',()=>body.classList.remove('panel-open'));document.querySelector('.scrim').addEventListener('click',()=>body.classList.remove('panel-open'));
gazeX.addEventListener('input',e=>setGaze(e.target.value,gazeY.value,false));gazeY.addEventListener('input',e=>setGaze(gazeX.value,e.target.value,false));
document.querySelector('#centerGaze').addEventListener('click',()=>setGaze(0,0));
document.addEventListener('keydown',e=>{if(e.key>='1'&&e.key<='6'){stopDemo(false);setState(STATES[Number(e.key)-1])}if(e.key==='Escape')body.classList.remove('panel-open')});
let hold;document.addEventListener('pointerdown',e=>{enterImmersive();if(e.clientX<90&&e.clientY<90)hold=setTimeout(()=>body.classList.toggle('panel-open'),650)});document.addEventListener('pointerup',()=>clearTimeout(hold));
const requested=new URLSearchParams(location.search).get('state')?.toUpperCase();if(requested)setState(requested);setGaze(0,0);updateDemoControl();scheduleBlink();scheduleSaccade();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

