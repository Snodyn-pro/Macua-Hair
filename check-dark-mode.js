const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Checking dark mode consistency across all pages...');

// Define common dark mode CSS classes to check for
const darkModeClasses = [
  'dark:text-',
  'dark:bg-',
  'dark:border-',
  'dark:hover:',
  'dark:focus:',
  'dark-gradient',
  'dark:prose-invert',
  'dark:from-',
  'dark:to-'
];

// Find all page files
const pageFiles = glob.sync('pages/**/*.{tsx,jsx}');
const componentFiles = glob.sync('components/**/*.{tsx,jsx}');
const allFiles = [...pageFiles, ...componentFiles];

console.log(`Found ${pageFiles.length} page files and ${componentFiles.length} component files.`);

// Results tracking
const inconsistencies = [];
const darkModeStats = {};

// Initialize stats for each class
darkModeClasses.forEach(cls => {
  darkModeStats[cls] = { count: 0, files: [] };
});

// Process each file
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check if file has any dark mode classes
  const hasDarkMode = darkModeClasses.some(cls => content.includes(cls));
  
  if (!hasDarkMode && !file.includes('_document') && !file.includes('_app')) {
    inconsistencies.push({
      file,
      issue: 'No dark mode classes found'
    });
  }
  
  // Count occurrences of each dark mode class
  darkModeClasses.forEach(cls => {
    const matches = content.match(new RegExp(cls, 'g'));
    if (matches && matches.length > 0) {
      darkModeStats[cls].count += matches.length;
      darkModeStats[cls].files.push(file);
    }
  });
  
  // Check for non-standard dark mode usage
  if (content.includes('dark:') && !content.includes('className')) {
    inconsistencies.push({
      file,
      issue: 'Dark mode classes found but not in className attributes'
    });
  }
  
  // Check for potential text color issues in dark mode
  if (content.includes('text-gray-700') && !content.includes('dark:text-gray-100') && 
      !content.includes('dark:text-gray-200') && !content.includes('dark:text-white')) {
    inconsistencies.push({
      file,
      issue: 'Text might have poor contrast in dark mode (text-gray-700 without dark: variant)'
    });
  }
});

// Print results
console.log('\n--- DARK MODE USAGE STATISTICS ---');
for (const [cls, data] of Object.entries(darkModeStats)) {
  console.log(`${cls}: ${data.count} occurrences in ${new Set(data.files).size} files`);
}

console.log('\n--- POTENTIAL INCONSISTENCIES ---');
if (inconsistencies.length === 0) {
  console.log('No inconsistencies found!');
} else {
  inconsistencies.forEach(({ file, issue }) => {
    console.log(`${file}: ${issue}`);
  });
}

// Find all specific pages that need attention
const pagesToFix = inconsistencies
  .filter(inc => inc.file.startsWith('pages/'))
  .map(inc => inc.file);

if (pagesToFix.length > 0) {
  console.log('\n--- PAGES NEEDING DARK MODE FIXES ---');
  pagesToFix.forEach(page => console.log(page));
}

console.log('\nDark mode consistency check complete.'); 