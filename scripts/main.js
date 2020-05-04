const DEFAULT_GRID_SIZE = 16;
const COLOR_BLACK = 'rgb(0,0,0)';
const COLOR_WHITE = 'rgb(255,255,255)';
let mouseDraw;

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
  let shaderButton = document.getElementById('shader-btn');
  let drawingContainer = document.getElementById('container');

  resetButton.addEventListener('click', resetGrid);
  gridToggle.addEventListener('click', toggleGridLines);
  precisionButton.addEventListener('click', togglePrecisionMode);

  pencilButton.addEventListener('click', (e) =>{
    e.target.classList.add('active');+
    eraserButton.classList.remove('active');
    rainbowButton.classList.remove('active');
    shaderButton.classList.remove('active');
    e.stopPropagation();
  });
  
  rainbowButton.addEventListener('click', (e) =>{
    e.target.classList.add('active');
    pencilButton.classList.remove('active');
    eraserButton.classList.remove('active');
    shaderButton.classList.remove('active');
    e.stopPropagation();
  });

  eraserButton.addEventListener('click', (e) => {
    e.target.classList.add('active');
    pencilButton.classList.remove('active');
    rainbowButton.classList.remove('active');
    shaderButton.classList.remove('active');
    e.stopPropagation();
  });

  shaderButton.addEventListener('click', (e) => {
    e.target.classList.add('active');
    pencilButton.classList.remove('active');
    rainbowButton.classList.remove('active');
    eraserButton.classList.remove('active');
    e.stopPropagation();
  });

  drawingContainer.addEventListener('mouseup', (e) => {
    e.preventDefault();
    mouseDraw = false;
  });

  drawingContainer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    mouseDraw = true;
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
      divBox.style.backgroundColor = COLOR_WHITE;
      divBox.addEventListener('mouseenter', drawColor);
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
  let isActive = e.target.classList.contains('active');
  
  isActive ? e.target.classList.remove('active') : e.target.classList.add('active');
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
  let shaderMode = document.getElementById('shader-btn').classList.contains('active');
  let isPrecisionMode = document.getElementById('precision-btn').classList.contains('active');

  if(isPrecisionMode) {
    if(mouseDraw) {
      if(pencilMode) drawBlack(e);
      if(rainbowMode) drawRandom(e);
      if(eraserMode) drawWhite(e);
      if(shaderMode) drawShader(e);
    }
  } else {
    if(pencilMode) drawBlack(e);
    if(rainbowMode) drawRandom(e);
    if(eraserMode) drawWhite(e);
    if(shaderMode) drawShader(e);
  }
  e.stopPropagation();
}

function drawBlack(e) {
  e.target.style.backgroundColor = COLOR_BLACK;
}

function drawWhite(e) {
  e.target.style.backgroundColor = COLOR_WHITE;
}

function drawRandom(e) {
  e.target.style.backgroundColor = `rgb(${getRandomColor()},${getRandomColor()},${getRandomColor()})`;
}

function drawShader(e) {
  let currentBackgroundColor = e.target.style.backgroundColor;
  let RGB = currentBackgroundColor.slice(3).replace(/\(|\)/g,'').split(',');

  let newR = RGB[0] - 25;
  let newG = RGB[1] - 25;
  let newB = RGB[2] - 25;

  newR >= 0 ? newR = newR : newR = 0;
  newG >= 0 ? newG = newG : newG = 0;
  newB >= 0 ? newB = newB : newB = 0;

  e.target.style.backgroundColor = `rgb(${newR},${newG},${newB})`;
}

function getRandomColor() {
  return Math.random() * 255; // 0-255
}