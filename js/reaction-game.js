// Reaction Test Game
function setupReactionGame() {
    console.log("Reaction game starting...");
    
    // Game container
    const reactionGameContainer = document.createElement('div');
    reactionGameContainer.classList.add('reaction-game-container');
    
    // Simple implementation for testing
    reactionGameContainer.innerHTML = `
        <div class="reaction-header">
            <div class="reaction-stats">
                <div class="reaction-stat">
                    <i class="fas fa-bolt"></i> Current: <span class="current-time">-</span> ms
                </div>
                <div class="reaction-stat">
                    <i class="fas fa-trophy"></i> Best: <span class="best-time">-</span> ms
                </div>
            </div>
        </div>
        <div class="reaction-area">
            <div class="reaction-target">
                <div class="reaction-message">Click to start</div>
            </div>
        </div>
    `;
    
    // Add to game area
    document.getElementById('game-area').appendChild(reactionGameContainer);
    
    // For demo purposes
    setTimeout(() => {
        const target = reactionGameContainer.querySelector('.reaction-target');
        target.classList.add('active');
        target.querySelector('.reaction-message').textContent = 'CLICK NOW!';
        
        // Simulate ending
        setTimeout(() => {
            // Using global function
            window.showScore(320);
        }, 2000);
    }, 3000);
}

// Make sure it's in the global scope
window.setupReactionGame = setupReactionGame;