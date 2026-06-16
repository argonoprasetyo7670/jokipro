const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const map = {
  'from-violet-600 to-indigo-600': 'bg-brand-gradient',
  'hover:from-violet-500 hover:to-indigo-500': 'hover:opacity-90',
  'bg-gradient-to-r from-violet-600 to-indigo-600': 'bg-brand-gradient',
  'bg-violet-500': 'bg-primary',
  'bg-violet-600': 'bg-primary',
  'bg-indigo-500': 'bg-secondary',
  'bg-indigo-600': 'bg-secondary',
  'shadow-violet-500': 'shadow-primary',
  'border-violet-500': 'border-primary',
  'text-violet-300': 'text-primary-foreground',
  'text-violet-700': 'text-primary',
  'text-violet-100': 'text-primary-foreground',
  'bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400': 'bg-brand-gradient',
  'bg-gradient-to-r from-violet-400 to-indigo-400': 'bg-brand-gradient',
  'from-violet-500 to-indigo-500': 'bg-brand-gradient',
  'bg-gradient-to-br from-violet-500/10 to-indigo-500/10': 'bg-primary/10',
  'group-hover:from-violet-500/20 group-hover:to-indigo-500/20': 'group-hover:bg-primary/20',
  'bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700': 'bg-brand-gradient',
  'hover:bg-violet-50': 'hover:bg-blue-50',
  'via-violet-500': 'via-primary',
  'from-violet-500': 'from-primary',
  'to-indigo-500': 'to-secondary'
};

walkDir('./app', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // specialized replacements
    content = content.replace(/bg-gradient-to-r from-violet-600 to-indigo-600/g, 'bg-brand-gradient');
    content = content.replace(/from-violet-600 to-indigo-600/g, 'bg-brand-gradient');
    content = content.replace(/hover:from-violet-500 hover:to-indigo-500/g, 'hover:opacity-90');
    content = content.replace(/bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400/g, 'bg-brand-gradient');
    content = content.replace(/bg-gradient-to-r from-violet-400 to-indigo-400/g, 'bg-brand-gradient');
    content = content.replace(/bg-gradient-to-br from-violet-500\/10 to-indigo-500\/10/g, 'bg-primary/10');
    content = content.replace(/group-hover:from-violet-500\/20 group-hover:to-indigo-500\/20/g, 'group-hover:bg-primary/20');
    content = content.replace(/bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700/g, 'bg-brand-gradient');
    
    // general replacements
    content = content.replace(/violet-500/g, 'primary');
    content = content.replace(/violet-600/g, 'primary');
    content = content.replace(/indigo-500/g, 'secondary');
    content = content.replace(/indigo-600/g, 'secondary');
    content = content.replace(/purple-700/g, 'blue-700');
    content = content.replace(/violet-100/g, 'blue-100');
    content = content.replace(/violet-300/g, 'blue-300');
    content = content.replace(/violet-50/g, 'blue-50');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
