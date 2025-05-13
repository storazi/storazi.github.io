window.addEventListener("DOMContentLoaded", () => {
    let currentFontSize = 100;
  
    function getSelectedData() {
      return document.getElementById("petType").value === "reborn" ? rebornPets : normalPets;
    }
  
    function isOldPet(name) {
      return oldPetList.includes(name.trim().toLowerCase());
    }
  
    function displayPets(data) {
      const modal = document.getElementById("modalOverlay");
      const results = document.getElementById("results");
  
      if (!data || !data.length) {
        results.innerHTML = "❌ 결과 없음";
      } else {
        const isReborn = document.getElementById("petType").value === "reborn";
  
        data = [...data].sort((a, b) => parseFloat(b["총 성장률"] || 0) - parseFloat(a["총 성장률"] || 0));
        results.innerHTML = data.map(p => `
          <div class="pet-block">
            <strong>${p["이름"]}${isReborn ? "" : isOldPet(p["이름"]) ? " (구펫)" : " (신펫)"}</strong><br>
            속성: ${p["속성1"] || ""}${p["속성2"] ? "/" + p["속성2"] : ""}<br>
            ⚔️ 공격력: ${p["공격력 성장률"].toFixed(3)} |
            🛡️ 방어력: ${p["방어력 성장률"].toFixed(3)} |
            🏃 순발력: ${p["순발력 성장률"].toFixed(3)} |
            ❤️ 체력: ${p["체력 성장률"].toFixed(3)}<br>
            🌟 총 성장률: ${p["총 성장률"].toFixed(3)}<br>
            📦 획득처: ${p["획득처"] || "정보 없음"}
          </div>
        `).join("");
      }
  
      modal.style.display = "flex";
    }
  
    function parseRange(val) {
      if (!val) return null;
      val = val.trim();
      if (val.includes('-')) return val.split('-').map(Number);
      if (val.includes('±')) {
        const [base, range] = val.split('±').map(parseFloat);
        return [base - range, base + range];
      }
      const num = parseFloat(val);
      return [num - 0.1, num + 0.1];
    }
  
    function advancedSearch() {
      const pets = getSelectedData();
      const atk = parseRange(document.getElementById("atk").value);
      const def = parseRange(document.getElementById("def").value);
      const spd = parseRange(document.getElementById("spd").value);
      const hp = parseRange(document.getElementById("hp").value);
      const total = parseRange(document.getElementById("total").value);
  
      let result = pets;
  
      if (atk) result = result.filter(p => p["공격력 성장률"] >= atk[0] && p["공격력 성장률"] <= atk[1]);
      if (def) result = result.filter(p => p["방어력 성장률"] >= def[0] && p["방어력 성장률"] <= def[1]);
      if (spd) result = result.filter(p => p["순발력 성장률"] >= spd[0] && p["순발력 성장률"] <= spd[1]);
      if (hp) result = result.filter(p => p["체력 성장률"] >= hp[0] && p["체력 성장률"] <= hp[1]);
      if (total) result = result.filter(p => p["총 성장률"] >= total[0] && p["총 성장률"] <= total[1]);
  
      const limit = parseInt(document.getElementById("limitCount")?.value) || result.length;
      result = result.sort((a, b) => b["총 성장률"] - a["총 성장률"]).slice(0, limit);
      displayPets(result);
    }
  
    function comparePets() {
      const pets = getSelectedData();
      const names = [1, 2, 3, 4, 5].map(i => document.getElementById(`compare${i}`).value.trim().toLowerCase()).filter(Boolean);
      const selected = names.map(name => pets.find(p => p["이름"] && p["이름"].toLowerCase() === name)).filter(Boolean);
  
      if (selected.length < 2) {
        alert("비교할 페트를 2개 이상 입력하세요.");
        return;
      }
  
      const keys = ["공격력 성장률", "방어력 성장률", "순발력 성장률", "체력 성장률", "총 성장률"];
      let html = '<table border="1" style="width:100%;text-align:center;"><tr><th>항목</th>' + selected.map(p => `<th>${p["이름"]}</th>`).join('') + '</tr>';
      keys.forEach(k => {
        html += `<tr><td>${k}</td>` + selected.map(p => `<td>${p[k].toFixed(3)}</td>`).join('') + '</tr>';
      });
      html += '</table>';
      document.getElementById("results").innerHTML = html;
      document.getElementById("modalOverlay").style.display = "flex";
    }
  
        // 이벤트 연결
        document.getElementById("nameSearchBtn").addEventListener("click", () => {
          const keyword = document.getElementById('nameSearch').value.trim().toLowerCase();
          const pets = getSelectedData();
          const filtered = keyword === "" ? pets : pets.filter(p => p["이름"] && p["이름"].toLowerCase().includes(keyword));
          displayPets(filtered);
        });
    
        // Enter 키로 이름 검색
        document.getElementById("nameSearch").addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("nameSearchBtn").click();
          }
        });
    
        document.getElementById("filterBtn").addEventListener("click", advancedSearch);
        document.getElementById("compareBtn").addEventListener("click", comparePets);
        document.getElementById("modalCloseBtn").addEventListener("click", () => {
          document.getElementById("modalOverlay").style.display = "none";
        });
    
        // 확대/축소 기능
        const zoomInBtn = document.getElementById("zoomInBtn");
        const zoomOutBtn = document.getElementById("zoomOutBtn");
        const modal = document.getElementById("modalContent");
    
        if (zoomInBtn) {
          zoomInBtn.addEventListener("click", () => {
            currentFontSize += 10;
            modal.style.fontSize = currentFontSize + '%';
          });
        }
    
        if (zoomOutBtn) {
          zoomOutBtn.addEventListener("click", () => {
            currentFontSize = Math.max(50, currentFontSize - 10);
            modal.style.fontSize = currentFontSize + '%';
          });
        }
    
        modal.style.fontSize = currentFontSize + '%';
    
  });
  