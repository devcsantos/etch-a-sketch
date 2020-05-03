const DEFAULT_GRID_SIZE = 16;

initializePage();



function initializePage() {
  initializeGrid(DEFAULT_GRID_SIZE);
  initializeButtonListeners();
}

function initializeButtonListeners() {
  let resetButton = document.getElementById('reset-btn');
  resetButton.addEventListener('click', resetGrid);
}


function initializeGrid(gridSize) {
  let rainbowCounter = 0;
  let container = document.getElementById('container');
  if(gridSize < DEFAULT_GRID_SIZE) gridSize = DEFAULT_GRID_SIZE;

  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  for(let x=0; x<gridSize; x++) {
    for(let y=0; y<gridSize; y++) {
      let divBox = document.createElement('div');
      let drawColor = drawBlack;
      divBox.style.backgroundClip = 'white';
      if(rainbowCounter % 10 > 0) drawColor = drawRandom;
      else drawColor = drawBlack;
      divBox.addEventListener('mouseenter', drawColor);
      container.appendChild(divBox);
      rainbowCounter++;
    }
    rainbowCounter++;
  }
}

function resetGrid() {
  let gridSize = window.prompt("How many squares per side? Default/Minimum is 16");
  if(gridSize) initializeGrid(gridSize);
  else initializeGrid(16);
}

function drawBlack(e) {
  e.target.style.backgroundColor = 'black';
}

function drawRandom(e) {
  e.target.style.backgroundColor = `rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`;
}

function getRandomColor() {
  return Math.random() * 255; // 0-255
}