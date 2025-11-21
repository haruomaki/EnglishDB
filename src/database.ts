const STORAGE_KEY = "wordbook";

export interface Sentence {
  id: number;
  sentence: string;
  note: string;
  createdAt: string;
}

export function load(): Sentence[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function save(list: Sentence[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// デバッグ用
interface DB {
  load: typeof load;
  save: typeof save;
  reset: () => void;
  dump: () => void;
  patch: (f: (arr: Sentence[]) => Sentence[]) => void;
}

declare global {
  interface Window {
    db?: DB;
  }
}

if (import.meta.env.DEV) {
  window.db = {
    load,
    save,
    reset() {
      localStorage.removeItem(STORAGE_KEY);
    },
    dump() {
      console.log(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
    },
    patch(f: (arr: Sentence[]) => Sentence[]) {
      const arr = load();
      save(f(arr));
    }
  };
}
