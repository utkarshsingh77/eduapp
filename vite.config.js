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
  // For Cloudflare Pages, use '/' as the base path
  // For GitHub Pages, use '/repo-name/' format
  base: process.env.DEPLOY_TARGET === 'github' ? '/eduapp/' : '/',
  
  // Configure asset handling
  assetsInclude: ['**/*.md'],
})