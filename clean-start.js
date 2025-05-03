const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the .next directory
const nextDir = path.join(__dirname, '.next');

console.log('Starting clean application setup for dark mode...');

// Check if .next directory exists
if (fs.existsSync(nextDir)) {
  try {
    // Remove the .next directory
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('.next directory successfully removed.');
  } catch (err) {
    console.error(`Error while removing .next directory: ${err.message}`);
  }
} else {
  console.log('.next directory does not exist. Nothing to clean.');
}

// Install dependencies to ensure we have everything needed
try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('Dependencies installed successfully.');
} catch (err) {
  console.error(`Error while installing dependencies: ${err.message}`);
}

// Start the development server
try {
  console.log('Starting Next.js development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (err) {
  console.error(`Error while starting the application: ${err.message}`);
} 