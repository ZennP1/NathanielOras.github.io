function showProject(projectName) {
    alert("You selected: " + projectName);
}

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;

    alert(
        "Thank you, " + name + "!\n\n" +
        "Your message has been received."
    );

    contactForm.reset();
});



const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", function() {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.style.color = "white";

        if (link.getAttribute("href") === "#" + current) {
            link.style.color = "#ff2020";
        }

    });

});




   
// ===== GEOMETRY DASH GAME =====

document.addEventListener("DOMContentLoaded", function () {
    const game = document.getElementById("gd-game");
    const player = document.getElementById("gd-player");
    const obstaclesBox = document.getElementById("gd-obstacles");
    const scoreDisplay = document.getElementById("gd-score");
    const bestDisplay = document.getElementById("gd-best");
    const overlay = document.getElementById("gd-overlay");
    const message = document.getElementById("gd-message");
    const instructions = document.getElementById("gd-instructions");
    const startButton = document.getElementById("gd-start");

    // Stop if the HTML elements are missing
    if (!game || !player || !obstaclesBox ||
        !scoreDisplay || !bestDisplay || !overlay ||
        !message || !instructions || !startButton) {
        console.error(
            "Geometry Dash: Missing HTML elements. Check your game HTML."
        );
        return;
    }

    let running = false;
    let jumping = false;
    let score = 0;
    let best = 0;
    let playerY = 0;
    let velocityY = 0;
    let obstacles = [];
    let spawnTimer = 0;
    let lastTime = 0;
    let animationId = null;

    const gravity = 0.65;
    const jumpPower = 12.5;
    const groundY = 43;

    function showOverlay(title, text, buttonText) {
        message.textContent = title;
        instructions.textContent = text;
        startButton.textContent = buttonText;
        overlay.style.display = "flex";
    }

    function updatePlayer() {
        player.style.bottom = (groundY + playerY) + "px";
        player.style.transform =
            `rotate(${playerY === 0 ? 0 : -playerY * 2}deg)`;
    }

    function jump() {
        if (!running) return;

        if (!jumping) {
            jumping = true;
            velocityY = jumpPower;
        }
    }

 // Create different types of parkour obstacles
function createObstacle() {
    const type = Math.random();

    // DOUBLE SPIKES
    if (type < 0.35) {
        const group = document.createElement("div");
        group.className = "gd-obstacle-group";

        for (let i = 0; i < 2; i++) {
            const spike = document.createElement("div");
            spike.className = "gd-obstacle";
            spike.style.left = (i * 25) + "px";
            group.appendChild(spike);
        }

        obstaclesBox.appendChild(group);

        obstacles.push({
            element: group,
            x: game.clientWidth + 20,
            width: 63,
            height: 38,
            passed: false
        });
    }

    // TRIPLE SPIKES
    else if (type < 0.55) {
        const group = document.createElement("div");
        group.className = "gd-obstacle-group";

        for (let i = 0; i < 3; i++) {
            const spike = document.createElement("div");
            spike.className = "gd-obstacle";
            spike.style.left = (i * 25) + "px";
            group.appendChild(spike);
        }

        obstaclesBox.appendChild(group);

        obstacles.push({
            element: group,
            x: game.clientWidth + 20,
            width: 88,
            height: 38,
            passed: false
        });
    }

    // JUMP BLOCK
    else if (type < 0.78) {
        const block = document.createElement("div");
        block.className = "gd-block";

        obstaclesBox.appendChild(block);

        obstacles.push({
            element: block,
            x: game.clientWidth + 20,
            width: 38,
            height: 42,
            passed: false
        });
    }

    // SINGLE SPIKE
    else {
        const spike = document.createElement("div");
        spike.className = "gd-obstacle";

        obstaclesBox.appendChild(spike);

        obstacles.push({
            element: spike,
            x: game.clientWidth + 20,
            width: 38,
            height: 38,
            passed: false
        });
    }
    }

    function startGame() {
        // Cancel an old animation before restarting
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        obstacles.forEach(function (obstacle) {
            obstacle.element.remove();
        });
        obstacles = [];

        score = 0;
        playerY = 0;
        velocityY = 0;
        jumping = false;
        spawnTimer = 30;
        lastTime = 0;
        running = true;

        scoreDisplay.textContent = "0";
        updatePlayer();
        overlay.style.display = "none";

        console.log("Geometry Dash started!");
        animationId = requestAnimationFrame(loop);
    }

    function endGame() {
        running = false;

        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        showOverlay(
            "GAME OVER!",
            "Your score: " + score + " — Try again!",
            "PLAY AGAIN"
        );
    }

    function loop(timestamp) {
        if (!running) return;

        const delta = lastTime
            ? Math.min((timestamp - lastTime) / 16.67, 2)
            : 1;

        lastTime = timestamp;

        // Gravity and jumping
        if (jumping) {
            velocityY -= gravity * delta;
            playerY += velocityY * delta;

            if (playerY <= 0) {
                playerY = 0;
                velocityY = 0;
                jumping = false;
            }
        }

        updatePlayer();

        // Create spikes
        spawnTimer -= delta;

        if (spawnTimer <= 0) {
            createObstacle();
      spawnTimer = Math.max(
    48,
    90 - score * 0.5 + Math.random() * 25
);
        }

        const speed = 5.5 + Math.min(score * 0.035, 4);
        const playerLeft = player.offsetLeft;
        const playerRight = playerLeft + player.offsetWidth;
        const playerBottom = groundY + playerY;

        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];

            obstacle.x -= speed * delta;
            obstacle.element.style.left = obstacle.x + "px";

            // More accurate spike collision check
            const overlapsX =
                playerRight - 5 > obstacle.x + 7 &&
                playerLeft + 5 < obstacle.x + obstacle.width - 7;

         const overlapsY =
    playerBottom < groundY + (obstacle.height || 38) - 5;

            if (overlapsX && overlapsY) {
                endGame();
                return;
            }

            if (
                !obstacle.passed &&
                obstacle.x + obstacle.width < playerLeft
            ) {
                obstacle.passed = true;
                score++;

                scoreDisplay.textContent = score;

                if (score > best) {
                    best = score;
                    bestDisplay.textContent = best;
                }
            }

            if (obstacle.x + obstacle.width < 0) {
                obstacle.element.remove();
                obstacles.splice(i, 1);
            }
        }

        animationId = requestAnimationFrame(loop);
    }

    // The play button starts the game
    startButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        startGame();
    });

    // Clicking or tapping the game makes the cube jump
    game.addEventListener("pointerdown", function (event) {
        if (event.target === startButton) return;
        jump();
    });

    // Keyboard controls
    document.addEventListener("keydown", function (event) {
        if (event.code !== "Space" && event.code !== "ArrowUp") {
            return;
        }

        const tag = document.activeElement
            ? document.activeElement.tagName
            : "";

        if (tag === "INPUT" || tag === "TEXTAREA") return;

        event.preventDefault();

        if (!event.repeat) {
            jump();
        }
    });

    bestDisplay.textContent = best;
    updatePlayer();

    showOverlay(
        "GEOMETRY DASH",
        "Press SPACE, click, or tap to jump!",
        "PLAY GAME"
    );

    console.log("Geometry Dash loaded successfully!");
});