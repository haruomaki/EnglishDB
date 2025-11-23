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

/**
 * 配列内の2つの要素をインプレースで入れ替えます。
 *
 * @template T 配列が保持する要素の型。
 * @param array 要素を入れ替える対象の配列。
 * @param i 入れ替える1つ目の要素のインデックス。
 * @param j 入れ替える2つ目の要素のインデックス。
 * @returns インデックスが有効で、かつ異なる場合に入れ替えを行い `true` を返します。
 *          インデックスが不正、または i と j が同一の場合は何もせず `false` を返します。
 */
function swapInPlace<T>(array: T[], i: number, j: number): boolean {
  if (i !== j && 0 <= i && i < array.length && 0 <= j && j < array.length) {
    [array[i], array[j]] = [array[j], array[i]];
    return true;
  }
  return false;
}

export function swap(i: number, j: number) {
  const list = load();
  swapInPlace(list, i, j);
  save(list);
}

// デバッグ用
interface DB {
  load: typeof load;
  save: typeof save;
  swap: typeof swap;
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
    swap,
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
