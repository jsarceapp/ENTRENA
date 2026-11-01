const routines = [
 {day:"LUN",name:"Torso A",focus:"ÉNFASIS EN PECHO",items:[["Press banca","3 × 6–10"],["Jalón al pecho","3 × 8–12"],["Press inclinado con mancuernas","2 × 8–12"],["Remo sentado en polea","2 × 8–12"],["Elevaciones laterales","2 × 12–15"],["Curl de bíceps con mancuernas","2 × 10–15"],["Extensión de tríceps en polea","2 × 10–15"]]},
 {day:"MAR",name:"Pierna A",focus:"ÉNFASIS EN CUÁDRICEPS",items:[["Sentadilla","3 × 6–10"],["Prensa","2 × 10–12"],["Curl femoral sentado","3 × 10–15"],["Extensión de cuádriceps","2 × 12–15"],["Hip thrust","2 × 8–12"],["Gemelos de pie","2 × 12–15"],["Crunch en polea","2 × 12–15"]]},
 {day:"JUE",name:"Torso B",focus:"ÉNFASIS EN ESPALDA",items:[["Press de pecho en máquina inclinado","3 × 8–12"],["Remo con pecho apoyado","3 × 8–12"],["Press de hombro con mancuernas","2 × 8–12"],["Jalón neutro","2 × 10–12"],["Aperturas en polea","2 × 12–15"],["Curl de bíceps en polea","2 × 10–15"],["Extensión de tríceps por encima de la cabeza","2 × 10–15"]]},
 {day:"SÁB",name:"Pierna B",focus:"ÉNFASIS EN GLÚTEOS E ISQUIOS",items:[["Peso muerto rumano","3 × 8–10"],["Sentadilla búlgara","2 × 8–10"],["Curl femoral tumbado","3 × 10–15"],["Extensión de cuádriceps","2 × 12–15"],["Hip thrust","2 × 10–12"],["Gemelos sentado","2 × 12–15"],["Elevaciones de piernas","2 × 12–15"]]}
];
const $=s=>document.querySelector(s);
let selected=0, exerciseIndex=0, sessionSets=[], sessionDone=[];
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let history=read("entrena_history",[]), last=read("entrena_last",{});
function showScreen(id){document.querySelectorAll(".screen").forEach(x=>x.classList.toggle("active",x.id===id));document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.screen===id));}
function renderRoutine(){
 const r=routines[selected];$("#todayWorkout").textContent=r.name;$("#workoutTitle").textContent=r.name;$("#workoutFocus").textContent=r.focus;
 $("#dayTabs").innerHTML=routines.map((x,i)=>`<button class="day-tab ${i===selected?"active":""}" data-i="${i}">${x.day}</button>`).join("");
 document.querySelectorAll(".day-tab").forEach(b=>b.onclick=()=>{selected=+b.dataset.i;renderRoutine()});
 $("#exerciseList").innerHTML=r.items.map((it,i)=>`<div class="exercise"><div class="ex-number">${String(i+1).padStart(2,"0")}</div><div class="ex-info"><strong>${it[0]}</strong><small>${it[1]} repeticiones</small></div><div class="last-weight">${last[it[0]]?last[it[0]]+" kg":"—"}</div></div>`).join("");
}
function parseSets(target){const m=target.match(/^(\d+)/);return m?+m[1]:3}
function begin(){exerciseIndex=0;sessionSets=[];sessionDone=[];routines[selected].items.forEach(it=>{let n=parseSets(it[1]);sessionSets.push(Array.from({length:n},()=>({weight:last[it[0]]||"",reps:"",done:false})));sessionDone.push(false)});showScreen("session");renderExercise()}
function renderExercise(){
 const r=routines[selected],it=r.items[exerciseIndex];$("#sessionDay").textContent=r.day+" · "+r.name.toUpperCase();$("#sessionExercise").textContent=it[0];$("#sessionTarget").textContent=it[1]+" repeticiones";
 $("#setRows").innerHTML=sessionSets[exerciseIndex].map((s,i)=>`<div class="set-row"><span>${i+1}</span><input inputmode="decimal" type="number" min="0" step="0.5" placeholder="kg" value="${s.weight}" data-field="weight" data-i="${i}"><input inputmode="numeric" type="number" min="0" placeholder="reps" value="${s.reps}" data-field="reps" data-i="${i}"><input class="check" type="checkbox" ${s.done?"checked":""} data-field="done" data-i="${i}"></div>`).join("");
 $("#setRows").querySelectorAll("input").forEach(inp=>inp.onchange=()=>{const s=sessionSets[exerciseIndex][+inp.dataset.i];s[inp.dataset.field]=inp.type==="checkbox"?inp.checked:inp.value;updateProgress()});
 $("#progressBar").style.width=(sessionDone.filter(Boolean).length/r.items.length*100)+"%";
 $("#prevExercise").disabled=exerciseIndex===0;$("#nextExercise").textContent=exerciseIndex===r.items.length-1?"REVISAR →":"SIGUIENTE →";
}
function updateProgress(){const r=routines[selected];$("#progressBar").style.width=(sessionDone.filter(Boolean).length/r.items.length*100)+"%"}
function saveSession(){
 const r=routines[selected],entries=[];
 r.items.forEach((it,i)=>{sessionSets[i].forEach(s=>{if(s.weight!==""||s.reps!==""){entries.push({exercise:it[0],weight:Number(s.weight)||0,reps:Number(s.reps)||0,done:s.done});if(s.weight!=="")last[it[0]]=Number(s.weight)}})});
 const completed={date:new Date().toISOString(),name:r.name,day:r.day,sets:entries.length,entries};history.unshift(completed);write("entrena_history",history);write("entrena_last",last);showScreen("home");renderRoutine();alert("Entrenamiento guardado en este dispositivo.");
}
function renderHistory(){$("#historyList").innerHTML=history.length?history.map(h=>`<div class="history-item"><small>${new Date(h.date).toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</small><strong>${h.name}</strong><small>${h.sets} series registradas</small></div>`).join(""):'<div class="empty">Todavía no hay entrenamientos guardados.<br>Cuando completes tu primera sesión, aparecerá aquí.</div>'}
$("#startBtn").onclick=begin;$("#backHome").onclick=()=>showScreen("home");$("#addSet").onclick=()=>{sessionSets[exerciseIndex].push({weight:"",reps:"",done:false});renderExercise()};
$("#prevExercise").onclick=()=>{if(exerciseIndex>0){exerciseIndex--;renderExercise()}};
$("#nextExercise").onclick=()=>{sessionDone[exerciseIndex]=true;if(exerciseIndex<routines[selected].items.length-1){exerciseIndex++;renderExercise()}else{renderExercise();$("#nextExercise").textContent="FINALIZAR";$("#nextExercise").onclick=saveSession}};
$("#finishSession").onclick=saveSession;
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{if(b.dataset.screen==="history")renderHistory();showScreen(b.dataset.screen)});
$("#exportData").onclick=()=>{const blob=new Blob([JSON.stringify({history,last},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="entrena-datos.json";a.click();URL.revokeObjectURL(a.href)};
$("#clearData").onclick=()=>{if(confirm("¿Borrar todo el historial guardado en este dispositivo?")){history=[];last={};write("entrena_history",history);write("entrena_last",last);renderRoutine();renderHistory();alert("Historial borrado.")}};
$("#todayLabel").textContent=new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"}).toUpperCase();
renderRoutine();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
