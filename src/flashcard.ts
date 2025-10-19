import "./flashcard.css"

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

const list = loadSentences();
let index = 0;

const sentenceEl = document.getElementById("sentence")!;
const noteEl = document.getElementById("note")!;
const toggleBtn = document.getElementById("toggle-note")!;
const nextBtn = document.getElementById("next-card")!;
const backBtn = document.getElementById("back")!;

function showCard(i: number) {
    if (list.length === 0) {
        sentenceEl.textContent = "単語帳が空です。";
        noteEl.textContent = "";
        (toggleBtn as HTMLButtonElement).disabled = true;
        (nextBtn as HTMLButtonElement).disabled = true;
        return;
    }

    const item = list[i % list.length];
    sentenceEl.textContent = item.sentence;
    noteEl.textContent = item.note;
    noteEl.style.display = "none";
    (toggleBtn as HTMLButtonElement).textContent = "訳を見る";
}

toggleBtn.addEventListener("click", () => {
    if (noteEl.style.display === "none") {
        noteEl.style.display = "block";
        (toggleBtn as HTMLButtonElement).textContent = "訳を隠す";
    } else {
        noteEl.style.display = "none";
        (toggleBtn as HTMLButtonElement).textContent = "訳を見る";
    }
});

nextBtn.addEventListener("click", () => {
    index = (index + 1) % list.length;
    showCard(index);
});

backBtn.addEventListener("click", () => {
    window.location.href = "/"; // index.htmlへ戻る
});

showCard(index);
