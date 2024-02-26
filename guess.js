//  Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector('h1').innerHTML = gameName;
document.querySelector('footer').innerHTML = `${gameName} Game Created by Zyad Nasr`;



// Setting Game Options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;


// manage words
let wordToGuess = "";
const words = ["create", "update", "delete", "master", "branch", "mainly", "elzozz", "school"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// manage hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

// console.log(wordToGuess);

function generateInput() {
    const inputsContainer = document.querySelector('.inputs');

    // create number of trys
    for (let i = 1; i <= numberOfTries; i++) {
        const tryDev = document.createElement("div");
        tryDev.classList.add(`try${i}`);
        tryDev.innerHTML = `<span>Try ${i}</span>`

        if (i !== 1) tryDev.classList.add("disapled-inputs");

        // create inputs
        for (let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter${j}`;
            input.setAttribute("maxlength", "1")
            tryDev.appendChild(input);
        }

        inputsContainer.appendChild(tryDev);
    }
    inputsContainer.children[0].children[1].focus();

    // Disaple all inputs expect the first one
    const inputsInDisapledDiv = document.querySelectorAll(".disapled-inputs input")
    inputsInDisapledDiv.forEach((input) => {
        input.disabled = true;
    } );

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // convert all letters to upperCase
        input.addEventListener("input", function () { 
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });

        input.addEventListener("keydown", function(event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            // console.log(currentIndex)
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0 ) inputs[prevInput].focus();
            }
        } )
    });
}


const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

console.log(wordToGuess);

function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // Game logic
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        }else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        }else {
            inputField.classList.add("no");
            successGuess = false;
        }

    }

    // check if user win or lose
    if (successGuess) {
        messageArea.innerHTML = `you win the word is <span>${wordToGuess}</span>`;

        // disaple all inputs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDev) => tryDev.classList.add("disapled-inputs") );

        // disaple Guess Button
        guessButton.disabled = true;
        getHintButton.disabled = true;
    }else {
        document.querySelector(`.try${currentTry}`).classList.add("disapled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        currentTry++;
        const nextTryInputs = document.querySelectorAll(`.try${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));


        let el = document.querySelector(`.try${currentTry}`);
        if (el) {
            document.querySelector(`.try${currentTry}`).classList.remove("disapled-inputs");
            el.children[1].focus();
        }else {
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `you lose the word is <span>${wordToGuess}</span>`;
        }
    }
}

function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if (numberOfHints === 0) {
        getHintButton.disabled = true;
    }


    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    // console.log(emptyEnabledInputs);

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        // console.log(randomIndex);
        // console.log(randomInput);
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackSpace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

document.addEventListener("keydown", handleBackSpace);


window.onload = function () {
    generateInput();
}