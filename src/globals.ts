// src/utils/globals.ts

// まず型宣言
declare global {
  /**
   * 例: 全ファイルから呼べる関数
   * @param name あなたの名前
   */
  function greet(name: string): void;

  /**
    * クリック時のイベントリスナーを設定するマクロ。
    */
  function ONCLICK(id: string, f: (ev: MouseEvent) => void): void;

  /**
   * DOMを作成するテンプレート。
   * @param strings HTML文字列
   * @param keys プレースホルダー
   */
  function html(strings: TemplateStringsArray, ...keys: unknown[]): HTMLElement;
}

globalThis.greet = (name: string) => {
  console.log(`Hello, ${name}!`);
};

globalThis.ONCLICK = (id: string, f: (ev: MouseEvent) => void) => {
  const el = document.getElementById(id);
  el?.addEventListener("click", f);
};

import html from "nanohtml";
globalThis.html = html;
