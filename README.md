# 🪟 Windows XP Portfolio

A nostalgic Windows XP-themed portfolio website with authentic boot screen, login, and desktop interface.

## ✨ Features

- **Boot Screen** - Classic Windows XP startup with animated loading bar
- **Login Screen** - Password-protected login with user avatar
- **Desktop Interface** - Draggable icons, resizable windows, and taskbar
- **Start Menu** - Two-column layout with social media links and fullscreen toggle
- **System Tray Icons** - Info icon (creator contact) and theme toggle (eye comfort mode)
- **Recycle Bin** - Fun customizable items showing your personality
- **Mobile Support** - Rotation prompt for landscape viewing
- **100% Customizable** - All settings in one JSON file

---

## 🚀 Quick Start

### 1. Download/Clone the Project
```bash
git clone <your-repo-url>
cd windows-xp-portfolio
```

### 2. Customize Your Portfolio
Edit `portfolio-config.json` with your information (see Configuration section below)

### 3. Add Your Profile Picture
- Replace one of the GIF files (`giphy.gif`, `giphy-1.gif`, etc.) with your own image
- Or add a new image file and reference it in `portfolio-config.json`

### 4. Add Your Resume (Optional)
- Add a file named `resume.pdf` to the root folder
- The Resume window will automatically link to it
- Or change the filename in `portfolio-config.json` under `resumeFile`

### 5. Deploy
Upload all files to your hosting service:
- **Netlify**: Drag & drop the folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Push to `gh-pages` branch
- **Any static host**: Upload via FTP/SFTP

---

## 🎮 Using the Portfolio

### System Tray Icons (Bottom Right)
- **ℹ️ Info Icon** - Click to see creator contact information
- **🌙 Theme Icon** - Click to toggle Eye Comfort Mode (orange theme for reduced eye strain)

### Start Menu Features
- **Full Screen** - Toggle fullscreen mode for immersive experience
- **All Programs** - Submenu with all available windows
- **Social Links** - Quick access to LinkedIn, GitHub, Instagram

### Clock
- Hover over the clock to see the full date

---

## ⚙️ Configuration

All customization is done in **`portfolio-config.json`**. No code editing required!

### Personal Information
```json
{
  "bootName": "Your Name",              // Appears on boot screen
  "bootSubtitle": "Your Title",         // Your tagline/role
  "name": "Your Full Name",             // Used throughout the site
  "email": "your@email.com",
  "phone": "+1 234 567 8900",
  "bio": "Your bio text here..."
}
```

### Social Media Links
```json
{
  "linkedin": "https://linkedin.com/in/yourprofile",
  "github": "https://github.com/yourusername",
  "instagram": "https://instagram.com/yourusername"
}
```

### Profile Picture
```json
{
  "profilePic": "giphy.gif"  // Options: giphy.gif, giphy-1.gif, giphy-2.gif, giphy-3.gif
}
```

Or use your own image:
1. Add your image file to the root folder (e.g., `my-photo.jpg`)
2. Update config: `"profilePic": "my-photo.jpg"`

### Login Password
```json
{
  "password": "yourpassword"  // Password for the login screen
}
```

### Recycle Bin Items
Add fun items that show your personality:
```json
{
  "recycleItems": [
    {
      "icon": "😴",
      "name": "Procrastination.exe",
      "desc": "Deleted for good productivity"
    },
    {
      "icon": "🐛",
      "name": "Bugs_I_Created.zip",
      "desc": "Fixed and removed"
    }
  ]
}
```

**Tips for Recycle Bin:**
- Use emojis for icons (😴 🐛 ☕ 💤 🎮 📱 🍕 etc.)
- Make file names funny (.exe, .zip, .java, .txt, etc.)
- Keep descriptions short and witty

---

## 📁 Project Structure

```
windows-xp-portfolio/
├── index.html                 # Main HTML file
├── portfolio-config.json      # ⭐ YOUR SETTINGS FILE
├── config.js                  # Loads the JSON config
├── css/
│   ├── xp-theme.css          # Windows XP styling
│   └── windows.css           # Window components
├── js/
│   ├── desktop.js            # Main desktop logic
│   └── windows.js            # Window management
├── icons/                     # Desktop icons
├── giphy.gif                  # Profile picture options
├── giphy-1.gif
├── giphy-2.gif
├── giphy-3.gif
├── background.jpg             # Desktop wallpaper
└── logo.png                   # Boot screen logo
```

---

## 🎨 Customization Guide

### Change Desktop Wallpaper
Replace `background.jpg` with your own image (recommended: 1920x1080px)

### Change Boot Logo
Replace `logo.png` with your own logo (recommended: 200x200px, transparent PNG)

### Add More Desktop Icons
Edit `index.html` and add icons in the desktop section:
```html
<div class="desktop-icon" data-window="your-window">
    <img src="icons/your-icon.png" alt="Icon">
    <span>Your Label</span>
</div>
```

### Add New Windows
Edit `js/desktop.js` in the `getWindowContent()` function:
```javascript
yourwindow: {
    icon: '📄',
    title: 'Your Window',
    html: `<div>Your content here</div>`
}
```

---

## 🌐 Deployment

### Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your project folder
3. Done! Your site is live

### Vercel
1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Deploy

### GitHub Pages
```bash
git checkout -b gh-pages
git push origin gh-pages
```
Enable GitHub Pages in repo settings

### Traditional Hosting
Upload all files via FTP to your web host's public folder

---

## 🛠️ Troubleshooting

### Config Not Loading?
- Make sure `portfolio-config.json` is in the root folder
- Check for JSON syntax errors (use [jsonlint.com](https://jsonlint.com))
- Clear browser cache and refresh

### Profile Picture Not Showing?
- Verify the file name matches exactly in `portfolio-config.json`
- Check file is in the root folder
- Supported formats: .jpg, .png, .gif

### Password Not Working?
- Check `password` field in `portfolio-config.json`
- Password is case-sensitive
- Default password is `bram`

### Mobile Issues?
- The site prompts users to rotate to landscape
- Best viewed on tablets and desktops
- Minimum width: 768px

---

## 💡 Tips for Selling This Portfolio

### For Buyers:
1. Edit `portfolio-config.json` with your info
2. Replace profile pictures with your own
3. Upload to Netlify (free hosting)
4. Share your link!

### What Buyers Can Customize:
- ✅ All personal information
- ✅ Social media links
- ✅ Profile pictures
- ✅ Login password
- ✅ Recycle Bin items
- ✅ Desktop wallpaper
- ✅ Boot screen logo

### What Requires Code Knowledge:
- Adding new windows/pages
- Changing colors/fonts
- Adding new desktop icons
- Modifying animations

### Reset Icon Positions:
If desktop icons overlap after dragging, open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

---

## 📝 License

This project is available for personal and commercial use.

---

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify your `portfolio-config.json` syntax
3. Clear browser cache and try again

---

## 🎯 Credits

- Windows XP design © Microsoft
- Built with vanilla JavaScript
- No frameworks or dependencies

---

**Enjoy your nostalgic portfolio! 🪟✨**
