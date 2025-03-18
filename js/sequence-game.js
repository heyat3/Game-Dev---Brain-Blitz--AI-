// Number Sequence Game
function setupSequenceGame() {
    console.log("Sequence game starting...");
    
    // Game container
    const sequenceGameContainer = document.createElement('div');
    sequenceGameContainer.classList.add('sequence-game-container');
    
    // Simple implementation for testing
    sequenceGameContainer.innerHTML = `
        <div class="sequence-header">
            <div class="sequence-stats">
                <div class="sequence-stat">
                    <i class="fas fa-layer-group"></i> Level: <span class="level">1</span>
                </div>
                <div class="sequence-stat">
                    <i class="fas fa-star"></i> Score: <span class="score">0</span>
                </div>
            </div>
        </div>
        <div class="sequence-display">
            <div class="sequence-message">Remember the sequence</div>
            <div class="sequence-number">2, 4, 6, 8, ?</div>
        </div>
        <div class="sequence-input">
            <input type="number" placeholder="Enter next number..." />
            <button>Submit</button>
        </div>
    `;
    
    // Add to game area
    document.getElementById('game-area').appendChild(sequenceGameContainer);
    
    // For demo purposes
    setTimeout(() => {
        // Using global function
        window.showScore(75);
    }, 10000);
}

// Make sure it's in the global scope
window.setupSequenceGame = setupSequenceGame;