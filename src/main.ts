import './style.css';
import { renderHome } from './home.ts';

class App {
  private currentState: string = 'home';

  state(): string {
    return this.currentState;
  }

  showHome() {
    this.currentState = 'home';
    renderHome();
  }
}

const app = new App();
app.showHome();
