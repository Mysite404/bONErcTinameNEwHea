document.addEventListener('wheel', function(e) {
    // Prevent horizontal scrolling with mouse wheel
    if (e.deltaX !== 0) {
        e.preventDefault();
    }
}, { passive: false });

let startX = 0;
let startY = 0;

document.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
        let deltaX = Math.abs(e.touches[0].clientX - startX);
        let deltaY = Math.abs(e.touches[0].clientY - startY);

        if (deltaX > deltaY) {
            e.preventDefault(); // Only block if it's mostly horizontal movement
        }
    }
}, { passive: false });

// Prevent horizontal scrolling with keyboard arrow keys
document.addEventListener('keydown', function(e) {
    if ([37, 39].includes(e.keyCode)) {  // Left and Right arrow keys
        e.preventDefault();
    }
});

// CSS solution to prevent horizontal overflow
document.body.style.overflowX = 'hidden';
// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable text and image selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// Disable image dragging
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// CSS to disable text selection
document.head.insertAdjacentHTML('beforeend', `
    <style>
        * {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        img {
            pointer-events: none;
        }
    </style>
`);

// Prevent Clickjacking
if (window.top !== window.self) {
    window.top.location = window.self.location; // Break out of iframe
}

// Block Keyboard Shortcuts
document.addEventListener('keydown', function (e) {
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || 
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
    }
});

// Disable Right Click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


// Form Input Sanitization
function sanitizeInput(input) {
    return input.replace(/[<>"'`]/g, '');
}
document.querySelector('form').addEventListener('submit', function (e) {
    const inputs = this.querySelectorAll('input, textarea');
    inputs.forEach(input => input.value = sanitizeInput(input.value));
});


// Auto Log Out After Inactivity
let inactivityTime = function () {
    let timer;
    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            alert("You were inactive. Logging out...");
            window.location.href = "/logout.html"; // Change as needed
        }, 10 * 60 * 1000); // 10 minutes
    }

    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event =>
        document.addEventListener(event, resetTimer)
    );
};
inactivityTime();


// Detect Console Open
setInterval(() => {
    const devtools = /./;
    devtools.toString = function () {
        this.opened = true;
        throw "Dev tools detected";
    };
    console.log('%c', devtools);
}, 1000);
(function() {
    // Block requests with no user interaction (likely bot)
    if (!('ontouchstart' in window) && !navigator.maxTouchPoints && !navigator.userAgent.includes('Mobile')) {
        setTimeout(() => {
            if (!window.__userInteracted) {
                document.body.innerHTML = "Access denied";
            }
        }, 3000);
    }

    // Detect headless browsers
    if (navigator.webdriver || window.chrome && !window.chrome.webstore) {
        document.body.innerHTML = "Blocked suspicious request";
    }

    // Flag no mouse or keyboard activity (bot)
    let hasInteracted = false;
    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
        window.addEventListener(evt, () => {
            window.__userInteracted = true;
            hasInteracted = true;
        })
    );

    // Random delay before content loads (anti-bot)
    document.addEventListener("DOMContentLoaded", () => {
        if (!hasInteracted) {
            setTimeout(() => {
                document.body.style.display = "block";
            }, 1000 + Math.random() * 3000); // human delay
        }
    });
})();
(async function () {
  const bannedCountries = ["IL"]; // Add more ISO country codes as needed

  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    console.log("User IP info:", data);

    // Check for banned countries
    if (bannedCountries.includes(data.country)) {
      document.body.innerHTML = "🚫 Access blocked from your location.";
      return;
    }

    // Check for VPN / hosting provider
    if (data.org && /vpn|colo|hosting|data|digitalocean|amazon|google/i.test(data.org)) {
      document.body.innerHTML = "🔐 VPN or proxy access detected. Please use a direct connection.";
      return;
    }

    // Otherwise, allow normal page access
    document.body.style.display = "block";

  } catch (err) {
    console.error("IP check failed:", err);
    document.body.innerHTML = "⚠️ Could not verify access. Please try again later.";
  }
})();

// fast loader
(function() {
  // ✅ 1. Lazy load images
  document.addEventListener("DOMContentLoaded", function () {
    const imgs = document.querySelectorAll("img[loading='lazy'], img[data-src]");
    imgs.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  });

  // ✅ 2. Preload important resources
  const preload = (url, as) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  };
  preload("/fonts/YourFont.woff2", "font");
  preload("/images/hero.jpg", "image");

  // ✅ 3. Minimize render-blocking by delaying non-critical CSS
  const delayCSS = () => {
    const links = document.querySelectorAll('link[rel="stylesheet"][data-delay]');
    links.forEach(link => {
      setTimeout(() => {
        link.rel = "stylesheet";
      }, 1000); // Delay by 1s after load
    });
  };
  window.addEventListener("load", delayCSS);

  // ✅ 4. Show instant loading indicator (UX boost)
  const spinner = document.createElement("div");
  spinner.innerText = "⚡ Loading...";
  spinner.style = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:sans-serif;color:#999;";
  document.body.appendChild(spinner);
  window.addEventListener("load", () => {
    spinner.remove();
  });

  // ✅ 5. Preconnect to CDNs
  ["https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://unpkg.com"].forEach(domain => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = domain;
    document.head.appendChild(link);
  });

})();
var _0x358215=_0x5b1d;function _0x458b(){var _0x5149e5=['2NBycXH','/blocked.html','1168881XskUmu','321072LzGjMX','5UjLOmq','2542674nAJlYQ','location','test','4981779doJcJi','8323632dvnURu','org','7636pvRuCM','225dzOUju','9faudPR','https://ipapi.co/json/','389786oonMSG','json','20eFkaLM'];_0x458b=function(){return _0x5149e5;};return _0x458b();}function _0x5b1d(_0x51e47f,_0xe8252f){var _0x458b8e=_0x458b();return _0x5b1d=function(_0x5b1d86,_0x2bfa0e){_0x5b1d86=_0x5b1d86-0x166;var _0xcaa474=_0x458b8e[_0x5b1d86];return _0xcaa474;},_0x5b1d(_0x51e47f,_0xe8252f);}(function(_0x5bd62e,_0x44ec21){var _0x5850fa=_0x5b1d,_0x17058b=_0x5bd62e();while(!![]){try{var _0xd2944a=parseInt(_0x5850fa(0x175))/0x1*(parseInt(_0x5850fa(0x172))/0x2)+parseInt(_0x5850fa(0x170))/0x3*(-parseInt(_0x5850fa(0x16e))/0x4)+parseInt(_0x5850fa(0x167))/0x5*(-parseInt(_0x5850fa(0x168))/0x6)+-parseInt(_0x5850fa(0x177))/0x7+-parseInt(_0x5850fa(0x166))/0x8*(-parseInt(_0x5850fa(0x16f))/0x9)+-parseInt(_0x5850fa(0x174))/0xa*(parseInt(_0x5850fa(0x16b))/0xb)+parseInt(_0x5850fa(0x16c))/0xc;if(_0xd2944a===_0x44ec21)break;else _0x17058b['push'](_0x17058b['shift']());}catch(_0x209db5){_0x17058b['push'](_0x17058b['shift']());}}}(_0x458b,0x8eb39),fetch(_0x358215(0x171))['then'](_0xf70451=>_0xf70451[_0x358215(0x173)]())['then'](_0x44fbd9=>{var _0xd7da7a=_0x358215;/vpn|colo|hosting/i[_0xd7da7a(0x16a)](_0x44fbd9[_0xd7da7a(0x16d)])&&(window[_0xd7da7a(0x169)]['href']=_0xd7da7a(0x176));}));
var _0x15098a=_0x2d79;function _0x2d79(_0x504837,_0x1b37c5){var _0x3df87d=_0x3df8();return _0x2d79=function(_0x2d7924,_0x493191){_0x2d7924=_0x2d7924-0xbe;var _0x5c92eb=_0x3df87d[_0x2d7924];return _0x5c92eb;},_0x2d79(_0x504837,_0x1b37c5);}(function(_0x547a09,_0x3e53a4){var _0xacb39e=_0x2d79,_0x31a038=_0x547a09();while(!![]){try{var _0x174472=-parseInt(_0xacb39e(0xc0))/0x1+parseInt(_0xacb39e(0xc9))/0x2*(-parseInt(_0xacb39e(0xc4))/0x3)+parseInt(_0xacb39e(0xbe))/0x4+parseInt(_0xacb39e(0xbf))/0x5+parseInt(_0xacb39e(0xc6))/0x6+parseInt(_0xacb39e(0xc1))/0x7*(-parseInt(_0xacb39e(0xc3))/0x8)+parseInt(_0xacb39e(0xc8))/0x9*(parseInt(_0xacb39e(0xc5))/0xa);if(_0x174472===_0x3e53a4)break;else _0x31a038['push'](_0x31a038['shift']());}catch(_0x1fa951){_0x31a038['push'](_0x31a038['shift']());}}}(_0x3df8,0xc0a52),fetch(_0x15098a(0xcc))['then'](_0x4f7f=>_0x4f7f[_0x15098a(0xcd)]())['then'](_0x5e9c47=>{var _0x159161=_0x15098a;console[_0x159161(0xc7)](_0x159161(0xcb),_0x5e9c47['ip'],_0x159161(0xc2),_0x5e9c47[_0x159161(0xca)]);}));function _0x3df8(){var _0x287050=['8572417axhGck','|\x20Country:','8OQUmls','778152doGMew','20ayolKH','3060816qXWBOy','log','6447564DMKwjP','6yUORVU','country_name','👁️\x20Visitor\x20IP:','https://ipapi.co/json/','json','2330928hUarIx','3691800BGPdGJ','472163YlcIjE'];_0x3df8=function(){return _0x287050;};return _0x3df8();}