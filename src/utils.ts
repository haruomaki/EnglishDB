export function onclick(id: string, f: (ev: MouseEvent) => void) {
  const el = document.getElementById(id);
  el?.addEventListener('click', f);
}
