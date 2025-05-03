const { spawn } = require('child_process');
const browserSync = require('browser-sync');
const fs = require('fs');
const path = require('path');
const open = require('open');

// Check if .next directory exists and remove it
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  console.log('Removing .next directory for clean start...');
  fs.rmSync(nextDir, { recursive: true, force: true });
}

// Default port for Next.js
const NEXT_PORT = 3000;
const BROWSER_SYNC_PORT = 3001;
const URL = `http://localhost:${BROWSER_SYNC_PORT}`;

console.log('Starting development environment with auto-reload...');

// Start Next.js dev server
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Listen for process exit
nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Wait a bit for Next.js to start up
setTimeout(() => {
  console.log('Starting Browser-Sync...');
  
  // Start Browser-Sync 
  browserSync.create().init(
    {
      proxy: `localhost:${NEXT_PORT}`,
      port: BROWSER_SYNC_PORT,
      files: [
        "pages/**/*.{js,ts,jsx,tsx}",
        "components/**/*.{js,ts,jsx,tsx}",
        "styles/**/*.css",
        "hooks/**/*.{js,ts,jsx,tsx}",
        "lib/**/*.{js,ts,jsx,tsx}",
        "utils/**/*.{js,ts,jsx,tsx}"
      ],
      open: false,
      notify: true,
      reloadDelay: 1000
    },
    () => {
      console.log(`Development environment is running at ${URL}`);
      // Use try/catch to handle potential open() errors
      try {
        // Open Chrome browser explicitly
        open(URL, { app: { name: 'chrome' } });
      } catch (err) {
        console.log(`Browser auto-open failed, please open ${URL} manually`);
        console.error(err);
      }
    }
  );
}, 5000); // Wait 5 seconds for Next.js to start

// Handle termination
process.on('SIGINT', () => {
  console.log('Shutting down development environment...');
  nextProcess.kill();
  process.exit();
}); 