(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const d of t.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();const m="wordbook";function s(){const c=localStorage.getItem(m);return c?JSON.parse(c):[]}function i(c){localStorage.setItem(m,JSON.stringify(c))}let a="card";function l(c){const r=document.getElementById("list");if(r.innerHTML="",c.length===0){r.innerHTML="<p style='text-align:center;color:#999;'>まだ何も追加されていません</p>";return}if(a==="table"){const o=document.createElement("table");o.style.width="100%",o.style.borderCollapse="collapse",o.innerHTML=`
      <thead>
        <tr>
          <th style="text-align:left;border-bottom:1px solid #ccc;">英語文</th>
          <th style="text-align:left;border-bottom:1px solid #ccc;">訳・メモ</th>
          <th style="border-bottom:1px solid #ccc;"></th>
        </tr>
      </thead>
      <tbody></tbody>
    `;const n=o.querySelector("tbody");c.forEach(e=>{const t=document.createElement("tr");t.innerHTML=`
        <td style="padding:6px;">${e.sentence}</td>
        <td style="padding:6px;color:#777;font-style:italic;">${e.note}</td>
        <td style="text-align:right;padding:6px;">
          <button class="delete-btn" data-id="${e.id}">✕</button>
        </td>
      `,n.appendChild(t)}),r.appendChild(o)}else c.forEach(o=>{const n=document.createElement("div");n.className="card";const e=document.createElement("div");e.className="sentence",e.textContent=o.sentence;const t=document.createElement("div");t.className="note",t.textContent=o.note;const d=document.createElement("button");d.className="delete-btn",d.textContent="✕",d.addEventListener("click",()=>{const u=c.filter(p=>p.id!==o.id);i(u),l(u)}),n.appendChild(e),n.appendChild(t),n.appendChild(d),r.appendChild(n)});r.querySelectorAll(".delete-btn").forEach(o=>{o.addEventListener("click",()=>{const n=Number(o.dataset.id),e=c.filter(t=>t.id!==n);i(e),l(e)})})}function f(){const c=document.getElementById("sentence"),r=document.getElementById("note"),o=document.getElementById("add-btn");let n=s();l(n),o.addEventListener("click",()=>{const e=c.value.trim(),t=r.value.trim();if(!e)return;n=[{id:Date.now(),sentence:e,note:t,createdAt:new Date().toISOString()},...n],i(n),l(n),c.value="",r.value="",c.focus()}),document.getElementById("table-view-btn")?.addEventListener("click",()=>{a="table",l(s())}),document.getElementById("card-view-btn")?.addEventListener("click",()=>{a="card",l(s())})}f();
