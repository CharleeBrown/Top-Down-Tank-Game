let c = document.getElementById("mainCanvas");
let ctx = c.getContext("2d");
let size = 10;

let params = { x: c.width / 2, y: c.height / 2, size };
let projectParams = { x: params.x, y: params.y, size: 5, active: false };
let delta = 5; // Movement speed
const enemies = []; // Stores enemy objects

// Function to initialize game
function init() {
    
	createEnemies();
    update();
	
}

// Function to update and redraw the canvas
function update() {
    ctx.clearRect(0, 0, c.width, c.height); // Clear canvas before redrawing

    // Draw main object (player)
    ctx.fillStyle = "red";
    ctx.fillRect(params.x, params.y, params.size, params.size);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(params.x, params.y, params.size, params.size);

    // Draw enemies
    drawEnemies();

    // Draw missile if active
    if (projectParams.active) {
        ctx.fillStyle = "black";
        ctx.fillRect(projectParams.x, projectParams.y, projectParams.size, projectParams.size);
    }
}

// Function to move the missile
function moveMissile() {
    if (projectParams.active) {
        if (projectParams.x + projectParams.size < c.width) {
            projectParams.x += delta; // Move missile
			
			clearEnemy(projectParams.x, projectParams.y);
            update();
            requestAnimationFrame(moveMissile); // Continue movement
        } else {
            projectParams.active = false; // Deactivate when out of bounds
            update();
        }
    }
}

// Function to create enemies **once** and store them
function createEnemies() {
    for (let i = 0; i < 5; i++) {
        let size = 20; // Enemy size
        let x = Math.floor((params.x -5)+ Math.random() * (c.width - params.x)-size);
        let y = Math.floor(params.y +Math.random() * (c.height-params.y) - size); // Keep enemies above player
       
        enemies.push({ x, y, size }); // Store enemy object
    }
}

// Function to draw enemies from stored array
function drawEnemies() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillStyle = "purple";

    for (let enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
        ctx.strokeRect(enemy.x, enemy.y, enemy.size, enemy.size);
    }
}

function clearEnemy(x, y) {
    for (let i = enemies.length - 1; i >= 0; i--) { // Iterate backward
        let enemy = enemies[i];

        // You have to account for the size of the enemy, not just the coordinates.
		//The coordinates will be a literal pixel, add the enemy.size to ensure they meet.
		// topic:boundingbox, collision
        if (
            x >= enemy.x && x <= enemy.x + enemy.size &&
            y >= enemy.y && y <= enemy.y + enemy.size
        ) {
            console.log(`Removing enemy at: ${enemy.x}, ${enemy.y}`);
            enemies.splice(i, 1); // Remove the enemy from the array
            if(enemies.length==0){
                init();
            }
            update(); // Refresh the canvas after removal
            break; // Stop after removing one enemy (optional)

         
        }
    }
}


// Event listener for movement
document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowLeft":
            if (params.x - delta >= 0) params.x -= delta;
            break;
        case "ArrowRight":
            if (params.x + delta + params.size <= c.width) params.x += delta;
            break;
        case "ArrowUp":
            if (params.y - delta >= 0) params.y -= delta;
            break;
        case "ArrowDown":
            if (params.y + delta + params.size <= c.height) params.y += delta;
            break;
        case "Enter":
            if (!projectParams.active) { // Fire only if no missile is active
                projectParams.x = params.x + params.size; // Start at player's position
                projectParams.y = params.y + params.size / 2;
                projectParams.active = true;
                moveMissile();
            }
            break;
    }
    update();
});

// Start the game
init();
