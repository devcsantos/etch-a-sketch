const DEFAULT_GRID_SIZE = 16;
let pencilMode = true;

initializePage();

function initializePage() {
  initializeGrid(DEFAULT_GRID_SIZE);
  initializeControlListeners();
}

function initializeControlListeners() {
  let resetButton = document.getElementById('reset-btn');
  let gridToggle = document.getElementById('border-toggle');
  let pencilButton = document.getElementById('pencil-btn');
  let rainbowButton = document.getElementById('rainbow-btn');

  resetButton.addEventListener('click', resetGrid);
  gridToggle.addEventListener('click', toggleGridLines);

  pencilButton.addEventListener('click', (e) =>{
    pencilMode = true;
    e.stopPropagation();
  });
  
  rainbowButton.addEventListener('click', (e) =>{
    pencilMode = false;
    e.stopPropagation();
  });
}


function initializeGrid(gridSize) {
  let container = document.getElementById('container');
  if(gridSize < DEFAULT_GRID_SIZE) gridSize = DEFAULT_GRID_SIZE;

  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  clearGrid(container);

  for(let x=0; x<gridSize; x++) {
    for(let y=0; y<gridSize; y++) {
      let divBox = document.createElement('div');
      divBox.style.backgroundClip = 'white';
      divBox.addEventListener('mouseenter', drawColor);
      container.appendChild(divBox);
    }
  }
}

function clearGrid(gridContainer) {
  while(gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.lastChild);
  }
}

function resetGrid() {
  let gridSize = window.prompt(`How many squares per side? Default/Minimum is ${DEFAULT_GRID_SIZE}`);
  gridSize ? initializeGrid(gridSize) : initializeGrid(DEFAULT_GRID_SIZE);
}

function toggleGridLines(e) {
  let gridBoxes = document.querySelectorAll('#container div');
  if(e.target.checked) {
    for(let i=0; i<gridBoxes.length; i++) {
      gridBoxes[i].classList.add('grid-lines');
    }
  } else {
    for(let i=0; i<gridBoxes.length; i++) {
      gridBoxes[i].classList.remove('grid-lines');
    }
  }
  e.stopPropagation();
}

function drawColor(e) {
  pencilMode ? drawBlack(e) : drawRandom(e);
}

function drawBlack(e) {
  e.target.style.backgroundColor = 'black';
  e.stopPropagation();
}

function drawRandom(e) {
  e.target.style.backgroundColor = `rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`;
  e.stopPropagation();
}

function getRandomColor() {
  return Math.random() * 255; // 0-255
}