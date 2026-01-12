# 🚀 Quick Start Guide

Get started with Prompt Library in 3 minutes!

## Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

That's it! 🎉

## Common Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check code with ESLint
npm run format       # Format code with Prettier
```

## Quick Deploy to GitHub Pages

```bash
# 1. Build the project
npm run build

# 2. Install gh-pages
npm install -D gh-pages

# 3. Add deploy script to package.json
# "deploy": "npm run build && gh-pages -d dist"

# 4. Deploy
npm run deploy
```

Your app will be live at: `https://yourusername.github.io/prompt-library`

## File Structure

```
📦 prompt-library
├── 📁 js/                  # JavaScript modules
│   ├── constants.js        # App constants
│   ├── translations.js     # i18n translations
│   ├── PromptLibrary.js    # Main class
│   └── main.js            # Entry point
├── 📄 index.html          # HTML template
├── 🎨 styles.css          # Global styles
├── 🎯 favicon.svg         # App icon
├── ⚙️ vite.config.js      # Build config
└── 📦 package.json        # Dependencies
```

## First Steps

1. **Add a prompt** - Enter title and content, click "Save Prompt"
2. **Search prompts** - Use the search bar to filter by keywords
3. **Export data** - Click "Export" to download as JSON
4. **Switch theme** - Toggle between light/dark mode
5. **Change language** - Select English, Georgian, or Russian

## Customization

### Change Colors

Edit `styles.css`:

```css
:root {
  --primary-color: #6366f1; /* Main theme color */
  --danger-color: #fb7185; /* Delete button color */
}
```

### Add a Language

Edit `js/translations.js`:

```javascript
export const translations = {
  en: {
    /* English */
  },
  ka: {
    /* Georgian */
  },
  ru: {
    /* Russian */
  },
  es: {
    /* Add Spanish */
  },
};
```

## Troubleshooting

**Blank page?**

- Check browser console for errors
- Try `npm install` again
- Clear browser cache

**Build errors?**

- Node version 18+ required
- Delete `node_modules` and reinstall
- Check `vite.config.js` syntax

**Can't see changes?**

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check if dev server is running
- Clear browser cache

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) for development guide
- 💬 Open an issue on GitHub

---

Happy prompting! 🎯
