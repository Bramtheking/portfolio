// Dino Game - Chrome Style
function initDinoGame() {
    const canvas = document.getElementById('dino-canvas');
    const ctx = canvas.getContext('2d');
    
    // Responsive canvas size
    const isMobile = window.innerWidth < 768;
    canvas.width = isMobile ? 400 : 800;
    canvas.height = 200;
    
    let dino = { 
        x: 50, 
        y: 140, 
        width: 40, 
        height: 40, 
        dy: 0, 
        jumping: false,
        ducking: false
    };
    
    let obstacles = [];
    let clouds = [];
    let score = 0;
    let gameSpeed = 6;
    let gameOver = false;
    let gameLoop;
    let frame = 0;
    
    // Create initial clouds
    for (let i = 0; i < 3; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * 60 + 20,
            width: 60,
            speed: 1
        });
    }
    
    function jump() {
        if (!dino.jumping && !gameOver && dino.y === 140) {
            dino.dy = -12;
            dino.jumping = true;
        }
    }
    
    function duck(isDucking) {
        if (!dino.jumping) {
            dino.ducking = isDucking;
            dino.height = isDucking ? 25 : 40;
            dino.y = isDucking ? 155 : 140;
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (gameOver) {
                resetDinoGame();
            } else {
                jump();
            }
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            duck(true);
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowDown') {
            duck(false);
        }
    });
    
    canvas.addEventListener('click', () => {
        if (gameOver) {
            resetDinoGame();
        } else {
            jump();
        }
    });
    
    // Touch controls for mobile
    let touchStartY = 0;
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartY = e.touches[0].clientY;
        if (gameOver) {
            resetDinoGame();
        }
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        if (diff > 30) {
            // Swipe up - jump
            jump();
            touchStartY = touchY;
        } else if (diff < -30) {
            // Swipe down - duck
            duck(true);
        }
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        duck(false);
    });
    
    function resetDinoGame() {
        dino = { x: 50, y: 140, width: 40, height: 40, dy: 0, jumping: false, ducking: false };
        obstacles = [];
        score = 0;
        gameSpeed = 6;
        gameOver = false;
        frame = 0;
        gameLoop = setInterval(updateDino, 1000/60);
    }
    
    function drawDino() {
        ctx.fillStyle = '#535353';
        
        // Body
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
        
        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(dino.x + 25, dino.y + 5, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(dino.x + 28, dino.y + 8, 3, 3);
        
        // Legs animation
        if (!dino.jumping) {
            ctx.fillStyle = '#535353';
            const legOffset = Math.floor(frame / 5) % 2 === 0 ? 0 : 5;
            ctx.fillRect(dino.x + 10, dino.y + dino.height, 8, 10);
            ctx.fillRect(dino.x + 25 + legOffset, dino.y + dino.height, 8, 10);
        }
    }
    
    function drawCactus(x, y, type) {
        ctx.fillStyle = '#3d8b3d';
        
        if (type === 1) {
            // Single cactus
            ctx.fillRect(x + 10, y, 10, 30);
            ctx.fillRect(x, y + 10, 10, 15);
            ctx.fillRect(x + 20, y + 15, 10, 10);
        } else {
            // Double cactus
            ctx.fillRect(x + 5, y, 8, 30);
            ctx.fillRect(x + 17, y + 5, 8, 25);
        }
    }
    
    function drawBird(x, y) {
        ctx.fillStyle = '#535353';
        const wingOffset = Math.floor(frame / 5) % 2 === 0 ? -3 : 3;
        
        // Body
        ctx.fillRect(x + 10, y + 5, 20, 10);
        // Wings
        ctx.fillRect(x, y + 5 + wingOffset, 15, 5);
        ctx.fillRect(x + 25, y + 5 + wingOffset, 15, 5);
        // Head
        ctx.fillRect(x + 25, y, 10, 10);
    }
    
    function drawCloud(cloud) {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(cloud.x, cloud.y, 30, 15);
        ctx.fillRect(cloud.x + 10, cloud.y - 8, 30, 15);
        ctx.fillRect(cloud.x + 20, cloud.y, 30, 15);
    }
    
    function updateDino() {
        if (gameOver) return;
        
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#f7f7f7');
        gradient.addColorStop(1, '#e0e0e0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw clouds
        clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x < -cloud.width) {
                cloud.x = canvas.width;
                cloud.y = Math.random() * 60 + 20;
            }
            drawCloud(cloud);
        });
        
        // Update dino physics
        dino.dy += 0.6; // gravity
        dino.y += dino.dy;
        
        if (dino.y >= 140) {
            dino.y = 140;
            dino.dy = 0;
            dino.jumping = false;
        }
        
        drawDino();
        
        // Create obstacles
        if (frame % 90 === 0) {
            const type = Math.random();
            if (type < 0.7) {
                // Cactus
                obstacles.push({ 
                    x: canvas.width, 
                    y: 150, 
                    width: 30, 
                    height: 30,
                    type: Math.random() < 0.5 ? 1 : 2,
                    isFlying: false
                });
            } else {
                // Flying bird
                obstacles.push({ 
                    x: canvas.width, 
                    y: Math.random() < 0.5 ? 100 : 120, 
                    width: 40, 
                    height: 20,
                    type: 3,
                    isFlying: true
                });
            }
        }
        
        // Update and draw obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;
            
            if (obstacles[i].isFlying) {
                drawBird(obstacles[i].x, obstacles[i].y);
            } else {
                drawCactus(obstacles[i].x, obstacles[i].y, obstacles[i].type);
            }
            
            // Collision detection
            if (dino.x < obstacles[i].x + obstacles[i].width - 5 &&
                dino.x + dino.width - 5 > obstacles[i].x &&
                dino.y < obstacles[i].y + obstacles[i].height - 5 &&
                dino.y + dino.height - 5 > obstacles[i].y) {
                gameOver = true;
                clearInterval(gameLoop);
                
                // Game over screen
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 40px Arial';
                ctx.fillText('GAME OVER', canvas.width/2 - 120, canvas.height/2 - 20);
                ctx.font = '20px Arial';
                ctx.fillText('Score: ' + score, canvas.width/2 - 50, canvas.height/2 + 20);
                ctx.font = '16px Arial';
                ctx.fillText('Click or Press Space to Restart', canvas.width/2 - 130, canvas.height/2 + 50);
            }
            
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                if (score % 10 === 0) {
                    gameSpeed += 0.5;
                }
            }
        }
        
        // Draw ground
        ctx.fillStyle = '#535353';
        ctx.fillRect(0, 180, canvas.width, 2);
        
        // Dashed ground line
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(0, 185);
        ctx.lineTo(canvas.width, 185);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw score
        ctx.fillStyle = '#535353';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Score: ' + score, canvas.width - 120, 30);
        
        // Draw speed indicator
        ctx.font = '14px Arial';
        ctx.fillText('Speed: ' + gameSpeed.toFixed(1), canvas.width - 120, 55);
    }
    
    gameLoop = setInterval(updateDino, 1000/60);
}

// Snake Game - Modern Style
function initSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    
    // Responsive canvas size
    const isMobile = window.innerWidth < 768;
    canvas.width = isMobile ? 300 : 500;
    canvas.height = isMobile ? 300 : 500;
    
    const gridSize = 25;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 };
    let food = { x: 15, y: 15 };
    let score = 0;
    let gameOver = false;
    let gameLoop;
    let speed = 150;
    
    function placeFood() {
        let validPosition = false;
        while (!validPosition) {
            food.x = Math.floor(Math.random() * tileCount);
            food.y = Math.floor(Math.random() * tileCount);
            
            validPosition = true;
            for (let segment of snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    validPosition = false;
                    break;
                }
            }
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (gameOver && e.code === 'Space') {
            resetSnakeGame();
            return;
        }
        
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                if (direction.y === 0) nextDirection = { x: 0, y: -1 };
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 'KeyS':
                if (direction.y === 0) nextDirection = { x: 0, y: 1 };
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'KeyA':
                if (direction.x === 0) nextDirection = { x: -1, y: 0 };
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'KeyD':
                if (direction.x === 0) nextDirection = { x: 1, y: 0 };
                e.preventDefault();
                break;
        }
    });
    
    // Click/Touch to follow - Snake moves toward clicked position
    function handlePointerInput(clientX, clientY) {
        if (gameOver) {
            resetSnakeGame();
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;
        
        // Convert to grid coordinates
        const gridX = Math.floor(clickX / gridSize);
        const gridY = Math.floor(clickY / gridSize);
        
        // Calculate direction to clicked position
        const headX = snake[0].x;
        const headY = snake[0].y;
        
        const diffX = gridX - headX;
        const diffY = gridY - headY;
        
        // Determine which direction to move based on larger difference
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Move horizontally
            if (diffX > 0 && direction.x === 0) {
                nextDirection = { x: 1, y: 0 }; // Right
            } else if (diffX < 0 && direction.x === 0) {
                nextDirection = { x: -1, y: 0 }; // Left
            }
        } else {
            // Move vertically
            if (diffY > 0 && direction.y === 0) {
                nextDirection = { x: 0, y: 1 }; // Down
            } else if (diffY < 0 && direction.y === 0) {
                nextDirection = { x: 0, y: -1 }; // Up
            }
        }
    }
    
    // Mouse click
    canvas.addEventListener('click', (e) => {
        handlePointerInput(e.clientX, e.clientY);
    });
    
    // Touch
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handlePointerInput(touch.clientX, touch.clientY);
    });
    
    function resetSnakeGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        gameOver = false;
        speed = 150;
        placeFood();
        clearInterval(gameLoop);
        gameLoop = setInterval(updateSnake, speed);
    }
    
    function updateSnake() {
        if (gameOver) return;
        
        direction = nextDirection;
        
        const head = { 
            x: snake[0].x + direction.x, 
            y: snake[0].y + direction.y 
        };
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver = true;
            clearInterval(gameLoop);
            drawSnakeGameOver();
            return;
        }
        
        // Check self collision
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver = true;
                clearInterval(gameLoop);
                drawSnakeGameOver();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            placeFood();
            
            // Increase speed every 5 foods
            if (score % 50 === 0 && speed > 50) {
                speed -= 10;
                clearInterval(gameLoop);
                gameLoop = setInterval(updateSnake, speed);
            }
        } else {
            snake.pop();
        }
        
        drawSnake();
    }
    
    function drawSnake() {
        // Background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
        
        // Draw snake with gradient
        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            const alpha = 1 - (i / snake.length) * 0.5;
            
            if (i === 0) {
                // Head
                const gradient = ctx.createRadialGradient(
                    segment.x * gridSize + gridSize/2,
                    segment.y * gridSize + gridSize/2,
                    0,
                    segment.x * gridSize + gridSize/2,
                    segment.y * gridSize + gridSize/2,
                    gridSize
                );
                gradient.addColorStop(0, '#00ff00');
                gradient.addColorStop(1, '#00aa00');
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = `rgba(0, 200, 0, ${alpha})`;
            }
            
            ctx.fillRect(
                segment.x * gridSize + 2, 
                segment.y * gridSize + 2, 
                gridSize - 4, 
                gridSize - 4
            );
            
            // Eyes on head
            if (i === 0) {
                ctx.fillStyle = '#000';
                const eyeSize = 4;
                if (direction.x === 1) {
                    ctx.fillRect(segment.x * gridSize + 15, segment.y * gridSize + 7, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + 15, segment.y * gridSize + 14, eyeSize, eyeSize);
                } else if (direction.x === -1) {
                    ctx.fillRect(segment.x * gridSize + 6, segment.y * gridSize + 7, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + 6, segment.y * gridSize + 14, eyeSize, eyeSize);
                } else if (direction.y === 1) {
                    ctx.fillRect(segment.x * gridSize + 7, segment.y * gridSize + 15, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + 14, segment.y * gridSize + 15, eyeSize, eyeSize);
                } else {
                    ctx.fillRect(segment.x * gridSize + 7, segment.y * gridSize + 6, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * gridSize + 14, segment.y * gridSize + 6, eyeSize, eyeSize);
                }
            }
        }
        
        // Draw food with glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff0000';
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize/2,
            food.y * gridSize + gridSize/2,
            gridSize/2 - 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw score
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Score: ' + score, 15, 35);
        
        // Draw length
        ctx.font = '16px Arial';
        ctx.fillText('Length: ' + snake.length, 15, 60);
    }
    
    function drawSnakeGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 40);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 10);
        
        ctx.font = '20px Arial';
        ctx.fillText('Length: ' + snake.length, canvas.width/2, canvas.height/2 + 45);
        
        ctx.font = '18px Arial';
        ctx.fillText('Press SPACE to Restart', canvas.width/2, canvas.height/2 + 85);
        
        ctx.textAlign = 'left';
    }
    
    gameLoop = setInterval(updateSnake, speed);
    drawSnake();
}
