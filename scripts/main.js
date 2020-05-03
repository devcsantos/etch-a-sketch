initializePage();




function initializePage() {
  initializeGrid(16);
}


function initializeGrid(gridSize) {
  let container = document.getElementById('container');

  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  container.style.width = '400px';
  container.style.height = '400px';
  for(let x=0; x<gridSize; x++) {
    for(let y=0; y<gridSize; y++) {
      let divBox = document.createElement('div');
      divBox.addEventListener('mouseenter', drawBlack);
      container.appendChild(divBox);
    }
  }
}

function drawBlack(e) {
  e.target.style.backgroundColor = 'black';
}