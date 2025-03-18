// Speed Math Game
function setupMathGame() {
    console.log("Math game starting...");
    
    // Game container
    const mathGameContainer = document.createElement('div');
    mathGameContainer.classList.add('math-game-container');
    
    // Simple implementation for testing
    mathGameContainer.innerHTML = `
        <div class="math-header">
            <div class="math-stats">
                <div class="math-stat">
                    <i class="fas fa-star"></i> Score: <span class="score">0</span>
                </div>
                <div class="math-stat">
                    <i class="fas fa-check"></i> Correct: <span class="correct">0</span>
                </div>
            </div>
        </div>
        <div class="math-problem-container">
            <div class="math-problem">8 × 7 = ?</div>
        </div>
        <div class="math-input">
            <input type="number" class="answer-input" placeholder="Enter answer">
            <button class="submit-answer">Submit</button>
        </div>
    `;
    
    // Add to game area
    document.getElementById('game-area').appendChild(mathGameContainer);
    
    // For demo purposes
    setTimeout(() => {
        // Using global function
        window.showScore(110);
    }, 10000);
}

// Make sure it's in the global scope
window.setupMathGame = setupMathGame;