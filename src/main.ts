import './style.css'

document.querySelector("#greet_button")?.addEventListener("click", () => {
  console.log("おしたよ");
});

// Vite + TS でも書き方はほぼ同じ
const form = document.querySelector<HTMLFormElement>("#inputForm")!;
const input = document.querySelector<HTMLInputElement>("#textInput")!;
const list = document.querySelector<HTMLUListElement>("#stringList")!;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement("li");
  li.textContent = value;
  list.appendChild(li);

  input.value = "";
  input.focus();
});
