(function() {
    let points = 0;
    let score = document.querySelector('#score .scoreVal');
    let playground = document.querySelector('#playground');
    let cookieTemplate = document.querySelector('#template');
    let cookieWidth = cookieTemplate.offsetWidth;
    let cookieCount = 100;

    // Generates cookies.
    for (let i = 0; i < 10; i++) {
        setTimeout(function() {
            drawCookie(i);
        }, 1200);
    };

    // Generates a cookie and draws it on the screen.
    function drawCookie(num) {
        let cookie = cookieTemplate.cloneNode();
        randomizeOrigin(cookie);
        playground.appendChild(cookie);
        cookie.onclick = function(event) {
            onClick(event, num);
        };

        let startY = cookie.style.top;
        let endY = playground.offsetHeight + cookie.offsetHeight + 'px';
        cookie.animate([
            { top: `${startY}` },
            { top: `${endY}` },
        ], {
                duration: 3000,
                delay: 100 * num,
                iterations: Infinity,
            }
        );
    }

    // Randomize the origin of the cookie (off-screen);
    function randomizeOrigin(cookie) {
        let randArr = new Uint16Array(1);
        crypto.getRandomValues(randArr);
        let randVal = randArr[0];
        let left = (randVal % playground.offsetWidth);
        if (left < 0) {
            left += cookieWidth;
        } else if (left >= playground.offsetWidth - cookieWidth) {
            left -= cookieWidth;
        }
        cookie.style.setProperty("left", left + "px");
        cookie.style.setProperty("top", `-${cookieWidth}px`);
    }

    function onClick(e, num) {
        console.log(e);
        let cookie = e.target;

        // Updates the score.
        points++;
        score.innerHTML = points;

        // Effectively resets the cookie's animation.
        cookie.finish();
    }
})();
