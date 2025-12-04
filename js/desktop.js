// Desktop.js - Main desktop functionality

// Check for mobile and orientation
function checkMobileOrientation() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isPortrait = window.innerHeight > window.innerWidth;
    const mobilePrompt = document.getElementById('mobile-prompt');
    
    if (isMobile && isPortrait) {
        mobilePrompt.classList.remove('hidden');
        document.getElementById('boot-screen').style.display = 'none';
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('desktop').style.display = 'none';
    } else {
        mobilePrompt.classList.add('hidden');
        // Show the appropriate screen
        if (!document.getElementById('boot-screen').classList.contains('hidden')) {
            document.getElementById('boot-screen').style.display = 'flex';
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

function initializePortfolio() {
    // Load saved settings
    loadSettings();
    
    // Start boot sequence
    setTimeout(() => {
        document.getElementById('boot-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
    }, 3000);
    
    // Login screen click - go to welcome screen
    document.getElementById('user-login').addEventListener('click', () => {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('welcome-screen').classList.remove('hidden');
        
        // Play startup sound
        const startupSound = document.getElementById('startup-sound');
        if (startupSound) {
            startupSound.play().catch(err => console.log('Audio play failed:', err));
        }
        
        // After 3 seconds, go to desktop
        setTimeout(() => {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('desktop').classList.remove('hidden');
            updateClock();
            // Use more efficient clock update
            let lastClockUpdate = Date.now();
            function clockLoop() {
                const now = Date.now();
                if (now - lastClockUpdate >= 1000) {
                    updateClock();
                    lastClockUpdate = now;
                }
                requestAnimationFrame(clockLoop);
            }
            clockLoop();
        }, 3000);
    });
    
    // Desktop initialization
    initializeDesktop();
}

function initializeDesktop() {
    // Desktop icons
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
        // Load saved position
        const savedPos = localStorage.getItem(`icon_pos_${icon.dataset.window}`);
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            icon.style.position = 'absolute';
            icon.style.left = pos.x + 'px';
            icon.style.top = pos.y + 'px';
        } else {
            // Set initial position from grid
            const rect = icon.getBoundingClientRect();
            icon.dataset.initialX = rect.left;
            icon.dataset.initialY = rect.top;
        }
        
        // Make draggable with single click to open
        let isDragging = false;
        let dragStarted = false;
        let startX, startY, iconX, iconY;
        
        icon.onmousedown = function(e) {
            startX = e.clientX;
            startY = e.clientY;
            const rect = icon.getBoundingClientRect();
            iconX = rect.left;
            iconY = rect.top;
            dragStarted = false;
            
            if (!icon.style.position || icon.style.position === 'static') {
                icon.style.position = 'absolute';
                icon.style.left = iconX + 'px';
                icon.style.top = iconY + 'px';
            }
            
            function onMouseMove(event) {
                const deltaX = event.clientX - startX;
                const deltaY = event.clientY - startY;
                
                // Only start dragging if moved more than 5px
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    isDragging = true;
                    dragStarted = true;
                }
                
                if (isDragging) {
                    const newX = iconX + deltaX;
                    const newY = iconY + deltaY;
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
        return;
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
                <h1>Live Projects</h1>
                <p style="margin-bottom: 20px;">Click any project to open it in a new window</p>
                <div class="project-grid">
                    <div class="project-card" onclick="createWindow('kenlive')">
                        <h3>📻 KenLive Radio</h3>
                        <p>Live streaming radio platform with real-time broadcasting and analytics.</p>
                        <span class="project-link">Open App →</span>
                    </div>
                    <div class="project-card" onclick="createWindow('milestone')">
                        <h3>📻 Milestone Radio</h3>
                        <p>Educational institution radio system with scheduled programming.</p>
                        <span class="project-link">Open App →</span>
                    </div>
                    <div class="project-card" onclick="createWindow('newsline')">
                        <h3>📻 Newsline Radio</h3>
                        <p>Professional news broadcasting platform with live updates.</p>
                        <span class="project-link">Open App →</span>
                    </div>
                    <div class="project-card" onclick="createWindow('allotmeal')">
                        <h3>🌐 AllotMeal</h3>
                        <p>Full-stack web application with modern features and responsive design.</p>
                        <span class="project-link">Open App →</span>
                    </div>
                    <div class="project-card" onclick="window.open('https://play.google.com/store/apps/details?id=com.milestoneinstitute.radio', '_blank')">
                        <h3>📱 Milestone Radio App</h3>
                        <p>Android app on Google Play Store with 10,000+ downloads.</p>
                        <span class="project-link">Open in Play Store →</span>
                    </div>
                </div>
            `
        },
        kenlive: {
            icon: '📻',
            title: 'KenLive Radio Project',
            externalUrl: 'https://radio.kenlive.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-kenlive">Loading...</div>
                    <iframe src="https://radio.kenlive.co.ke" style="flex: 1; width: 100%; border: none;" title="KenLive Radio" onload="setTimeout(() => { const loader = document.getElementById('loader-kenlive'); if(loader) loader.remove(); }, 100)"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-kenlive'); if(loader) loader.remove(); }, 5000);</script>
            `
        },
        milestone: {
            icon: '📻',
            title: 'Milestone Radio Project',
            externalUrl: 'https://radio.milestoneinstitute.ac.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-milestone">Loading...</div>
                    <iframe src="https://radio.milestoneinstitute.ac.ke" style="flex: 1; width: 100%; border: none;" title="Milestone Radio" onload="setTimeout(() => { const loader = document.getElementById('loader-milestone'); if(loader) loader.remove(); }, 100)"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-milestone'); if(loader) loader.remove(); }, 5000);</script>
            `
        },
        newsline: {
            icon: '📻',
            title: 'Newsline Radio Project',
            externalUrl: 'https://radio.newsline.co.ke',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-newsline">Loading...</div>
                    <iframe src="https://radio.newsline.co.ke" style="flex: 1; width: 100%; border: none;" title="Newsline Radio" onload="setTimeout(() => { const loader = document.getElementById('loader-newsline'); if(loader) loader.remove(); }, 100)"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-newsline'); if(loader) loader.remove(); }, 5000);</script>
            `
        },
        allotmeal: {
            icon: '🌐',
            title: 'AllotMeal Project',
            externalUrl: 'https://allotmealafroc.com',
            html: `
                <div style="height: 100%; display: flex; flex-direction: column; position: relative;">
                    <div class="iframe-loader" id="loader-allotmeal">Loading...</div>
                    <iframe src="https://allotmealafroc.com" style="flex: 1; width: 100%; border: none;" title="AllotMeal" onload="setTimeout(() => { const loader = document.getElementById('loader-allotmeal'); if(loader) loader.remove(); }, 100)"></iframe>
                </div>
                <script>setTimeout(() => { const loader = document.getElementById('loader-allotmeal'); if(loader) loader.remove(); }, 5000);</script>
            `
        },

        resume: {
            icon: '📄',
            title: 'Resume',
            html: `
                <div class="resume-viewer" style="height: 100%; display: flex; flex-direction: column;">
                    <iframe src="resume.pdf#zoom=100" style="flex: 1; width: 100%; border: none; background: #525252;" title="Resume PDF Viewer"></iframe>
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
    
    // Dragging - fixed to stop properly
    titlebar.onmousedown = function(e) {
        // Don't drag if clicking buttons
        if (e.target.classList.contains('window-control-btn')) return;
        
        // If maximized, un-maximize on drag
        if (window.classList.contains('maximized')) {
            window.classList.remove('maximized');
            // Center the window under cursor
            const rect = window.getBoundingClientRect();
            window.style.left = (e.clientX - rect.width / 2) + 'px';
            window.style.top = '50px';
        }
        
        focusWindow(window);
        e.preventDefault();
        
        let shiftX = e.clientX - window.getBoundingClientRect().left;
        let shiftY = e.clientY - window.getBoundingClientRect().top;
        
        function moveAt(pageX, pageY) {
            window.style.left = pageX - shiftX + 'px';
            window.style.top = pageY - shiftY + 'px';
        }
        
        function onMouseMove(event) {
            event.preventDefault();
            moveAt(event.clientX, event.clientY);
        }
        
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
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


// Handle tab visibility to prevent freezing when switching tabs
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Tab is hidden - pause animations
        document.body.classList.add('tab-hidden');
        
        // Pause audio if playing
        const spotifyAudio = document.getElementById('spotify-audio');
        if (spotifyAudio && !spotifyAudio.paused) {
            spotifyAudio.dataset.wasPlaying = 'true';
        }
    } else {
        // Tab is visible again - resume smoothly
        document.body.classList.remove('tab-hidden');
        
        const spotifyAudio = document.getElementById('spotify-audio');
        if (spotifyAudio && spotifyAudio.dataset.wasPlaying === 'true') {
            delete spotifyAudio.dataset.wasPlaying;
        }
        
        // Update clock immediately
        if (typeof updateClock === 'function') {
            updateClock();
        }
    }
});

// Prevent animations from accumulating when tab is hidden
let animationFrameId;
function smoothUpdate() {
    if (!document.hidden) {
        // Update clock and other time-based elements
        updateClock();
    }
    animationFrameId = requestAnimationFrame(smoothUpdate);
}

// Start smooth updates
if (typeof updateClock === 'function') {
    smoothUpdate();
}

// Handle page freeze on focus
window.addEventListener('focus', function() {
    // Small delay to let browser catch up
    setTimeout(() => {
        // Refresh any time-dependent elements
        if (typeof updateClock === 'function') {
            updateClock();
        }
    }, 100);
});

// Optimize performance by reducing unnecessary repaints
window.addEventListener('blur', function() {
    // Cancel any pending animation frames when tab loses focus
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});


// Performance optimization - Handle tab visibility
let isTabVisible = !document.hidden;
let progressUpdateInterval = null;

document.addEventListener('visibilitychange', function() {
    const audio = document.getElementById('spotify-audio');
    isTabVisible = !document.hidden;
    
    if (document.hidden) {
        // Tab is hidden - pause heavy operations
        if (audio && !audio.paused) {
            audio.dataset.wasPlaying = 'true';
        }
        // Stop progress bar updates
        if (progressUpdateInterval) {
            clearInterval(progressUpdateInterval);
            progressUpdateInterval = null;
        }
    } else {
        // Tab is visible again - resume immediately
        if (audio && audio.dataset.wasPlaying === 'true') {
            delete audio.dataset.wasPlaying;
        }
        // Use requestAnimationFrame for immediate response
        requestAnimationFrame(() => {
            document.body.style.display = 'block';
        });
    }
});

// Optimize animations when tab is not visible
let animationsPaused = false;
let pauseStyleElement = null;

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        animationsPaused = true;
        document.body.classList.add('tab-hidden');
        // Pause all CSS animations
        if (!pauseStyleElement) {
            pauseStyleElement = document.createElement('style');
            pauseStyleElement.id = 'pause-animations';
            pauseStyleElement.textContent = '* { animation-play-state: paused !important; transition: none !important; }';
            document.head.appendChild(pauseStyleElement);
        }
    } else {
        animationsPaused = false;
        document.body.classList.remove('tab-hidden');
        // Resume all CSS animations immediately
        if (pauseStyleElement) {
            pauseStyleElement.remove();
            pauseStyleElement = null;
        }
        // Use RAF for instant smooth resume
        requestAnimationFrame(() => {
            document.body.style.willChange = 'auto';
        });
    }
});


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
