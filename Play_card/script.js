const symbols = [
 '🍎','🍌','🍇','🍓','🍍','🥝','🍉','🍒',
 '🥥','🍑','🍈','🍋','🍊','🍐','🥭','🫐',
 '🍅','🥕','🌽','🥔','🥦','🍆','🥬','🧄',
 '🧅','🥜','🌰','🍞','🧀','🍗','🍖','🍔'
];

let firstCard = null;
let secondCard = null;
let lock = false;
let moves = 0;
let time = 0;
let timer;
let level = "easy";
let matchedPairs = 0;

function setLevel(lvl) {
  level = lvl;
  document.getElementById("levelPage").style.display = "none";
  document.getElementById("gameSection").style.display = "block";
  startGame();
}

function goBack() {
  clearInterval(timer);
  document.getElementById("gameSection").style.display = "none";
  document.getElementById("levelPage").style.display = "block";
}

function startGame() {
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  let gridSize;
  if (level === "easy") gridSize = 4;
  if (level === "medium") gridSize = 6;
  if (level === "hard") gridSize = 8;

  board.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

  let totalCards = gridSize * gridSize;
  let selectedSymbols = symbols.slice(0, totalCards / 2);

  let gameCards = [...selectedSymbols, ...selectedSymbols];
  gameCards.sort(() => 0.5 - Math.random());

  firstCard = null;
  secondCard = null;
  lock = false;
  matchedPairs = 0;

  moves = 0;
  time = 0;

  document.getElementById("moves").textContent = moves;
  document.getElementById("time").textContent = time;

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    document.getElementById("time").textContent = time;
  }, 1000);

  gameCards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-symbol", symbol);
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lock || this.classList.contains("flipped")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lock = true;
    moves++;
    document.getElementById("moves").textContent = moves;

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      matchedPairs++;
      firstCard = null;
      secondCard = null;
      lock = false;
      checkWin();
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard = null;
        secondCard = null;
        lock = false;
      }, 800);
    }
  }
}

function checkWin() {
  const totalPairs = document.querySelectorAll(".card").length / 2;

  if (matchedPairs === totalPairs) {
    clearInterval(timer);

    let score = Math.max(1000 - (moves * 10 + time * 5), 0);

    document.getElementById("finalScore").innerText =
      `Moves: ${moves}, Time: ${time}s, Score: ${score}`;

    document.getElementById("winPopup").style.display = "flex";
  }
}

function closePopup() {
  document.getElementById("winPopup").style.display = "none";
  startGame();
}
