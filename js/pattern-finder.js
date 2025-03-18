// Pattern Finder Game
function setupPatternFinderGame() {
    // Game container
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('pattern-finder-container');
    
    // Game state
    let currentLevel = 1;
    let currentPattern = null;
    let correctAnswer = null;
    let score = 0;
    let lives = 3;
    let gameActive = true;
    
    // Initial UI
    gameContainer.innerHTML = `
        <div class="pattern-header">
            <div class="pattern-stats">
                <div class="pattern-stat">
                    <i class="fas fa-trophy"></i> Score: <span class="score">0</span>
                </div>
                <div class="pattern-stat">
                    <i class="fas fa-layer-group"></i> Level: <span class="level">1</span>
                </div>
                <div class="pattern-stat">
                    <i class="fas fa-heart"></i> Lives: <span class="lives">3</span>
                </div>
            </div>
        </div>
        <div class="pattern-main">
            <div class="pattern-display">
                <div class="sequence-message">What number comes next in this sequence?</div>
                <div class="sequence-numbers"></div>
            </div>
            <div class="pattern-input">
                <input type="number" class="answer-input" placeholder="Enter your answer">
                <button class="submit-answer">Submit</button>
            </div>
            <div class="pattern-feedback hidden"></div>
        </div>
    `;
    
    // Add to game area
    document.getElementById('game-area').appendChild(gameContainer);
    
    // Get DOM elements
    const sequenceDisplay = gameContainer.querySelector('.sequence-numbers');
    const answerInput = gameContainer.querySelector('.answer-input');
    const submitButton = gameContainer.querySelector('.submit-answer');
    const scoreDisplay = gameContainer.querySelector('.score');
    const levelDisplay = gameContainer.querySelector('.level');
    const livesDisplay = gameContainer.querySelector('.lives');
    const feedbackDisplay = gameContainer.querySelector('.pattern-feedback');
    
    // Predefined patterns - each function returns [sequence, answer]
    const patterns = [
        // Level 1-3: Simple arithmetic (adding/subtracting constants)
        () => {
            const start = Math.floor(Math.random() * 10) + 1;
            const increment = Math.floor(Math.random() * 5) + 1;
            const sequence = Array(5).fill().map((_, i) => start + (increment * i));
            const answer = sequence[4] + increment;
            return [sequence, answer, `+${increment} pattern`];
        },
        // Level 4-6: Geometric (multiplying/dividing by constants)
        () => {
            const start = Math.floor(Math.random() * 5) + 1;
            const multiplier = Math.floor(Math.random() * 3) + 2;
            const sequence = Array(5).fill().map((_, i) => start * Math.pow(multiplier, i));
            const answer = sequence[4] * multiplier;
            return [sequence, answer, `×${multiplier} pattern`];
        },
        // Level 7-9: Alternating patterns
        () => {
            const increment1 = Math.floor(Math.random() * 5) + 1;
            const increment2 = Math.floor(Math.random() * 5) + 1;
            const start = Math.floor(Math.random() * 10) + 1;
            const sequence = [start];
            for (let i = 1; i < 5; i++) {
                if (i % 2 === 1) {
                    sequence.push(sequence[i-1] + increment1);
                } else {
                    sequence.push(sequence[i-1] + increment2);
                }
            }
            // Next number depends on last pattern
            const answer = sequence[4] + (sequence.length % 2 === 0 ? increment1 : increment2);
            return [sequence, answer, `Alternating +${increment1}/+${increment2} pattern`];
        },
        // Level 10-12: Squared numbers with offset
        () => {
            const offset = Math.floor(Math.random() * 10);
            const sequence = Array(5).fill().map((_, i) => (i+1)*(i+1) + offset);
            const answer = 36 + offset; // 6² + offset
            return [sequence, answer, `n² + ${offset} pattern`];
        },
        // Level 13-15: Fibonacci-like (each number is sum of two previous)
        () => {
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 5) + 1;
            const sequence = [a, b];
            for (let i = 2; i < 5; i++) {
                sequence.push(sequence[i-1] + sequence[i-2]);
            }
            const answer = sequence[3] + sequence[4]; // Sum of last two numbers
            return [sequence, answer, "Sum of previous two numbers"];
        }
    ];
    
    // Start a new pattern
    function newPattern() {
        // Clear previous feedback
        feedbackDisplay.classList.add('hidden');
        
        // Determine pattern based on level
        let patternIndex;
        if (currentLevel <= 3) {
            patternIndex = 0; // Simple arithmetic
        } else if (currentLevel <= 6) {
            patternIndex = 1; // Geometric
        } else if (currentLevel <= 9) {
            patternIndex = 2; // Alternating
        } else if (currentLevel <= 12) {
            patternIndex = 3; // Squared numbers
        } else {
            patternIndex = 4; // Fibonacci-like
        }
        
        // Generate the pattern
        const [sequence, answer, patternDescription] = patterns[patternIndex]();
        currentPattern = sequence;
        correctAnswer = answer;
        
        // Display the sequence
        sequenceDisplay.innerHTML = sequence.map(n => `<span>${n}</span>`).join(', ') + ', <span class="question-mark">?</span>';
        
        // Clear input
        answerInput.value = '';
        answerInput.focus();
        
        // For debugging - show the pattern in console
        console.log(`Pattern: ${patternDescription}, Correct answer: ${answer}`);
    }
    
    // Check the user's answer
    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);
        
        // Validate input
        if (isNaN(userAnswer)) {
            showFeedback('Please enter a valid number', 'warning');
            return;
        }
        
        // Check answer
        if (userAnswer === correctAnswer) {
            // Correct answer
            score += currentLevel * 10;
            scoreDisplay.textContent = score;
            
            showFeedback('Correct! Great job!', 'correct');
            
            // Level up
            currentLevel++;
            levelDisplay.textContent = currentLevel;
            
            // Start new pattern after delay
            setTimeout(newPattern, 1500);
        } else {
            // Wrong answer
            lives--;
            livesDisplay.textContent = lives;
            
            if (lives <= 0) {
                // Game over
                gameActive = false;
                showFeedback(`Game Over! The correct answer was ${correctAnswer}`, 'wrong');
                submitButton.textContent = 'Play Again';
                submitButton.removeEventListener('click', checkAnswer);
                submitButton.addEventListener('click', resetGame);
            } else {
                showFeedback(`Wrong answer. Try again! (${lives} lives left)`, 'wrong');
            }
        }
    }
    
    // Show feedback to user
    function showFeedback(message, type) {
        feedbackDisplay.textContent = message;
        feedbackDisplay.className = 'pattern-feedback'; // Reset classes
        feedbackDisplay.classList.add(type);
        feedbackDisplay.classList.remove('hidden');
    }
    
    // Reset the game
    function resetGame() {
        currentLevel = 1;
        score = 0;
        lives = 3;
        gameActive = true;
        
        // Update displays
        scoreDisplay.textContent = score;
        levelDisplay.textContent = currentLevel;
        livesDisplay.textContent = lives;
        
        // Reset button
        submitButton.textContent = 'Submit';
        submitButton.removeEventListener('click', resetGame);
        submitButton.addEventListener('click', checkAnswer);
        
        // New pattern
        newPattern();
    }
    
    // Event listeners
    submitButton.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Start the first pattern
    newPattern();
    
    // Add CSS for the Pattern Finder game
    const style = document.createElement('style');
    style.textContent = `
        .pattern-finder-container {
            width: 100%;
            max-width: 600px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .pattern-header {
            width: 100%;
            margin-bottom: 30px;
        }
        
        .pattern-stats {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        
        .pattern-stat {
            padding: 10px 15px;
            background-color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            font-weight: 500;
        }
        
        .pattern-stat i {
            margin-right: 5px;
            color: #14b8a6;
        }
        
        .pattern-main {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .pattern-display {
            width: 100%;
            padding: 25px;
            background-color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
            margin-bottom: 25px;
            text-align: center;
        }
        
        .sequence-message {
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 20px;
        }
        
        .sequence-numbers {
            font-size: 2rem;
            font-weight: 600;
            color: var(--text-primary);
            letter-spacing: 1px;
        }
        
        .sequence-numbers span {
            display: inline-block;
            padding: 0 10px;
        }
        
        .question-mark {
            color: #14b8a6;
            animation: pulse 1.5s infinite;
        }
        
        .pattern-input {
            width: 100%;
            display: flex;
            margin-bottom: 20px;
        }
        
        .answer-input {
            flex: 1;
            padding: 12px 15px;
            font-size: 1.1rem;
            border: 2px solid #e2e8f0;
            border-radius: var(--radius-md) 0 0 var(--radius-md);
            outline: none;
        }
        
        .answer-input:focus {
            border-color: #14b8a6;
        }
        
        .submit-answer {
            padding: 12px 20px;
            background: linear-gradient(135deg, #14b8a6, #0d9488);
            color: white;
            font-weight: 600;
            border: none;
            border-radius: 0 var(--radius-md) var(--radius-md) 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .submit-answer:hover {
            background: linear-gradient(135deg, #0d9488, #0f766e);
        }
        
        .pattern-feedback {
            width: 100%;
            padding: 15px 20px;
            border-radius: var(--radius-md);
            text-align: center;
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        
        .pattern-feedback.correct {
            background-color: rgba(34, 197, 94, 0.1);
            color: var(--green);
        }
        
        .pattern-feedback.wrong {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--red);
        }
        
        .pattern-feedback.warning {
            background-color: rgba(234, 179, 8, 0.1);
            color: var(--yellow);
        }
        
        .hidden {
            display: none;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @media (max-width: 600px) {
            .pattern-stats {
                flex-direction: column;
                gap: 10px;
            }
            
            .sequence-numbers {
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Make sure it's in the global scope
window.setupPatternFinderGame = setupPatternFinderGame;