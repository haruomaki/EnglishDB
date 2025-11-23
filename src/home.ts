import arrow from "../images/arrow.svg?raw";
import * as db from "./database";

let currentView: "card" | "table" = "card";

/**
 * 単語一覧を作成（or更新）する。
 */
function createList() {
  const list = db.load();
  const container = document.createElement("div");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#999;'>まだ何も追加されていません</p>";
    return;
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

    list.forEach((sentence) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding:6px;">${sentence.sentence}</td>
        <td style="padding:6px;color:#777;font-style:italic;">${sentence.note}</td>
        <td style="text-align:right;padding:6px;">
          <button class="edit-btn" data-id="${sentence.id}">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    container.appendChild(table);
  } else {
    // これまでのカード表示
    createCards(list);
    return;
  }

  document.querySelector("#list")!.replaceChildren(...container.children);
}

function swapInPlace<T>(array: T[], i: number, j: number): boolean {
  if (i !== j && 0 <= i && i < array.length && 0 <= j && j < array.length) {
    [array[i], array[j]] = [array[j], array[i]];
    return true;
  }
  return false;
}

/**
 * データベースの内容に合わせてカードの中身を更新する。
 */
function syncCard() {
  const cards = document.querySelector("#list")!.children;
  const list = db.load();

  if (cards.length !== list.length) throw Error("データベースと表示部の長さが合っていません");

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    card.querySelector(".sentence")!.textContent = list[i].sentence;
    card.querySelector(".note")!.textContent = list[i].note;
  }
}

// カードを生成する
function createCards(list: db.Sentence[]) {
  // カードの外殻を個数分作成。
  list.forEach((_, index) => {
    const card = html`
      <div class="card">
        <div class="card-top"></div>
        <div class="card-bottom">
          <button class="move-up"><span>${raw(arrow)}</span></button>
          <button class="move-down"><span>${raw(arrow)}</span></button>
        </div>
      </div>
    `;

    // 上下ボタンクリック時
    card.querySelector(".move-up")?.addEventListener("click", () => {
      const list = db.load();
      swapInPlace(list, index, index - 1);
      db.save(list);
      syncCard();
    });

    card.querySelector(".move-down")?.addEventListener("click", () => {
      const list = db.load();
      swapInPlace(list, index, index + 1);
      db.save(list);
      syncCard();
    });

    document.querySelector("#list")!.appendChild(card);
  });

  // 各カードのcard-top部を生成。
  list.forEach((_, index) => {
    createCardTop(index, "normal");
  });
}

function createCardTop(index: number, mode: "normal" | "edit") {
  const cards = document.querySelector("#list")!.children;
  const cardTop = cards[index].querySelector(".card-top")!;

  if (mode === "normal") {
    const newCardTop = html`
      <div class="card-top">
        <div class="text-section">
          <div class="sentence"></div>
          <div class="note"></div>
        </div>
        <div class="ui-section">
          <button class="edit-btn">🖊</button>
        </div>
      </div>
    `;

    // 編集ボタンクリック時
    newCardTop.querySelector(".edit-btn")?.addEventListener("click", () => {
      createCardTop(index, "edit");
    });

    cardTop.replaceWith(newCardTop);
  } else if (mode === "edit") {
    const newCardTop = html`
    <div class="card-top">
      <div class="text-section">
        <input class="sentence">
        <br>
        <input class="note">
      </div>
      <div class="ui-section">
        <button class="edit-btn">💾</button>
      </div>
    </div>
  `;
    cardTop.replaceWith(newCardTop);
  } else {
    throw Error("modeが不正な値です。");
  }
}

export function createHome() {
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

  // 雛形をdocumentに反映させたあと、それを編集する形で画面を構築していく。
  document.getElementById("app")?.replaceChildren(...home.children);

  const sentenceInput = home.querySelector("#sentence") as HTMLInputElement;
  const noteInput = home.querySelector("#note") as HTMLInputElement;

  // TODO: listの読み込み位置はここでなくてよい
  let list = db.load();
  console.log(list);
  createList();
  syncCard();

  function ONCLICK(id: string, f: (ev: MouseEvent) => void) {
    const el = document.querySelector("#" + id)! as HTMLElement;
    el.addEventListener("click", f);
  };

  ONCLICK("add-btn", () => {
    const sentence = sentenceInput.value.trim();
    const note = noteInput.value.trim();
    if (!sentence) return;

    const newItem: db.Sentence = {
      id: Date.now(),
      sentence,
      note,
      createdAt: new Date().toISOString(),
    };

    list = [newItem, ...list];
    db.save(list);
    createList();

    sentenceInput.value = "";
    noteInput.value = "";
    sentenceInput.focus();
  });

  // テーブル表示へ
  ONCLICK("table-view-btn", () => {
    currentView = "table";
    createList();
  });

  // カード表示へ
  ONCLICK("card-view-btn", () => {
    currentView = "card";
    createList();
  });

  // 単語カードページへ移動
  ONCLICK("flashcard-link", () => {
    window.location.href = import.meta.env.BASE_URL + "/flashcard.html";
  });

  // JSONをエクスポート
  ONCLICK("export-json-btn", () => {
    const list = db.load();
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
}
