// Desktop.js - Main desktop functionality

// Check for mobile and orientation
let hasInitialized = false;
let currentScreen = 'boot'; // Track which screen is active
let animationsPaused = false;
let pageWasHidden = false;

// Prevent white screen and optimize performance when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause animations
        pageWasHidden = true;
        animationsPaused = true;
        document.body.style.animationPlayState = 'paused';
        
        // Pause all animations
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.style.animationPlayState !== undefined) {
                el.style.animationPlayState = 'paused';
            }
        });
    } else {
        // Page is visible again - restore immediately
        if (pageWasHidden) {
            // Force immediate repaint to prevent white screen
            document.body.style.display = 'none';
            document.body.offsetHeight; // Force reflow
            document.body.style.display = '';
            
            // Resume animations smoothly
            requestAnimationFrame(() => {
                document.body.style.animationPlayState = 'running';
                
                const allElements = document.querySelectorAll('*');
                allElements.forEach(el => {
                    if (el.style.animationPlayState !== undefined) {
                        el.style.animationPlayState = 'running';
                    }
                });
                
                animationsPaused = false;
                pageWasHidden = false;
            });
        }
    }
});

// Handle page focus/blur for additional stability
window.addEventListener('focus', () => {
    // Ensure page is visible when focused
    if (document.body.style.display === 'none') {
        document.body.style.display = '';
    }
    
    // Force a single clean repaint
    requestAnimationFrame(() => {
        document.body.offsetHeight;
    });
});

// Prevent layout thrashing
window.addEventListener('blur', () => {
    // Save current state when losing focus
    pageWasHidden = true;
});

// Handle page show/hide events (for back/forward navigation)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from cache - force refresh
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
    }
});

function checkMobileOrientation() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isPortrait = window.innerHeight > window.innerWidth;
    const mobilePrompt = document.getElementById('mobile-prompt');
    const bootScreen = document.getElementById('boot-screen');
    const loginScreen = document.getElementById('login-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const desktop = document.getElementById('desktop');
    
    if (isMobile && isPortrait) {
        // Show mobile prompt, hide everything else
        mobilePrompt.classList.remove('hidden');
        bootScreen.style.display = 'none';
        loginScreen.style.display = 'none';
        welcomeScreen.style.display = 'none';
        desktop.style.display = 'none';
    } else {
        // Hide mobile prompt
        mobilePrompt.classList.add('hidden');
        
        // Restore the correct screen based on what was active
        if (currentScreen === 'boot' && !bootScreen.classList.contains('hidden')) {
            bootScreen.style.display = 'flex';
        } else if (currentScreen === 'login' && !loginScreen.classList.contains('hidden')) {
            loginScreen.style.display = 'flex';
        } else if (currentScreen === 'welcome' && !welcomeScreen.classList.contains('hidden')) {
            welcomeScreen.style.display = 'flex';
        } else if (currentScreen === 'desktop' && !desktop.classList.contains('hidden')) {
            desktop.style.display = 'block';
        } else if (!hasInitialized) {
            // First time initialization
            bootScreen.style.display = 'flex';
            currentScreen = 'boot';
            hasInitialized = true;
        }
    }
}

// Boot sequence
document.addEventListener('DOMContentLoaded', () => {
    checkMobileOrientation();
    initializePortfolio();
});

// Check orientation on resize
window.addEventListener('resize', checkMobileOrientation);
window.addEventListener('orientationchange', checkMobileOrientation);

let bootSequenceStarted = false;

function initializePortfolio() {
    // Load saved settings
    loadSettings();
    
    // Start boot sequence only once
    if (!bootSequenceStarted) {
        bootSequenceStarted = true;
        setTimeout(() => {
            document.getElementById('boot-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('login-screen').style.display = 'flex';
            currentScreen = 'login';
        }, 1500);
    }
    
    // Login screen click - go to welcome screen
    document.getElementById('user-login').addEventListener('click', () => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('welcome-screen').classList.remove('hidden');
        document.getElementById('welcome-screen').style.display = 'flex';
        currentScreen = 'welcome';
        
        // Play startup sound
        const startupSound = document.getElementById('startup-sound');
        
        // Function to transition to desktop
        const goToDesktop = () => {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('desktop').classList.remove('hidden');
            document.getElementById('desktop').style.display = 'block';
            currentScreen = 'desktop';
            updateClock();
            
            // Auto-open Projects and Experience windows side-by-side on the right (desktop only)
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (!isMobile) {
                setTimeout(() => {
                    // Open both windows simultaneously for faster loading
                    const expWindow = createWindow('experience');
                    const projWindow = createWindow('projects');
                    
                    if (expWindow) {
                        expWindow.style.width = '350px';
                        expWindow.style.height = '450px';
                        expWindow.style.left = (window.innerWidth - 720) + 'px';
                        expWindow.style.top = '30px';
                    }
                    
                    if (projWindow) {
                        projWindow.style.width = '350px';
                        projWindow.style.height = '450px';
                        projWindow.style.left = (window.innerWidth - 360) + 'px';
                        projWindow.style.top = '30px';
                    }
                }, 100);
            }
            // Update clock every second
            updateClock();
            setInterval(updateClock, 1000);
            
            // Start notification loop (15 sec first, then every 50 sec)
            startNotificationLoop();
        };
        
        // Play startup sound and transition when it ends
        if (startupSound) {
            startupSound.play().catch(err => console.log('Audio play failed:', err));
            
            // Transition to desktop when sound ends
            startupSound.addEventListener('ended', goToDesktop, { once: true });
            
            // Fallback: if sound doesn't play or takes too long, transition after 2 seconds max
            setTimeout(goToDesktop, 2000);
        } else {
            // No sound, go to desktop immediately
            goToDesktop();
        }
    });
    
    // Desktop initialization
    initializeDesktop();
}

function initializeDesktop() {
    // Desktop icons
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
        // Don't load saved positions - keep icons in grid
        // This prevents overlapping issues
        icon.style.position = 'static';
        
        // Set initial position from grid
        const rect = icon.getBoundingClientRect();
        icon.dataset.initialX = rect.left;
        icon.dataset.initialY = rect.top;
        
        // Make draggable with single click to open
        let isDragging = false;
        let dragStarted = false;
        let startX, startY, iconX, iconY;
        
        icon.onmousedown = function(e) {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            dragStarted = false;
            
            function onMouseMove(event) {
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;
                
                // Only start dragging if moved more than 10px
                if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                    if (!isDragging) {
                        // First time dragging - convert to absolute positioning
                        isDragging = true;
                        dragStarted = true;
                        
                        const rect = icon.getBoundingClientRect();
                        const container = icon.parentElement.getBoundingClientRect();
                        iconX = rect.left - container.left;
                        iconY = rect.top - container.top;
                        icon.style.position = 'absolute';
                        icon.style.left = iconX + 'px';
                        icon.style.top = iconY + 'px';
                    }
                }
                
                if (isDragging) {
                    const newX = iconX + (event.clientX - startX);
                    const newY = iconY + (event.clientY - startY);
                    icon.style.left = newX + 'px';
                    icon.style.top = newY + 'px';
                }
            }
            
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                
                if (isDragging) {
                    // Save position
                    const pos = {
                        x: parseInt(icon.style.left),
                        y: parseInt(icon.style.top)
                    };
                    localStorage.setItem(`icon_pos_${icon.dataset.window}`, JSON.stringify(pos));
                } else if (!dragStarted) {
                    // It was a click, open window
                    const windowType = icon.dataset.window;
                    if (windowType) {
                        createWindow(windowType);
                    }
                }
                
                isDragging = false;
                dragStarted = false;
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        
        icon.ondragstart = function() {
            return false;
        };
        
        // Touch support for mobile
        icon.ontouchstart = function(e) {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            dragStarted = false;
            
            function onTouchMove(event) {
                const touch = event.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                
                // Only start dragging if moved more than 15px (more forgiving on mobile)
                if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
                    if (!isDragging) {
                        // First time dragging - convert to absolute positioning
                        isDragging = true;
                        dragStarted = true;
                        e.preventDefault(); // Prevent scrolling when dragging
                        
                        const rect = icon.getBoundingClientRect();
                        const container = icon.parentElement.getBoundingClientRect();
                        iconX = rect.left - container.left;
                        iconY = rect.top - container.top;
                        icon.style.position = 'absolute';
                        icon.style.left = iconX + 'px';
                        icon.style.top = iconY + 'px';
                    }
                }
                
                if (isDragging) {
                    event.preventDefault();
                    const newX = iconX + (touch.clientX - startX);
                    const newY = iconY + (touch.clientY - startY);
                    icon.style.left = newX + 'px';
                    icon.style.top = newY + 'px';
                }
            }
            
            function onTouchEnd() {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                
                if (isDragging) {
                    // Save position
                    const pos = {
                        x: parseInt(icon.style.left),
                        y: parseInt(icon.style.top)
                    };
                    localStorage.setItem(`icon_pos_${icon.dataset.window}`, JSON.stringify(pos));
                } else if (!dragStarted) {
                    // It was a tap, open window
                    const windowType = icon.dataset.window;
                    if (windowType) {
                        createWindow(windowType);
                    }
                }
                
                isDragging = false;
                dragStarted = false;
            }
            
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
        };
    });
    
    // Start button
    document.getElementById('start-button').addEventListener('click', toggleStartMenu);
    

    
    // Start menu items
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    startMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const windowType = item.dataset.window;
            if (windowType) {
                e.stopPropagation();
                createWindow(windowType);
                toggleStartMenu();
            }
        });
    });
    
    // Logout
    document.getElementById('logout-item').addEventListener('click', () => {
        location.reload();
    });
    
    // Shutdown
    document.getElementById('shutdown-btn').addEventListener('click', () => {
        showShutdownScreen();
    });
    
    // Info icon - show creator info
    document.getElementById('info-icon').addEventListener('click', () => {
        showCreatorInfo();
    });
    
    // Theme toggle icon - eye comfort mode
    let isOrangeTheme = false;
    document.getElementById('theme-icon').addEventListener('click', () => {
        isOrangeTheme = !isOrangeTheme;
        document.body.classList.toggle('orange-theme', isOrangeTheme);
        document.getElementById('theme-icon').textContent = isOrangeTheme ? '☀️' : '🌙';
    });
    
    // Fullscreen toggle
    document.getElementById('fullscreen-toggle-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
        toggleStartMenu();
    });
    
    // Close start menu when clicking outside
    document.addEventListener('click', (e) => {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.classList.add('hidden');
        }
        
        // Minimize active window when clicking outside (with delay to prevent immediate minimize)
        setTimeout(() => {
            const desktop = document.getElementById('desktop');
            if (activeWindow && desktop.contains(e.target) && 
                !activeWindow.contains(e.target) && 
                !e.target.closest('.taskbar-task') &&
                !e.target.closest('.start-menu') &&
                !e.target.closest('.desktop-icon') &&
                !e.target.closest('.start-menu-item') &&
                !e.target.closest('.window') &&
                !e.target.closest('.project-card')) {
                activeWindow.classList.add('minimized');
                const taskbarTask = document.querySelector(`.taskbar-task[data-window-id="${activeWindow.dataset.type}"]`);
                if (taskbarTask) taskbarTask.classList.remove('active');
            }
        }, 100);
    });
}

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.toggle('hidden');
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    // Format date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    
    document.getElementById('clock').textContent = `${displayHours}:${minutes} ${ampm}`;
    document.getElementById('clock').title = `${dayName}, ${monthName} ${date}, ${year}`;
}

function showCreatorInfo() {
    const name = localStorage.getItem('portfolio_name') || 'Bramwel Agina';
    const email = localStorage.getItem('portfolio_email') || 'bramwelagina@example.com';
    const phone = localStorage.getItem('portfolio_phone') || '+254 XXX XXX XXX';
    
    const dialog = document.createElement('div');
    dialog.className = 'xp-dialog';
    dialog.innerHTML = `
        <div class="xp-dialog-content">
            <div class="xp-dialog-header">
                <span class="dialog-title">ℹ️ About Creator</span>
                <button class="dialog-close" onclick="this.closest('.xp-dialog').remove()">×</button>
            </div>
            <div class="xp-dialog-body" style="padding: 20px; text-align: center;">
                <h2 style="margin: 0 0 15px 0; color: #0054e3;">Created by ${name}</h2>
                <div style="text-align: left; margin: 15px 0;">
                    <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${email}</p>
                    <p style="margin: 8px 0;"><strong>📱 Phone:</strong> ${phone}</p>
                </div>
                <p style="margin-top: 15px; font-size: 11px; color: #666;">
                    Windows XP Portfolio © ${new Date().getFullYear()}
                </p>
            </div>
            <div class="xp-dialog-footer">
                <button class="xp-button xp-button-primary" onclick="this.closest('.xp-dialog').remove()">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function showShutdownScreen() {
    const shutdownScreen = document.getElementById('shutdown-screen');
    
    // Set brand name from config
    const brandName = localStorage.getItem('portfolio_boot_name') || 'Windows XP';
    const brandSubtitle = localStorage.getItem('portfolio_boot_subtitle') || 'Professional';
    document.getElementById('shutdown-brand-name').textContent = brandName;
    document.getElementById('shutdown-brand-subtitle').textContent = brandSubtitle;
    
    shutdownScreen.classList.remove('hidden');
    
    let isShutdown = false;
    
    // Fade out after 3 seconds and show black screen
    setTimeout(() => {
        shutdownScreen.style.opacity = '0';
        setTimeout(() => {
            // Hide all content, show black screen
            shutdownScreen.style.background = '#000';
            shutdownScreen.innerHTML = '<div style="color: #fff; text-align: center; font-family: Tahoma; font-size: 14px;">Click anywhere to power on</div>';
            shutdownScreen.style.opacity = '1';
            shutdownScreen.style.display = 'flex';
            shutdownScreen.style.alignItems = 'center';
            shutdownScreen.style.justifyContent = 'center';
            isShutdown = true;
            
            // Click anywhere to restart
            shutdownScreen.addEventListener('click', function restartSystem() {
                location.reload();
            });
        }, 500);
    }, 3000);
}

function initCreditsControls() {
    const creditsScroll = document.getElementById('credits-scroll');
    const creditsContainer = document.getElementById('credits-container');
    const pauseBtn = document.getElementById('credits-pause');
    const playBtn = document.getElementById('credits-play');
    const slowerBtn = document.getElementById('credits-slower');
    const fasterBtn = document.getElementById('credits-faster');
    
    if (!creditsScroll || !pauseBtn || !playBtn) return;
    
    let isPaused = false;
    let currentSpeed = 80; // seconds (faster default)
    
    function updateSpeed() {
        creditsScroll.style.animationDuration = currentSpeed + 's';
    }
    
    // Pause button
    pauseBtn.addEventListener('click', () => {
        creditsScroll.classList.add('paused');
        isPaused = true;
    });
    
    // Play button
    playBtn.addEventListener('click', () => {
        creditsScroll.classList.remove('paused');
        isPaused = false;
    });
    
    // Slower button
    slowerBtn.addEventListener('click', () => {
        currentSpeed += 20;
        if (currentSpeed > 300) currentSpeed = 300; // Max 5 minutes
        updateSpeed();
    });
    
    // Faster button
    fasterBtn.addEventListener('click', () => {
        currentSpeed -= 20;
        if (currentSpeed < 40) currentSpeed = 40; // Min 40 seconds
        updateSpeed();
    });
    
    // Allow manual scrolling
    creditsContainer.addEventListener('wheel', (e) => {
        creditsScroll.classList.add('paused');
        isPaused = true;
    });
}


function loadSettings() {
    const userName = localStorage.getItem('portfolio_name') || 'Bramwel Agina';
    const bootName = localStorage.getItem('portfolio_boot_name') || 'Bramwel Agina';
    const bootSubtitle = localStorage.getItem('portfolio_boot_subtitle') || 'Visual Designer';
    
    // Update user display names
    document.querySelectorAll('#display-name, #start-display-name').forEach(el => {
        el.textContent = userName;
    });
    
    // Update boot screen
    const bootNameEl = document.querySelector('.boot-name');
    const bootSubtitleEl = document.querySelector('.boot-subtitle');
    if (bootNameEl) bootNameEl.textContent = bootName;
    if (bootSubtitleEl) bootSubtitleEl.textContent = bootSubtitle;
    
    // Update login screen branding
    const loginBrandName = document.getElementById('login-brand-name');
    const loginBrandSubtitle = document.getElementById('login-brand-subtitle');
    const restartBrandName = document.getElementById('restart-brand-name');
    const loginClickName = document.getElementById('login-click-name');
    const userSubtitle = document.getElementById('user-subtitle');
    
    if (loginBrandName) loginBrandName.textContent = bootName;
    if (loginBrandSubtitle) loginBrandSubtitle.textContent = bootSubtitle;
    if (restartBrandName) restartBrandName.textContent = bootName;
    if (loginClickName) loginClickName.textContent = userName;
    if (userSubtitle) userSubtitle.textContent = bootSubtitle;
    
    // Load profile picture - default to giphy.gif if none set
    let profilePic = localStorage.getItem('portfolio_profile_pic');
    if (!profilePic) {
        profilePic = 'giphy.gif';
        localStorage.setItem('portfolio_profile_pic', profilePic);
    }
    
    // Update all avatar elements
    updateAllAvatars(profilePic);
}

function getRecycleItems() {
    const defaultItems = [
        { icon: '😴', name: 'Procrastination.exe', desc: 'Deleted for good productivity' },
        { icon: '🐛', name: 'Bugs_I_Created.zip', desc: 'Fixed and removed' },
        { icon: '☕', name: 'Bad_Coffee.java', desc: 'Upgraded to premium beans' },
        { icon: '💤', name: 'Sleep_Schedule.txt', desc: 'Working on restoring this...' },
        { icon: '🎮', name: 'Distractions_Folder', desc: 'Moved to weekends only' }
    ];
    
    const savedItems = localStorage.getItem('recycle_items');
    const items = savedItems ? JSON.parse(savedItems) : defaultItems;
    
    return items.map(item => `
        <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
            <span style="font-size: 32px;">${item.icon}</span>
            <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 13px;">${item.name}</div>
                <div style="font-size: 11px; color: #666;">${item.desc}</div>
            </div>
        </div>
    `).join('');
}

function updateAllAvatars(profilePic) {
    document.querySelectorAll('.avatar-circle, .avatar-circle-large, .start-user-avatar, .password-avatar-img').forEach(el => {
        if (el) {
            el.style.backgroundImage = `url(${profilePic})`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.textContent = '';
        }
    });
}

// Window management
let windowZIndex = 100;
let activeWindow = null;

function createWindow(type) {
    // Check if window already exists
    const existingWindow = document.querySelector(`.window[data-type="${type}"]`);
    if (existingWindow) {
        if (existingWindow.classList.contains('minimized')) {
            existingWindow.classList.remove('minimized');
        }
        focusWindow(existingWindow);
        return existingWindow;
    }
    
    const windowsContainer = document.getElementById('windows-container');
    const window = document.createElement('div');
    window.className = 'window';
    window.dataset.type = type;
    window.style.zIndex = ++windowZIndex;
    
    // Set default size (bigger for project windows)
    const content = getWindowContent(type);
    if (content.externalUrl) {
        // Project windows - bigger
        window.style.width = '900px';
        window.style.height = '600px';
    } else {
        // Regular windows
        window.style.width = '600px';
        window.style.height = '400px';
    }
    
    // Random position
    const x = 50 + Math.random() * 200;
    const y = 50 + Math.random() * 100;
    window.style.left = x + 'px';
    window.style.top = y + 'px';
    
    window.innerHTML = `
        <div class="window-titlebar">
            ${content.externalUrl ? `<button class="external-link-btn" data-url="${content.externalUrl}" title="Open in New Tab">🔗 Open External</button>` : ''}
            <div class="window-icon">${content.icon}</div>
            <div class="window-title">${content.title}</div>
            <div class="window-controls">
                <button class="window-control-btn minimize" title="Minimize">_</button>
                <button class="window-control-btn maximize" title="Maximize">□</button>
                <button class="window-control-btn close" title="Close">×</button>
            </div>
        </div>
        <div class="window-menubar">
            <div class="window-menu-item">File</div>
            <div class="window-menu-item" id="view-menu">View</div>
            <div class="window-menu-item" id="help-menu">Help</div>
        </div>
        <div class="window-content">
            ${content.html}
        </div>
    `;
    
    windowsContainer.appendChild(window);
    
    // Add window controls
    setupWindowControls(window);
    
    // Add to taskbar
    addToTaskbar(window, content.title, content.icon);
    
    // Focus window
    focusWindow(window);
    
    // Initialize window-specific functionality
    if (type === 'resume') {
        initializeResume();
    } else if (type === 'dino') {
        setTimeout(() => initDinoGame(), 100);
    } else if (type === 'snake') {
        setTimeout(() => initSnakeGame(), 100);
    } else if (type === 'about') {
        setTimeout(() => initCreditsControls(), 100);
    } else if (type === 'spotify') {
        setTimeout(() => initSpotifyPlayer(), 100);
    }
    
    return window;
}


function getWindowContent(type) {
    const userName = localStorage.getItem('portfolio_name') || 'Bramwel Agina';
    const userEmail = localStorage.getItem('portfolio_email') || 'bramwelagina@example.com';
    const userPhone = localStorage.getItem('portfolio_phone') || '+254 XXX XXX XXX';
    const userBio = localStorage.getItem('portfolio_bio') || 'Software Developer passionate about creating innovative solutions and beautiful user experiences.';
    
    const contents = {
        about: {
            icon: '📁',
            title: 'About Me',
            html: `
                <div class="credits-container" id="credits-container">
                    <div class="credits-scroll" id="credits-scroll">
                        <div class="credits-section">
                            <h1 class="credits-title">${userName}</h1>
                            <p class="credits-subtitle">Full Stack Developer | Software Engineer | AI/ML Specialist</p>
                            <p class="credits-desc" style="max-width: 600px; margin: 20px auto;">
                                Passionate about building innovative digital solutions that make a difference. 
                                From web applications to mobile apps and AI-powered systems, I bring ideas to life with clean code and creative problem-solving.
                            </p>
                        </div>
                        
                        <div class="credits-section">
                            <h2 class="credits-heading">🚀 FEATURED PROJECTS</h2>
                            
                            <div class="credits-item">
                                <p class="credits-role">🌐 Full Stack Web Application</p>
                                <a href="https://allotmealafroc.com" target="_blank" class="credits-name credits-clickable">allotmealafroc.com</a>
                                <p class="credits-desc">A comprehensive web platform built from scratch with modern technologies.</p>
                                <p class="credits-desc">Features include user authentication, real-time updates, and responsive design.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">📻 Radio Streaming Platforms</p>
                                <p class="credits-desc">Developed and deployed multiple professional radio streaming platforms on radio.or.ke</p>
                            </div>
                            
                            <div class="credits-item">
                                <a href="https://radio.or.ke/kenlive" target="_blank" class="credits-name credits-clickable">radio.or.ke/kenlive</a>
                                <p class="credits-desc">Live streaming platform with real-time audio broadcasting, chat features, and analytics dashboard.</p>
                                <p class="credits-desc">Handles thousands of concurrent listeners with zero downtime.</p>
                            </div>
                            
                            <div class="credits-item">
                                <a href="https://radio.or.ke/milestone-radio" target="_blank" class="credits-name credits-clickable">radio.or.ke/milestone-radio</a>
                                <p class="credits-desc">Educational institution radio system with scheduled programming and podcast archives.</p>
                                <p class="credits-desc">Integrated with mobile app for seamless cross-platform experience.</p>
                            </div>
                            
                            <div class="credits-item">
                                <a href="https://radio.or.ke/newsline" target="_blank" class="credits-name credits-clickable">radio.or.ke/newsline</a>
                                <p class="credits-desc">Professional news broadcasting platform with live updates and breaking news alerts.</p>
                                <p class="credits-desc">Custom CMS for content management and automated scheduling.</p>
                            </div>
                        </div>
                        
                        <div class="credits-section">
                            <h2 class="credits-heading">🔧 WEBSITE TRANSFORMATIONS</h2>
                            <p class="credits-desc">Breathed new life into existing platforms with modern design and enhanced functionality</p>
                            
                            <div class="credits-item">
                                <a href="https://www.kenlive.co.ke" target="_blank" class="credits-name credits-clickable">www.kenlive.co.ke</a>
                                <p class="credits-desc">Complete redesign with modern UI/UX principles and improved performance.</p>
                                <p class="credits-desc">Migrated to responsive design, optimized loading times by 60%.</p>
                            </div>
                            
                            <div class="credits-item">
                                <a href="https://www.newsline.co.ke" target="_blank" class="credits-name credits-clickable">www.newsline.co.ke</a>
                                <p class="credits-desc">Full UI/UX overhaul with focus on readability and user engagement.</p>
                                <p class="credits-desc">Implemented SEO best practices and accessibility standards.</p>
                            </div>
                            
                            <div class="credits-item">
                                <a href="https://www.bigstarnews.co.ke" target="_blank" class="credits-name credits-clickable">www.bigstarnews.co.ke</a>
                                <p class="credits-desc">Complete stack renovation from frontend to backend infrastructure.</p>
                                <p class="credits-desc">Enhanced security, scalability, and content management system.</p>
                            </div>
                        </div>
                        
                        <div class="credits-section">
                            <h2 class="credits-heading">📱 MOBILE DEVELOPMENT</h2>
                            
                            <div class="credits-item">
                                <p class="credits-role">Android Application</p>
                                <p class="credits-name">Milestone Radio App</p>
                                <p class="credits-desc">Native Android app with 10,000+ downloads on Google Play Store.</p>
                                <p class="credits-desc">Features: Live streaming, offline playback, push notifications, and social sharing.</p>
                                <p class="credits-desc">Built with modern Android architecture components and Material Design.</p>
                                <a href="https://play.google.com/store/apps/details?id=com.milestoneinstitute.radio" target="_blank" class="credits-link credits-clickable">📥 Download on Google Play Store</a>
                            </div>
                        </div>
                        
                        <div class="credits-section">
                            <h2 class="credits-heading">💻 TECHNICAL EXPERTISE</h2>
                            
                            <div class="credits-item">
                                <p class="credits-skill">Frontend Development</p>
                                <p class="credits-desc">HTML5, CSS3, JavaScript (ES6+), React, Vue.js, Angular</p>
                                <p class="credits-desc">Responsive Design, Progressive Web Apps, Animation & Interactions</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-skill">Backend Development</p>
                                <p class="credits-desc">Node.js, Python, PHP, RESTful APIs, GraphQL</p>
                                <p class="credits-desc">MySQL, MongoDB, PostgreSQL, Redis, Firebase</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-skill">Mobile Development</p>
                                <p class="credits-desc">Native Android (Java/Kotlin), React Native, Flutter</p>
                                <p class="credits-desc">Cross-platform solutions, App Store deployment, Push notifications</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-skill">AI & Machine Learning</p>
                                <p class="credits-desc">TensorFlow, PyTorch, Scikit-learn, Natural Language Processing</p>
                                <p class="credits-desc">Computer Vision, Predictive Analytics, Neural Networks</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-skill">DevOps & Tools</p>
                                <p class="credits-desc">Git, Docker, CI/CD, AWS, Linux, Nginx, Apache</p>
                                <p class="credits-desc">Performance optimization, Security best practices</p>
                            </div>
                        </div>
                        
                        <div class="credits-section">
                            <h2 class="credits-heading">💼 PROFESSIONAL EXPERIENCE</h2>
                            
                            <div class="credits-item">
                                <p class="credits-role">Full-Stack Web Developer</p>
                                <p class="credits-name"><a href="https://allotmealafroc.com" target="_blank" class="credits-clickable" style="color: #667eea; text-decoration: none;">AllotMeal Afroc Platform</a></p>
                                <p class="credits-desc">2023 - Present</p>
                                <p class="credits-desc">Led redesign and deployment of allotmealafroc.com connecting 1000+ hotels, businesses, and stakeholders through listings, networking, and payment services. Built with Next.js, MongoDB, and Netlify.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">Radio Platform Developer</p>
                                <p class="credits-name"><a href="https://radio.kenlive.co.ke" target="_blank" class="credits-clickable" style="color: #667eea; text-decoration: none;">KenLive Radio</a></p>
                                <p class="credits-desc">2023 - Present</p>
                                <p class="credits-desc">Created live streaming radio platform for community news and programs founded by Ken Wakuraya, former Inooro news anchor. Built real-time audio broadcasting system with chat features and analytics dashboard handling thousands of concurrent listeners with zero downtime.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">Full-Stack Developer & Mobile App Developer</p>
                                <p class="credits-name"><a href="https://radio.milestoneinstitute.ac.ke" target="_blank" class="credits-clickable" style="color: #667eea; text-decoration: none;">Milestone Radio</a></p>
                                <p class="credits-desc">2023 - Present</p>
                                <p class="credits-desc">Developed both web platform and Android mobile app for Milestone Institute's educational radio system. Web platform features scheduled programming and podcast archives. Mobile app has 10,000+ downloads on Google Play Store with live streaming, offline playback, push notifications, and social sharing capabilities.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">Mobile App Developer</p>
                                <p class="credits-name"><a href="https://drive.google.com/file/d/1oNvRwnLwDcZJQZFzQKMfCSbODjAQ2hwW/view?usp=drive_link" target="_blank" class="credits-clickable" style="color: #667eea; text-decoration: none;">SCHACCS & Educational Institutions</a></p>
                                <p class="credits-desc">2024 - 2025</p>
                                <p class="credits-desc">Developed parent-student portal with 10,000+ downloads featuring fee overview, academic results, attendance tracking, and event notifications. Built using Flutter, Firebase, and SQLite.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">SMS-Based Application Developer</p>
                                <p class="credits-name"><a href="https://drive.google.com/file/d/13RMQPaovCbr7BipoDhvtZoT6gTUP8hxk/view?usp=drive_link" target="_blank" class="credits-clickable" style="color: #667eea; text-decoration: none;">Rental Management System</a></p>
                                <p class="credits-desc">2024</p>
                                <p class="credits-desc">Created innovative SMS-based rental application that reads and processes SMS messages instead of traditional API data. Enables property managers to track rent payments, send reminders, and manage tenants through SMS communication, perfect for areas with limited internet connectivity.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">Android/iOS Developer</p>
                                <p class="credits-name">Various Clients</p>
                                <p class="credits-desc">2022 - 2025</p>
                                <p class="credits-desc">Developed cross-platform mobile applications integrating RESTful APIs. Built secure SACCO app processing $2M+ in transactions with zero security incidents using Java (Android) and Swift (iOS).</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">Freelance Web Developer</p>
                                <p class="credits-name">Multiple Organizations</p>
                                <p class="credits-desc">Jan 2023 - Dec 2023</p>
                                <p class="credits-desc">Built secure, responsive web applications and CRM modules using PHP, Laravel, and MySQL. Collaborated with clients to deliver custom solutions on schedule, improving operational efficiency by 60%.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">Full-Stack Developer & IT Trainer</p>
                                <p class="credits-name"><a href="https://newslinemedia.co.ke" target="_blank" class="credits-clickable" style="color: #667eea; text-decoration: none;">Newsline Media</a></p>
                                <p class="credits-desc">Aug 2024 - Dec 2025</p>
                                <p class="credits-desc">Developed platform connecting businesses with students seeking attachments and training opportunities across Kenya. Built comprehensive networking system bridging education and industry.</p>
                                <p class="credits-desc">Trained attachés in various IT disciplines: Web Development, Android App Development, AI/ML, Cybersecurity, Networking, and Database Management.</p>
                            </div>
                            
                            <div class="credits-item">
                                <p class="credits-role">Cybersecurity Trainer</p>
                                <p class="credits-name">MediaCrest</p>
                                <p class="credits-desc">2024</p>
                                <p class="credits-desc">Trained professionals in cybersecurity best practices, threat detection, and security protocols. Developed training materials and conducted hands-on workshops on network security and ethical hacking.</p>
                            </div>
                        </div>
                        
                        <div class="credits-section">
                            <h2 class="credits-heading">🎓 EDUCATION & GROWTH</h2>
                            <div class="credits-item">
                                <p class="credits-name">Software Engineering</p>
                                <p class="credits-desc">Specialized in AI/ML Development and Full Stack Engineering</p>
                                <p class="credits-desc">Continuous learner, always exploring new technologies and best practices</p>
                            </div>
                        </div>
                        
                        <div class="credits-section">
                            <h2 class="credits-heading">🌟 WHAT I BRING</h2>
                            <div class="credits-item">
                                <p class="credits-desc">✓ Clean, maintainable, and scalable code</p>
                                <p class="credits-desc">✓ User-centered design thinking</p>
                                <p class="credits-desc">✓ Problem-solving mindset</p>
                                <p class="credits-desc">✓ Attention to detail and quality</p>
                                <p class="credits-desc">✓ Effective communication and collaboration</p>
                                <p class="credits-desc">✓ Passion for innovation and continuous improvement</p>
                            </div>
                        </div>
                        
                        <div class="credits-section credits-final">
                            <h1 class="credits-title">Thank You</h1>
                            <p class="credits-subtitle">For Viewing My Portfolio</p>
                            <p class="credits-contact">Get in touch to collaborate!</p>
                        </div>
                    </div>
                    <div class="credits-controls">
                        <button class="credits-btn" id="credits-slower">🐢 Slower</button>
                        <button class="credits-btn" id="credits-pause">⏸️ Pause</button>
                        <button class="credits-btn" id="credits-play">▶️ Play</button>
                        <button class="credits-btn" id="credits-faster">🐇 Faster</button>
                    </div>
                </div>
            `
        },
        projects: {
            icon: '💼',
            title: 'My Projects',
            html: `
                <div style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100%;">
                    <h1 style="color: white; font-size: 32px; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Featured Projects</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-bottom: 30px; font-size: 14px;">Click any project to explore</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                        <!-- KenLive Radio -->
                        <div onclick="createWindow('kenlive')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">📻</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">KenLive Radio</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">Community news and programs founded by Ken Wakuraya, former Inooro news anchor. Listed at radio.or.ke/kenlive-radio/</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Live Streaming</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">National Visibility</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Next.js</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Node.js</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Firebase</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Figma</span>
                            </div>
                            <span style="color: #667eea; font-weight: 600; font-size: 14px;">Open App →</span>
                        </div>
                        
                        <!-- Milestone Radio -->
                        <div onclick="createWindow('milestone')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">🎓</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">Milestone Radio</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">Radio for Milestone Institute supporting student broadcasting and media practice. Listed at radio.or.ke/milestone-radio/</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Educational</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Student Media</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Next.js</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Node.js</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Firebase</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Figma</span>
                            </div>
                            <span style="color: #f5576c; font-weight: 600; font-size: 14px;">Open App →</span>
                        </div>
                        
                        <!-- Newsline Radio -->
                        <div onclick="createWindow('newsline')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">📰</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">Newsline Radio</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">News dissemination and student journalism training platform. Listed at radio.or.ke/newsline/</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f9ff; color: #0099cc; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">News Platform</span>
                                <span style="background: #e6f9ff; color: #0099cc; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Journalism</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Next.js</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Node.js</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Firebase</span>
                            </div>
                            <span style="color: #00f2fe; font-weight: 600; font-size: 14px;">Open App →</span>
                        </div>
                        
                        <!-- AllotMeal -->
                        <div onclick="createWindow('allotmeal')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">🍽️</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">AllotMeal Africa</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">Platform connecting companies across Africa - hotels, restaurants, agriculture, and business services with advanced booking and payment integration.</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #fff4e6; color: #cc6600; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Business Platform</span>
                                <span style="background: #fff4e6; color: #cc6600; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Pan-African</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Next.js</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Node.js</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Firebase</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">PostgreSQL</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">M-Pesa API</span>
                            </div>
                            <span style="color: #fa709a; font-weight: 600; font-size: 14px;">Open App →</span>
                        </div>
                        
                        <!-- Newsline Media -->
                        <div onclick="createWindow('newslinemedia')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">🤝</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">Newsline Media</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">Platform connecting businesses with students seeking attachments and training opportunities across Kenya. Bridging education and industry.</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6fff9; color: #00997a; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Education</span>
                                <span style="background: #e6fff9; color: #00997a; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Networking</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">React</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Node.js</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">PostgreSQL</span>
                            </div>
                            <span style="color: #30cfd0; font-weight: 600; font-size: 14px;">Open App →</span>
                        </div>
                        
                        <!-- KenLive Website -->
                        <div onclick="createWindow('kenlive-web')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="position: absolute; top: 12px; right: 12px; background: #ff6b6b; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 700;">REDESIGNED</div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">🔧</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">KenLive.co.ke</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">Complete website renovation with modern UI/UX, improved performance, and responsive design. 60% faster loading times.</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #ffe6e6; color: #cc0000; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Renovation</span>
                                <span style="background: #ffe6e6; color: #cc0000; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Performance</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #ffe6f0; color: #cc0066; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">WordPress</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">JavaScript</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">MySQL</span>
                            </div>
                            <span style="color: #ff6b6b; font-weight: 600; font-size: 14px;">Open Website →</span>
                        </div>
                        
                        <!-- Newsline Website -->
                        <div onclick="createWindow('newsline-web')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="position: absolute; top: 12px; right: 12px; background: #56ab2f; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 700;">REDESIGNED</div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">📰</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">Newsline.co.ke</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">News platform UI/UX overhaul with focus on readability, SEO optimization, and accessibility standards.</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #f0ffe6; color: #336600; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">News Platform</span>
                                <span style="background: #f0ffe6; color: #336600; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">SEO</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #ffe6f0; color: #cc0066; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">WordPress</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">JavaScript</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">MySQL</span>
                            </div>
                            <span style="color: #56ab2f; font-weight: 600; font-size: 14px;">Open Website →</span>
                        </div>
                        
                        <!-- BigStar News -->
                        <div onclick="createWindow('bigstar-web')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="position: absolute; top: 12px; right: 12px; background: #f7971e; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 700;">REDESIGNED</div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">⭐</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">BigStarNews.co.ke</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">Complete stack renovation from frontend to backend. Enhanced security, scalability, and modern CMS.</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #fff9e6; color: #996600; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Full Stack</span>
                                <span style="background: #fff9e6; color: #996600; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Security</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #ffe6f0; color: #cc0066; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">WordPress</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">JavaScript</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">MySQL</span>
                            </div>
                            <span style="color: #f7971e; font-weight: 600; font-size: 14px;">Open Website →</span>
                        </div>
                        
                        <!-- Milestone Radio App -->
                        <div onclick="window.open('https://play.google.com/store/apps/details?id=com.milestoneinstitute.radio', '_blank')" style="background: white; border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px;">📱</div>
                            <h3 style="color: #1a202c; font-size: 18px; margin-bottom: 8px;">Milestone Radio App</h3>
                            <p style="color: #718096; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">Native Android app on Google Play Store with 10,000+ downloads. Reliable technical delivery with national reach.</p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6fff9; color: #00997a; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Android</span>
                                <span style="background: #e6fff9; color: #00997a; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">10K+ Downloads</span>
                            </div>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                                <span style="background: #e6f7ff; color: #0099cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Android Studio</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Dart/Flutter</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Firebase</span>
                            </div>
                            <span style="color: #00997a; font-weight: 600; font-size: 14px;">Open in Play Store →</span>
                        </div>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <button onclick="createWindow('allprojects')" style="background: white; color: #667eea; padding: 12px 30px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: all 0.3s;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 12px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.2)'">
                            📂 View All Projects (20+)
                        </button>
                    </div>
                </div>
            `
        },
        allprojects: {
            icon: '📂',
            title: 'All Projects - Complete Portfolio',
            html: `<div style="padding:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);height:100%;overflow-y:auto"><div style="padding:40px 40px 30px"><h1 style="color:white;font-size:36px;margin:0 0 10px 0;text-shadow:2px 2px 4px rgba(0,0,0,0.3);font-weight:bold">Complete Portfolio</h1><p style="color:rgba(255,255,255,0.95);font-size:16px;margin:0">20+ projects across web, mobile, AI/ML, design & research</p></div><div style="padding:0 40px 40px"><div style="margin-bottom:40px"><h2 style="color:white;font-size:24px;margin:0 0 20px 0;display:flex;align-items:center;gap:10px"><span style="font-size:28px">🌐</span> Web Projects</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px"><div onclick="createWindow('allotmeal')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#fa709a 0%,#fee140 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">AllotMeal Africa</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Platform connecting companies across Africa</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Next.js</span><span style="background:#e6ffe6;color:#009900;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Node.js</span><span style="background:#fff0e6;color:#cc6600;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Firebase</span><span style="background:#e6ffe6;color:#009900;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">PostgreSQL</span><span style="background:#ffe6f0;color:#cc0066;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">M-Pesa API</span></div></div><div onclick="createWindow('newslinemedia')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#30cfd0 0%,#330867 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Newsline Media</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Student-business connection platform</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Education</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">React</span><span style="background:#e6ffe6;color:#009900;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Node.js</span><span style="background:#e6ffe6;color:#009900;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">PostgreSQL</span></div></div><div onclick="createWindow('kenlive-web')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#ff6b6b 0%,#ee5a6f 100%)"></div><div style="position:absolute;top:16px;right:16px;background:#ff6b6b;color:white;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700">REDESIGNED</div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">KenLive.co.ke</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">60% faster loading times</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Performance</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#ffe6f0;color:#cc0066;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">WordPress</span><span style="background:#e6f2ff;color:#0066cc;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">JavaScript</span><span style="background:#e6ffe6;color:#009900;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">MySQL</span></div></div><div onclick="createWindow('newsline-web')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#56ab2f 0%,#a8e063 100%)"></div><div style="position:absolute;top:16px;right:16px;background:#ff6b6b;color:white;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700">REDESIGNED</div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Newsline.co.ke</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">SEO optimization</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">SEO</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#ffe6f0;color:#cc0066;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">WordPress</span><span style="background:#e6f2ff;color:#0066cc;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">JavaScript</span><span style="background:#e6ffe6;color:#009900;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">MySQL</span></div></div><div onclick="createWindow('bigstar-web')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#f7971e 0%,#ffd200 100%)"></div><div style="position:absolute;top:16px;right:16px;background:#ff6b6b;color:white;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700">REDESIGNED</div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">BigStarNews.co.ke</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Full stack renovation</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Full Stack</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#ffe6f0;color:#cc0066;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">WordPress</span><span style="background:#e6f2ff;color:#0066cc;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">JavaScript</span><span style="background:#e6ffe6;color:#009900;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">MySQL</span></div></div><div onclick="window.open('https://github.com/Bramtheking/Ai-detector-Website-React.git','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#667eea 0%,#764ba2 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">AI Detector Website 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">AI detection platform</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">React</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">TensorFlow</span></div></div><div onclick="window.open('https://drive.google.com/file/d/1EqzwYl-XUOfP6hwRrlKUMhctETF5ridg/view?usp=drive_link','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#4facfe 0%,#00f2fe 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">School Management System 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Educational platform</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">React</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">React</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Node.js</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">MongoDB</span></div></div></div></div><div style="margin-bottom:40px"><h2 style="color:white;font-size:24px;margin:0 0 20px 0;display:flex;align-items:center;gap:10px"><span style="font-size:28px">📱</span> Mobile Apps</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px"><div onclick="window.open('https://github.com/Bramtheking/SCHACCS.git','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#f093fb 0%,#f5576c 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">SCHACCS App 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Student portal with 12K+ downloads</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Flutter</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">12K+</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Flutter</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Dart</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Firebase</span></div></div><div onclick="window.open('https://drive.google.com/file/d/1CzDfpguiAVTYj9Bkzfb3K7LrXs8beBal/view?usp=drive_link','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#a8edea 0%,#fed6e3 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Health Living App 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Wellness tracking with AI</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Flutter</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">10K+</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Flutter</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Dart</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">TensorFlow</span></div></div><div onclick="window.open('https://github.com/Bramtheking/aidetectorandroidapp.git','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#ffd200 0%,#f7971e 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">AI Detector App 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">ML models with 95% accuracy</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">React Native</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">5K+</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">React Native</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">JavaScript</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">TensorFlow</span></div></div><div onclick="window.open('https://github.com/Bramtheking/healthtracker.git','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#ee5a6f 0%,#f093fb 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Doctor App 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Video consultations</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Flutter</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">8K+</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Flutter</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Dart</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">WebRTC</span></div></div><div style="background:white;padding:24px;border-radius:16px;box-shadow:0 8px 16px rgba(0,0,0,0.15);position:relative;overflow:hidden;opacity:0.85"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#34a853 0%,#0f9d58 100%)"></div><div style="position:absolute;top:16px;right:16px;background:#999;color:white;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:700">PRIVATE</div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">PEFRANK SACCO App</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Secure savings - $2M+ transactions</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Java</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">15K+</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Java</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Android</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">MySQL</span></div></div><div onclick="window.open('https://play.google.com/store/apps/details?id=com.milestoneinstitute.radio','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#764ba2 0%,#667eea 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Milestone Radio App 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Android app with 10K+ downloads</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Android</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">10K+</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Android Studio</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Dart/Flutter</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Firebase</span></div></div></div></div><div style="margin-bottom:40px"><h2 style="color:white;font-size:24px;margin:0 0 20px 0;display:flex;align-items:center;gap:10px"><span style="font-size:28px">📻</span> Radio Platforms</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px"><div onclick="createWindow('kenlive')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#667eea 0%,#764ba2 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">KenLive Radio</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Community news platform</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Firebase</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Next.js</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Cloudinary</span></div></div><div onclick="createWindow('milestone')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#f5576c 0%,#f093fb 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Milestone Radio</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Student broadcasting</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Firebase</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Next.js</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Figma</span></div></div><div onclick="createWindow('newsline')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#00f2fe 0%,#4facfe 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Newsline Radio</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Journalism training</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Firebase</span><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Next.js</span></div></div></div></div><div style="margin-bottom:40px"><h2 style="color:white;font-size:24px;margin:0 0 20px 0;display:flex;align-items:center;gap:10px"><span style="font-size:28px">🤖</span> AI & ML</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px"><div onclick="window.open('https://www.kaggle.com/code/bramwelagina/bramwel','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#20bfff 0%,#4facfe 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Loan Default Prediction 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Top 100/10,000 - 95% accuracy</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Python</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Scikit-learn</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Pandas</span></div></div><div onclick="window.open('https://www.academia.edu/124266169','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#a8e063 0%,#56ab2f 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">AI Text Detector 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">BERT model for AI vs human text</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Python</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">BERT</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">TensorFlow</span></div></div>/div></div><div style="margin-bottom:40px"><h2 style="color:white;font-size:24px;margin:0 0 20px 0;display:flex;align-items:center;gap:10px"><span style="font-size:28px">🎨</span> Design</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px"><div onclick="window.open('https://www.figma.com/design/4kU2NKfmL5YWEijEiJO70W/Coffee-Shop-Mobile-App-Design?node-id=0-1','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#fee140 0%,#fa709a 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Coffee Shop Design 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Elegant café ordering system</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Figma</span></div></div><div onclick="window.open('https://www.figma.com/design/qhz2JiiViREHisOBP5KOYf/Online-Bike-Shopping-App?node-id=0-1','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#30cfd0 0%,#330867 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Bike Shopping Design 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">E-commerce with AR preview</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#e6f2ff;color:#0066cc;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600">Figma</span></div></div></div></div><div style="margin-bottom:40px"><h2 style="color:white;font-size:24px;margin:0 0 20px 0;display:flex;align-items:center;gap:10px"><span style="font-size:28px">🔬</span> Research</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px"><div onclick="window.open('https://www.academia.edu/124266169','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#667eea 0%,#764ba2 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Simulating Smell Device 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">Electromagnetic wave olfactory device (2024)</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">IoT</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Hardware</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Research</span></div></div><div onclick="window.open('https://www.academia.edu/130053956','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#f5576c 0%,#f093fb 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Hybrid Census Solution 🔗</h3><p style="margin:0 0 16px 0;font-size:14px;color:#4a5568;line-height:1.6">96-98% coverage, 90% cost reduction (2025)</p><div style="display:flex;gap:8px;flex-wrap:wrap"><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">AI/ML</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Big Data</span><span style="background:#f0f0f0;color:#333;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:600">Research</span></div></div><div onclick="window.open('https://www.academia.edu/130053873','_blank')" style="background:white;padding:24px;border-radius:16px;cursor:pointer;box-shadow:0 8px 16px rgba(0,0,0,0.15);transition:all 0.3s;position:relative;overflow:hidden" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 32px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"><div style="position:absolute;top:0;left:0;width:6px;height:100%;background:linear-gradient(180deg,#a8edea 0%,#fed6e3 100%)"></div><h3 style="margin:0 0 12px 0;color:#1a202c;font-size:20px;font-weight:bold">Baby-Like AI System 🔗</h3><p style="margin:0;font-size:14px;color:#4a5568;line-height:1.6">AI that learns like a newborn (2025)</p></div></div></div></div></div>`
        },
        kenlive: {
            icon: '📻',
            title: 'KenLive Radio Project',
            externalUrl: 'https://radio.kenlive.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-kenlive">Loading...</div>
                    <iframe src="https://radio.kenlive.co.ke" style="flex: 1; width: 100%; border: none;" title="KenLive Radio" onload="document.getElementById('loader-kenlive')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-kenlive'); if(loader) loader.remove(); }, 3000);</script>
            `
        },
        milestone: {
            icon: '📻',
            title: 'Milestone Radio Project',
            externalUrl: 'https://radio.milestoneinstitute.ac.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-milestone">Loading...</div>
                    <iframe src="https://radio.milestoneinstitute.ac.ke" style="flex: 1; width: 100%; border: none;" title="Milestone Radio" onload="document.getElementById('loader-milestone')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-milestone'); if(loader) loader.remove(); }, 3000);</script>
            `
        },
        newsline: {
            icon: '📻',
            title: 'Newsline Radio Project',
            externalUrl: 'https://radio.newsline.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-newsline">Loading...</div>
                    <iframe src="https://radio.newsline.co.ke" style="flex: 1; width: 100%; border: none;" title="Newsline Radio" onload="document.getElementById('loader-newsline')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-newsline'); if(loader) loader.remove(); }, 3000);</script>
            `
        },
        allotmeal: {
            icon: '🍽️',
            title: 'AllotMeal Africa - Business Platform',
            externalUrl: 'https://allotmealafroc.com',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-allotmeal">Loading...</div>
                    <iframe src="https://allotmealafroc.com" style="flex: 1; width: 100%; border: none;" title="AllotMeal Africa" onload="document.getElementById('loader-allotmeal')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-allotmeal'); if(loader) loader.remove(); }, 3000);</script>
            `
        },
        newslinemedia: {
            icon: '🤝',
            title: 'Newsline Media - Student-Business Platform',
            externalUrl: 'https://newslinemedia.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-newslinemedia">Loading...</div>
                    <iframe src="https://newslinemedia.co.ke" style="flex: 1; width: 100%; border: none;" title="Newsline Media" onload="document.getElementById('loader-newslinemedia')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-newslinemedia'); if(loader) loader.remove(); }, 3000);</script>
            `
        },
        'kenlive-web': {
            icon: '🔧',
            title: 'KenLive.co.ke - Website Renovation',
            externalUrl: 'https://www.kenlive.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-kenlive-web">Loading...</div>
                    <iframe src="https://www.kenlive.co.ke" style="flex: 1; width: 100%; border: none;" title="KenLive Website" onload="document.getElementById('loader-kenlive-web')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-kenlive-web'); if(loader) loader.remove(); }, 3000);</script>
            `
        },
        'newsline-web': {
            icon: '📰',
            title: 'Newsline.co.ke - News Platform',
            externalUrl: 'https://www.newsline.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-newsline-web">Loading...</div>
                    <iframe src="https://www.newsline.co.ke" style="flex: 1; width: 100%; border: none;" title="Newsline Website" onload="document.getElementById('loader-newsline-web')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-newsline-web'); if(loader) loader.remove(); }, 3000);</script>
            `
        },
        'bigstar-web': {
            icon: '⭐',
            title: 'BigStarNews.co.ke - News Platform',
            externalUrl: 'https://www.bigstarnews.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-bigstar-web">Loading...</div>
                    <iframe src="https://www.bigstarnews.co.ke" style="flex: 1; width: 100%; border: none;" title="BigStar News" onload="document.getElementById('loader-bigstar-web')?.remove()"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-bigstar-web'); if(loader) loader.remove(); }, 3000);</script>
            `
        },

        resume: {
            icon: '📄',
            title: 'Resume',
            html: `
                <div class="resume-viewer" style="height: 100%; display: flex; flex-direction: column;">
                    <iframe src="resume.pdf#view=FitH&zoom=100" style="flex: 1; width: 100%; border: none; background: #525252; transform: scale(1); zoom: 1;" title="Resume PDF Viewer"></iframe>
                </div>
            `
        },
        dino: {
            icon: '🦖',
            title: 'Dino Game',
            html: `
                <div style="padding: 15px; text-align: center; background: #f0f0f0;">
                    <div style="margin-bottom: 10px;">
                        <h2 style="margin: 0 0 5px 0; color: #333;">🦖 Chrome Dino Game</h2>
                        <p style="margin: 0; font-size: 13px; color: #666;">
                            <strong>SPACE/UP:</strong> Jump | <strong>DOWN:</strong> Duck | <strong>Click:</strong> Jump
                        </p>
                    </div>
                    <canvas id="dino-canvas" style="border: 3px solid #333; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-radius: 4px;"></canvas>
                </div>
            `
        },
        snake: {
            icon: '🐍',
            title: 'Snake Game',
            html: `
                <div style="padding: 15px; text-align: center; background: #f0f0f0;">
                    <div style="margin-bottom: 10px;">
                        <h2 style="margin: 0 0 5px 0; color: #333;">🐍 Classic Snake Game</h2>
                        <p style="margin: 0; font-size: 13px; color: #666;">
                            <strong>Arrow Keys</strong> or <strong>WASD</strong> to Move
                        </p>
                    </div>
                    <canvas id="snake-canvas" style="border: 3px solid #333; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border-radius: 4px;"></canvas>
                </div>
            `
        },
        recycle: {
            icon: '🗑️',
            title: 'Recycle Bin',
            html: `
                <div style="padding: 20px;">
                    <h1>Recycle Bin</h1>
                    <p style="margin-bottom: 20px;">Items I've "deleted" from my life</p>
                    <div id="recycle-items" style="display: grid; gap: 10px;">
                        ${getRecycleItems()}
                    </div>
                    <button class="btn-primary" onclick="document.getElementById('recycle-items').innerHTML = '<p style=padding:20px;text-align:center;color:#666;>Recycle Bin is empty</p>'" style="margin-top: 20px; padding: 8px 16px;">
                        🗑️ Empty Recycle Bin
                    </button>
                </div>
            `
        },
        contact: {
            icon: '✉️',
            title: 'Contact',
            html: `
                <h1>Get In Touch</h1>
                <p>Feel free to reach out to me through any of the following channels:</p>
                <div class="contact-info">
                    <div class="contact-item">
                        <img src="icons/mail.png" class="contact-icon-img" alt="Email">
                        <div>
                            <strong>Email:</strong><br>
                            <a href="mailto:${userEmail}" class="contact-link">${userEmail}</a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <img src="icons/phone.png" class="contact-icon-img" alt="Phone">
                        <div>
                            <strong>Phone:</strong><br>
                            <span>${userPhone}</span>
                        </div>
                    </div>
                    <div class="contact-item">
                        <img src="icons/linkedin.png" class="contact-icon-img" alt="LinkedIn">
                        <div>
                            <strong>LinkedIn:</strong><br>
                            <a href="${localStorage.getItem('portfolio_linkedin') || 'https://linkedin.com/in/yourprofile'}" target="_blank" class="contact-link">View Profile</a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <img src="icons/github.png" class="contact-icon-img" alt="GitHub">
                        <div>
                            <strong>GitHub:</strong><br>
                            <a href="${localStorage.getItem('portfolio_github') || 'https://github.com/yourprofile'}" target="_blank" class="contact-link">View Profile</a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <img src="icons/instagram.png" class="contact-icon-img" alt="Instagram">
                        <div>
                            <strong>Instagram:</strong><br>
                            <a href="${localStorage.getItem('portfolio_instagram') || 'https://instagram.com/yourprofile'}" target="_blank" class="contact-link">View Profile</a>
                        </div>
                    </div>
                </div>
            `
        },
        experience: {
            icon: '<img src="icons/experience.png" style="width:18px;height:18px;">',
            title: 'Professional Experience',
            html: `
                <div style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100%; overflow-y: auto;">
                    <h1 style="color: white; font-size: 32px; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Professional Experience</h1>
                    
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <!-- Full-Stack Web Developer -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Full-Stack Web Developer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;"><a href="https://allotmealafroc.com" target="_blank" style="color: #667eea; text-decoration: none; cursor: pointer;">AllotMeal Afroc Platform</a></p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">2023 - Present</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Led redesign and deployment of allotmealafroc.com connecting 1000+ hotels, businesses, and stakeholders through listings, networking, and payment services. Built with Next.js, MongoDB, and Netlify, processing thousands of bookings.
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Next.js</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">MongoDB</span>
                                <span style="background: #e6ffff; color: #006666; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Node.js</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">React</span>
                            </div>
                        </div>
                        
                        <!-- KenLive Radio -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Radio Platform Developer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;"><a href="https://radio.kenlive.co.ke" target="_blank" style="color: #667eea; text-decoration: none; cursor: pointer;">KenLive Radio</a></p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">2023 - Present</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Created live streaming radio platform for community news and programs founded by Ken Wakuraya, former Inooro news anchor. Built real-time audio broadcasting system with chat features and analytics dashboard handling thousands of concurrent listeners with zero downtime.
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">PHP</span>
                                <span style="background: #ffe6e6; color: #cc0000; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Laravel</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">JavaScript</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">MySQL</span>
                            </div>
                        </div>
                        
                        <!-- Milestone Radio -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Full-Stack Developer & Mobile App Developer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;"><a href="https://radio.milestoneinstitute.ac.ke" target="_blank" style="color: #667eea; text-decoration: none; cursor: pointer;">Milestone Radio</a></p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">2023 - Present</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Developed both web platform and Android mobile app for Milestone Institute's educational radio system. Web platform features scheduled programming and podcast archives. Mobile app has 10,000+ downloads on Google Play Store with live streaming, offline playback, push notifications, and social sharing capabilities.
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #e6f7ff; color: #0099cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Flutter</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Dart</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Firebase</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">PHP</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">MySQL</span>
                            </div>
                        </div>
                        
                        <!-- SCHACCS -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Mobile App Developer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;"><a href="https://drive.google.com/file/d/1oNvRwnLwDcZJQZFzQKMfCSbODjAQ2hwW/view?usp=drive_link" target="_blank" style="color: #667eea; text-decoration: none; cursor: pointer;">SCHACCS & Educational Institutions</a></p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">2024 - 2025</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Developed parent-student portal with 10,000+ downloads featuring fee overview, academic results, attendance tracking, and event notifications. Built using Flutter, Firebase, and SQLite for cross-platform compatibility.
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #e6f7ff; color: #0099cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Flutter</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Dart</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Firebase</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">SQLite</span>
                            </div>
                        </div>
                        
                        <!-- SMS Rental App -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">SMS-Based Application Developer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;"><a href="https://drive.google.com/file/d/13RMQPaovCbr7BipoDhvtZoT6gTUP8hxk/view?usp=drive_link" target="_blank" style="color: #667eea; text-decoration: none; cursor: pointer;">Rental Management System</a></p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">2024</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Created innovative SMS-based rental application that reads and processes SMS messages instead of traditional API data. Enables property managers to track rent payments, send reminders, and manage tenants through SMS communication, perfect for areas with limited internet connectivity.
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Java</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Android</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">SQLite</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">SMS API</span>
                            </div>
                        </div>
                        
                        <!-- Android/iOS Developer -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Android/iOS Developer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;">Various Clients</p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">2022 - 2025</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Developed cross-platform mobile applications integrating RESTful APIs and optimized UI/UX workflows. Built secure SACCO app processing $2M+ in transactions with zero security incidents using Java (Android) and Swift (iOS).
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Java</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Kotlin</span>
                                <span style="background: #fff0e6; color: #cc6600; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Swift</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">REST API</span>
                            </div>
                        </div>
                        
                        <!-- Freelance Web Developer -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Freelance Web Developer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;">Multiple Organizations</p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">Jan 2023 - Dec 2023</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Built secure, responsive web applications and CRM modules using PHP, Laravel, and MySQL. Collaborated with clients to deliver custom solutions on schedule, improving operational efficiency by 60%.
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">PHP</span>
                                <span style="background: #ffe6e6; color: #cc0000; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Laravel</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">MySQL</span>
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">JavaScript</span>
                            </div>
                        </div>
                        
                        <!-- Newsline Media -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Full-Stack Developer & IT Trainer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;"><a href="https://newslinemedia.co.ke" target="_blank" style="color: #667eea; text-decoration: none; cursor: pointer;">Newsline Media</a></p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">Aug 2024 - Dec 2025</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Developed platform connecting businesses with students seeking attachments and training opportunities across Kenya. Built comprehensive networking system bridging education and industry. Additionally, trained attachés in various IT disciplines including web development, Android app development, AI/ML, cybersecurity, networking, and database management.
                            </p>
                            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px;">
                                <span style="background: #e6f2ff; color: #0066cc; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">React.js</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">Node.js</span>
                                <span style="background: #ffe6f0; color: #cc0066; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">PHP</span>
                                <span style="background: #e6ffe6; color: #009900; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">MySQL</span>
                            </div>
                        </div>
                        
                        <!-- MediaCrest -->
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 12px;">
                                <div>
                                    <h2 style="color: #1a202c; font-size: 22px; margin: 0 0 4px 0;">Cybersecurity Trainer</h2>
                                    <p style="color: #667eea; font-size: 16px; font-style: italic; margin: 0 0 8px 0;">MediaCrest</p>
                                    <p style="color: #718096; font-size: 14px; margin: 0;">2024</p>
                                </div>
                            </div>
                            <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                                Trained professionals in cybersecurity best practices, threat detection, and security protocols. Developed training materials and conducted hands-on workshops on network security and ethical hacking.
                            </p>
                        </div>
                    </div>
                </div>
            `
        },
        spotify: {
            icon: '🎵',
            title: 'Spotify Player',
            html: `
                <div class="spotify-player">
                    <div class="spotify-main-content">
                        <div class="spotify-left-panel">
                            <div class="playlist-section">
                                <div class="playlist-title">
                                    <img src="icons/spotify.png" style="width: 24px; height: 24px;">
                                    <span>My Favorites</span>
                                </div>
                                <div class="song-list" id="song-list">
                                    <div class="song-item" data-src="music/Eminem - Lose Yourself.mp3" data-title="Lose Yourself" data-artist="Eminem" data-cover="icons/eminemloseyourself.jpg">
                                        <img src="icons/eminemloseyourself.jpg" class="song-thumbnail">
                                        <div class="song-info">
                                            <div class="song-title">Lose Yourself</div>
                                            <div class="song-artist">Eminem</div>
                                        </div>
                                        <div class="song-duration">5:26</div>
                                    </div>
                                    <div class="song-item" data-src="music/I Wonder.mp3" data-title="I Wonder" data-artist="Kanye West" data-cover="icons/iwonder.jpg">
                                        <img src="icons/iwonder.jpg" class="song-thumbnail">
                                        <div class="song-info">
                                            <div class="song-title">I Wonder</div>
                                            <div class="song-artist">Kanye West</div>
                                        </div>
                                        <div class="song-duration">4:03</div>
                                    </div>
                                    <div class="song-item" data-src="music/JAY-Z - Empire State Of Mind ft. Alicia Keys.mp3" data-title="Empire State Of Mind" data-artist="JAY-Z ft. Alicia Keys" data-cover="icons/empirestateofminds.jpg">
                                        <img src="icons/empirestateofminds.jpg" class="song-thumbnail">
                                        <div class="song-info">
                                            <div class="song-title">Empire State Of Mind</div>
                                            <div class="song-artist">JAY-Z ft. Alicia Keys</div>
                                        </div>
                                        <div class="song-duration">4:36</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="spotify-right-panel">
                            <div class="now-playing-section">
                                <div class="album-cover" id="album-cover">
                                    <div class="album-placeholder">
                                        <img src="icons/spotify.png" style="width: 80px; height: 80px; opacity: 0.3;">
                                    </div>
                                </div>
                                <div class="track-details">
                                    <h1 id="current-track-title">Select a song</h1>
                                    <p id="current-track-artist">Click any song to start playing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="spotify-player-bar">
                        <div class="player-progress">
                            <span id="current-time">0:00</span>
                            <div class="progress-track">
                                <input type="range" id="progress-bar" min="0" max="100" value="0" class="progress-slider">
                            </div>
                            <span id="duration-time">0:00</span>
                        </div>
                        <div class="player-controls-row">
                            <div class="player-left-info">
                                <div class="mini-cover" id="mini-cover"></div>
                                <div class="mini-track-info">
                                    <div id="mini-track-title">No song playing</div>
                                    <div id="mini-track-artist"></div>
                                </div>
                            </div>
                            <div class="player-controls">
                                <button class="ctrl-btn" id="shuffle-btn" title="Shuffle">🔀</button>
                                <button class="ctrl-btn" id="prev-btn" title="Previous">⏮</button>
                                <button class="ctrl-btn ctrl-play" id="play-btn" title="Play">▶</button>
                                <button class="ctrl-btn" id="next-btn" title="Next">⏭</button>
                                <button class="ctrl-btn" id="repeat-btn" title="Repeat">🔁</button>
                            </div>
                            <div class="player-volume">
                                <button class="ctrl-btn" id="volume-btn" title="Mute">🔊</button>
                                <input type="range" id="volume-slider" min="0" max="100" value="70" class="volume-slider">
                            </div>
                        </div>
                    </div>
                    <audio id="spotify-audio"></audio>
                </div>
            `
        },
        technologies: {
            icon: '<img src="icons/technology.png" style="width:18px;height:18px;">',
            title: 'Technologies & Skills',
            html: `<div style="padding:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);height:100%;overflow-y:auto">
    <div style="padding:40px 40px 30px">
        <h1 style="color:white;font-size:36px;margin:0 0 10px 0;text-shadow:2px 2px 4px rgba(0,0,0,0.3);font-weight:bold">Technologies & Skills</h1>
        <p style="color:rgba(255,255,255,0.95);font-size:16px;margin:0">Tools and technologies I work with</p>
    </div>
    
    <div style="padding:0 40px 40px">
        <!-- Programming Languages -->
        <div style="margin-bottom:40px">
            <h2 style="color:white;font-size:24px;margin:0 0 20px 0;font-weight:600">Programming Languages</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/oracle/F80000" style="width:48px;height:48px;margin-bottom:12px" alt="Java">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Java</h3>
                    <p style="margin:0;font-size:13px;color:#666">Android Development</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/python/3776AB" style="width:48px;height:48px;margin-bottom:12px" alt="Python">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Python</h3>
                    <p style="margin:0;font-size:13px;color:#666">AI/ML & Backend</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/javascript/F7DF1E" style="width:48px;height:48px;margin-bottom:12px;background:#000;padding:4px;border-radius:8px" alt="JavaScript">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">JavaScript</h3>
                    <p style="margin:0;font-size:13px;color:#666">Vanilla JS & ES6+</p>
                </div>
            </div>
        </div>
        
        <!-- Frameworks & Libraries -->
        <div style="margin-bottom:40px">
            <h2 style="color:white;font-size:24px;margin:0 0 20px 0;font-weight:600">Frameworks & Libraries</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/react/61DAFB" style="width:48px;height:48px;margin-bottom:12px" alt="React">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">React.js</h3>
                    <p style="margin:0;font-size:13px;color:#666">Web Applications</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/nextdotjs/000000" style="width:48px;height:48px;margin-bottom:12px" alt="Next.js">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Next.js</h3>
                    <p style="margin:0;font-size:13px;color:#666">Full-Stack React</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/flutter/02569B" style="width:48px;height:48px;margin-bottom:12px" alt="Flutter">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Flutter</h3>
                    <p style="margin:0;font-size:13px;color:#666">Cross-Platform Mobile</p>
                </div>
            </div>
        </div>
        
        <!-- Mobile Development -->
        <div style="margin-bottom:40px">
            <h2 style="color:white;font-size:24px;margin:0 0 20px 0;font-weight:600">Mobile Development</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/android/3DDC84" style="width:48px;height:48px;margin-bottom:12px" alt="Android">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Android</h3>
                    <p style="margin:0;font-size:13px;color:#666">Native Development</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/androidstudio/3DDC84" style="width:48px;height:48px;margin-bottom:12px" alt="Android Studio">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Android Studio</h3>
                    <p style="margin:0;font-size:13px;color:#666">IDE & Tools</p>
                </div>
            </div>
        </div>
        
        <!-- Web Technologies -->
        <div style="margin-bottom:40px">
            <h2 style="color:white;font-size:24px;margin:0 0 20px 0;font-weight:600">Web Technologies</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/html5/E34F26" style="width:48px;height:48px;margin-bottom:12px" alt="HTML5">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Web Development</h3>
                    <p style="margin:0;font-size:13px;color:#666">HTML, CSS, JavaScript</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/firebase/FFCA28" style="width:48px;height:48px;margin-bottom:12px" alt="Firebase">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Firebase</h3>
                    <p style="margin:0;font-size:13px;color:#666">Backend Services</p>
                </div>
            </div>
        </div>
        
        <!-- Design Tools -->
        <div style="margin-bottom:40px">
            <h2 style="color:white;font-size:24px;margin:0 0 20px 0;font-weight:600">Design Tools</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/figma/F24E1E" style="width:48px;height:48px;margin-bottom:12px" alt="Figma">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Figma</h3>
                    <p style="margin:0;font-size:13px;color:#666">UI/UX Design</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/adobephotoshop/31A8FF" style="width:48px;height:48px;margin-bottom:12px" alt="Photoshop">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Adobe Photoshop</h3>
                    <p style="margin:0;font-size:13px;color:#666">Photo Editing</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/canva/00C4CC" style="width:48px;height:48px;margin-bottom:12px" alt="Canva">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Canva</h3>
                    <p style="margin:0;font-size:13px;color:#666">Graphic Design</p>
                </div>
            </div>
        </div>
        
        <!-- AI & Machine Learning -->
        <div style="margin-bottom:40px">
            <h2 style="color:white;font-size:24px;margin:0 0 20px 0;font-weight:600">AI & Machine Learning</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/tensorflow/FF6F00" style="width:48px;height:48px;margin-bottom:12px" alt="TensorFlow">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">TensorFlow</h3>
                    <p style="margin:0;font-size:13px;color:#666">Deep Learning</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/scikitlearn/F7931E" style="width:48px;height:48px;margin-bottom:12px" alt="Scikit-learn">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Scikit-learn</h3>
                    <p style="margin:0;font-size:13px;color:#666">Machine Learning</p>
                </div>
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/pandas/150458" style="width:48px;height:48px;margin-bottom:12px" alt="Pandas">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">Data Science</h3>
                    <p style="margin:0;font-size:13px;color:#666">Analysis & Modeling</p>
                </div>
            </div>
        </div>
        
        <!-- Productivity Tools -->
        <div style="margin-bottom:40px">
            <h2 style="color:white;font-size:24px;margin:0 0 20px 0;font-weight:600">Productivity Tools</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
                <div style="background:white;padding:20px;border-radius:12px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform 0.3s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <img src="https://cdn.simpleicons.org/microsoftoffice/D83B01" style="width:48px;height:48px;margin-bottom:12px" alt="MS Office">
                    <h3 style="margin:0 0 8px 0;color:#1a202c;font-size:18px;font-weight:bold">MS Office</h3>
                    <p style="margin:0;font-size:13px;color:#666">Word, Excel, PowerPoint</p>
                </div>
            </div>
        </div>
    </div>
</div>`
        }
    };
    
    return contents[type] || contents.about;
}

function setupWindowControls(window) {
    const titlebar = window.querySelector('.window-titlebar');
    const minimizeBtn = window.querySelector('.minimize');
    const maximizeBtn = window.querySelector('.maximize');
    const closeBtn = window.querySelector('.close');
    const viewMenu = window.querySelector('#view-menu');
    const helpMenu = window.querySelector('#help-menu');
    const externalBtn = window.querySelector('.external-link-btn');
    
    // Dragging - with touch support
    function startDrag(clientX, clientY, target) {
        // Don't drag if clicking buttons
        if (target.classList.contains('window-control-btn') || target.classList.contains('external-link-btn')) return false;
        
        // If maximized, un-maximize on drag
        if (window.classList.contains('maximized')) {
            window.classList.remove('maximized');
            // Center the window under cursor/touch
            const rect = window.getBoundingClientRect();
            window.style.left = (clientX - rect.width / 2) + 'px';
            window.style.top = '50px';
        }
        
        focusWindow(window);
        
        let shiftX = clientX - window.getBoundingClientRect().left;
        let shiftY = clientY - window.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            window.style.left = pageX - shiftX + 'px';
            window.style.top = pageY - shiftY + 'px';
        }
        
        return { moveAt, shiftX, shiftY };
    }
    
    // Mouse dragging
    titlebar.onmousedown = function(e) {
        const drag = startDrag(e.clientX, e.clientY, e.target);
        if (!drag) return;
        
        e.preventDefault();
        
        function onMouseMove(event) {
            event.preventDefault();
            drag.moveAt(event.clientX, event.clientY);
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    
    // Touch dragging with double-tap to maximize
    let lastTapTime = 0;
    let hasMoved = false;
    
    titlebar.ontouchstart = function(e) {
        const touch = e.touches[0];
        const currentTime = new Date().getTime();
        const tapGap = currentTime - lastTapTime;
        
        // Check for double-tap (within 300ms)
        if (tapGap < 300 && tapGap > 0) {
            // Double-tap detected - toggle maximize
            e.preventDefault();
            window.classList.toggle('maximized');
            lastTapTime = 0; // Reset to prevent triple-tap
            return;
        }
        
        lastTapTime = currentTime;
        hasMoved = false;
        
        const drag = startDrag(touch.clientX, touch.clientY, e.target);
        if (!drag) return;
        
        function onTouchMove(event) {
            hasMoved = true;
            event.preventDefault();
            const touch = event.touches[0];
            drag.moveAt(touch.clientX, touch.clientY);
        }
        
        function onTouchEnd() {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        }
        
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    };
    
    titlebar.ondragstart = function() {
        return false;
    };
    
    // Resizing - improved edge detection
    const resizeHandleSize = 10;
    let isResizing = false;
    let resizeDirection = '';
    
    function getResizeDirection(e, rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const onLeft = x < resizeHandleSize;
        const onRight = x > rect.width - resizeHandleSize;
        const onTop = y < resizeHandleSize;
        const onBottom = y > rect.height - resizeHandleSize;
        
        if (onLeft && onTop) return 'nw';
        if (onRight && onTop) return 'ne';
        if (onLeft && onBottom) return 'sw';
        if (onRight && onBottom) return 'se';
        if (onLeft) return 'w';
        if (onRight) return 'e';
        if (onTop) return 'n';
        if (onBottom) return 's';
        return '';
    }
    
    window.addEventListener('mousemove', (e) => {
        if (isResizing || window.classList.contains('maximized')) return;
        // Don't show resize cursor over content
        if (e.target.closest('.window-content')) {
            window.style.cursor = 'default';
            return;
        }
        
        const rect = window.getBoundingClientRect();
        const direction = getResizeDirection(e, rect);
        
        if (direction) {
            if (direction === 'nw' || direction === 'se') {
                window.style.cursor = 'nwse-resize';
            } else if (direction === 'ne' || direction === 'sw') {
                window.style.cursor = 'nesw-resize';
            } else if (direction === 'w' || direction === 'e') {
                window.style.cursor = 'ew-resize';
            } else if (direction === 'n' || direction === 's') {
                window.style.cursor = 'ns-resize';
            }
        } else {
            window.style.cursor = 'default';
        }
    });
    
    window.addEventListener('mousedown', (e) => {
        if (window.classList.contains('maximized')) return;
        // Don't resize if clicking on content area
        if (e.target.closest('.window-content')) return;
        
        const rect = window.getBoundingClientRect();
        const direction = getResizeDirection(e, rect);
        
        if (direction) {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            resizeDirection = direction;
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = rect.width;
            const startHeight = rect.height;
            const startLeft = rect.left;
            const startTop = rect.top;
            
            function onMouseMove(event) {
                event.preventDefault();
                document.body.style.userSelect = 'none';
                
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;
                
                if (resizeDirection.includes('e')) {
                    window.style.width = Math.max(400, startWidth + deltaX) + 'px';
                }
                if (resizeDirection.includes('s')) {
                    window.style.height = Math.max(300, startHeight + deltaY) + 'px';
                }
                if (resizeDirection.includes('w')) {
                    const newWidth = Math.max(400, startWidth - deltaX);
                    window.style.width = newWidth + 'px';
                    window.style.left = (startLeft + (startWidth - newWidth)) + 'px';
                }
                if (resizeDirection.includes('n')) {
                    const newHeight = Math.max(300, startHeight - deltaY);
                    window.style.height = newHeight + 'px';
                    window.style.top = (startTop + (startHeight - newHeight)) + 'px';
                }
            }
            
            function onMouseUp() {
                isResizing = false;
                resizeDirection = '';
                window.style.cursor = 'default';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    });
    
    // Window controls
    minimizeBtn.addEventListener('click', () => {
        window.classList.add('minimized');
        const taskbarTask = document.querySelector(`.taskbar-task[data-window-id="${window.dataset.type}"]`);
        if (taskbarTask) taskbarTask.classList.remove('active');
    });
    
    maximizeBtn.addEventListener('click', () => {
        window.classList.toggle('maximized');
    });
    
    closeBtn.addEventListener('click', () => {
        window.remove();
        const taskbarTask = document.querySelector(`.taskbar-task[data-window-id="${window.dataset.type}"]`);
        if (taskbarTask) taskbarTask.remove();
    });
    
    // External link button
    if (externalBtn) {
        externalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const url = externalBtn.dataset.url;
            if (url) {
                globalThis.open(url, '_blank');
            }
        });
    }
    
    // View menu - toggle maximize
    if (viewMenu) {
        viewMenu.addEventListener('click', () => {
            window.classList.toggle('maximized');
        });
    }
    
    // Help menu - show contact info
    if (helpMenu) {
        helpMenu.addEventListener('click', () => {
            showContactDialog();
        });
    }
    
    // Focus on click
    window.addEventListener('mousedown', () => {
        focusWindow(window);
    });
    
    // Pinch-to-resize gesture for mobile
    let initialDistance = 0;
    let initialWidth = 0;
    let initialHeight = 0;
    
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Two fingers detected - start pinch gesture
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialWidth = window.offsetWidth;
            initialHeight = window.offsetHeight;
        }
    }, { passive: false });
    
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && !window.classList.contains('maximized')) {
            // Pinch gesture in progress
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const scale = currentDistance / initialDistance;
            const newWidth = Math.max(400, Math.min(window.innerWidth, initialWidth * scale));
            const newHeight = Math.max(300, Math.min(window.innerHeight - 40, initialHeight * scale));
            
            window.style.width = newWidth + 'px';
            window.style.height = newHeight + 'px';
        }
    }, { passive: false });
}

function showContactDialog() {
    const name = localStorage.getItem('portfolio_name') || 'Bramwel Agina';
    const email = localStorage.getItem('portfolio_email') || 'bramwelagina@example.com';
    const phone = localStorage.getItem('portfolio_phone') || '+254 XXX XXX XXX';
    const linkedin = localStorage.getItem('portfolio_linkedin') || '';
    const github = localStorage.getItem('portfolio_github') || '';
    
    const dialog = document.createElement('div');
    dialog.className = 'xp-dialog';
    dialog.innerHTML = `
        <div class="xp-dialog-content">
            <div class="xp-dialog-header">
                <span class="dialog-title">📞 Contact Information</span>
                <button class="dialog-close" onclick="this.closest('.xp-dialog').remove()">×</button>
            </div>
            <div class="xp-dialog-body" style="padding: 20px;">
                <h2 style="margin: 0 0 15px 0; color: #0054e3; text-align: center;">${name}</h2>
                <div style="text-align: left; margin: 15px 0;">
                    <p style="margin: 10px 0;"><strong>📧 Email:</strong><br><a href="mailto:${email}" style="color: #0054e3;">${email}</a></p>
                    <p style="margin: 10px 0;"><strong>📱 Phone:</strong><br>${phone}</p>
                    ${linkedin ? `<p style="margin: 10px 0;"><strong>💼 LinkedIn:</strong><br><a href="${linkedin}" target="_blank" style="color: #0054e3;">View Profile</a></p>` : ''}
                    ${github ? `<p style="margin: 10px 0;"><strong>🐙 GitHub:</strong><br><a href="${github}" target="_blank" style="color: #0054e3;">View Profile</a></p>` : ''}
                </div>
            </div>
            <div class="xp-dialog-footer">
                <button class="xp-button xp-button-primary" onclick="this.closest('.xp-dialog').remove()">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
}

function focusWindow(window) {
    // Remove active class from all windows
    document.querySelectorAll('.window').forEach(w => {
        w.classList.add('inactive');
        w.style.zIndex = parseInt(w.style.zIndex) || 100;
    });
    
    // Add active class to this window
    window.classList.remove('inactive');
    window.style.zIndex = ++windowZIndex;
    
    // Update taskbar
    document.querySelectorAll('.taskbar-task').forEach(t => t.classList.remove('active'));
    const taskbarTask = document.querySelector(`.taskbar-task[data-window-id="${window.dataset.type}"]`);
    if (taskbarTask) taskbarTask.classList.add('active');
    
    activeWindow = window;
}

function addToTaskbar(window, title, icon) {
    const taskbarTasks = document.getElementById('taskbar-tasks');
    const task = document.createElement('div');
    task.className = 'taskbar-task active';
    task.dataset.windowId = window.dataset.type;
    task.innerHTML = `<span>${icon}</span><span>${title}</span>`;
    
    task.addEventListener('click', () => {
        if (window.classList.contains('minimized')) {
            window.classList.remove('minimized');
            focusWindow(window);
        } else if (activeWindow === window) {
            window.classList.add('minimized');
            task.classList.remove('active');
        } else {
            focusWindow(window);
        }
    });
    
    // Right-click to close
    task.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'taskbar-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            bottom: 40px;
            background: #ece9d8;
            border: 2px outset #fff;
            padding: 2px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 120px;
        `;
        
        menu.innerHTML = `
            <div class="context-menu-item" style="padding: 5px 10px; cursor: pointer; font-family: Tahoma; font-size: 11px;">
                ❌ Close
            </div>
        `;
        
        const closeItem = menu.querySelector('.context-menu-item');
        closeItem.addEventListener('mouseover', () => {
            closeItem.style.background = '#316ac5';
            closeItem.style.color = '#fff';
        });
        closeItem.addEventListener('mouseout', () => {
            closeItem.style.background = '';
            closeItem.style.color = '';
        });
        closeItem.addEventListener('click', () => {
            window.remove();
            task.remove();
            menu.remove();
        });
        
        document.body.appendChild(menu);
        
        // Close menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 10);
    });
    
    taskbarTasks.appendChild(task);
}


// Spotify Player Initialization
function initSpotifyPlayer() {
    const audio = document.getElementById('spotify-audio');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeBtn = document.getElementById('volume-btn');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const songItems = document.querySelectorAll('.song-item');
    const albumCover = document.getElementById('album-cover');
    const miniCover = document.getElementById('mini-cover');
    
    let currentSongIndex = -1;
    const songs = Array.from(songItems);
    
    // Set initial volume
    audio.volume = 0.7;
    
    // Song selection
    songItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            playSong(index);
        });
    });
    
    function playSong(index) {
        if (index < 0 || index >= songs.length) return;
        
        currentSongIndex = index;
        const song = songs[index];
        const src = song.dataset.src;
        const title = song.dataset.title;
        const artist = song.dataset.artist;
        const cover = song.dataset.cover;
        
        audio.src = src;
        audio.play();
        
        // Update UI
        document.getElementById('current-track-title').textContent = title;
        document.getElementById('current-track-artist').textContent = artist;
        document.getElementById('mini-track-title').textContent = title;
        document.getElementById('mini-track-artist').textContent = artist;
        playBtn.textContent = '⏸';
        
        // Update cover images
        if (cover) {
            albumCover.style.backgroundImage = `url(${cover})`;
            albumCover.style.backgroundSize = 'cover';
            albumCover.style.backgroundPosition = 'center';
            albumCover.innerHTML = '';
            
            miniCover.style.backgroundImage = `url(${cover})`;
            miniCover.style.backgroundSize = 'cover';
            miniCover.style.backgroundPosition = 'center';
        }
        
        // Highlight current song
        songs.forEach(s => s.classList.remove('active'));
        song.classList.add('active');
    }
    
    // Play/Pause
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            if (currentSongIndex === -1) {
                playSong(0);
            } else {
                audio.play();
                playBtn.textContent = '⏸';
            }
        } else {
            audio.pause();
            playBtn.textContent = '▶️';
        }
    });
    
    // Previous
    prevBtn.addEventListener('click', () => {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        } else {
            playSong(songs.length - 1);
        }
    });
    
    // Next
    nextBtn.addEventListener('click', () => {
        if (currentSongIndex < songs.length - 1) {
            playSong(currentSongIndex + 1);
        } else {
            playSong(0);
        }
    });
    
    // Auto-play next song
    audio.addEventListener('ended', () => {
        if (currentSongIndex < songs.length - 1) {
            playSong(currentSongIndex + 1);
        } else {
            playSong(0);
        }
    });
    
    // Progress bar - optimized to only update when visible
    let lastProgressUpdate = 0;
    audio.addEventListener('timeupdate', () => {
        // Skip updates if tab is hidden or update too frequent
        if (document.hidden) return;
        
        const now = Date.now();
        if (now - lastProgressUpdate < 100) return; // Throttle to 10fps max
        lastProgressUpdate = now;
        
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationTimeEl.textContent = formatTime(audio.duration);
        }
    });
    
    progressBar.addEventListener('input', () => {
        const time = (progressBar.value / 100) * audio.duration;
        audio.currentTime = time;
    });
    
    // Volume
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
        updateVolumeIcon();
    });
    
    volumeBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeSlider.value = 0;
        } else {
            audio.volume = 0.7;
            volumeSlider.value = 70;
        }
        updateVolumeIcon();
    });
    
    function updateVolumeIcon() {
        if (audio.volume === 0) {
            volumeBtn.textContent = '🔇';
        } else if (audio.volume < 0.5) {
            volumeBtn.textContent = '🔉';
        } else {
            volumeBtn.textContent = '🔊';
        }
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}


// Performance optimization - Tab visibility tracking (no blocking)
let isTabVisible = !document.hidden;


// Performance: Use passive event listeners for scroll events
document.addEventListener('DOMContentLoaded', function() {
    // Add passive listeners to improve scroll performance
    const scrollElements = document.querySelectorAll('.song-list, .credits-container');
    scrollElements.forEach(el => {
        if (el) {
            el.addEventListener('scroll', function() {}, { passive: true });
        }
    });
});

// Performance: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle resize after user stops resizing
        checkMobileOrientation();
    }, 250);
}, { passive: true });

// Hire Me Notification
let notificationInterval = null;

function showHireMeNotification() {
    const userName = localStorage.getItem('portfolio_name') || 'Bramwel Agina';
    const userEmail = localStorage.getItem('portfolio_email') || 'bramwelagina@example.com';
    const userPhone = localStorage.getItem('portfolio_phone') || '+254 XXX XXX XXX';
    
    // Don't show if one already exists
    if (document.querySelector('.xp-notification')) {
        return;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'xp-notification';
    notification.innerHTML = `
        <div class="xp-notification-header">
            <div class="xp-notification-title">
                <span>💼</span>
                <span>Available for Hire!</span>
            </div>
            <button class="xp-notification-close" onclick="closeHireMeNotification()">×</button>
        </div>
        <div class="xp-notification-body">
            <div class="xp-notification-message">
                <strong>${userName}</strong> is available for freelance projects and full-time opportunities!
            </div>
            <button class="xp-notification-button" onclick="showContactFromNotification()">
                📧 Get in Touch
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger slide-in animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeHireMeNotification();
    }, 5000);
}

function startNotificationLoop() {
    // Show first notification after 15 seconds
    setTimeout(() => {
        showHireMeNotification();
        
        // Then repeat every 50 seconds
        notificationInterval = setInterval(() => {
            showHireMeNotification();
        }, 50000);
    }, 15000);
}

function closeHireMeNotification() {
    const notification = document.querySelector('.xp-notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }
}

function showContactFromNotification() {
    closeHireMeNotification();
    createWindow('contact');
}
