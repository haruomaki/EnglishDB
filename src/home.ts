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

/**
 * 指定した親要素の子ノード同士を入れ替えます。
 * i, j には 0 以上 parentElement.children.length 未満の整数を指定してください。
 *
 * @param parentElement 子要素を入れ替える対象となる親要素
 * @param i 入れ替えたい最初の子要素のインデックス
 * @param j 入れ替えたいもう一方の子要素のインデックス
 * @returns 成功時は true、インデックスが不正な場合は false
 */
function swapChildElements(
  parentElement: HTMLElement,
  i: number,
  j: number
): boolean {
  const children = parentElement.children;
  const child1 = children.item(i);
  const child2 = children.item(j);
  if (!child1 || !child2) {
    console.error("指定されたインデックスの子要素が存在しません。");
    return false;
  }

  const placeholder = document.createElement("div");
  child1.replaceWith(placeholder);
  child2.replaceWith(child1);
  placeholder.replaceWith(child2);

  return true;
}

// カードを生成する
function createCards(list: db.Sentence[]) {
  // カードの外殻を個数分作成。
  list.forEach(() => {
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
      const index = [...card.parentElement!.children].indexOf(card);
      db.swap(index, index - 1);
      swapChildElements(card.parentElement!, index, index - 1);
    });

    card.querySelector(".move-down")?.addEventListener("click", () => {
      const index = [...card.parentElement!.children].indexOf(card);
      db.swap(index, index + 1);
      swapChildElements(card.parentElement!, index, index + 1);
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
  const record = db.load()[index];

  if (mode === "normal") {
    const newCardTop = html`
      <div class="card-top">
        <div class="text-section">
          <div class="sentence">${record.sentence}</div>
          <div class="note">${record.note}</div>
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
        <input type="text" name="sentence" value=${record.sentence}>
        <br>
        <input type="text" name="note" value=${record.note}>
      </div>
      <div class="ui-section">
        <button class="save-btn">💾</button>
      </div>
    </div>
  `;

    // 保存ボタンクリック時
    newCardTop.querySelector(".save-btn")?.addEventListener("click", () => {
      const new_sentence = newCardTop.querySelector<HTMLInputElement>('input[name="sentence"]')!.value;
      const new_note = newCardTop.querySelector<HTMLInputElement>('input[name="note"]')!.value;

      // データベースを更新。
      db.modify(index, new_sentence, new_note);

      createCardTop(index, "normal");
    });

    cardTop.replaceWith(newCardTop);
  } else {
    throw Error("modeが不正な値です。");
  }
}

export function createHome() {
  const home = html`
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

  // カード一覧生成
  createList();

  const sentenceInput = home.querySelector("#sentence") as HTMLInputElement;
  const noteInput = home.querySelector("#note") as HTMLInputElement;

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

    // TODO: データベース操作関数（addとか）に置き換え
    const list = [newItem, ...db.load()];
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
