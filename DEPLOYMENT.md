# Deployment Guide

This guide will help you deploy your EduForge application to GitHub Pages using GitHub Actions.

## Prerequisites

1. A GitHub repository for your project
2. An OpenAI API key

## Setup Instructions

### 1. Push Your Code to GitHub

If you haven't already, create a repository on GitHub and push your code:

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/eduapp.git
git push -u origin main
```

### 2. Configure Repository Settings

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", select **Source**: "GitHub Actions"

### 3. Set Up Secrets

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Add the following secret:
   - Name: `VITE_OPENAI_API_KEY`
   - Value: Your OpenAI API key

### 4. Update Base Path

In `vite.config.js`, update the base path to match your repository name:

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

For example, if your repository URL is `https://github.com/username/eduapp`, use `/eduapp/`.

### 5. Deploy

1. Push any changes to the `main` branch
2. The GitHub Action will automatically trigger
3. Check the Actions tab in your repository to monitor the deployment
4. Once complete, your app will be available at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

## Security Considerations ⚠️

**Important**: The current setup exposes your OpenAI API key in the browser, which is not secure for production use. Anyone can inspect the code and use your API key.

### Recommended Solutions:

1. **Use a Backend Service** (Recommended)
   - Create a backend API that handles OpenAI requests
   - Keep the API key on the server only
   - Implement authentication and rate limiting

2. **Use Serverless Functions**
   - Deploy API endpoints using Vercel, Netlify Functions, or AWS Lambda
   - Keep the API key in serverless environment variables

3. **Implement User Authentication**
   - Require users to provide their own OpenAI API keys
   - Store keys securely in browser's local storage

## Alternative Deployment Options

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Local Development

For local development with environment variables:

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key
3. Run `npm run dev`

## Troubleshooting

### Deployment Fails
- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Verify the secret name matches exactly: `VITE_OPENAI_API_KEY`

### 404 Errors
- Verify the base path in `vite.config.js` matches your repository name
- Ensure GitHub Pages is enabled in repository settings

### API Key Issues
- Make sure the secret is properly set in GitHub
- Check that the key is valid and has sufficient credits