const closeIntroPopup = document.getElementById("play-button");
const closeRulesPopup = document.getElementById("close-rules-popup");
const closeSharePopup = document.getElementById("close-share-popup");

// EVENT LISTENERS
closeIntroPopup.addEventListener("click", function () {
  document.getElementById("intro-popup-container").style.display = "none";
  document.getElementById("rules-popup-container").style.display = "none";
});

closeRulesPopup.addEventListener("click", function () {
  document.getElementById("rules-popup-container").style.display = "none";
});

closeSharePopup.addEventListener("click", function () {
  document.getElementById("share-popup-container").style.display = "none";
});

const flashcards = [
  {
    value: 100,
    word: "commit",
    definition: "Commits *ahem* the staged snapshot to the project history",
  },
  { value: 200, word: "init", definition: "Initializes a new Git repository." },
  {
    value: 300,
    word: "merge",
    definition: "Integrates changes from forked branches",
  },
  {
    value: 400,
    word: "pull",
    definition: "Download branch from remote repo and merge to current branch",
  },
  {
    value: 500,
    word: "push",
    definition: "Move local branch to another repository",
  },
  {
    value: 600,
    word: "branch",
    definition: "Creates isolated dev environments with one repository",
  },
  {
    value: 700,
    word: "clean",
    definition: "Removes untracked files from the working directory.",
  },
  {
    value: 800,
    word: "clone",
    definition: "Creates a copy of an existing repository.",
  },
  {
    value: 900,
    word: "rebase",
    definition:
      "Moves branches around, helping to avoid unnecessary merge commits.",
  },
  {
    value: 1000,
    word: "reset",
    definition: "Undoes changes to files in the working directory.",
  },
];

// sums up every card.value to give us the max possible points
let possiblePoints = flashcards.reduce((sum, card) => sum + card.value, 0);
let board = document.getElementById("game-board");
let turn = 0;
let nextLetter = 0;
let score = 0;

const flashcard = document.getElementById("flashcard");
const nextButton = document.getElementById("nextButton");

let currentCommand = flashcards[turn].word.toUpperCase().split("");

const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");
    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }
    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

const updateFlashcard = () => {
  if (turn === flashcards.length) {
    gameOver();
    return;
  }
  const { value, definition } = flashcards[turn];
  document.getElementById("flashcardValue").innerHTML = "$" + value;
  document.getElementById("flashcardDef").innerHTML = definition;

  function gameOver() {
    // document.getElementById("keyboard-cont").style.display = "none";
    document.getElementById("nextButton").style.display = "none";
    // document.getElementById("card").style.display = "none";
    document.getElementById("share-popup-container").style.display = "flex";
    document.getElementById("answers-button").style.display = "block";
    document.getElementById("play-again-button").style.display = "block";

    let gameResultShareText =
      "You git $" + score + " out of a possible $" + possiblePoints;
    document.getElementById("game-result").innerHTML = gameResultShareText;
  }

  let row = document.createElement("div");
  row.className = "letter-row";

  //splits current command into array of letters
  currentCommand = flashcards[turn].word.toUpperCase().split("");
  console.log(currentCommand);

  // loop through array of letters just created to draw # of boxes necessary as per letter count
  for (j = 0; j < currentCommand.length; j++) {
    let box = document.createElement("div");
    box.className = "letter-box";
    let delay = 250 * j;

    setTimeout(() => {
      //flip box
      animateCSS(box, "fadeInUp");
      row.appendChild(box);
    }, delay);
  }
  board.appendChild(row);
};

function openSharePopup() {
  document.getElementById("share-popup-container").style.display = "flex";

  // if HIDE button is visible, SHOW button should not be because answers are already being shown
  if (
    document.getElementById("hide-answers-button").style.display === "block"
  ) {
    document.getElementById("answers-button").style.display = "none";
  } else {
    document.getElementById("answers-button").style.display = "block";
  }

  let gameResultShareText =
    "You git $" + score + " out of a possible $" + possiblePoints;
  document.getElementById("game-result").innerHTML = gameResultShareText;

  document.getElementById("play-again-button").style.display = "block";
}

nextButton.addEventListener("click", () => {
  turn++;
  let row = document.getElementsByClassName("letter-row")[0];
  nextLetter = 0;
  board.removeChild(row);

  updateFlashcard();
});

updateFlashcard();

document.addEventListener("keyup", (e) => {
  let pressedKey = String(e.key);

  if (pressedKey === "Backspace" && nextLetter !== 0) {
    let row = document.getElementsByClassName("letter-row")[0];
    for (i = 0; i < currentCommand.length; i++) {
      let box = row.children[i];
      box.classList.remove("incorrect-box");
    }
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

// Listener for onscreen keyboard
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (
    target.classList.contains("keyboard-button") ||
    target.classList.contains("keyboard-button-spec")
  ) {
    let key = target.textContent;

    if (key === "Del") {
      key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
  } else {
    return;
  }
});

function insertLetter(pressedKey) {
  if (nextLetter === currentCommand.length) {
    return;
  }

  pressedKey = pressedKey.toUpperCase();

  let row = document.getElementsByClassName("letter-row")[0];
  let box = row.children[nextLetter];

  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");

  nextLetter++;
}

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[0];
  let box = row.children[nextLetter - 1];

  box.textContent = "";
  box.classList.remove("filled-box");
  box.classList.remove("incorrect-box");
  row.classList.remove("incorrect-box");
  nextLetter--;
}

function wrong() {
  toastr.error("Try again!");
  row = document.getElementsByClassName("letter-row")[0];
  animateBoxes();

  function animateBoxes() {
    for (let i = 0; i < currentCommand.length; i++) {
      setTimeout(() => {
        let box = row.children[i];
        box.classList.add("incorrect-box");
      }, i * 125);
    }
  }
}

function right() {
  toastr.success("You git it!");
  row = document.getElementsByClassName("letter-row")[0];
  animateBoxes();

  function animateBoxes() {
    for (let i = 0; i < currentCommand.length; i++) {
      setTimeout(() => {
        let box = row.children[i];
        box.classList.remove("incorrect-box");
        box.classList.add("correct-box");
        animateCSS(box, "jackInTheBox");
      }, i * 125);
    }
  }

  score += flashcards[turn].value;
  document.getElementById("score").innerHTML = "$" + score;
  setTimeout(() => {
    turn++;
    nextLetter = 0;
    board.removeChild(row);
    updateFlashcard();
  }, currentCommand.length * 250);
}

function checkGuess() {
  // "points" are used here not as anything the player sees.
  // Points are given for every iteration of the loop below IF each letter given by player matches each corresponding letter in the correct response.
  // If # points === length of currentCommand, then all letters must match and thus the player's response is correct.
  points = 0;
  let row = document.getElementsByClassName("letter-row")[0];

  for (i = 0; i < currentCommand.length; i++) {
    if (row.children[i].textContent !== currentCommand[i]) {
      wrong();
      break;
    } else {
      points++;
      if (points === currentCommand.length) {
        right();
      }
    }
  }
}

function answers() {
  document.getElementById("answers-button").style.display = "none";
  document.getElementById("hide-answers-button").style.display = "block";
  for (let i = 0; i < flashcards.length; i++) {
    const word = document.getElementById(`flashcard-word-${i}`);
    const def = document.getElementById(`flashcard-def-${i}`);
    if (word) {
      word.innerHTML = flashcards[i].word;
      word.style.display = "flex";
    }
    if (def) {
      def.innerHTML = flashcards[i].definition;
      def.style.display = "flex";
    }
  }
}

function hideAnswers() {
  document.getElementById("answers-button").style.display = "block";
  document.getElementById("hide-answers-button").style.display = "none";
  for (let i = 0; i < flashcards.length; i++) {
    const word = document.getElementById(`flashcard-word-${i}`);
    const def = document.getElementById(`flashcard-def-${i}`);
    if (word) {
      word.innerHTML = flashcards[i].word;
      word.style.display = "none";
    }
    if (def) {
      def.innerHTML = flashcards[i].definition;
      def.style.display = "none";
    }
  }
}

function openInstructions() {
  document.getElementById("intro-popup-container").style.display = "none";
  document.getElementById("rules-popup-container").style.display = "flex";
}

function playAgain() {
  location.reload();
}
