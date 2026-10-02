const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const STATES=['SLEEP','ATTEND','LISTEN','THINK','SPEAK','ACKNOWLEDGE'];
const body=document.body,statusText=document.querySelector('.status b'),panel=document.querySelector('.panel');
const gazeX=document.querySelector('#gazeX'),gazeY=document.querySelector('#gazeY');
const demoControl=document.querySelector('#demoControl');
const DEMO_SEQUENCE=[['SLEEP',2500],['ATTEND',2000],['LISTEN',3000],['THINK',2200],['SPEAK',4000],['ACKNOWLEDGE',1500],['ATTEND',2500]];
let state='ATTEND', manualX=0, manualY=0, blinkTimer, saccadeTimer, demoTimer, demoIndex=0, demoRunning=false;
const exitFullscreen=document.querySelector('#exitFullscreen'),enterFullscreen=document.querySelector('#enterFullscreen'),fullscreenHint=document.querySelector('#fullscreenHint');
let immersiveWanted=true,fullscreenPending=false,hintTimer;
function fullscreenElement(){return document.fullscreenElement||document.webkitFullscreenElement}
function installedDisplay(){return matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function showFullscreenHint(message){clearTimeout(hintTimer);fullscreenHint.textContent=message;hintTimer=setTimeout(()=>fullscreenHint.textContent='',8000)}
function syncFullscreen(){const active=!!fullscreenElement();body.dataset.fullscreen=String(active);enterFullscreen.disabled=active;enterFullscreen.textContent=active?'Fullscreen active':'Enter fullscreen';if(!active)immersiveWanted=false}
async function enterImmersive(explicit=false){if(fullscreenElement()||fullscreenPending||(!explicit&&!immersiveWanted))return;if(explicit)immersiveWanted=true;const request=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(!request){if(explicit)showFullscreenHint('Fullscreen is unavailable here. Use your phone’s system Home gesture or button to leave the app.');return}fullscreenPending=true;try{await request.call(document.documentElement,{navigationUI:'hide'});if(!immersiveWanted){await leaveFullscreen();return}fullscreenHint.textContent='';syncFullscreen()}catch{if(explicit)showFullscreenHint('Fullscreen could not open. You can keep using the app here.')}finally{fullscreenPending=false}}
async function leaveFullscreen(){immersiveWanted=false;if(!fullscreenElement()){showFullscreenHint(installedDisplay()?'Installed app display stays fullscreen. Use your phone’s system Home gesture or button to leave the app.':'Browser fullscreen is already off. Use your phone’s system Home gesture or button to leave the app.');syncFullscreen();return}const exit=document.exitFullscreen||document.webkitExitFullscreen;if(!exit){showFullscreenHint('Fullscreen exit is unavailable here. Use your phone’s system Home gesture or button to leave the app.');return}try{await exit.call(document);syncFullscreen();showFullscreenHint(installedDisplay()?'Browser fullscreen ended; the installed app display remains. Use your phone’s system Home gesture or button to leave the app.':'Fullscreen ended. Use your phone’s system Home gesture or button to return to the Home screen.')}catch{syncFullscreen();showFullscreenHint('Fullscreen could not exit. Use your phone’s system Home gesture or button to leave the app.')}}
exitFullscreen.addEventListener('click',leaveFullscreen);enterFullscreen.addEventListener('click',()=>enterImmersive(true));
document.addEventListener('fullscreenchange',syncFullscreen);document.addEventListener('webkitfullscreenchange',syncFullscreen);
body.dataset.fullscreen=String(!!fullscreenElement());enterFullscreen.disabled=!!fullscreenElement();
function setState(next){if(!STATES.includes(next))return;state=next;body.dataset.state=next;statusText.textContent=next;document.querySelectorAll('[data-set-state]').forEach(b=>{b.classList.toggle('active',b.dataset.setState===next);b.setAttribute('aria-pressed',String(b.dataset.setState===next))});if(next==='ACKNOWLEDGE'&&!reducedMotion.matches){body.animate([{transform:'translateY(0)'},{transform:'translateY(3px)'},{transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'})}scheduleBlink()}
function setGaze(x,y,updateInputs=true){manualX=Number(x);manualY=Number(y);document.documentElement.style.setProperty('--gx',manualX);document.documentElement.style.setProperty('--gy',manualY);if(updateInputs){gazeX.value=manualX;gazeY.value=manualY}document.querySelector('#xValue').value=manualX.toFixed(2);document.querySelector('#yValue').value=manualY.toFixed(2)}
function blink(){if(state==='SLEEP'||reducedMotion.matches)return;document.documentElement.style.setProperty('--blink',1);setTimeout(()=>document.documentElement.style.setProperty('--blink',0),150)}
function scheduleBlink(){clearTimeout(blinkTimer);if(state==='SLEEP'||reducedMotion.matches)return;blinkTimer=setTimeout(()=>{blink();if(Math.random()>.72)setTimeout(blink,260);scheduleBlink()},2400+Math.random()*3200)}
function saccade(){if(!['ATTEND','SPEAK'].includes(state)||body.classList.contains('panel-open')){scheduleSaccade();return}const dx=(Math.random()-.5)*.08,dy=(Math.random()-.5)*.04;document.documentElement.style.setProperty('--gx',Math.max(-1,Math.min(1,manualX+dx)));document.documentElement.style.setProperty('--gy',Math.max(-1,Math.min(1,manualY+dy)));setTimeout(()=>{document.documentElement.style.setProperty('--gx',manualX);document.documentElement.style.setProperty('--gy',manualY)},160);scheduleSaccade()}
function scheduleSaccade(){clearTimeout(saccadeTimer);if(reducedMotion.matches)return;saccadeTimer=setTimeout(saccade,4200+Math.random()*3200)}
function updateDemoControl(){demoControl.setAttribute('aria-pressed',String(demoRunning));demoControl.querySelector('em').textContent=demoRunning?'Stop sequence':'Start sequence'}
function runDemoStep(){if(!demoRunning)return;const [next,duration]=DEMO_SEQUENCE[demoIndex];setState(next);demoIndex=(demoIndex+1)%DEMO_SEQUENCE.length;demoTimer=setTimeout(runDemoStep,duration)}
function startDemo(){clearTimeout(demoTimer);demoRunning=true;demoIndex=0;updateDemoControl();runDemoStep();setTimeout(()=>setPanel(false),350)}
function stopDemo(settle=true){clearTimeout(demoTimer);demoRunning=false;demoIndex=0;updateDemoControl();if(settle)setState('ATTEND')}
document.querySelectorAll('[data-set-state]').forEach(b=>b.addEventListener('click',()=>{stopDemo(false);setState(b.dataset.setState)}));
demoControl.addEventListener('click',()=>demoRunning?stopDemo():startDemo());
document.querySelector('.panel-trigger').addEventListener('click',()=>setPanel(!body.classList.contains('panel-open')));
document.querySelector('.close').addEventListener('click',()=>setPanel(false));document.querySelector('.scrim').addEventListener('click',()=>setPanel(false));
gazeX.addEventListener('input',e=>setGaze(e.target.value,gazeY.value,false));gazeY.addEventListener('input',e=>setGaze(gazeX.value,e.target.value,false));
document.querySelector('#centerGaze').addEventListener('click',()=>setGaze(0,0));
document.addEventListener('keydown',e=>{if(e.key>='1'&&e.key<='6'&&e.target.tagName!=='INPUT'){stopDemo(false);setState(STATES[Number(e.key)-1])}if(e.key==='Escape')setPanel(false)});
const trigger=document.querySelector('.panel-trigger');
function setPanel(open){body.classList.toggle('panel-open',open);panel.inert=!open;trigger.setAttribute('aria-expanded',String(open));if(open)document.querySelector('.close').focus();else trigger.focus({preventScroll:true})}
reducedMotion.addEventListener('change',()=>{document.documentElement.style.setProperty('--blink',0);scheduleBlink();scheduleSaccade()});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#exitFullscreen,#enterFullscreen'))enterImmersive()});
const requested=new URLSearchParams(location.search).get('state')?.toUpperCase();if(requested)setState(requested);setGaze(0,0);setState(state);updateDemoControl();scheduleBlink();scheduleSaccade();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

