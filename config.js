// Load configuration from JSON file
let portfolioConfig = {};

// Fetch config from JSON file
fetch('portfolio-config.json')
    .then(response => response.json())
    .then(config => {
        portfolioConfig = config;
        initializeDefaults();
    })
    .catch(error => {
        console.error('Error loading config:', error);
        // Use fallback defaults
        portfolioConfig = {
            bootName: 'Bramwel Agina',
            bootSubtitle: 'Visual Designer',
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
    // Always overwrite localStorage with JSON values
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
}

