// まずグローバル関数を登録
import "./globals";

import "./style.css";
import { generateHome } from "./home.ts";

class App {
  private currentState: string = "home";

  state(): string {
    return this.currentState;
  }

  showHome() {
    this.currentState = "home";
    document.getElementById("app")?.replaceChildren(...generateHome().children);
  }
}

const app = new App();
app.showHome();
