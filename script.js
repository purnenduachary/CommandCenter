const plan = {
  Monday:    {tag:"GAME",  info:"DSA 07:00–09:15 PM • Gaming 11:30 PM", topic:"Core Java — OOP & fundamentals", blocks:[
    ["07:00–09:15 PM","DSA","Problems + pattern recognition","dsa"],
    ["09:15–10:00 PM","Break / dinner","Reset before backend","none"],
    ["10:00–11:15 PM","Spring Boot / Development","Backend learning or project work","backend"],
    ["11:30 PM–01:00 AM","Gaming","Friends / fun","fun"]
  ]},
  Tuesday:   {tag:"GYM",   info:"Gym • Backend deep work", topic:"Core Java — Collections", blocks:[
    ["07:00–09:15 PM","DSA","Problems + pattern recognition","dsa"],
    ["09:15–10:00 PM","Gym","Strength session","gym"],
    ["10:00 PM–01:00 AM","Spring Boot / Development","UniqueVerse + backend implementation","backend"]
  ]},
  Wednesday: {tag:"GAME",  info:"DSA 07:00–09:15 PM • Gaming 11:30 PM", topic:"Core Java — Exceptions & Generics", blocks:[
    ["07:00–09:15 PM","DSA","Problems + pattern recognition","dsa"],
    ["09:15–10:00 PM","Break / dinner","Reset before backend","none"],
    ["10:00–11:15 PM","Spring Boot / Development","Backend learning or project work","backend"],
    ["11:30 PM–01:00 AM","Gaming","Friends / fun","fun"]
  ]},
  Thursday:  {tag:"GYM",   info:"Gym • Backend deep work", topic:"Core Java — Multithreading", blocks:[
    ["07:00–09:15 PM","DSA","Problems + pattern recognition","dsa"],
    ["09:15–10:00 PM","Gym","Strength session","gym"],
    ["10:00 PM–01:00 AM","Spring Boot / Development","UniqueVerse + backend implementation","backend"]
  ]},
  Friday:    {tag:"GAME",  info:"DSA 07:00–09:15 PM • Gaming 11:30 PM", topic:"Java 8 — Streams & Lambdas", blocks:[
    ["07:00–09:15 PM","DSA","Problems + pattern recognition","dsa"],
    ["09:15–10:00 PM","Break / dinner","Reset before backend","none"],
    ["10:00–11:15 PM","Spring Boot / Development","Backend learning or project work","backend"],
    ["11:30 PM–01:00 AM","Gaming","Friends / fun","fun"]
  ]},
  Saturday:  {tag:"GYM",   info:"Gym • Deep development session", topic:"Spring / Spring Boot interview rotation", blocks:[
    ["Morning / afternoon","DSA","1–1.5 hr focused practice","dsa"],
    ["Afternoon","Gym","Strength session","gym"],
    ["04:00–07:00 PM","Spring Boot / Development","Long UniqueVerse / backend build","backend"],
    ["Night","Free time","Do whatever doesn't require a ticket from management","fun"]
  ]},
  Sunday:    {tag:"RESET", info:"Revision • Long walk • Recovery", topic:"Weekly interview Q&A revision", blocks:[
    ["Flexible","DSA revision","Review weak patterns + mistakes","dsa"],
    ["Flexible","Weekly review","Check DSA, backend, gym and interview progress","backend"],
    ["Evening","Long walk / rest","Recovery and personal time","gym"]
  ]}
};

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const now = new Date();
const today = days[now.getDay()];
let selectedDay = today;
const key = d => `maccc_${d}`;
let state = JSON.parse(localStorage.getItem("mac_command_center") || "{}");

function save(){ localStorage.setItem("mac_command_center", JSON.stringify(state)); }

function initState(){
  for(const d of days){
    if(!state[key(d)]) state[key(d)] = {checks:[], q:0};
  }
  save();
}
initState();

function dateText(){
  return now.toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
}
document.getElementById("dateLine").textContent = dateText();

function tick(){
  document.getElementById("clock").textContent = new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
}
tick(); setInterval(tick,1000);

function renderWeek(){
  const el=document.getElementById("weekPlan");
  el.innerHTML=days.slice(1).concat(["Sunday"]).map(d=>{
    const p=plan[d];
    const done=(state[key(d)].checks||[]).filter(Boolean).length;
    const total=p.blocks.filter(b=>b[3]!=="none" && b[3]!=="fun").length;
    return `<div class="day ${d===today?"today":""} ${d===selectedDay?"selected":""}" data-day="${d}" role="button" tabindex="0">
      <div class="day-name">${d.slice(0,3).toUpperCase()}</div>
      <div class="day-info">${p.info}</div>
      <div class="day-tag">${done}/${Math.max(total,1)} FOCUS</div>
    </div>`;
  }).join("");

  el.querySelectorAll(".day").forEach(day=>{
    day.style.cursor="pointer";
    const selectDay=()=>{
      selectedDay=day.dataset.day;
      renderAll();
      document.getElementById("todayBlocks").scrollIntoView({behavior:"smooth",block:"center"});
    };
    day.addEventListener("click",selectDay);
    day.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectDay();}});
  });
}

function renderToday(){
  const activeDay=selectedDay;
  const p=plan[activeDay], s=state[key(activeDay)];
  document.getElementById("todayTitle").textContent = "LOCKIN";
  document.getElementById("todaySubtitle").textContent=(activeDay===today ? p.info : `${activeDay} • ${p.info}`)+" • Office target: 5–10 interview questions.";
  document.querySelector(".focus-card h3").textContent = activeDay===today ? "Today's blocks" : `${activeDay}'s blocks`;

  const focusBlocks=p.blocks.filter(b=>b[3]!=="none" && b[3]!=="fun");
  const completed=focusBlocks.reduce((n,b)=>n+(s.checks[p.blocks.indexOf(b)]?1:0),0);
  const pct=focusBlocks.length?Math.round(completed/focusBlocks.length*100):0;
  document.getElementById("todayPercent").textContent=pct+"%";
  document.getElementById("todayBar").style.width=pct+"%";

  document.getElementById("todayBlocks").innerHTML=p.blocks.map((b,i)=>`
    <div class="block">
      <input class="check" type="checkbox" ${s.checks[i]?"checked":""} data-i="${i}">
      <div class="block-time">${b[0]}</div>
      <div class="block-main">
        <div class="block-title">${b[1]}</div>
        <div class="block-sub">${b[2]}</div>
      </div>
    </div>`).join("");

  document.querySelectorAll(".check").forEach(c=>{
    c.addEventListener("change",e=>{
      state[key(activeDay)].checks[e.target.dataset.i]=e.target.checked;
      save(); renderAll();
    });
  });
}

function renderInterview(){
  const s=state[key(selectedDay)];
  document.getElementById("qCount").textContent=s.q||0;
  document.getElementById("topic").textContent=plan[selectedDay].topic;
}
document.querySelectorAll(".qbtn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    state[key(selectedDay)].q=Math.max(0,(state[key(selectedDay)].q||0)+Number(btn.dataset.delta));
    save(); renderInterview();
  });
});

function renderProgress(){
  let dsa=0,backend=0,gym=0;
  for(const d of days){
    const p=plan[d], s=state[key(d)];
    p.blocks.forEach((b,i)=>{
      if(s.checks[i]){
        if(b[3]==="dsa")dsa++;
        if(b[3]==="backend")backend++;
        if(b[3]==="gym")gym++;
      }
    });
  }
  const target={dsa:6,backend:5,gym:3};
  document.getElementById("dsaSessions").textContent=dsa;
  document.getElementById("backendSessions").textContent=backend;
  document.getElementById("gymSessions").textContent=gym;
  document.getElementById("dsaBar").style.width=Math.min(100,dsa/target.dsa*100)+"%";
  document.getElementById("backendBar").style.width=Math.min(100,backend/target.backend*100)+"%";
  document.getElementById("gymBar").style.width=Math.min(100,gym/target.gym*100)+"%";
}

function renderAll(){renderWeek();renderToday();renderInterview();renderProgress();}

// Expose the selected weekday to assistive technology and visual styling.
document.body.dataset.activeDay = today.toLowerCase();
renderAll();

document.getElementById("resetWeek").addEventListener("click",()=>{
  if(confirm("Reset this week's checkboxes and interview counts?")){
    for(const d of days) state[key(d)]={checks:[],q:0};
    save();renderAll();
  }
});
