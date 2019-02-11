// Main menu (Easy, Medium and Hard levels )
const mainMenu = () => {
  ctx.textAlign = 'center';
  ctx.font = "bold 20pt sans-serif";
  ctx.fillStyle = "#000000";
  
  let y = 100;
  
  for(const d in difficulties)
  {
    const mouseOver = (mouseState.y>=(y-20) && mouseState.y<=(y+10));
    
    if(mouseOver) { ctx.fillStyle = "#000099"; }
    
    difficulties[d].menuBox = [y-20, y+10];
    ctx.fillText(difficulties[d].name, 150, y);
    y+= 80;
    
    if(mouseOver) { ctx.fillStyle = "#000000"; }
  }
};

const gameScreen = () =>
{
  const halfWidth = gameState.tileW / 2;
  const halfHeight = gameState.tileH / 2;
  
  const currentDiff = difficulties[gameState.difficulty];
  
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  
  ctx.fillStyle = "#000000";
  ctx.font = "12px sans-serif";
  ctx.fillText(currentDiff.name, 150, 20);
  
  ctx.fillText("Return to menu", 150, 390);
  
  if(gameState.screen !== 'lost')
  {
    ctx.textAlign = "left";
    ctx.fillText("Mines: " + currentDiff.mines, 10, 40);
    
    const whichT = (gameState.screen === 'won' ?
      gameState.timeTaken : gameTime);
    let t = '';
    if((gameTime / 1000) > 60)
    {
      t = Math.floor((whichT / 1000) / 60) + ':';
    }
    const s = Math.floor((whichT / 1000) % 60);
    t+= (s > 9 ? s : '0' + s);
    
    ctx.textAlign = "right";
    ctx.fillText("Time: " + t, 290, 40);
  }
  
  if(gameState.screen === 'lost' || gameState.screen === 'won')
  {
    ctx.textAlign = "center";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(
      (gameState.screen === 'lost' ?
        "Game Over" : "Won!"), 150, offsetY - 10);
  }
  
  ctx.strokeStyle = "#999999";
  ctx.strokeRect(offsetX, offsetY,
    (currentDiff.width * gameState.tileW),
    (currentDiff.height * gameState.tileH));
  
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  for(let i in grid)
  {
    const px = offsetX + (grid[i].x * gameState.tileW);
    const py = offsetY + (grid[i].y * gameState.tileH);
    
    if(gameState.screen === 'lost' && grid[i].hasMine)
    {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(px, py,
        gameState.tileW, gameState.tileH);
      ctx.fillStyle = "#000000";
      ctx.fillText("x", px + halfWidth, py + halfHeight);
    }
    else if(grid[i].currentState === 'visible')
    {
      ctx.fillStyle = "#dddddd";
      
      if(grid[i].danger)
      {
        ctx.fillStyle = "#000000";
        ctx.fillText(grid[i].danger, px + halfWidth, py + halfHeight);
      }
    }
    else
    {
      ctx.fillStyle = "#cccccc";
      ctx.fillRect(px, py,
        gameState.tileW, gameState.tileH);
      ctx.strokeRect(px, py,
        gameState.tileW, gameState.tileH);
      
      if(grid[i].currentState === 'flagged')
      {
        ctx.fillStyle = "#0000cc";
        ctx.fillText("P", px + halfWidth, py + halfHeight);
      }
    }
  }
};


// checks if the drawing context for the Canvas exists, and then updates the gameTime and calculates the timeElapsed
const drawGame = () => {
  if(ctx==null) { return; }
  
  // Frame & update related timing
  const currentFrameTime = Date.now();
  if(lastFrameTime === 0) { lastFrameTime = currentFrameTime; }
  const timeElapsed = currentFrameTime - lastFrameTime;
  gameTime += timeElapsed;
  
  // Update game
  updateGame();
  
  // Clear canvas
  ctx.fillStyle = "#ddddee";
  ctx.fillRect(0, 0, 300, 400);
  
  if(gameState.screen === 'menu') { mainMenu(); }
  else { gameScreen(); }
  
  // Update the lastFrameTime
  lastFrameTime = currentFrameTime;
  
  // Wait for the next frame...
  requestAnimationFrame(drawGame);
};

const realPos = (x, y) => {
  let p = document.getElementById('game');
  
  do {
    x-= p.offsetLeft;
    y-= p.offsetTop;
    
    p = p.offsetParent;
  } while(p!=null);
  
  return [x, y];
};


window.onload = () => {
  ctx = document.getElementById('game').getContext('2d');
  
  // Event listeners
  document.getElementById('game').addEventListener('click', function(e) {
    const pos = realPos(e.pageX, e.pageY);
    mouseState.click = [pos[0], pos[1], 1];
  });
  document.getElementById('game').addEventListener('mousemove',
    function(e) {
      const pos = realPos(e.pageX, e.pageY);
      mouseState.x = pos[0];
      mouseState.y = pos[1];
    });
  
  document.getElementById('game').addEventListener('contextmenu',
    function(e) {
      e.preventDefault();
      const pos = realPos(e.pageX, e.pageY);
      mouseState.click = [pos[0], pos[1], 2];
      return false;
    });
  
  requestAnimationFrame(drawGame);
};
