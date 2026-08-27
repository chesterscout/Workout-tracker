const days=[
{title:'Day 1 — Chest Lead',ex:[['DB Bench Press','Chest','6–12','90–120 sec'],['1-Arm DB Row','Back','6–12','90–120 sec'],['Goblet Squat','Quads','6–12','90–120 sec'],['DB Romanian Deadlift','Hamstrings/Glutes','6–12','90–120 sec'],['Seated DB Shoulder Press','Shoulders','8–15','60–90 sec'],['Alternating DB Curl','Biceps','10–20','45–75 sec'],['Lying DB Triceps Extension','Triceps','10–20','45–75 sec'],['Standing DB Calf Raise','Calves','12–20','30–60 sec'],['Weighted Crunch','Abs','12–20','30–60 sec']]},
{title:'Day 2 — Posterior Lead',ex:[['DB Romanian Deadlift','Hamstrings/Glutes','6–12','90–120 sec'],['Incline DB Press','Chest','6–12','90–120 sec'],['Chest-Supported DB Row','Back','6–12','90–120 sec'],['Reverse DB Lunge','Quads','8–15','60–90 sec'],['DB Lateral Raise','Shoulders','10–20','45–75 sec'],['Hammer Curl','Biceps','10–20','45–75 sec'],['Overhead DB Extension','Triceps','10–20','45–75 sec'],['Single-Leg Calf Raise','Calves','12–20','30–60 sec'],['Reverse Crunch','Abs','12–20','30–60 sec']]},
{title:'Day 3 — Back Lead',ex:[['1-Arm DB Row','Back','6–12','90–120 sec'],['Bulgarian Split Squat','Quads','6–12','90–120 sec'],['DB Fly','Chest','10–20','45–75 sec'],['DB Hip Thrust','Hamstrings/Glutes','8–15','60–90 sec'],['Rear-Delt DB Fly','Shoulders','10–20','45–75 sec'],['Preacher DB Curl','Biceps','10–20','45–75 sec'],['Close-Grip DB Press','Triceps','8–15','60–90 sec'],['Seated DB Calf Raise','Calves','12–20','30–60 sec'],['DB Russian Twist','Abs','12–20','30–60 sec']]},
{title:'Day 4 — Shoulder Lead',ex:[['Seated DB Shoulder Press','Shoulders','8–15','60–90 sec'],['Goblet Squat','Quads','6–12','90–120 sec'],['Bent-Over DB Row','Back','6–12','90–120 sec'],['Single-Leg DB RDL','Hamstrings/Glutes','8–15','60–90 sec'],['DB Squeeze Press','Chest','8–15','60–90 sec'],['Concentration Curl','Biceps','10–20','45–75 sec'],['DB Skull Crusher','Triceps','10–20','45–75 sec'],['Standing DB Calf Raise','Calves','12–20','30–60 sec'],['Lying Leg Raise','Abs','12–20','30–60 sec']]},
{title:'Day 5 — Quad Lead',ex:[['Bulgarian Split Squat','Quads','6–12','90–120 sec'],['Incline DB Press','Chest','6–12','90–120 sec'],['Incline Bench DB Row','Back','6–12','90–120 sec'],['DB Hip Thrust','Hamstrings/Glutes','8–15','60–90 sec'],['Incline Rear-Delt Raise','Shoulders','10–20','45–75 sec'],['Incline DB Curl','Biceps','10–20','45–75 sec'],['DB Kickback','Triceps','10–20','45–75 sec'],['Single-Leg Calf Raise','Calves','12–20','30–60 sec'],['Weighted Sit-Up','Abs','12–20','30–60 sec']]}];

const muscles=['Chest','Back','Shoulders','Biceps','Triceps','Quads','Hamstrings/Glutes','Calves','Abs'];
const STORE='dbWorkoutTrackerV2';
let state={day:0,draft:{},workouts:[],progress:[],selectedMuscle:'Chest'};
try{const s=localStorage.getItem(STORE);if(s)state={...state,...JSON.parse(s)}}catch(e){}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
const safe=(v,min,max)=>{const n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):''};
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const key=(d,e)=>`${d}-${e}`;

$$('.tab').forEach(b=>b.addEventListener('click',()=>{const n=b.dataset.page;$$('.tab').forEach(x=>x.classList.toggle('active',x===b));$$('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${n}`));if(n==='progress')drawProgress();if(n==='strength')renderStrength()}));

function renderDay(){
 const d=days[state.day];$('#dayTitle').textContent=d.title;const list=$('#exerciseList');list.innerHTML='';
 d.ex.forEach((e,i)=>{
  const k=key(state.day,i),old=state.draft[k]||{},sets=Array.from({length:3},(_,j)=>({w:old.sets?.[j]?.w??'',r:old.sets?.[j]?.r??''})),rir=old.rir??'2',done=!!old.done;
  const card=document.createElement('article');card.className='exercise'+(done?' done':'');
  card.innerHTML=`
   <div class="row">
    <div><strong>${i+1}. ${e[0]}</strong><div class="rx">${e[1]} · 3 sets · ${e[2]} reps · rest ${e[3]}</div></div>
    <label class="check"><input class="doneCheck" type="checkbox" ${done?'checked':''}>Done</label>
   </div>
   <div class="setTable">
    <div></div><div class="setHead">Weight (lb)</div><div class="setHead">Reps</div>
    <div class="setName">Set 1</div><div class="setField"><input data-set="0" data-kind="w" value="${sets[0].w}" type="number" min="0" max="200" step="2.5" inputmode="decimal"></div><div class="setField"><input data-set="0" data-kind="r" value="${sets[0].r}" type="number" min="0" max="100" step="1" inputmode="numeric"></div>
    <div class="setName">Set 2</div><div class="setField"><input data-set="1" data-kind="w" value="${sets[1].w}" type="number" min="0" max="200" step="2.5" inputmode="decimal"></div><div class="setField"><input data-set="1" data-kind="r" value="${sets[1].r}" type="number" min="0" max="100" step="1" inputmode="numeric"></div>
    <div class="setName">Set 3</div><div class="setField"><input data-set="2" data-kind="w" value="${sets[2].w}" type="number" min="0" max="200" step="2.5" inputmode="decimal"></div><div class="setField"><input data-set="2" data-kind="r" value="${sets[2].r}" type="number" min="0" max="100" step="1" inputmode="numeric"></div>
   </div>
   <div class="rirBox"><label>RIR (reps in reserve)</label><select class="rir"><option ${rir==='0'?'selected':''}>0</option><option ${rir==='1'?'selected':''}>1</option><option ${rir==='2'?'selected':''}>2</option><option ${rir==='3'?'selected':''}>3</option><option ${rir==='4+'?'selected':''}>4+</option></select></div>`;
  const store=()=>{
   const obj=state.draft[k]||{sets:[{w:'',r:''},{w:'',r:''},{w:'',r:''}],rir:'2',done:false};
   while(obj.sets.length<3)obj.sets.push({w:'',r:''});
   state.draft[k]=obj;return obj;
  };
  card.querySelectorAll('[data-set]').forEach(inp=>inp.addEventListener('change',()=>{const o=store();o.sets[Number(inp.dataset.set)][inp.dataset.kind]=safe(inp.value,0,inp.dataset.kind==='w'?200:100);save()}));
  card.querySelector('.rir').addEventListener('change',ev=>{const o=store();o.rir=ev.target.value;save()});
  card.querySelector('.doneCheck').addEventListener('change',ev=>{const o=store();o.done=ev.target.checked;save();card.classList.toggle('done',o.done)});
  list.appendChild(card);
 });
}

$('#prevDay').addEventListener('click',()=>{state.day=(state.day+4)%5;save();renderDay()});
$('#nextDay').addEventListener('click',()=>{state.day=(state.day+1)%5;save();renderDay()});

$('#saveWorkout').addEventListener('click',()=>{
 const d=days[state.day],exercises=[];
 d.ex.forEach((e,i)=>{const l=state.draft[key(state.day,i)];if(!l)return;const sets=(l.sets||[]).slice(0,3).map(s=>({w:safe(s.w,0,200),r:safe(s.r,0,100)})).filter(s=>s.w!==''&&s.r!=='');if(sets.length)exercises.push({name:e[0],muscle:e[1],sets,rir:l.rir||''})});
 if(!exercises.length){$('#saveMsg').textContent='Enter at least one completed set before saving.';return}
 state.workouts.push({id:Date.now(),date:$('#workoutDate').value||today(),day:state.day,title:d.title,notes:$('#workoutNotes').value.trim().slice(0,140),exercises});
 state.workouts=state.workouts.slice(-300);d.ex.forEach((_,i)=>delete state.draft[key(state.day,i)]);save();$('#saveMsg').textContent='Workout saved to history.';$('#workoutNotes').value='';renderDay();renderHistory();
});

function renderHistory(){const a=[...state.workouts].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,8);$('#historyList').innerHTML=a.length?a.map(w=>`<div class="historyItem"><strong>${w.date} · ${w.title}</strong><div class="tiny">${w.exercises.length} exercises${w.notes?' · '+w.notes:''}</div></div>`).join(''):'No saved workouts yet.'}

$('#addProgress').addEventListener('click',()=>{const date=$('#pDate').value,weight=safe($('#pWeight').value,0,1000),waist=safe($('#pWaist').value,0,100),notes=$('#pNotes').value.trim().slice(0,120);if(!date){$('#progressMsg').textContent='Choose a date first.';return}if(weight===''&&waist===''){$('#progressMsg').textContent='Enter a weight, waist measurement, or both.';return}state.progress.push({date,weight,waist,notes});state.progress=state.progress.slice(-300);save();$('#progressMsg').textContent='Progress entry added.';$('#pWeight').value='';$('#pWaist').value='';$('#pNotes').value='';renderProgressTable();drawProgress()});
function renderProgressTable(){const rows=$('#progressRows');rows.innerHTML='';[...state.progress].sort((a,b)=>b.date.localeCompare(a.date)).forEach(p=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${p.date}</td><td>${p.weight===''?'—':p.weight}</td><td>${p.waist===''?'—':p.waist}</td><td>${p.notes||'—'}</td>`;rows.appendChild(tr)})}

function drawLine(c,pts){const ctx=c.getContext('2d'),dpr=devicePixelRatio||1,w=Math.max(300,Math.floor(c.getBoundingClientRect().width)),h=260;c.width=w*dpr;c.height=h*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);ctx.font='12px system-ui';ctx.fillStyle='#6b7280';if(!pts.length){ctx.fillText('Not enough data yet.',18,32);return}const vals=pts.map(p=>p.v);let mn=Math.min(...vals),mx=Math.max(...vals);if(mn===mx){mn-=1;mx+=1}const span=mx-mn,y0=mn-span*.12,y1=mx+span*.12,p={l:48,r:16,t:18,b:34},x=i=>p.l+(pts.length===1?0:i/(pts.length-1)*(w-p.l-p.r)),y=v=>p.t+(y1-v)/(y1-y0)*(h-p.t-p.b);ctx.strokeStyle='#d7dce3';for(let j=0;j<5;j++){const yy=p.t+j*(h-p.t-p.b)/4;ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke()}ctx.strokeStyle='#2563eb';ctx.lineWidth=2.5;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(x(i),y(q.v)):ctx.moveTo(x(i),y(q.v)));ctx.stroke();ctx.fillStyle='#2563eb';pts.forEach((q,i)=>{ctx.beginPath();ctx.arc(x(i),y(q.v),3.3,0,Math.PI*2);ctx.fill()})}
function drawProgress(){const a=[...state.progress].sort((a,b)=>a.date.localeCompare(b.date));drawLine($('#weightChart'),a.filter(p=>p.weight!=='').map(p=>({v:Number(p.weight)})));drawLine($('#waistChart'),a.filter(p=>p.waist!=='').map(p=>({v:Number(p.waist)})))}

const est=s=>{const w=Number(s.w),r=Number(s.r);return w>0&&r>0?w*(1+r/30):null};
function muscleSeries(m){const ex={};[...state.workouts].sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id).forEach(w=>w.exercises.forEach(e=>{if(e.muscle!==m)return;const best=Math.max(...e.sets.map(est).filter(Number.isFinite));if(!Number.isFinite(best))return;if(!ex[e.name])ex[e.name]={base:best,pts:[]};ex[e.name].pts.push({date:w.date,v:best/ex[e.name].base*100})}));const by={};Object.values(ex).forEach(o=>o.pts.forEach(p=>(by[p.date]??=[]).push(p.v)));return Object.keys(by).sort().map(date=>({v:by[date].reduce((a,b)=>a+b,0)/by[date].length}))}
function renderStrength(){const box=$('#muscleButtons');box.innerHTML='';muscles.forEach(m=>{const b=document.createElement('button');b.textContent=m;b.className=state.selectedMuscle===m?'active':'';b.onclick=()=>{state.selectedMuscle=m;save();renderStrength()};box.appendChild(b)});const s=muscleSeries(state.selectedMuscle);$('#muscleName').textContent=state.selectedMuscle;$('#trackedCount').textContent=s.length;if(s.length){const cur=s[s.length-1].v;$('#currentIndex').textContent=cur.toFixed(1);$('#indexChange').textContent=`${cur>=100?'+':''}${(cur-100).toFixed(1)}%`}else{$('#currentIndex').textContent='—';$('#indexChange').textContent='—'}drawLine($('#strengthChart'),s)}

$('#exportData').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='workout-tracker-v23-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});
$('#importBtn').addEventListener('click',()=>$('#importFile').click());
$('#importFile').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const o=JSON.parse(await f.text());state={day:0,draft:{},workouts:[],progress:[],selectedMuscle:'Chest',...o};save();renderAll();alert('Backup imported.')}catch{alert('Could not import that backup.')}e.target.value=''});
$('#resetAll').addEventListener('click',()=>{if(confirm('Delete all workout history, measurements, and current entries?')){state={day:0,draft:{},workouts:[],progress:[],selectedMuscle:'Chest'};save();renderAll()}});
function renderAll(){renderDay();renderHistory();renderProgressTable();renderStrength();drawProgress()}
$('#workoutDate').value=today();$('#pDate').value=today();renderAll();