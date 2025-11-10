/* =========================
   🪄 강화 시뮬레이터
========================= */
function initEnhanceSimulator(){
  const upgradeData=[
    { level:1,success:1.00,break:0.00,cost:35000 },
    { level:2,success:0.80,break:0.00,cost:59800 },
    { level:3,success:0.60,break:0.00,cost:106400 },
    { level:4,success:0.50,break:1.00,cost:152710 },  // 4강 이상부터 파괴 100%
    { level:5,success:0.40,break:1.00,cost:273630 },
    { level:6,success:0.40,break:1.00,cost:468530 },
    { level:7,success:0.30,break:1.00,cost:552800 },
    { level:8,success:0.20,break:1.00,cost:698470 },
    { level:9,success:0.20,break:1.00,cost:857200 },
    { level:10,success:0.10,break:1.00,cost:1195390 }
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

  const getEquipName = () => currentEquip === "weapon" ? "무기" : "방어구";

  const addLog=(text)=>{
    if(outputBox){
      if(!outputBox.value) outputBox.value = text;
      else outputBox.value += "\n" + text;
      outputBox.scrollTop = outputBox.scrollHeight;
    }
  };

  function resetAll(bySwitch){
    level=0; totalCost=0;
    if(levelEl) levelEl.textContent="현재 강화 단계: +0";
    if(resultEl) resultEl.textContent="";
    if(statusEl) statusEl.textContent="";
    if(totalCostEl) totalCostEl.textContent="0 S";
    if(outputBox) outputBox.value="";
    if(bySwitch) addLog(`장비 변경됨: ${getEquipName()}`);
  }

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
      addLog(`⚔️ ${getEquipName()} +${level-1} ▶ +${level} 강화 성공`);
    }else{
      if(level>=4){  // 4강 이상부터는 무조건 파괴
        level=0;
        addLog(`💥 ${getEquipName()} 강화 실패 → 장비 파괴`);
      }else{
        addLog(`💢 ${getEquipName()} +${level} 강화 실패`);
      }
    }

    if(levelEl) levelEl.textContent=`현재 강화 단계: +${level}`;
    if(totalCostEl) totalCostEl.textContent=totalCost.toLocaleString()+" S";
    if(statusEl) statusEl.textContent=`성공확률 ${(successRate*100).toFixed(1)}% | 파괴확률 ${(destroyRate*100).toFixed(0)}% | 소모 ${cost.toLocaleString()} S`;
  }

  // 이하 동일 ...
}
