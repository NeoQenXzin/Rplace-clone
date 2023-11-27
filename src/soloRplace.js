class Game {
  static COLORS = ["#ff4500", "#00cc78", "#2450a5", "#fed734", "#f9fafc"];
  static BOARD_SIZE = [25, 25];
  static PIXEL_SIZE = 20;
  static TIME_TO_WAIT = 2000;

  lastPixelAddedDate = null;
  constructor() {
    this.ColorPicker = new ColorPicker(Game.COLORS, Game.COLORS[0]);
    this.warning = new Warning();
    this.interval = null;
  }

  init() {
    this.board = document.querySelector("#board");
    this.timeLeft = document.querySelector("#time-left");
    this.board.style.gridTemplateColumns = `repeat(${Game.BOARD_SIZE[0]}, ${Game.PIXEL_SIZE}px)`;
    this.ColorPicker.init();
    this.warning.init();
    this.initPixel();
  }
  initPixel() {
    for (let i = 0; i < Game.BOARD_SIZE[0] * Game.BOARD_SIZE[1]; i++) {
      const pixel = new Pixel(Game.COLORS[Game.COLORS.length - 1]);

      pixel.element.addEventListener("click", () => {
        this.onPixelClick(pixel);
      });

      this.board.appendChild(pixel.element);
    }
  }

  onPixelClick(pixel) {
    if (
      this.lastPixelAddedDate &&
      new Date() - this.lastPixelAddedDate < Game.TIME_TO_WAIT
    ) {
      this.warning.showWarning();
      console.log("Vous devez attendre avant d ajouter un nouveau pixel");
      return;
    }
    pixel.color = this.ColorPicker.currentColor;
    this.lastPixelAddedDate = new Date();
    this.toggleTimeLeft();
  }

  toggleTimeLeft() {
    this.timeLeft.innerText = Game.TIME_TO_WAIT / 1000 + "s";

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      const now = new Date();
      const diff = now - this.lastPixelAddedDate;
      const second2Wait = Math.floor((Game.TIME_TO_WAIT - diff) / 1000);

      this.timeLeft.innerText = `${second2Wait}s`;
      if (second2Wait < 0) {
        clearInterval(this.interval);
        this.timeLeft.innerText = ``;
      }
    }, 980);
  }
}

class Warning {
  constructor() {
    this.intervalle = null;
  }
  init() {
    this.element = document.querySelector("#warning");
  }
  showWarning() {
    this.element.classList.remove("hidden");

    clearInterval(this.intervalle);

    this.intervalle = setTimeout(() => {
      this.element.classList.add("hidden");
    }, Game.TIME_TO_WAIT);
  }
}
class Pixel {
  static PIXEL_CLASS = "pixel";
  static PIXEL_PICKER_CLASS = "pixel-picker";

  constructor(color) {
    this._color = color;
    this.element = document.createElement("div");
    this.element.style.backgroundColor = color;
    this.element.classList.add(Pixel.PIXEL_CLASS);
  }

  set color(newColor) {
    this._color = newColor;
    this.element.style.backgroundColor = newColor;
  }

  get color() {
    return this._color;
  }
}

class ColorPicker {
  constructor(colors, currentColor) {
    this.colors = colors;
    this.currentColor = currentColor;
    this.pixels = [];
  }
  init() {
    this.element = document.querySelector("#color-picker");
    for (const color of this.colors) {
      console.log(color);
      const pixel = new Pixel(color);
      this.pixels.push(pixel);
      pixel.element.classList.add(Pixel.PIXEL_PICKER_CLASS);

      if (color === this.currentColor) {
        pixel.element.classList.add("active");
      }

      pixel.element.addEventListener("click", () => {
        this.onColorPixelClick(pixel);
      });

      this.element.appendChild(pixel.element);
    }
  }
  onColorPixelClick(pixel) {
    this.currentColor = pixel.color;
    this.updateActiveColor();
  }

  updateActiveColor() {
    for (const pixel of this.pixels) {
      pixel.element.classList.toggle(
        "active",
        pixel.color === this.currentColor
      );
    }
  }
}

const game = new Game();
game.init();
