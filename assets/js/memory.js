var selectedTile = null;
var flipTimeout = null;

function createBoard(size){
  var board = document.getElementById('board');
  var newCode = "";

  var tileNumber = 0;

  for (let i = 0; i < size; i++) {
    newCode += '<div class="board-row">';
    for (let j = 0; j < size; j++) {
      if(size % 2 == 1 && i == size - 1 && j == size - 1){
        newCode += '<div class="dummy-tile"></div>';
        break;
      }
      newCode += '<div class="board-tile" id="tile-' + tileNumber + '" onclick="selectTile(' + tileNumber + ')">';
        newCode += '<div class="board-tile-inner">';
          newCode += '<div class="board-tile-front"></div>';
          newCode += '<div class="board-tile-back">';
            newCode += '<img src="assets/icons/brain.svg" alt="Paris" style="width:100px;height:100px">';
          newCode += '</div>';
        newCode += '</div>';
      newCode += '</div>';
      tileNumber++;
    }
    newCode += '</div>';
  }

  board.innerHTML = newCode;
}

function selectTile(number){
  if(flipTimeout === null){
    document.getElementById('tile-' + number).classList.toggle('board-tile-selected');

    if(selectedTile === null){
      selectedTile = number;
    } else {
      if(compareTiles(selectedTile, number)){
        removeTiles(selectedTile, number);
      } else {
        document.getElementById('tile-' + selectedTile).classList.toggle('board-tile-selected');
        document.getElementById('tile-' + number).classList.toggle('board-tile-selected');
      }
    }
  }
}

function startGame(size){
  createBoard(size);
  startTimer();

  document.getElementById('dificulty-box').style.display = "none";
}

function startTimer(){
  var timer = 0;
  setInterval(() => {
    timer++;
    const minutes = Math.floor(timer / 60);
    const seconds = timer - minutes * 60;

    const newTime = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

    document.getElementById('timer').innerHTML = newTime;
  }, 1000);
}