#!/bin/bash

# Setup script for GitHub Pages deployment

echo "🚀 Setting up GitHub Pages deployment for EduForge"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git is not initialized. Please run 'git init' first."
    exit 1
fi

# Get repository name
echo "📝 Please enter your GitHub username:"
read -r username
echo "📝 Please enter your repository name (e.g., eduapp):"
read -r reponame

# Update vite.config.js with the correct base path
echo "🔧 Updating vite.config.js with base path..."
sed -i.bak "s|'/eduapp/'|'/$reponame/'|g" vite.config.js
rm vite.config.js.bak

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔑 Creating .env file..."
    echo "📝 Please enter your OpenAI API key:"
    read -r apikey
    echo "VITE_OPENAI_API_KEY=$apikey" > .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Local setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a repository on GitHub named: $reponame"
echo "2. Add the remote: git remote add origin https://github.com/$username/$reponame.git"
echo "3. Add the VITE_OPENAI_API_KEY secret in GitHub repository settings"
echo "4. Push your code: git push -u origin main"
echo "5. Enable GitHub Pages in repository settings (Source: GitHub Actions)"
echo ""
echo "🔒 Security Note: Your API key will be exposed in the browser."
echo "   Consider using the secure deployment option with Vercel for production."