(function() {
    const cookieWidth = 64;
    const startY = -cookieWidth;
    const endY = 730;
    const cookieCount = 2;
    const cookieSpawnChance = 0.5;
    let score, start;
    let scoreEl = document.querySelector("#scoreVal");
    let timeEl = document.querySelector("#timeVal");
    let playground = document.querySelector("#playground");

    function startGame() {
        playground.classList.remove("game-over");
        playground.onclick = null;
        score = 0;
        start = null;
        drawTime();
        drawScore();
        toggleScoreColor();

        playground.classList.add("pre-start");
        setTimeout(function() {
            playground.classList.remove("pre-start");
        }, 5000);

        // Create our cookies.
        for (let x = 0; x < cookieCount; x++) {
            spawnCookie();
        }
        window.requestAnimationFrame(draw);
    }

    function getRandLeft() {
        return Math.random() * (720 - cookieWidth);
    }

    function getRandTimeout() {
        return Math.random() * 2000;
    }

    function drawTime(t) {
        let minutes = Math.floor(t / 60000);
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        let seconds = ((t % 60000) / 1000).toFixed(0);
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        timeEl.innerHTML = `${minutes}:${seconds}`;
    }

    function drawScore() {
        scoreEl.innerHTML = score;
    }

    function toggleScoreColor(type) {
        switch (type) {
            case "inc":
                scoreEl.classList.add("positive");
                scoreEl.classList.remove("negative");
                break;
            case "dec":
                scoreEl.classList.add("negative");
                scoreEl.classList.remove("positive");
                break;
            default:
                scoreEl.classList.remove("negative");
                scoreEl.classList.remove("positive");
        }
    }

    function increaseScore() {
        score++;
        drawScore();
        toggleScoreColor("inc");
    }

    function decreaseScore() {
        if (score > 0) score--;
        drawScore();
        toggleScoreColor("dec");
    }

    async function animateAfterTimeout(el, ms) {
        let rand = getRandLeft();
        el.style.transform = `translate(${rand}px)`;
        setTimeout(function() {
            el.classList.add("animate");
        }, ms);
    }

    function spawnCookie() {
        let cookie = document.createElement("div");
        cookie.classList.add("cookie");
        playground.appendChild(cookie);

        animateAfterTimeout(cookie, getRandTimeout());
        cookie.onmousedown = eatCookie;
        cookie.onclick = eatCookie;
    }

    function randomCookie() {
        if (Math.random() > cookieSpawnChance) {
            spawnCookie();
        }
    }

    function eatCookie(e) {
        let el = e.target;
        if (el.classList.contains("animate")) {
            el.classList.remove("animate");
        } else {
            animateAfterTimeout(el, 100);
        }
        increaseScore();

        randomCookie();
    }

    function gameOver() {
        playground.classList.add("game-over");

        let cookies = document.querySelectorAll(".cookie");
        if (cookies.length > 1) {
            for (let i = 0; i < cookies.length; i++) {
                cookies[i].remove();
            }
        }

        setTimeout(function() {
            playground.onclick = startGame;
        }, 2000);
    }

    function draw(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;
        let cookies = document.querySelectorAll(".cookie");
        for (let i = 0; i < cookies.length; i++) {
            if (!cookies[i].classList.contains("animate") && cookies[i].offsetTop === startY) {
                animateAfterTimeout(cookies[i], getRandTimeout());
            } else if (cookies[i].offsetTop === endY) {
                cookies[i].classList.remove("animate");
                decreaseScore();
            }

            if (progress > 5000 && score === 0) {
                gameOver();
                return;
            }
        }

        drawTime(progress);

        setTimeout(function() {
            window.requestAnimationFrame(draw);
        }, 500);
    }

    startGame();
})();