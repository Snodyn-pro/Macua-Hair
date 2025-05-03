module.exports = {
  // Proxy to the Next.js development server
  proxy: "localhost:3000",
  
  // Browser-sync port
  port: 3001,
  
  // Watch for changes in these file types
  files: [
    "pages/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{js,ts,jsx,tsx}",
    "styles/**/*.css",
    "hooks/**/*.{js,ts,jsx,tsx}",
    "lib/**/*.{js,ts,jsx,tsx}",
    "utils/**/*.{js,ts,jsx,tsx}"
  ],
  
  // Don't open the browser automatically (our script will do this)
  open: false,
  
  // Avoid full page refreshes
  injectChanges: true,
  
  // Show Browser-Sync UI for debugging
  ui: {
    port: 3002
  },
  
  // Notify changes in the browser
  notify: true,
  
  // Wait for Next.js to build before reloading
  reloadDelay: 1000
}; 