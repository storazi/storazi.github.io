document.addEventListener("DOMContentLoaded", () => {
  const pageKey = window.location.pathname.replace(/\W+/g, "_");
  fetch(`https://api.countapi.store/hit/storazi.github.io${pageKey}/visits`)
    .then(res => res.json())
    .then(d => document.getElementById("visitCounter").textContent =
      `🔹 방문자 수: ${d.value?.toLocaleString() ?? "???"}회`)
    .catch(() => document.getElementById("visitCounter").textContent = "😢");

  // 탭 전환
  const showTab = id => {
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-buttons button").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.getElementById(id==="simTab"?"tabSim":"tabExp").classList.add("active");
  };
  tabSim.onclick=()=>showTab("simTab");
  tabExp.onclick=()=>showTab("expTab");

  // 펫 데이터 로드 (GitHub Pages용 상대경로)
  async function loadPetData(){
    const base = "./data/";  // ✅ 수정됨
    try{
      const [pets,spet]=await Promise.all([
        fetch(base+"pets.json").then(r=>r.json()),
        fetch(base+"spet.json").then(r=>r.json())
      ]);
      console.log("✅ JSON 로드 완료:",pets.length,"/",spet.length);
      return {pets,spet};
    }catch(e){
      console.error("❌ JSON 불러오기 실패:",e);
      alert("펫 데이터를 불러오지 못했습니다. data 폴더 확인하세요.");
      return {pets:[],spet:[]};
    }
  }

  let PETS=[],SPETS=[],currentBase=null;
  const sgradeBox=document.getElementById("sgrade");
  const nameInput=document.getElementById("petName");
  const resultBox=document.getElementById("result");
  const costDisplay=document.getElementById("costDisplay");
  let totalCost=0;

  loadPetData().then(d=>{PETS=d.pets;SPETS=d.spet;});

  const safeName=o=>(o.name||o.이름||"").toLowerCase().trim();
  nameInput.onkeydown=e=>{if(e.key==="Enter")updatePet();};
  nameInput.onchange=updatePet;

  function updatePet(){
    const n=nameInput.value.trim().toLowerCase();
    const s=SPETS.find(x=>safeName(x)===n);
    if(!s){sgradeBox.innerHTML=`<b style="color:#ff6b81">⚠️ [${n}] 데이터 없음</b>`;currentBase=null;return;}
    const stat=s["초기치(stat)"];
    currentBase={name:s.이름,hp:stat["내구력(HP)"],atk:stat["공격력(Atk)"],def:stat["방어력(Def)"],agi:stat["순발력(Agi)"]};
    sgradeBox.innerHTML=`<b>${currentBase.name} S급 기준</b><br>체력 <b>${currentBase.hp}</b> | 공격력 <b>${currentBase.atk}</b> | 방어력 <b>${currentBase.def}</b> | 순발력 <b>${currentBase.agi}</b>`;
  }

  function rand(){return Math.floor(Math.random()*5)-2;}
  const fmt=(v,b)=>{
    const d=v-b;
    if(d>0)return`${v}<span class="plus"> (+${d})</span>`;
    if(d<0)return`${v}<span class="minus"> (${d})</span>`;
    return`${v}<span class="zero"> (0)</span>`;
  };

  function simulate(t=1){
    if(!currentBase){alert("펫 이름을 먼저 입력하세요.");return;}
    resultBox.innerHTML="";
    let o=`\n<b>${currentBase.name} 시뮬레이션</b>\n────────────────────\n`;
    for(let i=1;i<=t;i++){
      const x={HP:currentBase.hp+rand(),Atk:currentBase.atk+rand(),Def:currentBase.def+rand(),Agi:currentBase.agi+rand()};
      o+=`<b>${i}회차</b> → 체력 ${fmt(x.HP,currentBase.hp)} | 공격력 ${fmt(x.Atk,currentBase.atk)} | 방어력 ${fmt(x.Def,currentBase.def)} | 순발력 ${fmt(x.Agi,currentBase.agi)}\n`;
    }
    resultBox.innerHTML=o;
  }

  sim1.onclick=()=>{simulate(1);totalCost+=1000;costDisplay.textContent=`💰 총 소모: ${totalCost.toLocaleString()}원`;};
  sim5.onclick=()=>{simulate(5);totalCost+=5000;costDisplay.textContent=`💰 총 소모: ${totalCost.toLocaleString()}원`;};
  clear.onclick=()=>{resultBox.innerHTML="";totalCost=0;costDisplay.textContent="💰 총 소모: 0원";};
});
