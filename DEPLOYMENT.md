# GitHub Pages Deployment Guide

## Quick Setup

### Step 1: Enable GitHub Pages

1. Go to your repository settings: https://github.com/willnubrakes/nubrakes-fleet-portal/settings/pages

2. Under **"Source"**, you have two options:

   **Option A: GitHub Actions (Recommended)**
   - Select "GitHub Actions"
   - Create the workflow file (see below)

   **Option B: Manual Deployment**
   - Select "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`

### Step 2: Set Up GitHub Actions (Option A)

1. **Create the workflow file**:
   - Create `.github/workflows/deploy.yml` in your repository
   - Copy the content from the README or use this:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "./out"
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

2. **Commit and push**:
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push
   ```

3. **First deployment**:
   - Go to the "Actions" tab in your repository
   - The workflow will run automatically
   - After it completes, your site will be live!

### Step 3: Manual Deployment (Option B)

If you prefer manual deployment:

```bash
# Build the static site
npm run build

# Deploy to gh-pages branch
npm run deploy
```

## Your Site URL

Once deployed, your site will be available at:
**https://willnubrakes.github.io/nubrakes-fleet-portal/**

## Important Notes

- ⚠️ **API Routes don't work on GitHub Pages** (it's static hosting)
- The service request form will log to console instead of calling the API
- For production, update the webhook URL in `app/service-request/page.tsx` to point to your Zapier webhook
- The site uses a base path: `/nubrakes-fleet-portal` (configured in `next.config.ts`)

## Troubleshooting

- **Build fails?** Check the Actions tab for error messages
- **404 errors?** Make sure the base path in `next.config.ts` matches your repository name
- **Styles not loading?** Ensure `trailingSlash: true` is set in `next.config.ts`

