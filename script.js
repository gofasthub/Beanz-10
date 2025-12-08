/* --- CLOCK LOGIC --- */
function updateClock() {
    const now = new Date();
    
    // Format Time (12hr)
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const timeString = `${hours}:${minutes} ${ampm}`;
    
    // Format Date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dateString = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    const shortDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

    // Update Lock Screen
    document.getElementById('lock-time').innerText = `${hours}:${minutes}`;
    document.getElementById('lock-date').innerText = dateString;

    // Update Taskbar
    document.getElementById('tray-time').innerText = timeString;
    document.getElementById('tray-date').innerText = shortDate;
}

setInterval(updateClock, 1000);
updateClock(); // Run immediately

/* --- LOCK SCREEN --- */
function unlockScreen() {
    const lockScreen = document.getElementById('lock-screen');
    lockScreen.classList.add('unlocked');
}

/* --- START MENU --- */
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.toggle('hidden');
}

// Close Start Menu when clicking on desktop
document.addEventListener('click', function(e) {
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');
    
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');
    }
});

/* --- GAME WINDOW SYSTEM --- */
// USER: Configure your game paths here
const games = {
    'game1': { title: 'Super RPG', url: 'games/rpg/index.html' }, 
    'game2': { title: 'Spooky House', url: 'games/horror/index.html' },
    'game3': { title: 'Racer X', url: 'https://www.google.com/search?igu=1' } // Example external link
};

function openGame(gameId) {
    const game = games[gameId];
    if(!game) return;
    
    createWindow(game.title, game.url);
    
    // Close Start Menu
    document.getElementById('start-menu').classList.add('hidden');
}

function createWindow(title, url) {
    const windowArea = document.getElementById('window-area');
    
    // Check if window already exists (simple version allows multiples)
    
    const win = document.createElement('div');
    win.classList.add('window');
    
    // If user hasn't added a real file yet, show a placeholder message
    const displayContent = url.includes('.html') 
        ? `<iframe src="${url}"></iframe>` 
        : `<div style="color:white; display:flex; justify-content:center; align-items:center; height:100%;">
             <h2>Game Loading: ${url}...</h2>
             <p>(Place your game files in the repo to play)</p>
           </div>`;

    win.innerHTML = `
        <div class="title-bar" onmousedown="dragWindow(event, this.parentElement)">
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <span>_</span>
                <span>□</span>
                <span class="close-btn" onclick="this.closest('.window').remove()">✕</span>
            </div>
        </div>
        <div class="window-content">
            ${displayContent}
        </div>
    `;
    
    windowArea.appendChild(win);
}

/* --- BASIC WINDOW DRAGGING --- */
function dragWindow(e, windowEl) {
    let shiftX = e.clientX - windowEl.getBoundingClientRect().left;
    let shiftY = e.clientY - windowEl.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        windowEl.style.left = pageX - shiftX + 'px';
        windowEl.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    windowEl.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        windowEl.onmouseup = null;
    };
}
