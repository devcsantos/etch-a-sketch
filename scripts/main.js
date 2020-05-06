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
  let exportButton = document.getElementById('export-btn');
  let importButton = document.getElementById('import-btn');
  let showExtraControls = document.getElementById('extra-btn');
  let hideButton = document.getElementById('hide-btn');

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

  showExtraControls.addEventListener('click', (e) => {
    document.getElementById('popup-box').classList.remove('hide-display');
  });

  exportButton.addEventListener('click', (e) => {
    exportDrawing();
  });

  importButton.addEventListener('click', (e) => {
    importDrawing()
  });

  hideButton.addEventListener('click', (e) => {
    document.getElementById('popup-box').classList.add('hide-display');
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

function initializeGrid(gridSize, importArgs = []) {
  let container = document.getElementById('container');
  let isGridActive = document.getElementById('border-toggle').classList.contains('active');
  if(gridSize < DEFAULT_GRID_SIZE) gridSize = DEFAULT_GRID_SIZE;

  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  clearGrid(container);
  gridSize = gridSize**2;
  for(let x=0; x<gridSize; x++) {
    let divBox = document.createElement('div');
    if(importArgs.length > 0) divBox.style.backgroundColor = importArgs[x];
    else divBox.style.backgroundColor = COLOR_WHITE;
    divBox.addEventListener('mouseenter', drawColor);
    divBox.addEventListener('mousedown', drawColor);
    container.appendChild(divBox);
  }

  let gridBoxes = document.querySelectorAll('#container div'); // make sure to re-draw grid when reset
  if(isGridActive) drawGridLines(gridBoxes);
}

function clearGrid(gridContainer) {
  while(gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.lastChild);
  }
}

function resetGrid() {
  let gridSize = window.prompt(`How many squares per side? Default/Minimum is ${DEFAULT_GRID_SIZE}`);
  if(gridSize !== null) gridSize ? initializeGrid(gridSize) : initializeGrid(DEFAULT_GRID_SIZE);
}

function togglePrecisionMode(e) {
  let isActive = e.target.classList.contains('active');
  
  isActive ? e.target.classList.remove('active') : e.target.classList.add('active');
}

function toggleGridLines(e) {
  let gridBoxes = document.querySelectorAll('#container div');
  if(!e.target.classList.contains('active')) {
    e.target.classList.add('active');
    drawGridLines(gridBoxes);
  } else {
    e.target.classList.remove('active');
    for(let i=0; i<gridBoxes.length; i++) {
      gridBoxes[i].classList.remove('grid-lines');
    }
  }
  e.stopPropagation();
}

function drawGridLines(gridBoxes) {
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
  console.log(e);
  let pencilMode = document.getElementById('pencil-btn').classList.contains('active');
  let rainbowMode = document.getElementById('rainbow-btn').classList.contains('active');
  let eraserMode = document.getElementById('eraser-btn').classList.contains('active');
  let shaderMode = document.getElementById('shader-btn').classList.contains('active');
  let isPrecisionMode = document.getElementById('precision-btn').classList.contains('active');

  if(isPrecisionMode) {
    if(mouseDraw || e.type == 'mousedown') {
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

function exportDrawing() {
  let importExportBox = document.getElementById('import-export');
  let output = [];
  let gridBoxes = document.querySelectorAll('#container div');
  let gridSize = gridBoxes.length**(1/2);
  output.push(gridSize);
  for(let i=0;i<gridBoxes.length;i++) {
    output.push(gridBoxes[i].style.backgroundColor);
  }
  importExportBox.value = ''; // clear contents first to avoid overloading
  importExportBox.value = output;
}

function importDrawing() {
  let importExportBox = document.getElementById('import-export');
  let regexRGB = /rgb\([0-9]{1,3},\s*[0-9]{1,3},\s*[0-9]{1,3}\)/g;
  let importText = importExportBox.value;
  let gridSize = importText.slice(0,importText.indexOf(','));
  let rgbColors = importText.match(regexRGB);
  console.log(rgbColors);
  initializeGrid(gridSize, rgbColors);
}