// まずグローバル関数を登録
import './globals';

import './style.css';
import { renderHome } from './home.ts';

class App {
  private currentState: string = 'home';

  state(): string {
    return this.currentState;
  }

  showHome() {
    this.currentState = 'home';
    document.getElementById('app')?.replaceChildren(...renderHome().children);
  }
}

const app = new App();
app.showHome();
