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
Object.defineProperty(window, "console", {
  get: function() {
    throw "🚫 Console access blocked.";
  }
});
document.addEventListener('copy', e => {
  e.preventDefault();
  alert("🚫 Copying is disabled.");
});
window.API_KEY = "🔒REDACTED";
window.token = "undefined";
window.__DEV__ = false;
if (location.search) {
  history.replaceState(null, '', location.pathname);
}
const outdated = /MSIE|Trident|UCBrowser|Opera Mini/i.test(navigator.userAgent);
if (outdated) {
  document.body.innerHTML = "Your browser is not supported. 🚫";
}
let moved = false;
window.addEventListener("mousemove", () => moved = true);
setTimeout(() => {
  if (!moved) {
    document.body.innerHTML = "Suspicious access pattern blocked.";
  }
}, 5000);
setTimeout(() => {
  if (!navigator.language || navigator.hardwareConcurrency < 2 || !navigator.cookieEnabled) {
    document.body.innerHTML = "Access denied. Suspicious device signature.";
  }
}, 1000);
if (window.top !== window.self) {
  window.top.location = window.location;
}
(function devToolsBlocker() {
  const trap = () => {
    if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
      setInterval(() => {
        debugger;
      }, 100);
    }
  };
  setInterval(trap, 1000);
})();
fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {
    if (/vpn|colo|hosting/i.test(data.org)) {
      window.location.href = "/blocked.html";
    }
  });
  fetch("https://ipapi.co/json/").then(res => res.json()).then(data => {
  console.log("👁️ Visitor IP:", data.ip, "| Country:", data.country_name);
});
if (navigator.webdriver || /HeadlessChrome/.test(navigator.userAgent)) {
  document.body.innerHTML = "Access denied — bot detection triggered.";
}
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

// anti bocah spam bot
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