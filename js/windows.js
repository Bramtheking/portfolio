// Windows.js - Additional window functionality

// Initialize window-specific features after window is created
function initializeWindowFeatures(windowElement, type) {
    switch (type) {
        case 'resume':
            initializeResume();
            break;
        case 'settings':
            initializeSettings();
            break;
        case 'projects':
            initializeProjects();
            break;
    }
}

function initializeProjects() {
    // Add click handlers for project links
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Project link clicked! In the settings, you can customize these project links.');
        });
    });
}

function initializeResume() {
    // Check if resume is stored
    const resumeData = localStorage.getItem('portfolio_resume');
    const resumeContainer = document.getElementById('resume-container');

    if (resumeData) {
        resumeContainer.innerHTML = `
            <iframe src="${resumeData}" class="resume-embed" frameborder="0" style="zoom: 1; transform: scale(1);"></iframe>
        `;
    }

    // Download button
    const downloadBtn = document.getElementById('download-resume');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (resumeData) {
                const link = document.createElement('a');
                link.href = resumeData;
                link.download = 'resume.pdf';
                link.click();
            } else {
                alert('No resume uploaded yet. Please upload a resume in Settings.');
            }
        });
    }

    // View button - maximize the window
    const viewBtn = document.getElementById('view-resume');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            const resumeWindow = document.querySelector('.window[data-type="resume"]');
            if (resumeWindow) {
                if (resumeWindow.classList.contains('maximized')) {
                    resumeWindow.classList.remove('maximized');
                    viewBtn.textContent = '👁️ View Full Screen';
                } else {
                    resumeWindow.classList.add('maximized');
                    viewBtn.textContent = '👁️ Exit Full Screen';
                }
            }
        });
    }
}

// Window resize functionality
function makeWindowResizable(windowElement) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'window-resize-handle';
    resizeHandle.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
        z-index: 10;
    `;

    windowElement.appendChild(resizeHandle);

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowElement.offsetWidth;
        startHeight = windowElement.offsetHeight;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const width = startWidth + (e.clientX - startX);
        const height = startHeight + (e.clientY - startY);

        if (width > 400) windowElement.style.width = width + 'px';
        if (height > 300) windowElement.style.height = height + 'px';
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

// Window animations
function animateWindowOpen(windowElement) {
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'scale(0.8)';

    setTimeout(() => {
        windowElement.style.transition = 'opacity 0.2s, transform 0.2s';
        windowElement.style.opacity = '1';
        windowElement.style.transform = 'scale(1)';
    }, 10);
}

function animateWindowClose(windowElement, callback) {
    windowElement.style.transition = 'opacity 0.2s, transform 0.2s';
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'scale(0.8)';

    setTimeout(() => {
        if (callback) callback();
    }, 200);
}

// Context menu for windows (right-click)
function addWindowContextMenu(windowElement) {
    windowElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        // Remove existing context menus
        document.querySelectorAll('.context-menu').forEach(menu => menu.remove());

        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: #f0f0f0;
            border: 2px outset #fff;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 150px;
        `;

        const menuItems = [
            { label: 'Restore', action: () => windowElement.classList.remove('maximized') },
            { label: 'Minimize', action: () => windowElement.classList.add('minimized') },
            { label: 'Maximize', action: () => windowElement.classList.add('maximized') },
            { separator: true },
            { label: 'Close', action: () => windowElement.querySelector('.close').click() }
        ];

        menuItems.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.style.cssText = 'height: 1px; background: #ccc; margin: 2px 0;';
                contextMenu.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.textContent = item.label;
                menuItem.style.cssText = `
                    padding: 5px 15px;
                    cursor: pointer;
                    font-size: 11px;
                `;
                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.background = '#3c7dd7';
                    menuItem.style.color = '#fff';
                });
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.background = '';
                    menuItem.style.color = '';
                });
                menuItem.addEventListener('click', () => {
                    item.action();
                    contextMenu.remove();
                });
                contextMenu.appendChild(menuItem);
            }
        });

        document.body.appendChild(contextMenu);

        // Close context menu on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeContextMenu() {
                contextMenu.remove();
                document.removeEventListener('click', closeContextMenu);
            });
        }, 10);
    });
}
