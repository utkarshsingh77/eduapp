import { defineConfig } from 'vite'

export default defineConfig({
  // Configure the development server
  server: {
    port: 3000,
    open: true, // Automatically open the browser
    host: true, // Allow external connections
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize for modern browsers
    target: 'es2015',
  },
  
  // Base path for the application
  // Set to your repository name for GitHub Pages deployment
  // e.g., '/eduapp/' if your repo is https://github.com/username/eduapp
  base: process.env.NODE_ENV === 'production' ? '/eduapp/' : '/',
  
  // Configure asset handling
  assetsInclude: ['**/*.md'],
})