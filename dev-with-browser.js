const { spawn } = require('child_process');
const open = require('open');
const waitOn = require('wait-on');
const fs = require('fs');
const path = require('path');

// Check if .next directory exists and remove it
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  console.log('Removing .next directory for clean start...');
  fs.rmSync(nextDir, { recursive: true, force: true });
}

// Default port for Next.js
const PORT = 3000;
const URL = `http://localhost:${PORT}`;

console.log(`Starting Next.js development server on ${URL}...`);

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

// Wait for the server to be ready
waitOn({
  resources: [`http-get://localhost:${PORT}`],
  timeout: 30000 // 30 seconds timeout
}).then(() => {
  console.log(`Server is ready at ${URL}, opening browser...`);
  open(URL);
}).catch((err) => {
  console.error('Error waiting for server:', err);
}); 