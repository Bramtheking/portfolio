// Load configuration from JSON file
let portfolioConfig = {};

// Fetch config from JSON file with cache busting
fetch('portfolio-config.json?v=' + Date.now())
    .then(response => response.json())
    .then(config => {
        portfolioConfig = config;
        initializeDefaults();
        console.log('Portfolio config loaded:', portfolioConfig);
    })
    .catch(error => {
        console.error('Error loading config:', error);
        // Use fallback defaults
        portfolioConfig = {
            bootName: 'Bramwel Agina',
            bootSubtitle: 'Software Developer',
            name: 'Bramwel Agina',
            email: 'bramwela8@gmail.com',
            phone: '+254741797609',
            bio: 'Software Developer passionate about creating innovative solutions.',
            linkedin: 'https://www.linkedin.com/in/bramwel-agina-a88678266/',
            github: 'https://github.com/Bramtheking',
            instagram: 'https://www.instagram.com/bramwelagina/',
            profilePic: 'giphy.gif',
            password: 'bram',
            recycleItems: []
        };
        initializeDefaults();
    });

// Initialize defaults from config - ALWAYS use JSON as source of truth
function initializeDefaults() {
    // Always overwrite localStorage with JSON values to ensure consistency
    localStorage.setItem('portfolio_boot_name', portfolioConfig.bootName);
    localStorage.setItem('portfolio_boot_subtitle', portfolioConfig.bootSubtitle);
    localStorage.setItem('portfolio_name', portfolioConfig.name);
    localStorage.setItem('portfolio_email', portfolioConfig.email);
    localStorage.setItem('portfolio_phone', portfolioConfig.phone);
    localStorage.setItem('portfolio_bio', portfolioConfig.bio);
    localStorage.setItem('portfolio_linkedin', portfolioConfig.linkedin);
    localStorage.setItem('portfolio_github', portfolioConfig.github);
    localStorage.setItem('portfolio_instagram', portfolioConfig.instagram);
    localStorage.setItem('portfolio_profile_pic', portfolioConfig.profilePic);
    localStorage.setItem('portfolio_password', portfolioConfig.password);
    localStorage.setItem('recycle_items', JSON.stringify(portfolioConfig.recycleItems));
    
    // Update the boot screen immediately if it's visible
    updateBootScreenFromConfig();
}

// Update boot screen with config values immediately
function updateBootScreenFromConfig() {
    const bootName = document.querySelector('.boot-name');
    const bootSubtitle = document.querySelector('.boot-subtitle');
    
    if (bootName) bootName.textContent = portfolioConfig.bootName;
    if (bootSubtitle) bootSubtitle.textContent = portfolioConfig.bootSubtitle;
}

