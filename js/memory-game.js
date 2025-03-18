// Memory Match Game
function setupMemoryGame() {
    console.log("Memory game starting...");
    
    // Game container
    const memoryGameContainer = document.createElement('div');
    memoryGameContainer.classList.add('memory-game-container');
    
    // Game state
    let level = 1;
    let pairs = 0;
    let totalPairs = 8; // Start with 8 pairs (16 cards)
    let moves = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let gameActive = true;
    let score = 0;
    let timeElapsed = 0;
    let timerInterval = null;
    
    // Card content options - simple letters and symbols
    const cardSymbols = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '♠', '♥', '♦', '♣', '★', '♛', '♞', '✿'
    ];
    
    // Card colors
    const cardColors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
        '#84cc16', '#14b8a6', '#a855f7', '#f43f5e', '#64748b', '#0ea5e9', '#d946ef', '#10b981'
    ];
    
    // Initialize game UI
    memoryGameContainer.innerHTML = `
        <div class="memory-header">
            <div class="memory-stats">
                <div class="memory-stat">
                    <i class="fas fa-layer-group"></i> Level: <span class="level">1</span>
                </div>
                <div class="memory-stat">
                    <i class="fas fa-puzzle-piece"></i> Pairs: <span class="pairs">0</span>/<span class="total-pairs">8</span>
                </div>
                <div class="memory-stat">
                    <i class="fas fa-sync-alt"></i> Moves: <span class="moves">0</span>
                </div>
                <div class="memory-stat">
                    <i class="fas fa-stopwatch"></i> Time: <span class="time">0</span>s
                </div>
            </div>
        </div>
        
        <div class="memory-grid">
            <!-- Cards will be added here dynamically -->
        </div>
        
        <div class="memory-feedback hidden"></div>
        
        <div class="memory-timer">
            <div class="memory-timer-bar" style="width: 100%"></div>
        </div>
    `;
    
    // Add to game area
    document.getElementById('game-area').appendChild(memoryGameContainer);
    
    // Get DOM elements
    const memoryGrid = memoryGameContainer.querySelector('.memory-grid');
    const levelDisplay = memoryGameContainer.querySelector('.level');
    const pairsDisplay = memoryGameContainer.querySelector('.pairs');
    const totalPairsDisplay = memoryGameContainer.querySelector('.total-pairs');
    const movesDisplay = memoryGameContainer.querySelector('.moves');
    const timeDisplay = memoryGameContainer.querySelector('.time');
    const feedbackDisplay = memoryGameContainer.querySelector('.memory-feedback');
    const timerBar = memoryGameContainer.querySelector('.memory-timer-bar');
    
    // Create cards for the current level
    function createCards(level) {
        memoryGrid.innerHTML = '';
        
        // Determine grid size based on level
        let pairsCount;
        if (level === 1) {
            pairsCount = 8; // 4x4 grid
            memoryGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else if (level === 2) {
            pairsCount = 10; // 5x4 grid
            memoryGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        } else {
            pairsCount = 12; // 6x4 grid
            memoryGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
        }
        
        totalPairs = pairsCount;
        totalPairsDisplay.textContent = totalPairs;
        
        // Create a shuffled array of symbols and colors
        const levelSymbols = [...cardSymbols.slice(0, pairsCount)];
        const levelColors = [...cardColors.slice(0, pairsCount)];
        
        let cardPairs = [];
        for (let i = 0; i < pairsCount; i++) {
            cardPairs.push({
                symbol: levelSymbols[i],
                color: levelColors[i]
            });
        }
        
        // Double the array to create pairs and shuffle
        const cardContent = [...cardPairs, ...cardPairs];
        shuffleArray(cardContent);
        
        // Create card elements
        cardContent.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.setAttribute('data-symbol', item.symbol);
            card.innerHTML = `
                <div class="card-front">
                    <span style="color: ${item.color};">${item.symbol}</span>
                </div>
                <div class="card-back"></div>
            `;
            
            card.addEventListener('click', flipCard);
            memoryGrid.appendChild(card);
        });
        
        // Reset game state
        pairs = 0;
        moves = 0;
        pairsDisplay.textContent = pairs;
        movesDisplay.textContent = moves;
        
        // Show all cards briefly
        const allCards = document.querySelectorAll('.memory-card');
        allCards.forEach(card => card.classList.add('flipped'));
        
        setTimeout(() => {
            if (gameActive) {
                allCards.forEach(card => card.classList.remove('flipped'));
                startTimer();
            }
        }, 2000);
    }
    
    // Start the timer
    function startTimer() {
        const timeLimit = getTimeLimit();
        let timeRemaining = timeLimit;
        
        // Reset timer display and bar
        timeElapsed = 0;
        timeDisplay.textContent = timeElapsed;
        timerBar.style.width = '100%';
        
        // Start timer interval
        timerInterval = setInterval(() => {
            timeElapsed++;
            timeRemaining--;
            timeDisplay.textContent = timeElapsed;
            
            // Update timer bar
            const percentRemaining = (timeRemaining / timeLimit) * 100;
            timerBar.style.width = `${percentRemaining}%`;
            
            // Add warning class when time is running low
            if (percentRemaining < 30) {
                timerBar.classList.add('warning');
            }
            
            // Time's up
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                endGame(false);
            }
        }, 1000);
    }
    
    // Get time limit based on level
    function getTimeLimit() {
        if (level === 1) return 60;     // 60 seconds for level 1
        if (level === 2) return 90;     // 90 seconds for level 2
        return 120;                     // 120 seconds for level 3+
    }
    
    // Card flip logic
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        // Flip the card
        this.classList.add('flipped');
        
        // First card flipped
        if (!firstCard) {
            firstCard = this;
            return;
        }
        
        // Second card flipped
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        
        // Check for match
        checkForMatch();
    }
    
    // Check if the two flipped cards match
    function checkForMatch() {
        lockBoard = true;
        
        const isMatch = firstCard.getAttribute('data-symbol') === secondCard.getAttribute('data-symbol');
        
        if (isMatch) {
            // Cards match
            disableCards();
            pairs++;
            pairsDisplay.textContent = pairs;
            
            // Add matched class for visual feedback
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            // Add match animation
            firstCard.classList.add('match-animation');
            secondCard.classList.add('match-animation');
            
            // Calculate score for this match
            const speed = getSpeedBonus();
            const movesPenalty = Math.max(0, 5 - Math.floor(moves / 2));
            const matchScore = 10 + speed + movesPenalty;
            score += matchScore;
            
            // Show feedback
            showFeedback(`Match! +${matchScore} points`, 'success');
            
            // Check if all pairs found
            if (pairs === totalPairs) {
                // Add level completion bonus
                const levelBonus = level * 20;
                score += levelBonus;
                
                // Show level complete feedback
                showFeedback(`Level ${level} complete! +${levelBonus} bonus points!`, 'level-complete');
                
                // End level after a delay
                setTimeout(() => {
                    if (level < 3) {
                        // Advance to next level
                        level++;
                        levelDisplay.textContent = level;
                        clearInterval(timerInterval);
                        resetBoard();
                        createCards(level);
                    } else {
                        // Game completed
                        endGame(true);
                    }
                }, 1500);
            } else {
                // Continue game
                resetBoard();
            }
        } else {
            // Cards don't match
            unflipCards();
        }
    }
    
    // Get speed bonus based on time elapsed
    function getSpeedBonus() {
        if (timeElapsed < 10) return 10;  // Fast match
        if (timeElapsed < 20) return 5;   // Decent match
        return 0;                         // Slow match
    }
    
    // Disable matched cards
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }
    
    // Unflip non-matching cards
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 800);
    }
    
    // Reset board for next selection
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }
    
    // Show feedback message
    function showFeedback(message, type) {
        feedbackDisplay.textContent = message;
        feedbackDisplay.className = 'memory-feedback'; // Reset classes
        feedbackDisplay.classList.add(type);
        feedbackDisplay.classList.remove('hidden');
        
        // Hide feedback after a delay
        setTimeout(() => {
            feedbackDisplay.classList.add('hidden');
        }, 2000);
    }
    
    // End the game
    function endGame(success) {
        gameActive = false;
        clearInterval(timerInterval);
        
        // Calculate final score
        if (success) {
            // Add completion bonus
            const timeBonus = Math.floor(getTimeLimit() - timeElapsed) * 2;
            score += timeBonus;
            showFeedback(`Game Complete! Time bonus: +${timeBonus}`, 'level-complete');
        } else {
            showFeedback("Time's up! Game Over", 'failure');
        }
        
        // Apply match animation to all matched cards
        const matchedCards = document.querySelectorAll('.memory-card.matched');
        matchedCards.forEach(card => {
            card.classList.add('celebrate');
        });
        
        // Show final score
        setTimeout(() => {
            window.showScore(score);
        }, 2000);
    }
    
    // Shuffle array helper function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Start the game with level 1
    createCards(level);
    
    // Add CSS for the Memory Match game
    const style = document.createElement('style');
    style.textContent = `
        .memory-game-container {
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .memory-header {
            width: 100%;
            margin-bottom: 20px;
        }
        
        .memory-stats {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            width: 100%;
        }
        
        .memory-stat {
            padding: 10px 15px;
            background-color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            font-weight: 500;
        }
        
        .memory-stat i {
            margin-right: 5px;
            color: var(--purple);
        }
        
        .memory-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            width: 100%;
            max-width: 600px;
            margin: 0 auto 20px;
            perspective: 1000px;
        }
        
        @media (max-width: 500px) {
            .memory-stats {
                flex-direction: column;
            }
            
            .memory-grid {
                gap: 10px;
            }
        }
        
        .memory-card {
            height: 0;
            padding-bottom: 100%;
            position: relative;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
            transform-style: preserve-3d;
            transition: transform 0.5s;
            cursor: pointer;
            background-color: #f8fafc;
            overflow: hidden;
        }
        
        .memory-card.flipped {
            transform: rotateY(180deg);
        }
        
        .memory-card.matched {
            border: 2px solid var(--green);
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
        
        .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: var(--radius-md);
        }
        
        .card-front {
            transform: rotateY(180deg);
            background-color: white;
            color: var(--text-primary);
        }
        
        .card-front span {
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .card-back {
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
        }
        
        .card-back::after {
            content: "?";
            font-size: 2rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        /* Animations */
        @keyframes matched {
            0%, 100% { transform: rotateY(180deg) scale(1); }
            50% { transform: rotateY(180deg) scale(1.1); }
        }
        
        .match-animation {
            animation: matched 0.5s ease;
        }
        
        @keyframes celebrate {
            0% { transform: rotateY(180deg) scale(1); }
            50% { transform: rotateY(180deg) scale(1.2); box-shadow: 0 0 20px rgba(139, 92, 246, 0.8); }
            100% { transform: rotateY(180deg) scale(1); }
        }
        
        .memory-card.celebrate {
            animation: celebrate 1s ease infinite;
        }
        
        /* Timing bar */
        .memory-timer {
            width: 100%;
            height: 6px;
            background-color: #e2e8f0;
            border-radius: var(--radius-full);
            margin-top: 20px;
            overflow: hidden;
        }
        
        .memory-timer-bar {
            height: 100%;
            background: linear-gradient(to right, var(--purple), var(--blue));
            border-radius: var(--radius-full);
            transition: width 0.1s linear;
        }
        
        .memory-timer-bar.warning {
            background: linear-gradient(to right, var(--red), var(--yellow));
        }
        
        /* Feedback */
        .memory-feedback {
            width: 100%;
            padding: 15px 20px;
            border-radius: var(--radius-md);
            text-align: center;
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        
        .memory-feedback.success {
            background-color: rgba(34, 197, 94, 0.1);
            color: var(--green);
        }
        
        .memory-feedback.failure {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--red);
        }
        
        .memory-feedback.level-complete {
            background-color: rgba(139, 92, 246, 0.1);
            color: var(--purple);
        }
        
        .hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
}

// Make sure it's in the global scope
window.setupMemoryGame = setupMemoryGame;