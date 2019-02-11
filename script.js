Tile = function(x, y) {
  this.x = x;
  this.y	= y;
  this.hasMine = false;
  this.danger = 0;
  this.currentState	= 'hidden';
};

Tile.prototype.calcDanger = function() {
  const currentDiff = difficulties[gameState.difficulty];
  
  for(let py = this.y - 1; py <= this.y + 1; py++)
  {
    for(let px = this.x - 1; px <= this.x + 1; px++)
    {
      if(px === this.x && py === this.y) { continue; }
      
      if(px < 0 || py < 0 ||
        px >= currentDiff.width ||
        py >= currentDiff.height)
      {
        continue;
      }
      
      if(grid[((py*currentDiff.width)+px)].hasMine)
      {
        this.danger++;
      }
    }
  }
};

Tile.prototype.flag = function()
{
  if(this.currentState === 'hidden') { this.currentState = 'flagged'; }
  else if(this.currentState === 'flagged') { this.currentState = 'hidden'; }
};
Tile.prototype.click = function()
{
  if(this.currentState !== 'hidden') { return; }
  
  if(this.hasMine) { gameOver(); }
  else if(this.danger>0) { this.currentState = 'visible'; }
  else
  {
    this.currentState = 'visible';
    this.revealNeighbours();
  }
  
  checkState();
};

Tile.prototype.revealNeighbours = function()
{
  const currentDiff = difficulties[gameState.difficulty];
  
  for(let py = this.y - 1; py <= this.y + 1; py++)
  {
    for(let px = this.x - 1; px <= this.x + 1; px++)
    {
      if(px === this.x && py === this.y) { continue; }
      
      if(px < 0 || py < 0 ||
        px >= currentDiff.width ||
        py >= currentDiff.height)
      {
        continue;
      }
      
      const idx = ((py * currentDiff.width) + px);
      
      if(grid[idx].currentState === 'hidden')
      {
        grid[idx].currentState = 'visible';
        
        if(grid[idx].danger === 0)
        {
          grid[idx].revealNeighbours();
        }
      }
    }
  }
};

const checkState = () => {
  for(const i in grid)
  {
    if(grid[i].hasMine === false && grid[i].currentState !== 'visible')
    {
      return;
    }
  }
  
  gameState.timeTaken = gameTime;
  
  gameState.screen = 'won';
};

const gameOver = () => {
  gameState.screen = 'lost';
};

const startLevel = (diff) => {
  gameState.newBest	= false;
  gameState.timeTaken	= 0;
  gameState.difficulty	= diff;
  gameState.screen	= 'playing';
  
  gameTime = 0;
  lastFrameTime = 0;
  
  grid.length = 0;
  
  const currentDiff = difficulties[diff];
  
  offsetX = Math.floor((document.getElementById('game').width -
    (currentDiff.width * gameState.tileW)) / 2);
  
  offsetY = Math.floor((document.getElementById('game').height -
    (currentDiff.height * gameState.tileH)) / 2);
  
  for(let py = 0; py < currentDiff.height; py++)
  {
    for(let px = 0; px < currentDiff.width; px++)
    {
      grid.push(new Tile(px, py));
    }
  }
  
  let minesPlaced = 0;
  
  while(minesPlaced < currentDiff.mines)
  {
    const idx = Math.floor(Math.random() * grid.length);
    
    if(grid[idx].hasMine) { continue; }
    
    grid[idx].hasMine = true;
    minesPlaced++;
  }
  
  for(const i in grid) { grid[i].calcDanger(); }
};

const updateGame = () => {
  if(gameState.screen === 'menu')
  {
    if(mouseState.click!=null)
    {
      for(const i in difficulties)
      {
        if(mouseState.y >= difficulties[i].menuBox[0] &&
          mouseState.y <= difficulties[i].menuBox[1])
        {
          startLevel(i);
          break;
        }
      }
      mouseState.click = null;
    }
  }
  else if(gameState.screen === 'won' || gameState.screen === 'lost')
  {
    if(mouseState.click!=null)
    {
      gameState.screen = 'menu';
      mouseState.click = null;
    }
  }
  else
  {
    if(mouseState.click!=null)
    {
      const currentDiff = difficulties[gameState.difficulty];
      
      if(mouseState.click[0]>=offsetX &&
        mouseState.click[1]>=offsetY &&
        mouseState.click[0]<(offsetX + (currentDiff.width * gameState.tileW)) &&
        mouseState.click[1]<(offsetY + (currentDiff.height * gameState.tileH)))
      {
        const tile = [
          Math.floor((mouseState.click[0]-offsetX)/gameState.tileW),
          Math.floor((mouseState.click[1]-offsetY)/gameState.tileH)
        ];
        
        if(mouseState.click[2] === 1)
        {
          grid[((tile[1] * currentDiff.width) + tile[0])].click();
        }
        else
        {
          grid[((tile[1] * currentDiff.width) + tile[0])].flag();
        }
      }
      else if(mouseState.click[1]>=380)
      {
        gameState.screen = 'menu';
      }
      
      mouseState.click = null;
    }
  }
};
