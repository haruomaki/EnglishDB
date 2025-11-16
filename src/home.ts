interface Sentence {
  id: number;
  sentence: string;
  note: string;
  createdAt: string;
}

const STORAGE_KEY = "wordbook";

function loadSentences(): Sentence[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveSentences(list: Sentence[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
let currentView: "card" | "table" = "card";

function createList(list: Sentence[]): HTMLDivElement | null {
  const container = document.createElement("div");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#999;'>まだ何も追加されていません</p>";
    return null;
  }

  if (currentView === "table") {
    // テーブル形式
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    table.innerHTML = `
      <thead>
        <tr>
          <th style="text-align:left;border-bottom:1px solid #ccc;">英語文</th>
          <th style="text-align:left;border-bottom:1px solid #ccc;">訳・メモ</th>
          <th style="border-bottom:1px solid #ccc;"></th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody")!;

    list.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding:6px;">${item.sentence}</td>
        <td style="padding:6px;color:#777;font-style:italic;">${item.note}</td>
        <td style="text-align:right;padding:6px;">
          <button class="edit-btn" data-id="${item.id}">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    container.appendChild(table);
  } else {
    // これまでのカード表示
    list.forEach((item) => {
      container.appendChild(createNormalCard(item));
    });
  }

  return container;
}

function refreshList() {
  document.querySelector("#list")?.replaceChildren(...createList(loadSentences())!.children);
}

// // 入力フィールドを作成
// function createInput(value: string): HTMLInputElement {
//   const input = document.createElement("input");
//   input.type = "text";
//   input.value = value;
//   input.className = "edit-input";
//   return input;
// }

// 通常カードを生成する
function createNormalCard(item: Sentence): HTMLElement {
  const card = html`
    <div class="card">
      <div class="card-text">
        <div class="sentence">${item.sentence}</div>
        <div class="note">${item.note}</div>
      </div>
      <div class="card-ui">
        <button class="edit-btn">🖊</button>
        <br>
        <button class="move-up">↑</button>
        <button class="move-down">↓</button>
      </div>
    </div>
  `;

  // 編集ボタンクリック時
  card.querySelector(".edit-btn")?.addEventListener("click", () => {
    card.replaceWith(createEditCard(item));
  });

  return card;
}

// 編集カードを生成する
function createEditCard(item: Sentence): HTMLElement {
  return html`
    <div class="card">
      <p><input value=${item.sentence}></p>
      <p><input value=${item.note}></p>
    </div>
  `;
}

export function createHome(): HTMLDivElement {
  const home = document.createElement("div");
  home.innerHTML = `
    <h1>英語短文ノート</h1>

    <section class="form-section">
      <input id="sentence" type="text" placeholder="英語文を入力" />
      <input id="note" type="text" placeholder="メモ（日本語訳など）" />
      <button id="add-btn">追加</button>
    </section>

    <div class="view-switch">
      <button id="table-view-btn">テーブル表示</button>
      <button id="card-view-btn">カード表示</button>
      <button id="flashcard-link">単語帳モードへ</button>
      <button id="export-json-btn">JSONエクスポート</button>
    </div>

    <section id="list" class="list-section"></section>
  `;

  const sentenceInput = home.querySelector("#sentence") as HTMLInputElement;
  const noteInput = home.querySelector("#note") as HTMLInputElement;

  let list = loadSentences();
  home.querySelector("#list")?.replaceChildren(...createList(list)!.children);

  function ONCLICK(id: string, f: (ev: MouseEvent) => void) {
    const el = home.querySelector("#" + id)! as HTMLElement;
    el.addEventListener("click", f);
  };

  ONCLICK("add-btn", () => {
    const sentence = sentenceInput.value.trim();
    const note = noteInput.value.trim();
    if (!sentence) return;

    const newItem: Sentence = {
      id: Date.now(),
      sentence,
      note,
      createdAt: new Date().toISOString(),
    };

    list = [newItem, ...list];
    saveSentences(list);
    refreshList();

    sentenceInput.value = "";
    noteInput.value = "";
    sentenceInput.focus();
  });

  // テーブル表示へ
  ONCLICK("table-view-btn", () => {
    currentView = "table";
    refreshList();
  });

  // カード表示へ
  ONCLICK("card-view-btn", () => {
    currentView = "card";
    refreshList();
  });

  // 単語カードページへ移動
  ONCLICK("flashcard-link", () => {
    window.location.href = import.meta.env.BASE_URL + "/flashcard.html";
  });

  // JSONをエクスポート
  ONCLICK("export-json-btn", () => {
    const list = loadSentences();
    if (list.length === 0) {
      alert("まだデータがありません。");
      return;
    }

    const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(4, "0");
    const d = String(now.getDate()).padStart(2, "0");

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wordbook_${y}${m}${d}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  return home;
}
