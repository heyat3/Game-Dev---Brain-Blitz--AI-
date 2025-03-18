// Logic Games main script
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const gameButtons = document.querySelectorAll('.game-button');
    const descriptionCards = document.querySelectorAll('.description-card');
    const gameContainer = document.getElementById('game-container');
    const gameArea = document.getElementById('game-area');
    const currentGameTitle = document.getElementById('current-game-title');
    const backButton = document.getElementById('back-button');
    const container = document.querySelector('.container');
    
    // Initially hide all descriptions
    descriptionCards.forEach(card => {
        card.classList.add('hidden');
    });
    
    // Add initial prompt to select a game
    const descriptionArea = document.querySelector('.description-area');
    const initialPrompt = document.createElement('div');
    initialPrompt.classList.add('description-prompt');
    initialPrompt.innerHTML = `
        <div class="prompt-icon"><i class="fas fa-hand-point-down"></i></div>
        <h3>Select a Logic Challenge</h3>
        <p>Click on any game below to view its description and play.</p>
    `;
    descriptionArea.appendChild(initialPrompt);
    
    // Add event listeners to game buttons
    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameId = button.getAttribute('data-game');
            showDescription(gameId);
            
            // Add event listener for "Play Game" functionality
            const playButton = document.createElement('button');
            playButton.classList.add('play-game-button');
            playButton.innerHTML = '<i class="fas fa-play"></i> Play Game';
            
            // Remove any existing play button before adding a new one
            const existingButton = document.querySelector('.play-game-button');
            if (existingButton) {
                existingButton.remove();
            }
            
            // Add the play button to the description card
            const selectedCard = document.querySelector(`.${gameId}-description`);
            selectedCard.appendChild(playButton);
            
            // Add click event to play button
            playButton.addEventListener('click', () => {
                startGame(gameId);
            });
        });
    });
    
    // Function to show the appropriate description
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
    }
    
    // Function to start a game
    function startGame(gameId) {
        // Hide the main container
        container.classList.add('hidden');
        
        // Show game container
        gameContainer.classList.remove('hidden');
        
        // Set the game title
        const gameName = document.querySelector(`[data-game="${gameId}"] h2`).textContent;
        currentGameTitle.textContent = gameName;
        
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
            
            // This is where we initialize the specific game
            if (gameId === 'pattern') {
                // Start the Pattern Finder game
                if (typeof window.setupPatternFinderGame === 'function') {
                    window.setupPatternFinderGame();
                    startTimer();
                } else {
                    showFallbackGame(gameName);
                }
            } else {
                // For other games, show placeholder for now
                showFallbackGame(gameName);
            }
        });
    }
    
    // Show a fallback game/placeholder when the actual game is not available
    function showFallbackGame(gameName) {
        // Create placeholder
        const gamePlaceholder = document.createElement('div');
        gamePlaceholder.classList.add('game-placeholder');
        gamePlaceholder.innerHTML = `
            <h3>Game: ${gameName}</h3>
            <p>This game is under development. Stay tuned!</p>
            <div class="sample-game">
                <div style="text-align: center;">
                    <p>Coming soon!</p>
                    <p><i class="fas fa-hammer" style="font-size: 2rem; margin: 20px 0; color: var(--blue);"></i></p>
                    <p>We're working hard to bring you this challenge.</p>
                </div>
            </div>
        `;
        gameArea.appendChild(gamePlaceholder);
        
        // Start a timer for demo purposes
        startTimer();
        
        // End game after 10 seconds for demo
        setTimeout(() => {
            stopTimer();
            showScore(Math.floor(Math.random() * 100) + 50);
        }, 10000);
    }
    
    // Back button functionality
    backButton.addEventListener('click', () => {
        // Hide game container
        gameContainer.classList.add('hidden');
        
        // Show main container
        container.classList.remove('hidden');
        
        // Hide score display if visible
        const gameScore = document.getElementById('game-score');
        if (gameScore) {
            gameScore.classList.add('hidden');
        }
        
        // Stop the timer
        stopTimer();
    });
    
    // Timer functions
    let timer = null;
    let timerCount = 0;
    
    function startTimer() {
        stopTimer(); // Ensure no duplicate timers
        timerCount = 0;
        const timerSpan = document.querySelector('#game-timer span');
        timerSpan.textContent = timerCount;
        timer = setInterval(() => {
            timerCount++;
            timerSpan.textContent = timerCount;
        }, 1000);
    }
    
    function stopTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }
    
    // Simple function to show score (for demo purposes)
    function showScore(score) {
        const gameScore = document.getElementById('game-score');
        const scoreValue = document.getElementById('score-value');
        
        scoreValue.textContent = score;
        gameScore.classList.remove('hidden');
    }
    
    // Play Again button functionality
    const playAgainButton = document.getElementById('play-again');
    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
            const gameScore = document.getElementById('game-score');
            gameScore.classList.add('hidden');
            
            // Clear game area and restart the game
            gameArea.innerHTML = '';
            
            // Get current game ID
            const currentGameId = document.querySelector('.game-button.selected').getAttribute('data-game');
            startGame(currentGameId);
        });
    }
    
    // Sample interactive elements for demonstration
    
    // Grid Puzzle sample - toggle cells on click
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach(cell => {
        cell.addEventListener('click', () => {
            cell.classList.toggle('on');
            cell.classList.toggle('off');
        });
    });
    
    // Pattern Example - clicking the question mark reveals the answer
    const patternLastItem = document.querySelector('.pattern-example span:last-child');
    if (patternLastItem) {
        patternLastItem.addEventListener('click', () => {
            patternLastItem.textContent = patternLastItem.textContent === '?' ? '32' : '?';
        });
    }
    
    // Make these functions available globally
    window.showScore = showScore;
    window.startTimer = startTimer;
    window.stopTimer = stopTimer;
});