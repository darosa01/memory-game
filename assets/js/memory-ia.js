const jsConfetti = new JSConfetti()
var audioVictoria = new Audio('assets/audio/so-victoria.wav');
var audioDerrota = new Audio('assets/audio/so-derrota.wav');
var audioFlip = new Audio('assets/audio/flip2.mp3');

var selectedTile = null;
var playIsCompleted = false;
var flipTimeout = null;
var remainingTiles = null;
var tilesNumber = null;
var timerInterval = null;
var tableSize = null;

var currentPlayer = 1;

var pointsPlayer1 = 0;
var pointsPlayer2 = 0;

var difficulty = 1; // from 0 to 1. Greater is more difficult.
var delayAI = 1000; // in ms

var mapAI = {};

var cards = ['aerial-lift', 'alarm', 'ambulance', 'antenna', 'baby-carriage', 'backhoe', 'bat', 
              'bath', 'battery-automotive', 'beach', 'bell-ringing', 'bone', 'briefcase', 'cake', 
              'calculator', 'calendar-event', 'camera', 'campfire', 'candle', 'carrot', 'cherry', 
              'christmas-tree', 'deer', 'device-landline-phone', 'dog', 'engine', 'fish', 'gavel',
              'macro', 'mug', 'ship', 'snowman', 'trophy', 'woman'];

function changeDifficulty(){
  var elements = document.getElementsByName('ia-mode');

  for (let i = 0; i < elements.length; i++) {
    if(elements[i].checked){
      difficulty = parseInt(elements[i].value)/100;
    }
  }
}

function changePlayer(){
  currentPlayer = currentPlayer%2 + 1;
  if(currentPlayer == 1){
    document.getElementById('current-player').innerHTML = "Jugador/a";
  } else {
    document.getElementById('current-player').innerHTML = "Ordinador";
  }
  
  if(currentPlayer == 2){
    setTimeout(() => {
      playAI();
    }, delayAI);
  }
}

function checkCoincidenceAI(){
  var cardNames = Object.values(mapAI);

  let sorted_arr = cardNames.slice().sort();
  let pairs = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      pairs.push(sorted_arr[i]);
    }
  }

  var results = [];

  for (let i = 0; i < pairs.length; i++) {
    results = results.concat(Object.keys(mapAI).find(key => mapAI[key] === pairs[i]));
  }

  return results;
}

function checkFinish(){
  if(remainingTiles <= 0){
    clearInterval(timerInterval);
    document.getElementById('end-time').innerHTML = document.getElementById('timer').innerHTML;
    document.getElementById('end-box').style.display = 'flex';
    document.getElementById('end-box').classList.toggle('game-ended');

    document.getElementById('first-player-pairs').innerHTML = pointsPlayer1;
    document.getElementById('second-player-pairs').innerHTML = pointsPlayer2;

    document.getElementById('player-winner-box').style.display = 'block';
    document.getElementById('computer-winner-box').style.display = 'none';
    document.getElementById('tie-box').style.display = 'none';

    if(pointsPlayer1 > pointsPlayer2){
      audioVictoria.play();
      jsConfetti.addConfetti();
    } else if(pointsPlayer1 < pointsPlayer2){
      document.getElementById('player-winner-box').style.display = 'none';
      document.getElementById('computer-winner-box').style.display = 'block';
      audioDerrota.play();
    } else {
      document.getElementById('player-winner-box').style.display = 'none';
      document.getElementById('tie-box').style.display = 'block';
    }
  } else if (currentPlayer == 2){
    setTimeout(() => {
      playAI();
    }, delayAI);
  }
}

function compareTiles(firstTile, secondTile){
  var firstImage = document.getElementById('image-tile-' + firstTile).src;
  var secondImage = document.getElementById('image-tile-' + secondTile).src;

  return firstImage == secondImage;
}

function createBoard(size){
  var board = document.getElementById('board');
  var newCode = "";

  var tilesNumber = size * size;
  if(size % 2 == 1){
    tilesNumber--;
  }
  var cardsNumber = tilesNumber / 2;

  const shuffledArray = cards.sort(() => 0.5 - Math.random());
  let selectedCards = shuffledArray.slice(0, cardsNumber);

  selectedCards = selectedCards.concat(selectedCards);

  const readyCards = selectedCards.sort(() => 0.5 - Math.random());

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
            newCode += '<img id="image-tile-' + tileNumber + '" src="assets/cards/' + readyCards[size * i + j] + '.svg" alt="">';
          newCode += '</div>';
        newCode += '</div>';
      newCode += '</div>';
      tileNumber++;
    }
    newCode += '</div>';
  }

  board.innerHTML = newCode;
}

function flipBackTiles(firstTile, secondTile){
  logCardAI(firstTile);
  logCardAI(secondTile);
  flipTimeout = setTimeout(() => {
    document.getElementById('tile-' + firstTile).classList.toggle('board-tile-selected');
    document.getElementById('tile-' + secondTile).classList.toggle('board-tile-selected');
    selectedTile = null;
    flipTimeout = null;
    playIsCompleted = false;
    changePlayer();
  }, 1000);
}

function goodPlayAI(){
  var coincidences = checkCoincidenceAI();
  var firstCardKey = coincidences[0];

  var secondCardKey = Object.keys(mapAI).find(key => mapAI[key] === mapAI[firstCardKey] && key != firstCardKey);

  selectTileAI(parseInt(firstCardKey));
  selectTileAI(parseInt(secondCardKey));
}

function isMoveOkay(cardNumber){
  if(cardNumber == selectedTile){
    return false;
  }

  var element = document.getElementById('tile-' + cardNumber);

  if(element.classList.contains('board-tile-removed')){
    return false;
  }

  return true;
}

function logCardAI(cardNumber){
  var cardName = document.getElementById('image-tile-' + cardNumber).src.split('/').at(-1).split('.')[0];
  mapAI[cardNumber] = cardName;
}

function playAI(){
  var coincidences = checkCoincidenceAI();

  if(coincidences.length > 0){
    var goodLuck = Math.random() < difficulty;
    if(goodLuck){
      goodPlayAI();
    } else {
      randomPlayAI();
    }
  } else {
    randomPlayAI();
  }

  if(currentPlayer == 2 && selectedTile != null && !playIsCompleted){
    setTimeout(() => {
      randomPlayAI();
    }, delayAI);
  }
}

function randomPlayAI(){
  /*
  var existentEntries = Object.keys(mapAI);
  existentEntries = existentEntries.map(elem => parseInt(elem));
  */
  var randomSelection = Math.floor(Math.random() * (tilesNumber - 1));

  while(!isMoveOkay(randomSelection)){
    randomSelection = Math.floor(Math.random() * (tilesNumber - 1));
  }

  selectTileAI(randomSelection);
}

function removeTiles(firstTile, secondTile){
  flipTimeout = setTimeout(() => {
    var firstElem = document.getElementById('tile-' + firstTile);
    firstElem.classList.toggle('board-tile-removed');
    firstElem.removeAttribute('onclick');
    var secondElem = document.getElementById('tile-' + secondTile);
    secondElem.classList.toggle('board-tile-removed');
    secondElem.removeAttribute('onclick');
    selectedTile = null;
    flipTimeout = null;
    if(currentPlayer == 1){
      pointsPlayer1++;
    } else {
      pointsPlayer2++;
    }
    remainingTiles -= 2;
    removeTilesFromMapAI(firstTile, secondTile);
    playIsCompleted = false;
    checkFinish();
  }, 500);
}

function removeTilesFromMapAI(firstTile, secondTile){
  delete mapAI[firstTile];
  delete mapAI[secondTile];
}

function resetMatch(){
  currentPlayer = 2;
  changePlayer();
  pointsPlayer1 = 0;
  pointsPlayer2 = 0;
  mapAI = {};
  playIsCompleted = false;
  document.getElementById('timer').innerHTML = "00:00";
  document.getElementById('end-box').classList.toggle('game-ended');
  document.getElementById('end-box').style.display = 'none';
  startGame(tableSize);
}

function selectTile(number){
  if(flipTimeout === null && selectedTile != number && currentPlayer == 1){
    audioFlip.play();
    document.getElementById('tile-' + number).classList.toggle('board-tile-selected');

    if(selectedTile === null){
      selectedTile = number;
    } else {
      if(compareTiles(selectedTile, number)){
        removeTiles(selectedTile, number);
      } else {
        flipBackTiles(selectedTile, number);
      }
    }
  }
}

function selectTileAI(number){
  audioFlip.play();
  document.getElementById('tile-' + number).classList.toggle('board-tile-selected');

  if(selectedTile === null){
    selectedTile = number;
  } else {
    playIsCompleted = true;
    if(compareTiles(selectedTile, number)){
      removeTiles(selectedTile, number);
    } else {
      flipBackTiles(selectedTile, number);
    }
  }
}

function startGame(size){
  tableSize = size;
  tilesNumber = remainingTiles = size * size;

  if(remainingTiles % 2 == 1){
    remainingTiles--;
  }

  changeDifficulty();
  createBoard(size);
  startTimer();
  console.log(difficulty);
  document.getElementById('difficulty-box').style.display = "none";
}

function startTimer(){
  var timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    const minutes = Math.floor(timer / 60);
    const seconds = timer - minutes * 60;

    const newTime = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

    document.getElementById('timer').innerHTML = newTime;
  }, 1000);
}