/* ================================= 
  DOM VARIABLES
==================================== */

const overlayDiv = document.querySelector("#overlay");
const startButton = document.querySelector(".btn__reset");
const qwertyDiv = document.querySelector("#qwerty");
const phraseDiv = document.querySelector("#phrase");
const phraseUl = phraseDiv.firstElementChild;
const scoreboardDiv = document.querySelector("#scoreboard");
const scoreboardOl = scoreboardDiv.firstElementChild;
const keyboardButtons = qwertyDiv.querySelectorAll("button");

/* ================================= 
  GAME VARIABLES
==================================== */

let missed = 0; // used to keep track of player"s mistakes. 5 = gameover
const phrases = [
    "A blessing in disguise",
    "A dime a dozen",
    "Beat around the bush",
    "Break a leg",
    "Under the weather"
];

/* ================================= 
  GAME FUNCTIONS
==================================== */

// sets up the game
const setupNewGame = () => {
    reset();

    const phraseArray = getRandomPhraseAsArray(phrases);
    addPhraseToDisplay(phraseArray); 
};

const reset = () => {
    // reset all button presses
    for (let i = 0; i < keyboardButtons.length; i++) {
        keyboardButtons[i].disabled = false;
        keyboardButtons[i].removeAttribute("class");
    }

    // reset overlay class to refresh background color
    overlayDiv.className = "start";

    // clear phrase UL
    phraseUl.innerHTML = "";

    // reset lives
    resetLife();
};

const resetLife = () => {
    missed = 0;
    const lifeLIs = scoreboardOl.children;
    for(let i = 0; i < lifeLIs.length; i++) {
        const lifeLI = lifeLIs[i];
        lifeLI.className = "tries";
        const lifeImg = lifeLI.firstElementChild;
        lifeImg.src = "images/liveHeart.png";
    }
};

const subtractLife = () => {
    missed++;
    const lifeLIs = scoreboardOl.querySelectorAll(".tries");
    const lifeLI = lifeLIs[lifeLIs.length - 1]; // get the last one
    const lifeImg = lifeLI.firstElementChild;
    lifeImg.src = "images/lostHeart.png";
    lifeLI.removeAttribute("class");
}

// return a random phrase from an array
const getRandomPhraseAsArray = arr => {
    // arr is an array of phrases

    // pick a random phrase from arr
    const random = Math.floor(Math.random() * arr.length);
    const chosenPhraseString = arr[random];

    // convert that phrase to an array of characters
    const charArray = Array.from(chosenPhraseString);
    console.log(charArray);
    return charArray;
};

// add the letters of a string to the display
const addPhraseToDisplay = arr => {
    // arr is an array of characters
    
    for (let i = 0; i < arr.length; i++) {
        const char = arr[i];

        // create LI
        const newLi = document.createElement("li");
        newLi.textContent = char;

        // if character, add the class "letter"
        if(char.toUpperCase() != char.toLowerCase()) {
            // if true, it"s a letter
            newLi.className = "letter";
        } else {
            newLi.className = "space";
        }

        // add the LI to the UL
        phraseUl.appendChild(newLi);
    }
};

// check if a letter is in the phrase
const checkLetter = button => {

    const selectedLetter = button.textContent;
    const letterLIs = document.querySelectorAll(".letter");
    let match = null;

    for (let i = 0; i < letterLIs.length; i++) {
        const letterLI = letterLIs[i];
        const letterLIValue = letterLI.textContent;
        
        if (selectedLetter.toLowerCase() === letterLIValue.toLowerCase()) {
            letterLI.classList.add("show");

            match = letterLIValue;
        }
    }

    // If there’s a match, the function should add the “show” class to the list item containing that letter, store the matching letter inside of a variable, and return that letter.
    // If a match wasn’t found, the function should return null.
    return match;
};

// check if the game has been won or lost
const checkWin = () => {
    const shownLetters = document.querySelectorAll(".show");
    const letters = document.querySelectorAll(".letter");

    if (shownLetters.length === letters.length) {
        // win. show the overlay screen with the "win" class
        console.log("Player won");

        overlayDiv.classList.add("win");
        const message = overlayDiv.querySelector("h2");
        message.textContent = "You won!";
        startButton.textContent = "Play again";
        overlayDiv.style.display = "flex";
    } else if (missed >= 5) {
        // lost. show the overlay screen with the "lose" class
        console.log("Player lost");

        overlayDiv.classList.add("lose");
        const message = overlayDiv.querySelector("h2");
        message.textContent = "You lost!";
        startButton.textContent = "Play again";
        overlayDiv.style.display = "flex";
    }
};

/* ================================= 
  EVENT LISTENERS
==================================== */

// listen for the start game button to be pressed
startButton.addEventListener("click", (e) => {
    // hide the overlay
    overlayDiv.style.display = "none";

    // start game
    setupNewGame();
});

// listen for the onscreen keyboard to be clicked
qwertyDiv.addEventListener("click", (e) => {
    // only listen from buttons

    if (e.target.tagName === "BUTTON") {
        const button = e.target;

        if (button.className === "") {
            // only handle buttons that haven't been clicked yet

            button.className = "chosen";
            button.disabled = true;

            let letterFound = checkLetter(button);

            if (!letterFound) {
                // player guessed wrong
                subtractLife();
            } 
        }

        // check if game reaches end state already
        checkWin();
    }
});