# Cloudflare Pages Deployment Guide

This guide will help you deploy your EduForge application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Your project pushed to a GitHub/GitLab repository
3. OpenAI API key (for serverless function setup)

## Quick Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Select **Connect to Git**
4. Choose your repository and authorize Cloudflare
5. Select the repository containing your EduForge app

### 2. Configure Build Settings

Use these build settings:

- **Framework preset**: None (or Vite if available)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)

### 3. Environment Variables

Since the OpenAI API key should NOT be exposed in the browser, you have two options:

#### Option A: Client-Side (Not Recommended for Production)
Add the environment variable in Cloudflare Pages:
- Variable name: `VITE_OPENAI_API_KEY`
- Value: Your OpenAI API key

⚠️ **Warning**: This exposes your API key in the browser. Only use for testing/development.

#### Option B: Cloudflare Functions (Recommended)
1. Create a `functions` directory in your project root
2. Create `functions/api/openai.js`:

```javascript
export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7 } = body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
```

3. Update your `js/openai-service.js` to use the function endpoint when in production
4. Add the environment variable in Cloudflare Pages settings:
   - Variable name: `OPENAI_API_KEY` (without VITE_ prefix)
   - Value: Your OpenAI API key

### 4. Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be available at `https://your-project.pages.dev`

## Custom Domain (Optional)

1. Go to your Pages project settings
2. Navigate to **Custom domains**
3. Click **Set up a custom domain**
4. Follow the instructions to add your domain

## Troubleshooting

### CSS/Assets Not Loading
- The `vite.config.js` has been updated to use `/` as the base path for Cloudflare Pages
- If you still have issues, check the Network tab in browser DevTools to see the actual paths being requested

### Build Failures
- Check the build logs in Cloudflare Pages dashboard
- Ensure all dependencies are listed in `package.json`
- Try building locally first with `npm run build`

### API Key Issues
- Never commit `.env` files to your repository
- Use Cloudflare Pages environment variables
- Consider implementing the serverless function approach for production

## Updating Your App

Simply push changes to your connected Git repository. Cloudflare Pages will automatically rebuild and deploy your app.

## Performance Tips

1. Cloudflare Pages includes CDN by default
2. Enable Auto Minify in Cloudflare settings
3. Consider using Cloudflare Web Analytics for insights