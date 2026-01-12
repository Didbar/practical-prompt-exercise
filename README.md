# 📝 Prompt Library

A modern, accessible web application for managing and organizing AI prompts with multi-language support.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 📝 **Create & Manage Prompts** - Add, edit, and delete prompts with ease
- 🔍 **Real-time Search** - Filter prompts by title or content instantly
- 📥 **Export to JSON** - Download all your prompts for backup or sharing
- 🌍 **Multi-language Support** - English, Georgian (ქართული), and Russian (Русский)
- 🌓 **Dark/Light Theme** - Comfortable viewing in any environment
- ♿ **Fully Accessible** - WCAG compliant with ARIA labels and semantic HTML
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 💾 **Local Storage** - All data saved locally in your browser
- ⚡ **Fast & Lightweight** - Built with vanilla JavaScript, no heavy frameworks

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/prompt-library.git
cd prompt-library
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## 📦 Building for Production

Build optimized production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

The optimized files will be in the `dist/` directory, ready for deployment.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

### Project Structure

```
prompt-library/
├── js/
│   ├── constants.js      # Application constants
│   ├── translations.js   # i18n translations
│   ├── PromptLibrary.js  # Main application class
│   └── main.js          # Entry point
├── styles.css           # Application styles
├── index.html           # HTML entry point
├── favicon.svg          # Application icon
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🌐 Deployment

### GitHub Pages

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist/` folder to GitHub Pages:

```bash
# Using gh-pages package (install first: npm install -D gh-pages)
npx gh-pages -d dist
```

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel

1. Import your GitHub repository
2. Vercel will auto-detect Vite and configure automatically

## 🎨 Customization

### Adding a New Language

1. Edit `js/translations.js`
2. Add your language code to the translations object
3. Add option to language selector in `index.html`

### Changing Theme Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --primary-color: #6366f1;
  --danger-color: #fb7185;
  /* ... */
}
```

## 🧪 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome for Android)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with vanilla JavaScript and modern ES6 modules
- Styled with pure CSS (no frameworks)
- Icons from emoji characters
- Bundled with Vite

## 📧 Contact

Your Name - [@yourhandle](https://twitter.com/yourhandle)

Project Link: [https://github.com/yourusername/prompt-library](https://github.com/yourusername/prompt-library)

---

Made with ❤️ for the AI community
