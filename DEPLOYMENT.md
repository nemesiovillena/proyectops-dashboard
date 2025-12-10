# 🚀 Deployment Guide

## Production Build

```bash
# Build the project
npm run build

# The build artifacts will be in the dist/ folder
```

## Deployment Options

### 1. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/proyectops-dashboard/browser
```

### 2. Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. GitHub Pages

```bash
# Install Angular CLI GitHub Pages
npm install -g angular-cli-ghpages

# Build and deploy
ng build --configuration production --base-href /proyectops-dashboard/
npx angular-cli-ghpages --dir=dist/proyectops-dashboard/browser
```

### 4. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## Environment Configuration

Update the environment files for production:

**src/environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'YOUR_PRODUCTION_API_URL'
};
```

## Performance Optimization

The build is already optimized with:
- ✅ AOT Compilation
- ✅ Tree Shaking
- ✅ Minification
- ✅ Code Splitting
- ✅ Lazy Loading

## Post-Deployment Checklist

- [ ] Verify all routes work correctly
- [ ] Test responsive design on different devices
- [ ] Check API endpoints configuration
- [ ] Validate analytics tracking
- [ ] Test drag & drop functionality
- [ ] Verify all animations work smoothly

---

🌐 Live Demo: https://your-deployment-url.com
