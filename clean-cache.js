const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the .next directory
const nextDir = path.join(__dirname, '.next');

console.log('Cleaning Next.js cache to resolve theme issues...');

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

// Run npm cache clean --force
try {
  console.log('Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('npm cache cleaned successfully.');
} catch (err) {
  console.error(`Error while cleaning npm cache: ${err.message}`);
}

console.log('Cache cleaning completed. Please run "npm run dev" to start a fresh build.'); 