import './styles.css';
import './demo.css';
import './gridstack.css'
import { GridStack } from './gridstack';

class App {
  constructor() {
    this.counter = 0;
    this.counterElement = null;
    this.buttonElement = null;

    // Wait for DOM content to load
    document.addEventListener('DOMContentLoaded', () => {
      this.initialize();
    });
  }

  initialize() {
    GridStack.renderCB = function(el, w) {
      el.innerHTML = w.content;
    };

    let children = [
      {x: 0, y: 0, w: 4, h: 2, content: '1'},
      {x: 4, y: 0, w: 4, h: 4, content: '2'},
      {x: 8, y: 0, w: 2, h: 2, content: '<p class="card-text text-center" style="margin-bottom: 0">Drag me!<p class="card-text text-center"style="margin-bottom: 0"><ion-icon name="hand" style="font-size: 300%"></ion-icon><p class="card-text text-center" style="margin-bottom: 0">'},
      {x: 10, y: 0, w: 2, h: 2, content: '4'},
      {x: 0, y: 2, w: 2, h: 2, content: '5'},
      {x: 2, y: 2, w: 2, h: 4, content: '6'},
      {x: 8, y: 2, w: 4, h: 2, content: '7'},
      {x: 0, y: 4, w: 2, h: 2, content: '8'},
      {x: 4, y: 4, w: 4, h: 2, content: '9'},
      {x: 8, y: 4, w: 2, h: 2, content: '10'},
      {x: 10, y: 4, w: 2, h: 2, content: '11'},
    ];

    let grid = GridStack.init({ cellHeight: 70, children });
    grid.on('added removed change', function(e, items) {
      let str = '';
      items.forEach(function(item) { str += ' (x,y)=' + item.x + ',' + item.y; });
      console.log(e.type + ' ' + items.length + ' items:' + str );
    });

    this.counterElement = document.getElementById('counter');
    this.buttonElement = document.getElementById('clickMe');

    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', this.incrementCounter.bind(this));
    }

    console.log('JavaScript App initialized!');
  }

  incrementCounter() {
    this.counter++;
    if (this.counterElement) {
      this.counterElement.textContent = `Counter: ${this.counter}`;
    }
  }
}

// Initialize the app
new App();