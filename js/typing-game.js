// Typing Challenge Game
function setupTypingGame() {
    console.log("Typing game starting...");
    
    // Game container
    const typingGameContainer = document.createElement('div');
    typingGameContainer.classList.add('typing-game-container');
    
    // Simple implementation for testing
    typingGameContainer.innerHTML = `
        <div class="sample-text">The quick brown fox jumps over the lazy dog.</div>
        <textarea class="typing-input" placeholder="Start typing here..."></textarea>
        <div class="stats">
            <div>Accuracy: <span class="accuracy">100%</span></div>
            <div>WPM: <span class="wpm">0</span></div>
        </div>
    `;
    
    // Add to game area
    document.getElementById('game-area').appendChild(typingGameContainer);
    
    // For demo purposes
    setTimeout(() => {
        // Using global function
        window.showScore(85);
    }, 10000);
}

// Make sure it's in the global scope
window.setupTypingGame = setupTypingGame;