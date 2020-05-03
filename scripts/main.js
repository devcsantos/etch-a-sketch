const DEFAULT_GRID_SIZE = 16;

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
  let precisionButton = document.getElementById('precision-btn');
  let eraserButton = document.getElementById('eraser-btn');

  resetButton.addEventListener('click', resetGrid);
  gridToggle.addEventListener('click', toggleGridLines);
  precisionButton.addEventListener('click', togglePrecisionMode);

  pencilButton.addEventListener('click', (e) =>{
    e.target.classList.add('active');+
    eraserButton.classList.remove('active');
    rainbowButton.classList.remove('active');
    e.stopPropagation();
  });
  
  rainbowButton.addEventListener('click', (e) =>{
    e.target.classList.add('active');
    pencilButton.classList.remove('active');
    eraserButton.classList.remove('active');
    e.stopPropagation();
  });

  eraserButton.addEventListener('click', (e) => {
    e.target.classList.add('active');
    pencilButton.classList.remove('active');
    rainbowButton.classList.remove('active');
    e.stopPropagation();
  });
}

function initializeGrid(gridSize) {
  let container = document.getElementById('container');
  let isGridActive = document.getElementById('border-toggle').classList.contains('active');
  let isPrecision = document.getElementById('precision-btn').classList.contains('active');
  if(gridSize < DEFAULT_GRID_SIZE) gridSize = DEFAULT_GRID_SIZE;

  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  clearGrid(container);

  for(let x=0; x<gridSize; x++) {
    for(let y=0; y<gridSize; y++) {
      let divBox = document.createElement('div');
      divBox.style.backgroundColor = 'white';
      if(isPrecision) {
        divBox.addEventListener('mousedown', drawColor);
      } else {
        divBox.addEventListener('mouseenter', drawColor);
      }
      container.appendChild(divBox);
    }
  }

  let gridBoxes = document.querySelectorAll('#container div'); // make sure to re-draw grid when reset
  if(isGridActive) drawGridLines(true, gridBoxes);
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

function togglePrecisionMode(e) {
  let gridBoxes = document.getElementById('container').children;
  let isActive = e.target.classList.contains('active');
  
  if(isActive) e.target.classList.remove('active');
  else e.target.classList.add('active');

  for(let x=0; x<gridBoxes.length; x++) {
    if(!isActive) { // not currently active, will activate after
      gridBoxes[x].addEventListener('mousedown', drawColor);
      gridBoxes[x].removeEventListener('mouseenter', drawColor);
    }
    else {
      gridBoxes[x].removeEventListener('mousedown', drawColor);
      gridBoxes[x].addEventListener('mouseenter', drawColor);
    }
  }
}

function toggleGridLines(e) {
  let gridBoxes = document.querySelectorAll('#container div');
  if(!e.target.classList.contains('active')) {
    e.target.classList.add('active');
    drawGridLines(true, gridBoxes);
  } else {
    e.target.classList.remove('active');
    for(let i=0; i<gridBoxes.length; i++) {
      gridBoxes[i].classList.remove('grid-lines');
    }
  }
  e.stopPropagation();
}

function drawGridLines(add, gridBoxes) {
  let gridSize = (gridBoxes.length)**(1/2) - 1;
  
  for(let i=0; i<gridBoxes.length; i++) {
    if(i / (gridSize+1) < 1) { // top boxes
      gridBoxes[i].classList.add('grid-lines');
      gridBoxes[i].style.borderTopWidth = '0px';
    }
    if((i+1) % (gridSize+1) == 1) { // left-side boxes
      gridBoxes[i].classList.add('grid-lines');
      gridBoxes[i].style.borderLeftWidth = '0px';
    }
    if(Number.isInteger((i+1) / (gridSize+1))) { // right-hand side boxes
      gridBoxes[i].classList.add('grid-lines');
      gridBoxes[i].style.borderRightWidth = '0px';
    }
    if((i+1) / (gridSize+1) > gridSize) { // bottom boxes
      gridBoxes[i].classList.add('grid-lines');
      gridBoxes[i].style.borderBottomWidth = '0px';
    }
  }

  for(let i=0; i<gridBoxes.length; i++) {
    if(gridBoxes[i].classList.length < 1)
      gridBoxes[i].classList.add('grid-lines');
  }
}

function drawColor(e) {
  e.preventDefault();

  let pencilMode = document.getElementById('pencil-btn').classList.contains('active');
  let rainbowMode = document.getElementById('rainbow-btn').classList.contains('active');
  let eraserMode = document.getElementById('eraser-btn').classList.contains('active');

  if(pencilMode) drawBlack(e);
  if(rainbowMode) drawRandom(e);
  if(eraserMode) drawWhite(e);
}

function drawBlack(e) {
  e.target.style.backgroundColor = 'black';
  e.stopPropagation();
}

function drawWhite(e) {
  e.target.style.backgroundColor = 'white';
  e.stopPropagation();
}

function drawRandom(e) {
  e.target.style.backgroundColor = `rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`;
  e.stopPropagation();
}

function getRandomColor() {
  return Math.random() * 255; // 0-255
}