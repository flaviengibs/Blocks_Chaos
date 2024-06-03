const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const titleScreen = document.getElementById('titleScreen');
const deathScreen = document.getElementById('deathScreen');
const finalScore = document.getElementById('finalScore');

canvas.width = 800;
canvas.height = 600;

const chefImage = new Image();
chefImage.src = 'chef.png';  // Remplacez par le chemin de votre image de chef

const ingredientImage = new Image();
ingredientImage.src = 'ingredient.png';  // Remplacez par le chemin de votre image d'ingrédient

const obstacleImage = new Image();
obstacleImage.src = 'obstacle.png';  // Remplacez par le chemin de votre image d'obstacle

const chef = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    speed: 15,
    ingredients: []
};

const ingredients = [];
const obstacles = [];
let frameCount = 0;
let score = 0;
let isGameOver = false;
let gameLoopId;

function setup() {
    document.addEventListener('keydown', moveChef);
}

function startGame() {
    titleScreen.style.display = 'none';
    isGameOver = false;
    resetGame(); // Start the game loop
}

function moveChef(event) {
    if (isGameOver) return; // Prevent movement after game over

    switch(event.code) {
        case 'ArrowLeft':
            chef.x -= chef.speed;
            break;
        case 'ArrowRight':
            chef.x += chef.speed;
            break;
        case 'ArrowUp':
            chef.y -= chef.speed;
            break;
        case 'ArrowDown':
            chef.y += chef.speed;
            break;
    }
}

function loop() {
    if (isGameOver) return; // Stop the game loop if game is over

    update();
    draw();
    gameLoopId = requestAnimationFrame(loop);
}

function update() {
    frameCount++;

    ingredients.forEach((ingredient, index) => {
        if (isColliding(chef, ingredient)) {
            chef.ingredients.push(ingredient);
            ingredients.splice(index, 1);
            score++;

            // Generate a new obstacle and ingredient when an ingredient is collected
            obstacles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 30,
                height: 30,
                speed: 2 + Math.random() * 3,
                direction: Math.random() < 0.5 ? 'horizontal' : 'vertical'
            });

            ingredients.push({
                x: Math.random() * (canvas.width - 20),
                y: Math.random() * (canvas.height - 20),
                width: 20,
                height: 20,
                type: 'ingredient'
            });
        }
    });

    obstacles.forEach((obstacle, index) => {
        if (obstacle.direction === 'horizontal') {
            obstacle.x += obstacle.speed;
            if (obstacle.x > canvas.width || obstacle.x < 0) {
                obstacle.speed *= -1;
            }
        } else {
            obstacle.y += obstacle.speed;
            if (obstacle.y > canvas.height || obstacle.y < 0) {
                obstacle.speed *= -1;
            }
        }

        if (isColliding(chef, obstacle)) {
            gameOver();
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw chef
    ctx.drawImage(chefImage, chef.x, chef.y, chef.width, chef.height);

    // Draw ingredients
    ingredients.forEach(ingredient => {
        ctx.drawImage(ingredientImage, ingredient.x, ingredient.y, ingredient.width, ingredient.height);
    });

    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function gameOver() {
    isGameOver = true; // Set game state to over
    deathScreen.style.display = 'block';
    finalScore.textContent = score;
    cancelAnimationFrame(gameLoopId); // Stop the game loop
}

function restartGame() {
    resetGame();
    deathScreen.style.display = 'none';
    isGameOver = false;
    loop(); // Restart the game loop
}

function resetGame() {
    chef.x = canvas.width / 2;
    chef.y = canvas.height - 50;
    chef.ingredients = [];
    ingredients.length = 0;
    obstacles.length = 0;
    frameCount = 0;
    score = 0;

    // Start with one ingredient
    ingredients.push({
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * (canvas.height - 20),
        width: 20,
        height: 20,
        type: 'ingredient'
    });

    loop(); // Start the game loop
}

setup();
