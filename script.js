// Game data structure
const games = [
    { 
        id: 'typing', 
        name: 'Typing Challenge', 
        description: 'Test your typing speed and accuracy.',
        instructions: 'Type the shown text as quickly and accurately as possible.',
        setup: setupTypingGame
    },
    { 
        id: 'memory', 
        name: 'Memory Match', 
        description: 'Remember and match pairs of cards.',
        instructions: 'Find all matching pairs of cards in the fewest attempts possible.',
        setup: setupMemoryGame
    },
    { 
        id: 'reaction', 
        name: 'Reaction Test', 
        description: 'Test your reaction time to visual stimuli.',
        instructions: 'Click on the target as soon as it appears on screen.',
        setup: setupReactionGame
    },
    { 
        id: 'sequence', 
        name: 'Number Sequence', 
        description: 'Identify and continue number patterns.',
        instructions: 'Determine the pattern and select the next number in the sequence.',
        setup: setupSequenceGame
    },
    { 
        id: 'shapes', 
        name: 'Shape Sorter', 
        description: 'Sort shapes by color, size, and type.',
        instructions: 'Drag shapes to their matching categories as quickly as possible.',
        setup: setupShapesGame
    },
    { 
        id: 'math', 
        name: 'Speed Math', 
        description: 'Solve math problems against the clock.',
        instructions: 'Solve as many arithmetic problems as you can before time runs out.',
        setup: setupMathGame
    }
];

// DOM elements
const container = document.querySelector('.container');
const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');
const currentGameTitle = document.getElementById('current-game-title');
const backButton = document.getElementById('back-button');
const randomButton = document.getElementById('random-game');
const gameButtons = document.querySelectorAll('.game-button');
const gameScore = document.getElementById('game-score');
const scoreValue = document.getElementById('score-value');
const playAgainButton = document.getElementById('play-again');
const gameTimer = document.getElementById('game-timer');
const timerValue = gameTimer.querySelector('span');
const descriptionCards = document.querySelectorAll('.description-card');

// Game state
let currentGame = null;
let timer = null;
let timerCount = 0;

// Initialize the application
function init() {
    // Initially hide all descriptions
    descriptionCards.forEach(card => {
        card.classList.add('hidden');
    });
    
    // First remove any existing prompts to prevent duplicates
    const existingPrompt = document.querySelector('.description-prompt');
    if (existingPrompt) {
        existingPrompt.remove();
    }
    
    // Add initial prompt to select a game
    const descriptionArea = document.querySelector('.description-area');
    const initialPrompt = document.createElement('div');
    initialPrompt.classList.add('description-prompt');
    initialPrompt.innerHTML = `
        <div class="prompt-icon"><i class="fas fa-hand-point-down"></i></div>
        <h3>Select a Game</h3>
        <p>Click on any game below to view its description and play.</p>
    `;
    descriptionArea.appendChild(initialPrompt);
    
    // Add event listeners to game buttons
    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game');
            showDescription(gameId);
        });
    });

    // Random game button
    randomButton.addEventListener('click', startRandomGame);

    // Back button
    backButton.addEventListener('click', goBackToMenu);

    // Play again button
    playAgainButton.addEventListener('click', () => {
        gameScore.classList.add('hidden');
        startGame(currentGame.id);
    });
}

// Show description for a game
function showDescription(gameId) {
    // Hide all description cards
    descriptionCards.forEach(card => {
        card.classList.add('hidden');
    });
    
    // Hide the initial prompt if it exists
    const initialPrompt = document.querySelector('.description-prompt');
    if (initialPrompt) {
        initialPrompt.remove();
    }
    
    // Show the selected game description
    const selectedCard = document.querySelector(`.${gameId}-description`);
    if (selectedCard) {
        selectedCard.classList.remove('hidden');
    }
    
    // Highlight the selected button
    gameButtons.forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-game') === gameId) {
            button.classList.add('selected');
        }
    });
    
    // Add a "Play Game" button to the description if it doesn't exist
    if (!selectedCard.querySelector('.play-game-button')) {
        const playButton = document.createElement('button');
        playButton.classList.add('play-game-button');
        playButton.innerHTML = '<i class="fas fa-play"></i> Play Game';
        selectedCard.appendChild(playButton);
        
        // Add click event to play button
        playButton.addEventListener('click', () => {
            startGame(gameId);
        });
    }
}

// Start a specific game
function startGame(gameId) {
    // Find the game in our games array
    currentGame = games.find(game => game.id === gameId);
    if (!currentGame) return;

    // Update UI
    container.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameScore.classList.add('hidden');
    currentGameTitle.textContent = currentGame.name;
    
    // Copy the description content to the game area
    const descriptionCard = document.querySelector(`.${gameId}-description`).cloneNode(true);
    
    // Remove the play button from the cloned description if it exists
    const playButton = descriptionCard.querySelector('.play-game-button');
    if (playButton) {
        playButton.remove();
    }
    
    // Create game instructions container
    const gameInstructions = document.createElement('div');
    gameInstructions.classList.add('game-instructions');
    
    // Add the description card to the instructions
    gameInstructions.appendChild(descriptionCard);
    descriptionCard.classList.remove('hidden'); // Ensure it's visible
    
    // Add start button
    const startButton = document.createElement('button');
    startButton.classList.add('start-button');
    startButton.innerHTML = '<i class="fas fa-play-circle"></i> Start Game';
    gameInstructions.appendChild(startButton);
    
    // Clear and update game area
    gameArea.innerHTML = '';
    gameArea.appendChild(gameInstructions);
    
    // Start button event listener
    startButton.addEventListener('click', () => {
        // Clear instructions
        gameArea.innerHTML = '';
        
        // Reset timer
        timerCount = 0;
        timerValue.textContent = timerCount;
        
        // Start the timer
        startTimer();
        
        // Setup the specific game
        try {
            if (gameId === 'shapes' && typeof window.setupShapesGame === 'function') {
                // Start the Shape Sorter game
                window.setupShapesGame();
            } else if (typeof window[`setup${currentGame.id.charAt(0).toUpperCase() + currentGame.id.slice(1)}Game`] === 'function') {
                // Function exists, call it
                window[`setup${currentGame.id.charAt(0).toUpperCase() + currentGame.id.slice(1)}Game`]();
            } else if (currentGame.setup && typeof currentGame.setup === 'function') {
                // Use the function from the game object
                currentGame.setup();
            } else {
                // No function found, show error
                throw new Error(`Game setup function not found for ${currentGame.id}`);
            }
        } catch (error) {
            console.error("Error starting game:", error);
            
            // Show error message to user
            const errorMessage = document.createElement('div');
            errorMessage.style.padding = '20px';
            errorMessage.style.backgroundColor = '#fee2e2';
            errorMessage.style.color = '#ef4444';
            errorMessage.style.borderRadius = '8px';
            errorMessage.style.margin = '20px 0';
            errorMessage.style.textAlign = 'center';
            errorMessage.innerHTML = `
                <h3 style="margin-bottom: 10px">Oops! Something went wrong</h3>
                <p>There was an error starting the ${currentGame.name}.</p>
                <p>Please try another game or reload the page.</p>
            `;
            gameArea.appendChild(errorMessage);
        }
    });
}

// Start a random game
function startRandomGame() {
    const randomIndex = Math.floor(Math.random() * games.length);
    const randomGameId = games[randomIndex].id;
    
    // First show the description
    showDescription(randomGameId);
    
    // Then automatically start the game after a short delay
    setTimeout(() => {
        const playButton = document.querySelector('.play-game-button');
        if (playButton) {
            playButton.click();
        }
    }, 1000);
}

// Go back to the main menu
function goBackToMenu() {
    // Stop the timer if running
    stopTimer();
    
    // Update UI
    gameContainer.classList.add('hidden');
    container.classList.remove('hidden');
    gameScore.classList.add('hidden');
    
    // Reset game state
    currentGame = null;
    
    // Check if we need to restore the initial prompt
    const descriptionArea = document.querySelector('.description-area');
    const visibleDescription = document.querySelector('.description-card:not(.hidden)');
    
    // If no description is visible, add the initial prompt back
    if (!visibleDescription) {
        // Remove any existing prompts first (shouldn't be any, but just in case)
        const existingPrompt = document.querySelector('.description-prompt');
        if (existingPrompt) {
            existingPrompt.remove();
        }
        
        // Add the initial prompt
        const initialPrompt = document.createElement('div');
        initialPrompt.classList.add('description-prompt');
        initialPrompt.innerHTML = `
            <div class="prompt-icon"><i class="fas fa-hand-point-down"></i></div>
            <h3>Select a Game</h3>
            <p>Click on any game below to view its description and play.</p>
        `;
        descriptionArea.appendChild(initialPrompt);
    }
}

// Timer functions
function startTimer() {
    stopTimer(); // Ensure no duplicate timers
    timerCount = 0;
    timerValue.textContent = timerCount;
    timer = setInterval(() => {
        timerCount++;
        timerValue.textContent = timerCount;
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// Show score at the end of a game
function showScore(score) {
    stopTimer();
    scoreValue.textContent = score;
    gameScore.classList.remove('hidden');
}

// Make these functions available globally
window.showScore = showScore;
window.startTimer = startTimer;
window.stopTimer = stopTimer;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Placeholder functions for minigames (to be replaced by actual implementations)
// These ensure the code doesn't break if a game module fails to load
if (typeof setupTypingGame !== 'function') {
    function setupTypingGame() {
        const typingArea = document.createElement('div');
        typingArea.classList.add('placeholder-game');
        typingArea.innerHTML = `<p>Typing game module failed to load.</p>`;
        gameArea.appendChild(typingArea);
    }
}

if (typeof setupMemoryGame !== 'function') {
    function setupMemoryGame() {
        const memoryArea = document.createElement('div');
        memoryArea.classList.add('placeholder-game');
        memoryArea.innerHTML = `<p>Memory game module failed to load.</p>`;
        gameArea.appendChild(memoryArea);
    }
}

if (typeof setupReactionGame !== 'function') {
    function setupReactionGame() {
        const reactionArea = document.createElement('div');
        reactionArea.classList.add('placeholder-game');
        reactionArea.innerHTML = `<p>Reaction game module failed to load.</p>`;
        gameArea.appendChild(reactionArea);
        
        setTimeout(() => showScore(320), 3000);
    }
}

if (typeof setupSequenceGame !== 'function') {
    function setupSequenceGame() {
        const sequenceArea = document.createElement('div');
        sequenceArea.classList.add('placeholder-game');
        sequenceArea.innerHTML = `<p>Sequence game module failed to load.</p>`;
        gameArea.appendChild(sequenceArea);
        
        setTimeout(() => showScore(7), 3000);
    }
}

if (typeof setupShapesGame !== 'function') {
    function setupShapesGame() {
        const shapesArea = document.createElement('div');
        shapesArea.classList.add('placeholder-game');
        shapesArea.innerHTML = `<p>Shapes game module failed to load.</p>`;
        gameArea.appendChild(shapesArea);
        
        setTimeout(() => showScore(12), 3000);
    }
}

if (typeof setupMathGame !== 'function') {
    function setupMathGame() {
        const mathArea = document.createElement('div');
        mathArea.classList.add('placeholder-game');
        mathArea.innerHTML = `<p>Math game module failed to load.</p>`;
        gameArea.appendChild(mathArea);
        
        setTimeout(() => showScore(15), 3000);
    }
}