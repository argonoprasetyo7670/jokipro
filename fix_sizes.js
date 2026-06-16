const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Make all logos bigger
  content = content.replace(/className="w-auto h-8 sm:h-10 object-contain drop-shadow-sm"/g, 'className="w-auto h-10 sm:h-14 md:h-16 object-contain drop-shadow-md"');

  // Specific for app-sidebar.tsx
  if (filePath.endsWith('app-sidebar.tsx')) {
    content = content.replace(
      /<div className="flex aspect-square size-8 items-center justify-center">\s*<Image src="\/logo\.png"([^>]+)className="object-contain drop-shadow-md" \/>\s*<\/div>\s*<div className="flex flex-col gap-0\.5 leading-none">\s*<span className="text-xl font-bold tracking-tight">\s*Edu<span className="text-sidebar-primary">Tasky<\/span>\s*<\/span>\s*<\/div>/g,
      `<Image src="/logo.png"$1className="w-auto h-10 object-contain drop-shadow-md" />`
    );
  }

  // Specific for app/(auth)/layout.tsx
  if (filePath.endsWith('(auth)/layout.tsx')) {
    content = content.replace(
      /<Image src="\/logo\.png"([^>]+)className="w-auto h-12 sm:h-16 object-contain drop-shadow-md mb-8" \/>\s*<h1 className="text-4xl font-bold tracking-tight mb-4">\s*Edutasky\s*<\/h1>/g,
      `<Image src="/logo.png"$1className="w-auto h-16 sm:h-24 object-contain drop-shadow-xl mb-4" />`
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

['./app', './components'].forEach(dir => walkDir(dir, processFile));
