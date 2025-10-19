import"./modulepreload-polyfill-B5Qt9EMX.js";const g="wordbook";function i(){const n=localStorage.getItem(g);return n?JSON.parse(n):[]}function u(n){localStorage.setItem(g,JSON.stringify(n))}let p="card";function a(n){const l=document.getElementById("list");if(l.innerHTML="",n.length===0){l.innerHTML="<p style='text-align:center;color:#999;'>まだ何も追加されていません</p>";return}if(p==="table"){const o=document.createElement("table");o.style.width="100%",o.style.borderCollapse="collapse",o.innerHTML=`
      <thead>
        <tr>
          <th style="text-align:left;border-bottom:1px solid #ccc;">英語文</th>
          <th style="text-align:left;border-bottom:1px solid #ccc;">訳・メモ</th>
          <th style="border-bottom:1px solid #ccc;"></th>
        </tr>
      </thead>
      <tbody></tbody>
    `;const t=o.querySelector("tbody");n.forEach(e=>{const d=document.createElement("tr");d.innerHTML=`
        <td style="padding:6px;">${e.sentence}</td>
        <td style="padding:6px;color:#777;font-style:italic;">${e.note}</td>
        <td style="text-align:right;padding:6px;">
          <button class="delete-btn" data-id="${e.id}">✕</button>
        </td>
      `,t.appendChild(d)}),l.appendChild(o)}else n.forEach(o=>{const t=document.createElement("div");t.className="card";const e=document.createElement("div");e.className="sentence",e.textContent=o.sentence;const d=document.createElement("div");d.className="note",d.textContent=o.note;const c=document.createElement("button");c.className="delete-btn",c.textContent="✕",c.addEventListener("click",()=>{const s=n.filter(m=>m.id!==o.id);u(s),a(s)}),t.appendChild(e),t.appendChild(d),t.appendChild(c),l.appendChild(t)});l.querySelectorAll(".delete-btn").forEach(o=>{o.addEventListener("click",()=>{const t=Number(o.dataset.id),e=n.filter(d=>d.id!==t);u(e),a(e)})})}function y(){const n=document.getElementById("sentence"),l=document.getElementById("note"),o=document.getElementById("add-btn");let t=i();a(t),o.addEventListener("click",()=>{const e=n.value.trim(),d=l.value.trim();if(!e)return;t=[{id:Date.now(),sentence:e,note:d,createdAt:new Date().toISOString()},...t],u(t),a(t),n.value="",l.value="",n.focus()}),document.getElementById("table-view-btn")?.addEventListener("click",()=>{p="table",a(i())}),document.getElementById("card-view-btn")?.addEventListener("click",()=>{p="card",a(i())}),document.getElementById("flashcard-link")?.addEventListener("click",()=>{window.location.href="/EnglishDB/flashcard.html"}),document.getElementById("export-json-btn")?.addEventListener("click",()=>{const e=i();if(e.length===0){alert("まだデータがありません。");return}const d=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),c=new Date,s=c.getFullYear(),m=String(c.getMonth()+1).padStart(4,"0"),h=String(c.getDate()).padStart(2,"0"),b=URL.createObjectURL(d),r=document.createElement("a");r.href=b,r.download=`wordbook_${s}${m}${h}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(b)})}y();
