import { onclick } from "./utils";

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

function renderList(list: Sentence[]) {
    const container = document.getElementById("list")!;
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

        list.forEach((item) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td style="padding:6px;">${item.sentence}</td>
        <td style="padding:6px;color:#777;font-style:italic;">${item.note}</td>
        <td style="text-align:right;padding:6px;">
          <button class="delete-btn" data-id="${item.id}">✕</button>
        </td>
      `;
            tbody.appendChild(tr);
        });

        container.appendChild(table);
    } else {
        // これまでのカード表示
        list.forEach((item) => {
            const div = document.createElement("div");
            div.className = "card";

            const sentence = document.createElement("div");
            sentence.className = "sentence";
            sentence.textContent = item.sentence;

            const note = document.createElement("div");
            note.className = "note";
            note.textContent = item.note;

            const del = document.createElement("button");
            del.className = "delete-btn";
            del.textContent = "✕";
            del.addEventListener("click", () => {
                const newList = list.filter((s) => s.id !== item.id);
                saveSentences(newList);
                renderList(newList);
            });

            div.appendChild(sentence);
            div.appendChild(note);
            div.appendChild(del);
            container.appendChild(div);

            // カードをクリックしたとき
            div.addEventListener("click", () => {
                console.log("カードをクリック！");
            });
        });
    }

    // 削除ボタン（テーブル表示用）
    container.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLButtonElement).dataset.id);
            const newList = list.filter((s) => s.id !== id);
            saveSentences(newList);
            renderList(newList);
        });
    });
}

export function renderHome() {
    const sentenceInput = document.getElementById("sentence") as HTMLInputElement;
    const noteInput = document.getElementById("note") as HTMLInputElement;

    let list = loadSentences();
    renderList(list);

    onclick("add_btn", () => {
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
        renderList(list);

        sentenceInput.value = "";
        noteInput.value = "";
        sentenceInput.focus();
    });

    // テーブル表示へ
    onclick("table-view-btn", () => {
        currentView = "table";
        renderList(loadSentences());
    });

    // カード表示へ
    onclick("card-view-btn", () => {
        currentView = "card";
        renderList(loadSentences());
    });

    // 単語カードページへ移動
    onclick("flashcard-link", () => {
        window.location.href = import.meta.env.BASE_URL + "/flashcard.html";
    });

    // JSONをエクスポート
    onclick("export-json-btn", () => {
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
}
