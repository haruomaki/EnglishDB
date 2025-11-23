// まずグローバル関数を登録
import "./globals";

import "./style.css";
import "./card.css";
import { createHome } from "./home.ts";

class App {
  private currentState: string = "home";

  state(): string {
    return this.currentState;
  }

  showHome() {
    this.currentState = "home";
    createHome();
  }
}

const app = new App();
app.showHome();
