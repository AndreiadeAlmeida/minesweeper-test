let ctx = null;

let gameTime = 0, lastFrameTime = 0;

let offsetX = 0, offsetY = 0;
let grid = [];

const mouseState = {
  x	: 0,
  y	: 0,
  click	: null
};

const gameState = {
  difficulty	: 'easy',
  screen		: 'menu',
  timeTaken	: 0,
  
  tileW		: 20,
  tileH		: 20
};

const difficulties = {
  easy	: {
    name		: "Easy",
    width		: 10,
    height		: 10,
    mines		: 5,
    menuBox		: [0,0]
  },
  medium	: {
    name		: "Medium",
    width		: 12,
    height		: 10,
    mines		: 20,
    menuBox		: [0,0]
  },
  hard	: {
    name		: "Hard",
    width		: 15,
    height		: 15,
    mines		: 50,
    menuBox		: [0,0]
  }
};
