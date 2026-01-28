let words = [];

async function loadWords() {
    try {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=10`);
        const data = await response.json();
        words = data;
        generateRandomWord();
        updateTries();
    } catch (error) {
        console.error('Failed to load words:', error);
        // Fallback words if API fails
        words = ["example", "javascript", "coding", "challenge"];
        generateRandomWord();
        updateTries();
    }
}
let currentWord = "";
let correctWords = 0;
let tries = 0;
const TOTAL_TRIES = 5;
let triesLeft = TOTAL_TRIES;
let mistakes = 0;
const inputContainer = document.getElementById("inputContainer");
let inputFields = [];

function scrambleWord(word) {
    // Scramble and return the scrambled word
    return word.split("").sort(() => Math.random() - 0.5).join("");
}

function generateInputFields() {
    for (let i = 0; i < currentWord.length; i++) {
        inputContainer.innerHTML += `<input type="text" class="input-field" maxlength="1" />`;
    }
}

function generateRandomWord() {
    // Generate and display scrambled word
    inputContainer.innerHTML = "";
    currentWord = words[Math.floor(Math.random() * words.length)];
    const scrambled = scrambleWord(currentWord);

    document.getElementById("result").textContent = "";
    document.querySelector(".scrambled-word").innerHTML = scrambled.split("").map(letter => `<span>${letter}</span>`).join("");

    generateInputFields();

    // Add event listeners to input fields
    inputFields = document.querySelectorAll(".input-field");
    inputFields.forEach(input => {
        input.addEventListener("input", handleInput);
        
        // Backspace logic to return to previous field
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && input.value === "") {
                const prev = input.previousElementSibling;
                if (prev && prev.classList.contains("input-field")) {
                    prev.focus();
                }
            }
        });
    });
}

function handleInput(event) {
    // Handle input change event
    if (tries >= TOTAL_TRIES) {
        return;
    }
    const input = event.target;
    const value = input.value.toLowerCase();
    input.value = value;
    
    // If a character is entered, move to the next field
    if (value.length >= 1) {
        const next = input.nextElementSibling;
        if (next && next.classList.contains("input-field")) {
            next.focus();
        }
    }
    
    updateMistakes();
    checkWord();
}

function resetGame() {
    // Handle game reset button
    inputContainer.innerHTML = "";
    generateInputFields();
    tries = 0;
    mistakes = 0;
    updateTries();
    updateMistakes();
}

function updateTries() {
    // Update tries 
    document.getElementById("tries").textContent = `Tries ${tries}/5`;
    const triesDots = document.getElementById("triesDots");
    triesDots.innerHTML = "";
    for (let i = 0; i < TOTAL_TRIES; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');

    // If 'i' is less than tries, it's a used (purple) try
    if (i < tries) {
      dot.classList.add('active');
    } else {
      dot.classList.add('inactive');
    }
    
    triesDots.appendChild(dot);
  }
    if (tries >= TOTAL_TRIES) {
        document.getElementById("resetButton").disabled = true;
        document.querySelectorAll(".input-field").forEach(input => {
            input.disabled = true;
        });
    }
}

function updateMistakes() {
    // Update mistakes
    const inputs = document.querySelectorAll(".input-field");
    let mistakes = '';
    inputs.forEach(input => {
        if (input.value !== "") {
            mistakes += input.value + ", ";
        }
    });
    document.getElementById("mistakesList").textContent = mistakes;
}

function checkWord() {
    // Check if the word is correct
    const inputs = document.querySelectorAll(".input-field");
    let word = "";
    inputs.forEach(input => {
        word += input.value;
    });
    if (word.length !== currentWord.length) {
        return;
    }
    if (word === currentWord) {
        updateTries();
        document.getElementById("result").textContent = "Correct!";
        correctWords++;
        
        // Check if user has completed 5 correct words
        if (correctWords === TOTAL_TRIES) {
            alert("Congratulations! You have guessed all the words!");
            resetGame();
            document.getElementById("result").textContent = "";
            generateRandomWord();
        } else {
            tries++;
            updateTries();
            generateRandomWord();
        }
    } else if (tries >= TOTAL_TRIES - 1) { 
        //reset game on 5 tries (tries starts at 0, so 4 means 5 attempts)
        document.getElementById("result").textContent = "Try again!";
        resetGame();
        generateRandomWord();
    } else {
        tries++;
        updateTries();
        document.getElementById("result").textContent = "Incorrect!";
        generateRandomWord();
    }
}

document
    .getElementById("randomButton")
    .addEventListener("click", generateRandomWord);
document.getElementById("resetButton").addEventListener("click", resetGame);


// Initial load
loadWords();