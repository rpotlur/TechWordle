const WORD = 'APPLE'; // The word to guess
let currentGuess = '';
let attempts = 0;
let dictionary = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadDictionary();
    createBoard();
    const hiddenInput = document.getElementById('hidden-input');
    hiddenInput.addEventListener('keydown', handleKeyPress);
    hiddenInput.focus(); // Ensure the input field is focused
});

async function loadDictionary() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json');
        const words = await response.json();
        dictionary = Object.keys(words).filter(word => word.length === 5).map(word => word.toUpperCase());
        console.log('Dictionary loaded:', dictionary.length, 'words');
    } catch (error) {
        console.error('Error loading dictionary:', error);
    }
}

function createBoard() {
    const gameBoard = document.getElementById('game-board');
    for (let i = 0; i < 30; i++) { // 6 attempts x 5 letters
        const cell = document.createElement('div');
        cell.className = 'cell';
        gameBoard.appendChild(cell);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && currentGuess.length === 5) {
        if (dictionary.includes(currentGuess)) {
            checkGuess();
        } else {
            alert('Word not part of the list');
            currentGuess = '';
            updateBoard();
        }
    } else if (event.key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
        currentGuess += event.key.toUpperCase();
        updateBoard();
    }
}

function updateBoard() {
    const boardCells = document.querySelectorAll('.cell');
    const startIndex = attempts * 5;
    for (let i = 0; i < 5; i++) {
        const cell = boardCells[startIndex + i];
        cell.textContent = currentGuess[i] || '';
    }
}

function checkGuess() {
    const guessArray = currentGuess.split('');
    const boardCells = document.querySelectorAll('.cell');
    const startIndex = attempts * 5;
    let correctCount = 0;

    guessArray.forEach((letter, index) => {
        const cell = boardCells[startIndex + index];
        if (WORD[index] === letter) {
            cell.classList.add('correct');
            correctCount++;
        } else if (WORD.includes(letter)) {
            cell.classList.add('present');
        } else {
            cell.classList.add('absent');
        }
    });

    if (correctCount === 5) {
        alert(`Congrats, you guessed the word in ${attempts + 1} turns!`);
        return;
    }

    attempts++;
    currentGuess = '';

    if (attempts === 6) {
        alert(`Sorry, you are out of tries. The word was ${WORD}.`);
    }
}
