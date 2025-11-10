/* =========================
   🧭 공통 초기 설정 + 탭 전환
========================= */
document.addEventListener("DOMContentLoaded", () => {

  function showTab(id) {
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-buttons button").forEach(b => b.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
    const btn = document.getElementById(
      id === "simTab" ? "tabSim" :
      id === "expTab" ? "tabExp" :
      id === "enhanceTab" ? "tabEnhance" :
      "tabGrowth"
    );
    if (btn) btn.classList.add("active");
  }

  ["Sim","Exp","Enhance","Growth"].forEach(tab=>{
    const btn=document.getElementById("tab"+tab);
    if(btn) btn.onclick=()=>showTab(tab.toLowerCase()+"Tab");
  });

  /* 실행 */
  initPetSimulator();
  initExpCalculator();
  initEnhanceSimulator();
  initGrowthCalculator();
});


/* =========================
   🐾 초기치 시뮬레이터
========================= */
function initPetSimulator(){
  async function loadPetData() {
    const base = "./data/";
    try {
      const [pets, spet] = await Promise.all([
        fetch(base + "pets.json").then(r => r.json()),
        fetch(base + "spet.json").then(r => r.json())
      ]);
      return { pets: pets || [], spet: spet || [] };
    } catch (e) {
      console.error("펫 데이터 불러오기 실패:", e);
      alert("펫 데이터를 불러오지 못했습니다. data 폴더 확인하세요.");
      return { pets: [], spet: [] };
    }
  }

  let PETS = [], SPETS = [], currentBase = null;
  const sgradeBox = document.getElementById("sgrade");
  const nameInput = document.getElementById("petName");
  const resultBox = document.getElementById("result");
  const costDisplay = document.getElementById("costDisplay");
  let totalCost = 0;

  loadPetData().then(d => { PETS = d.pets; SPETS = d.spet; });

  function safeName(o) { return ((o && (o.name || o.이름)) || "").toString().toLowerCase().trim(); }
  if (nameInput) {
    nameInput.onkeydown = e => { if (e.key === "Enter") updatePet(); };
    nameInput.onchange = updatePet;
  }

  function updatePet(){
    const n = (nameInput?.value || "").trim().toLowerCase();
    if (!n) { sgradeBox.innerHTML = `<b style="color:#ff6b81">⚠️ 입력 필요</b>`; currentBase = null; return; }
    const s = (SPETS || []).find(x => safeName(x) === n);
    if (!s) { sgradeBox.innerHTML = `<b style="color:#ff6b81">⚠️ [${n}] 데이터 없음</b>`; currentBase = null; return; }
    const stat = s["초기치(stat)"] || {};
    currentBase = { name: s.이름 || s.name || n, hp: stat["내구력(HP)"] || 0, atk: stat["공격력(Atk)"] || 0, def: stat["방어력(Def)"] || 0, agi: stat["순발력(Agi)"] || 0 };
    sgradeBox.innerHTML = `<b>${currentBase.name} S급 기준</b><br>체력 <b>${currentBase.hp}</b> | 공격력 <b>${currentBase.atk}</b> | 방어력 <b>${currentBase.def}</b> | 순발력 <b>${currentBase.agi}</b>`;
  }

  function rand(){ return Math.floor(Math.random() * 5) - 2; }
  const fmt = (v,b) => {
    const d = v - b;
    if (d > 0) return `${v}<span class="plus"> (+${d})</span>`;
    if (d < 0) return `${v}<span class="minus"> (${d})</span>`;
    return `${v}<span class="zero"> (0)</span>`;
  };

  function simulate(t = 1){
    if (!currentBase) { alert("펫 이름을 먼저 입력하세요."); return; }
    if (resultBox) resultBox.value = "";
    let o = `${currentBase.name} 시뮬레이션 결과\n────────────────────\n`;
    for (let i = 1; i <= t; i++){
      const x = { HP: currentBase.hp + rand(), Atk: currentBase.atk + rand(), Def: currentBase.def + rand(), Agi: currentBase.agi + rand() };
      o += `${i}회차 → 체력 ${fmt(x.HP, currentBase.hp)} | 공격력 ${fmt(x.Atk, currentBase.atk)} | 방어력 ${fmt(x.Def, currentBase.def)} | 순발력 ${fmt(x.Agi, currentBase.agi)}\n`;
    }
    if (resultBox) resultBox.value = o.replace(/<[^>]+>/g,"");
  }

  const sim1 = document.getElementById("sim1");
  const sim5 = document.getElementById("sim5");
  const clearBtn = document.getElementById("clear");
  sim1 && (sim1.onclick = () => { simulate(1); totalCost += 1000; if (costDisplay) costDisplay.textContent = `💰 총 소모: ${totalCost.toLocaleString()}원`; });
  sim5 && (sim5.onclick = () => { simulate(5); totalCost += 5000; if (costDisplay) costDisplay.textContent = `💰 총 소모: ${totalCost.toLocaleString()}원`; });
  clearBtn && (clearBtn.onclick = () => { if (resultBox) resultBox.value = ""; totalCost = 0; if (costDisplay) costDisplay.textContent = "💰 총 소모: 0원"; });
}


/* =========================
   📘 경험치 계산기 (1~139)
========================= */
function initExpCalculator(){
  const EXP_TABLE = {
    1:2,2:6,3:17,4:37,5:67,6:111,7:169,8:247,9:344,10:464,
    11:609,12:783,13:985,14:1221,15:1491,16:1799,17:2145,18:2535,19:2968,20:3448,
    21:3977,22:4559,23:5193,24:5885,25:6635,26:7447,27:8321,28:9263,29:10272,30:11352,
    31:12506,32:13734,33:15042,34:16429,35:17899,36:19454,37:21098,38:22830,39:24656,40:26576,
    41:28594,42:30710,43:32930,44:35253,45:37683,46:40222,47:42874,48:45638,49:48520,50:51520,
    51:54642,52:57886,53:61258,54:64757,55:68387,56:72150,57:76050,58:80086,59:84264,60:106110,
    61:113412,62:121149,63:129352,64:138044,65:147256,66:157019,67:167366,68:178334,69:189958,
    70:202282,71:215348,72:229205,73:243901,74:259495,75:276041,76:293606,77:312258,78:332071,
    79:353126,80:375511,81:399318,82:424655,83:451631,84:480370,85:511007,86:543686,87:578571,
    88:616838,89:655680,90:698312,91:743970,92:795918,93:842442,94:901869,95:962553,96:1026899,
    97:1098354,98:1174419,99:1256664,100:1407463,101:1576358,102:1765521,103:1977384,104:2214670,
    105:2480430,106:2778082,107:3111451,108:3484825,109:3903005,110:4371365,111:4895929,
    112:5483440,113:6141453,114:6878428,115:7703839,116:8628300,117:9663695,118:10823339,
    119:12122140,120:13576796,121:15206012,122:17030733,123:19074421,124:21363352,125:23926954,
    126:26798189,127:30013971,128:33615648,129:37649526,130:42167469,131:47227565,132:52894873,
    133:59242257,134:66351328,135:74313488,136:83231106,137:93218839,138:104405100,139:116933712
  };

  function getTotalExp(s,t){
    let sum = 0;
    for (let lv = s; lv < t; lv++) if (EXP_TABLE[lv]) sum += EXP_TABLE[lv];
    return sum;
  }

  const runBtn = document.getElementById("run");
  const resetBtn = document.getElementById("reset");
  const fmtNum = n => isFinite(n) ? Number(n).toLocaleString() : "-";

  if (runBtn){
    runBtn.onclick = () => {
      try {
        const c = +document.getElementById('currentLevel').value;
        const cp = +(document.getElementById('currentPercent').value) || 0;
        const t = +document.getElementById('targetLevel').value;
        const ph = +document.getElementById('xpPerHour').value;
        if (!c || !t || !ph) throw new Error('입력이 부족합니다.');
        if (t <= c) throw new Error('목표 레벨은 현재보다 커야 합니다.');
        if (t > 139) throw new Error('최대 레벨은 139입니다.');
        const rem1 = (EXP_TABLE[c] || 0) * (1 - (cp / 100));
        const rem2 = getTotalExp(c+1, t);
        const remain = rem1 + rem2;
        const hrs = remain / ph;
        const days = hrs / 24;
        const H = Math.floor(hrs);
        const M = Math.round((hrs - H) * 60);
        document.getElementById('statRemain').textContent = fmtNum(Math.round(remain));
        document.getElementById('statHours').textContent = `${H}시간 ${M}분`;
        document.getElementById('statDays').textContent = days.toFixed(2) + " 일";
        document.getElementById('results').hidden = false;
      } catch (e) { alert(e.message); }
    };
  }

  if (resetBtn){
    resetBtn.onclick = () => {
      document.querySelectorAll('#expTab input').forEach(i => i.value = '');
      document.getElementById('results').hidden = true;
    };
  }
}


/* =========================
   🪄 강화 시뮬레이터
========================= */
// (생략 — 기존 동일)


/* =========================
   📊 성장률 계산기
========================= */
async function initGrowthCalculator(){
  let SPETS=[];
  try {
    const res = await fetch("https://raw.githubusercontent.com/atorazi/storazi.github.io/main/data/spet.json");
    SPETS = await res.json();
  } catch(e){
    console.error("성장률 데이터 불러오기 실패:", e);
  }

  const nameInput=document.getElementById("growthName");
  const resultBox=document.getElementById("growthResult");
  const runBtn=document.getElementById("growthRun");
  if (!runBtn) return;

  runBtn.onclick=()=>{
    const name=nameInput.value.trim().toLowerCase();
    if(!name){ resultBox.innerHTML="⚠️ 펫 이름을 입력하세요."; return; }

    const f=SPETS.find(x=>x.이름?.toLowerCase()===name || x.name?.toLowerCase()===name);
    if(!f){ resultBox.innerHTML=`❌ [${name}] 데이터를 찾을 수 없습니다.`; return; }

    const up=f["성장률(up)"]||{};
    resultBox.innerHTML=
      `<b>${f.이름||f.name} 성장률</b><br>
       체력(HP): ${up["내구력(HP)"]?.toFixed(2)||"-"}<br>
       공격력(Atk): ${up["공격력(Atk)"]?.toFixed(2)||"-"}<br>
       방어력(Def): ${up["방어력(Def)"]?.toFixed(2)||"-"}<br>
       순발력(Agi): ${up["순발력(Agi)"]?.toFixed(2)||"-"}`;
  };
}
