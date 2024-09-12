const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

document.addEventListener("keydown", function(event) {
  // التحقق مما إذا كانت المفتاح المضغوط هو "Enter" (الكود 13)
  // أو أحد المفاتيح الرقمية (من 0 إلى 9)
  if (event.key === "Enter" || (event.key >= "0" && event.key <= "9")) {
    addTask();
  }
});

let currentWord, correctLetters = [], wrongGuessCount = 0;
const maxGuesses = 6;

const resetGame = () => {
  // Resetting all game variables and UI elements
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
  wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
  gameModal.classList.remove("show");
}

const getRandomWord = () => {
  // Selecting a random word and hint from the wordlist
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word;
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
 
}
const gameOver = (isVictory) => {
  //After 600ms of game complete.. showing modal with relevant details
  setTimeout(() => {
      const modalText = isVictory ? 'You found the word:' : 'The correcr word was:';
      gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
      gameModal.querySelector("h4").innerText = `${isVictory ? 'congrats!' : 'game over!'}`;
      gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
      gameModal.classList.add("show");
  }, 300);
}

const initGame = (button, clickedLetter) => {
  // Checking if clickedletter is exist on the currentword
  if(currentWord.includes(clickedLetter)) {
    // Showing all correct letters on the word display
    [...currentWord].forEach((letter, index)=> {
      if(letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
      }
    })
  } else {
    // If clicked letter doesnt exist the update the wronguesscount and hangman image
    wrongGuessCount++;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  }

  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  // Calling gameover function if any of these condition meets
  if(wrongGuessCount === maxGuesses) return gameOver(false);
  if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);