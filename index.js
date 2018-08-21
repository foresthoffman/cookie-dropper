(function() {
  const cookieSpawnChance = 0.5; // 50% chance to spawn a cookie
  const cookieWidth = 64;
  const startY = -cookieWidth;
  const endY = 730;
  const cookieCount = 2;
  let score, start;
  let scoreEl = document.querySelector("#scoreVal")
  let timeEl = document.querySelector("#timeVal");
  let content = document.querySelector("#playground");

  function startGame() {
    // Resets the game.
    content.classList.remove("game-over");
    content.onclick = null;
    score = 0;
    start = null;
    drawTime();
    toggleScoreColor();
    drawScore();
    
    // Show the info text for a few seconds.
    content.classList.add("pre-start");
    setTimeout(function() {
      content.classList.remove("pre-start");
    }, 5000);
    
    // Initialize the cookies and their animations.
    for (let x = 0; x < cookieCount; x++) {
      spawnCookie();
    }
    window.requestAnimationFrame(draw);
  }
    
  // Generate a new cookie and add it to the DOM.
  function genCookie() {
    let cookie = document.createElement('div');
    cookie.classList.add('template');
    content.appendChild(cookie);
    return cookie;
  }
  
  // Assign animations and event listeners to a new cookie.
  function spawnCookie() {
    let cookie = genCookie();
    
    // Randomly animate the cookie in the next couple milliseconds.
    animateAfterTimeout(cookie, getRandTimeout());
    
    cookie.onmousedown = eatCookie;
  }
  
  // Update the displayed time, above the playground.
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
  
  // Updates the score color, based on whether the score
  // has been increased or decreased.
  function toggleScoreColor(type) {
    switch (type) {
      case "inc":
        scoreEl.classList.add('positive');
        scoreEl.classList.remove('negative');
        break;
      case "dec":
        scoreEl.classList.add('negative');
        scoreEl.classList.remove('positive');
        break;
      default:
        scoreEl.classList.remove('negative');
        scoreEl.classList.remove('positive');
    }
  }
  
  // Update the displayed score, above the playground.
  function drawScore() {
    scoreEl.innerHTML = score;
  }
  
  // Increment the score, and update the display.
  function increaseScore() {
    score++;
    drawScore();
    toggleScoreColor("inc");
  }
  
  // Decrement the score (if positive), and updat the display.
  function decreaseScore() {
    if (score > 0) score--;
    drawScore();
    toggleScoreColor("dec");
  }
  
  // Get a psuedo-random value for displacing a cookie horizontally.
  function getRandLeft() {
    return Math.random() * (720 - cookieWidth);
  }
  
  // Get a psuedo-random value for delaying a cookie's animation.
  function getRandTimeout() {
    return Math.random() * 2000;
  }
  
  // Animate the target cookie, after a delay, independently of
  // other cookies.
  async function animateAfterTimeout(el, ms) {
    let rand = getRandLeft();
    el.style.transform =  `translate(${rand}px)`;
    setTimeout(function() {
      el.classList.add('animate');
    }, ms);
  }
  
  // Might generate a cookie. Might not.
  function quantumCookie() {
    if (Math.random() > cookieSpawnChance) {
      spawnCookie();
    }
  }
  
  // Removes a cookie and increases the score.
  function eatCookie(e) {
    let el = e.target;
    if (el.classList.contains('animate')) {
      el.classList.remove('animate');
    } else {
      animateAfterTimeout(el, 100);
    }
    increaseScore();
    quantumCookie();
  }
  
  function gameOver() {
    content.classList.add("game-over");
  
    let cookies = document.querySelectorAll('.template');
    if (cookies.length > 1) {
      for (let i = 0; i < cookies.length; i++) {
        cookies[i].remove();
      }
    }
    
    setTimeout(function() {
      content.onclick = function() {
        console.log("clicked game over screen!");
        startGame();
      };
    }, 2000);
  }
  
  function draw(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    let templates = document.querySelectorAll('.template');
    for (let i = 0; i < templates.length; i++) {
      if (! templates[i].classList.contains('animate') && templates[i].offsetTop === startY) {
        animateAfterTimeout(templates[i], getRandTimeout());
      } else if (templates[i].offsetTop === endY) {
        templates[i].classList.remove('animate');
        decreaseScore();
      }
      
      // It's Game Over if the grace period has passed and
      // the score is still zero.
      if (progress > 5000 && score === 0) {
        gameOver();
        return;
      }
    }
    
    drawTime(progress);
    
    setTimeout(function(){
      window.requestAnimationFrame(draw);
    }, 500);
  }
  
  startGame();
})();