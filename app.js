// ✅ 탭 전환
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
  const tabEl = document.getElementById(tabId);
  const btnEl = document.querySelector(`#tab${tabId.replace("Tab","")}`);
  if (tabEl) tabEl.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  // 탭 버튼
  document.getElementById('tabSim').addEventListener('click',()=>switchTab('simTab'));
  document.getElementById('tabExp').addEventListener('click',()=>switchTab('expTab'));
  document.getElementById('tabEnhance').addEventListener('click',()=>switchTab('enhanceTab'));

  // 방문자 카운터
  fetch("https://api.countapi.xyz/hit/storazi.github.io_/visits")
    .then(r=>r.json())
    .then(d=>{
      document.getElementById('visitCounter').textContent=`👀 총 방문자 수: ${d.value.toLocaleString()}명`;
    })
    .catch(()=>document.getElementById('visitCounter').textContent="⚠️ 방문자 수 불러오기 실패");

  initEnhanceSimulator();
});


// ✅ 강화 시뮬레이터
function initEnhanceSimulator(){
  const upgradeData=[
    { level:1,success:1.00,break:0.00,cost:35000 },
    { level:2,success:0.80,break:0.00,cost:59800 },
    { level:3,success:0.60,break:0.00,cost:106400 },
    { level:4,success:0.50,break:0.00,cost:152710 },
    { level:5,success:0.40,break:0.60,cost:273630 },
    { level:6,success:0.40,break:0.60,cost:468530 },
    { level:7,success:0.30,break:0.70,cost:552800 },
    { level:8,success:0.20,break:0.80,cost:698470 },
    { level:9,success:0.20,break:0.80,cost:857200 },
    { level:10,success:0.10,break:0.90,cost:1195390 }
  ];

  let level=0,totalCost=0;
  let selectedCube={rate:0,mult:1};
  let selectedBooster=0;
  let currentEquip="weapon";

  const levelEl=document.getElementById('level');
  const resultEl=document.getElementById('resultEnh');
  const totalCostEl=document.getElementById('totalCost');
  const statusEl=document.getElementById('status');
  const outputBox=document.getElementById('enhanceOutput');

  // ✅ 로그 → 출력창에만 표시 (log-box 사용 안 함)
  const addLog=(text)=>{
    if(outputBox){
      outputBox.value += text + "\n";
      outputBox.scrollTop = outputBox.scrollHeight;
    }
  };

  function resetAll(bySwitch){
    level=0; totalCost=0;
    levelEl.textContent="현재 강화 단계: +0";
    resultEl.textContent="";
    statusEl.textContent="";
    totalCostEl.textContent="0 S";
    if(outputBox) outputBox.value="";
    if(bySwitch) addLog(`장비 변경됨: ${currentEquip==='weapon'?'⚔️ 무기':'🛡 방어구'}`);
  }

  // ✅ 단일 강화 시도
  function upgradeOnce(){
    if(level>=10){ return; }
    const data=upgradeData[level];
    const successRate=Math.min(1,data.success+selectedCube.rate+selectedBooster);
    const destroyRate=data.break;
    const cost=data.cost*selectedCube.mult;
    totalCost+=cost;
    const roll=Math.random();

    if(roll<=successRate){
      level++;
      addLog(`[${currentEquip}] +${level-1} ▶ +${level} 강화 성공`);
    }else if(roll<=successRate+(1-successRate)*destroyRate){
      level=0;
      addLog(`[${currentEquip}] 강화 실패 → 장비 파괴`);
    }else{
      addLog(`[${currentEquip}] +${level} 강화 실패`);
    }

    levelEl.textContent=`현재 강화 단계: +${level}`;
    totalCostEl.textContent=totalCost.toLocaleString()+" S";
    statusEl.textContent=`성공확률 ${(successRate*100).toFixed(1)}% | 파괴확률 ${(destroyRate*100).toFixed(0)}% | 소모 ${cost.toLocaleString()} S`;
  }

  // ✅ 목표 강화 시뮬레이션 (결과는 출력창에만)
  async function simulateTarget(target){
    let totalSpent=0;
    const start=performance.now();

    let tempLevel=0;
    while(tempLevel<target){
      const d=upgradeData[tempLevel];
      const rate=Math.min(1,d.success+selectedCube.rate+selectedBooster);
      const destroy=d.break;
      const cost=d.cost*selectedCube.mult;
      totalSpent+=cost;
      const roll=Math.random();
      if(roll<=rate){ tempLevel++; }
      else if(roll<=rate+(1-rate)*destroy){ tempLevel=0; }
    }

    const end=performance.now();
    const msg=`[${currentEquip}] 목표 +${target} 강화 성공 (총 ${totalSpent.toLocaleString()} S, ${(end-start).toFixed(1)}ms)`;

    // 중복 제거 후 추가
    if(outputBox){
      const lines=outputBox.value.split("\n").filter(l=>!l.includes(`+${target}까지 누적`));
      lines.push(`🎯 +${target}까지 누적 소모: ${totalSpent.toLocaleString()} S`);
      outputBox.value=lines.join("\n");
      outputBox.scrollTop=outputBox.scrollHeight;
    }

    resultEl.textContent=""; // 버튼 아래 결과 제거
    totalCostEl.textContent=totalSpent.toLocaleString()+" S";
  }

  // ✅ 버튼 이벤트
  document.querySelectorAll('.cube').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('.cube').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCube.rate=parseFloat(btn.dataset.rate);
      selectedCube.mult=parseFloat(btn.dataset.mult);
    };
  });

  document.querySelectorAll('.booster').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('.booster').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedBooster=parseFloat(btn.dataset.bonus);
    };
  });

  document.querySelectorAll('.equip').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('.equip').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      currentEquip=btn.dataset.type;
      resetAll(true);
    };
  });

  document.getElementById('upgradeBtn').onclick=()=>upgradeOnce();
  document.getElementById('resetBtn').onclick=()=>resetAll(false);
  document.getElementById('sim6').onclick=()=>simulateTarget(6);
  document.getElementById('sim8').onclick=()=>simulateTarget(8);
  document.getElementById('sim10').onclick=()=>simulateTarget(10);
}
