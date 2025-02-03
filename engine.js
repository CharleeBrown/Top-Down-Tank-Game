let c = document.getElementById("mainCanvas");
let ctx = c.getContext("2d");
let size = 10;

let params = { x: c.width / 2, y: c.height / 2, size };
let projectParams = { x: params.x, y: params.y, size: 5, active: false };
let delta = 5; // Movement speed

// Function to update and redraw the canvas
function update() {
    ctx.clearRect(0, 0, c.width, c.height); // Clear canvas before redrawing
    
    // Draw main object
    ctx.fillStyle = "red";
    ctx.fillRect(params.x, params.y, params.size, params.size);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(params.x, params.y, params.size, params.size);

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
            update(); 
            requestAnimationFrame(moveMissile); // Continue movement
        } else {
            projectParams.active = false; // Deactivate when out of bounds
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

// Initial render
update();
