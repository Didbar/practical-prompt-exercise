# Deployment Guide

This guide covers different deployment options for the Prompt Library application.

## 📋 Prerequisites

Before deploying, ensure you have:

- Built the project: `npm run build`
- Tested the production build: `npm run preview`

## 🚀 Deployment Options

### 1. GitHub Pages (Recommended)

#### Automatic Deployment (GitHub Actions)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**Setup:**

1. Go to your repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to `main` branch - deployment happens automatically!

#### Manual Deployment

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

Your site will be available at: `https://yourusername.github.io/prompt-library`

---

### 2. Netlify

#### Via UI (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click "Deploy site"

#### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

### 3. Vercel

#### Via UI

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite - just click "Deploy"!

#### Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

### 4. Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Configure:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy!

---

### 5. Custom Server (Apache/Nginx)

#### Build

```bash
npm run build
```

#### Apache (.htaccess)

Create `.htaccess` in `dist/` directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Deploy

```bash
# Copy dist folder to server
scp -r dist/* user@server:/var/www/prompt-library/
```

---

### 6. Docker

Create `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t prompt-library .
docker run -p 80:80 prompt-library
```

---

## 🔧 Configuration

### Base URL

If deploying to a subdirectory, update `vite.config.js`:

```js
export default defineConfig({
  base: "/your-subdirectory/",
  // ...
});
```

### Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-api.com
```

---

## ✅ Post-Deployment Checklist

- [ ] Test all features work correctly
- [ ] Verify all pages load without errors
- [ ] Check responsive design on mobile
- [ ] Test in different browsers
- [ ] Verify localStorage works
- [ ] Test export/import functionality
- [ ] Check accessibility (screen readers)
- [ ] Verify all translations work
- [ ] Test theme switching

---

## 🐛 Troubleshooting

### Blank page after deployment

- Check browser console for errors
- Verify `base` path in `vite.config.js`
- Ensure all assets are loading correctly

### 404 on refresh

- Configure server for SPA routing
- Check `.htaccess` or nginx config

### Assets not loading

- Verify `base` path is correct
- Check file paths in browser network tab

---

## 📊 Analytics (Optional)

Add Google Analytics by updating `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

---

Need help? Open an issue on GitHub!
