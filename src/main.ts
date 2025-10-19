import "./style.css"

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

function renderList(list: Sentence[]) {
  const container = document.getElementById("list")!;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#999;'>まだ何も追加されていません</p>";
    return;
  }

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
  });
}

function setup() {
  const sentenceInput = document.getElementById("sentence") as HTMLInputElement;
  const noteInput = document.getElementById("note") as HTMLInputElement;
  const addBtn = document.getElementById("add-btn")!;

  let list = loadSentences();
  renderList(list);

  addBtn.addEventListener("click", () => {
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
}

setup();
