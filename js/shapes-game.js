// Shape Sorter Game
function setupShapesGame() {
    console.log("Shape Sorter game starting...");
    
    // Game container
    const shapesGameContainer = document.createElement('div');
    shapesGameContainer.classList.add('shapes-game-container');
    
    // Game state
    let currentLevel = 1;
    let score = 0;
    let timeLeft = 60;
    let timer = null;
    let currentShapes = [];
    let correctSorts = 0;
    let totalShapesToSort = 0;
    let isDragging = false;
    let currentSortingCriteria = 'color'; // Can be 'color', 'shape', or 'size'
    
    // Shape properties
    const colors = ['red', 'blue', 'green', 'yellow'];
    const shapes = ['circle', 'square', 'triangle', 'diamond'];
    const sizes = ['small', 'medium', 'large'];
    
    // Initialize game UI
    shapesGameContainer.innerHTML = `
        <div class="shapes-header">
            <div class="shapes-stats">
                <div class="shapes-stat">
                    <i class="fas fa-trophy"></i> Score: <span class="score">0</span>
                </div>
                <div class="shapes-stat">
                    <i class="fas fa-layer-group"></i> Level: <span class="level">1</span>
                </div>
                <div class="shapes-stat">
                    <i class="fas fa-clock"></i> Time: <span class="time">60</span>s
                </div>
            </div>
        </div>
        
        <div class="shapes-instruction">
            <p>Sort the shapes by <span class="sorting-criteria">color</span>! Drag shapes to their matching categories.</p>
        </div>
        
        <div class="shapes-game-area">
            <div class="shapes-container">
                <!-- Shapes will be added here dynamically -->
            </div>
            
            <div class="categories-container">
                <!-- Categories will be added here dynamically -->
            </div>
        </div>
        
        <div class="shapes-feedback hidden"></div>
    `;
    
    // Add to game area
    document.getElementById('game-area').appendChild(shapesGameContainer);
    
    // Get DOM elements
    const scoreDisplay = shapesGameContainer.querySelector('.score');
    const levelDisplay = shapesGameContainer.querySelector('.level');
    const timeDisplay = shapesGameContainer.querySelector('.time');
    const shapesContainer = shapesGameContainer.querySelector('.shapes-container');
    const categoriesContainer = shapesGameContainer.querySelector('.categories-container');
    const sortingCriteriaDisplay = shapesGameContainer.querySelector('.sorting-criteria');
    const feedbackDisplay = shapesGameContainer.querySelector('.shapes-feedback');
    
    // Create a shape element
    function createShape(color, shape, size) {
        const shapeEl = document.createElement('div');
        shapeEl.classList.add('shape', 'draggable');
        shapeEl.setAttribute('data-color', color);
        shapeEl.setAttribute('data-shape', shape);
        shapeEl.setAttribute('data-size', size);
        
        // Set visual properties
        shapeEl.classList.add(`${color}-shape`);
        
        if (shape === 'circle') {
            shapeEl.classList.add('circle-shape');
        } else if (shape === 'square') {
            shapeEl.classList.add('square-shape');
        } else if (shape === 'triangle') {
            shapeEl.classList.add('triangle-shape');
        } else if (shape === 'diamond') {
            shapeEl.classList.add('diamond-shape');
        }
        
        if (size === 'small') {
            shapeEl.style.transform = 'scale(0.7)';
        } else if (size === 'large') {
            shapeEl.style.transform = 'scale(1.3)';
        }
        
        // Add drag event listeners
        shapeEl.addEventListener('mousedown', dragStart);
        shapeEl.addEventListener('touchstart', dragStart, { passive: false });
        
        return shapeEl;
    }
    
    // Create category containers
    function createCategories(criteria) {
        categoriesContainer.innerHTML = '';
        
        let categories = [];
        
        if (criteria === 'color') {
            categories = colors;
        } else if (criteria === 'shape') {
            categories = shapes;
        } else if (criteria === 'size') {
            categories = sizes;
        }
        
        categories.forEach(category => {
            const categoryEl = document.createElement('div');
            categoryEl.classList.add('category', `${category}-category`);
            categoryEl.setAttribute('data-category', category);
            
            const label = document.createElement('div');
            label.classList.add('category-label');
            label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            
            categoryEl.appendChild(label);
            categoriesContainer.appendChild(categoryEl);
        });
    }
    
    // Generate random shapes for the level
    function generateShapes(level) {
        shapesContainer.innerHTML = '';
        currentShapes = [];
        correctSorts = 0;
        
        // Number of shapes increases with level
        const numShapes = Math.min(4 + (level * 2), 16);
        totalShapesToSort = numShapes;
        
        // Generate random shapes
        for (let i = 0; i < numShapes; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            
            const shapeEl = createShape(color, shape, size);
            shapesContainer.appendChild(shapeEl);
            currentShapes.push(shapeEl);
        }
    }
    
    // Start a new level
    function startLevel(level) {
        // Update level display
        levelDisplay.textContent = level;
        
        // Set sorting criteria based on level
        if (level <= 3) {
            currentSortingCriteria = 'color';
        } else if (level <= 6) {
            currentSortingCriteria = 'shape';
        } else {
            currentSortingCriteria = 'size';
        }
        
        // Update instruction
        sortingCriteriaDisplay.textContent = currentSortingCriteria;
        
        // Create categories for the sorting criteria
        createCategories(currentSortingCriteria);
        
        // Generate shapes for the level
        generateShapes(level);
        
        // Set time based on level
        timeLeft = Math.max(60 - (level * 3), 30);
        timeDisplay.textContent = timeLeft;
        
        // Start timer
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }
    
    // Drag & Drop Functionality
    function dragStart(e) {
        if (isDragging) return;
        
        // Prevent default for touch events
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        
        const target = e.target;
        if (target.classList.contains('draggable')) {
            isDragging = true;
            target.classList.add('dragging');
            
            // Store initial position
            const rect = target.getBoundingClientRect();
            target.setAttribute('data-x', rect.left);
            target.setAttribute('data-y', rect.top);
            
            // Set up move and end events
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('touchmove', dragMove, { passive: false });
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
            
            // Set position for touch events
            if (e.type === 'touchstart') {
                const touch = e.touches[0];
                target.style.position = 'absolute';
                target.style.left = touch.clientX - (rect.width / 2) + 'px';
                target.style.top = touch.clientY - (rect.height / 2) + 'px';
            }
        }
    }
    
    function dragMove(e) {
        e.preventDefault();
        
        const draggingEl = document.querySelector('.dragging');
        if (!draggingEl) return;
        
        // Get position (mouse or touch)
        let clientX, clientY;
        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // Move element
        draggingEl.style.position = 'absolute';
        draggingEl.style.left = clientX - (draggingEl.offsetWidth / 2) + 'px';
        draggingEl.style.top = clientY - (draggingEl.offsetHeight / 2) + 'px';
        draggingEl.style.zIndex = '1000';
    }
    
    function dragEnd(e) {
        const draggingEl = document.querySelector('.dragging');
        if (!draggingEl) return;
        
        // Remove event listeners
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
        
        // Check if over a category
        const categories = document.querySelectorAll('.category');
        let dropped = false;
        
        categories.forEach(category => {
            const rect = category.getBoundingClientRect();
            
            // Get position (mouse or touch)
            let clientX, clientY;
            if (e.type === 'touchend' && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            // Check if dropped in this category
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                dropped = true;
                
                // Check if correct category
                const categoryValue = category.getAttribute('data-category');
                const shapeValue = draggingEl.getAttribute(`data-${currentSortingCriteria}`);
                
                if (categoryValue === shapeValue) {
                    // Correct sorting
                    draggingEl.classList.add('correct-sort');
                    showFeedback('Correct!', 'correct');
                    correctSorts++;
                    score += 10;
                    scoreDisplay.textContent = score;
                } else {
                    // Wrong sorting
                    draggingEl.classList.add('wrong-sort');
                    showFeedback('Wrong category!', 'wrong');
                    score = Math.max(0, score - 5);
                    scoreDisplay.textContent = score;
                }
                
                // Move to category
                category.appendChild(draggingEl);
                
                // Reset dragging styles
                draggingEl.style.position = '';
                draggingEl.style.left = '';
                draggingEl.style.top = '';
                draggingEl.style.zIndex = '';
                draggingEl.classList.remove('dragging');
                
                // Check if level complete
                checkLevelComplete();
            }
        });
        
        // If not dropped in a category, return to original position
        if (!dropped) {
            draggingEl.style.position = '';
            draggingEl.style.left = '';
            draggingEl.style.top = '';
            draggingEl.style.zIndex = '';
            draggingEl.classList.remove('dragging');
            shapesContainer.appendChild(draggingEl);
        }
        
        isDragging = false;
    }
    
    // Check if the level is complete
    function checkLevelComplete() {
        if (correctSorts >= totalShapesToSort * 0.7) { // 70% correct to advance
            clearInterval(timer);
            
            // Show feedback
            showFeedback(`Level ${currentLevel} complete! +${Math.round(timeLeft * 2)} bonus points!`, 'level-complete');
            
            // Add time bonus
            score += Math.round(timeLeft * 2);
            scoreDisplay.textContent = score;
            
            // Advance to next level after a delay
            setTimeout(() => {
                currentLevel++;
                startLevel(currentLevel);
            }, 2000);
        }
    }
    
    // Show feedback message
    function showFeedback(message, type) {
        feedbackDisplay.textContent = message;
        feedbackDisplay.className = 'shapes-feedback'; // Reset classes
        feedbackDisplay.classList.add(type);
        feedbackDisplay.classList.remove('hidden');
        
        // Hide after 2 seconds
        setTimeout(() => {
            feedbackDisplay.classList.add('hidden');
        }, 2000);
    }
    
    // End the game
    function endGame() {
        // Stop timer
        clearInterval(timer);
        
        // Show final score
        showFeedback(`Game Over! Final Score: ${score}`, 'game-over');
        
        // Show to the score screen
        setTimeout(() => {
            window.showScore(score);
        }, 2000);
    }
    
    // Start the first level
    startLevel(currentLevel);
    
    // Add CSS for the Shape Sorter game
    const style = document.createElement('style');
    style.textContent = `
        .shapes-game-container {
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        
        .shapes-header {
            width: 100%;
            margin-bottom: 20px;
        }
        
        .shapes-stats {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        
        .shapes-stat {
            padding: 10px 15px;
            background-color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            font-weight: 500;
        }
        
        .shapes-stat i {
            margin-right: 5px;
            color: var(--green);
        }
        
        .shapes-instruction {
            width: 100%;
            padding: 15px;
            background-color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
            margin-bottom: 20px;
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
        }
        
        .sorting-criteria {
            font-weight: 700;
            color: var(--green);
        }
        
        .shapes-game-area {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .shapes-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            padding: 20px;
            min-height: 100px;
            background-color: #f8fafc;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            justify-content: center;
        }
        
        .categories-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }
        
        .category {
            width: 120px;
            height: 120px;
            border: 2px dashed #cbd5e1;
            border-radius: var(--radius-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            transition: all 0.2s ease;
        }
        
        .category:hover {
            border-color: var(--green);
            box-shadow: var(--shadow-sm);
        }
        
        .category-label {
            background-color: white;
            padding: 5px 10px;
            border-radius: var(--radius-sm);
            font-weight: 600;
            margin-bottom: 10px;
            box-shadow: var(--shadow-sm);
        }
        
        /* Categories by color */
        .red-category .category-label {
            color: #ef4444;
            border-bottom: 2px solid #ef4444;
        }
        
        .blue-category .category-label {
            color: #3b82f6;
            border-bottom: 2px solid #3b82f6;
        }
        
        .green-category .category-label {
            color: #22c55e;
            border-bottom: 2px solid #22c55e;
        }
        
        .yellow-category .category-label {
            color: #eab308;
            border-bottom: 2px solid #eab308;
        }
        
        /* Categories by shape */
        .circle-category .category-label::before,
        .square-category .category-label::before,
        .triangle-category .category-label::before,
        .diamond-category .category-label::before {
            display: inline-block;
            margin-right: 5px;
            vertical-align: middle;
        }
        
        .circle-category .category-label::before {
            content: "⭕";
        }
        
        .square-category .category-label::before {
            content: "◼️";
        }
        
        .triangle-category .category-label::before {
            content: "▲";
        }
        
        .diamond-category .category-label::before {
            content: "◆";
        }
        
        /* Categories by size */
        .small-category .category-label {
            font-size: 0.8rem;
        }
        
        .medium-category .category-label {
            font-size: 1rem;
        }
        
        .large-category .category-label {
            font-size: 1.2rem;
        }
        
        /* Shapes */
        .shape {
            width: 50px;
            height: 50px;
            cursor: grab;
            transition: all 0.2s ease;
            user-select: none;
            touch-action: none;
        }
        
        .shape:hover {
            transform: scale(1.1);
        }
        
        .shape.dragging {
            cursor: grabbing;
            opacity: 0.8;
        }
        
        .red-shape {
            background-color: #ef4444;
        }
        
        .blue-shape {
            background-color: #3b82f6;
        }
        
        .green-shape {
            background-color: #22c55e;
        }
        
        .yellow-shape {
            background-color: #eab308;
        }
        
        .circle-shape {
            border-radius: 50%;
        }
        
        .square-shape {
            border-radius: 4px;
        }
        
        .triangle-shape {
            width: 0;
            height: 0;
            background-color: transparent;
            border-left: 25px solid transparent;
            border-right: 25px solid transparent;
            border-bottom: 50px solid currentColor;
        }
        
        .diamond-shape {
            transform: rotate(45deg);
            border-radius: 4px;
        }
        
        .correct-sort {
            opacity: 0.8;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
        
        .wrong-sort {
            opacity: 0.6;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
        
        /* Feedback */
        .shapes-feedback {
            width: 100%;
            padding: 15px 20px;
            border-radius: var(--radius-md);
            text-align: center;
            font-size: 1.1rem;
            font-weight: 500;
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        
        .shapes-feedback.correct {
            background-color: rgba(34, 197, 94, 0.1);
            color: var(--green);
        }
        
        .shapes-feedback.wrong {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--red);
        }
        
        .shapes-feedback.level-complete {
            background-color: rgba(139, 92, 246, 0.1);
            color: var(--purple);
        }
        
        .shapes-feedback.game-over {
            background-color: rgba(236, 72, 153, 0.1);
            color: var(--pink);
        }
        
        .hidden {
            display: none;
        }
        
        @media (max-width: 768px) {
            .shapes-stats {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
            
            .category {
                width: 100px;
                height: 100px;
            }
            
            .shape {
                width: 40px;
                height: 40px;
            }
            
            .triangle-shape {
                border-left: 20px solid transparent;
                border-right: 20px solid transparent;
                border-bottom: 40px solid currentColor;
            }
        }
    `;
    document.head.appendChild(style);
}

// Make sure it's in the global scope
window.setupShapesGame = setupShapesGame;