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
        alert('This action is disabled for security reasons.');
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


