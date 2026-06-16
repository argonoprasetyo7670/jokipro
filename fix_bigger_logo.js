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

  // 1. General Logos (Navbar, Footer, Login/Register pages)
  content = content.replace(/w-auto h-10 sm:h-14 md:h-16 object-contain drop-shadow-md/g, 'w-auto h-16 sm:h-20 md:h-24 object-contain drop-shadow-md');
  content = content.replace(/w-auto h-10 sm:h-14 md:h-16 object-contain drop-shadow-sm/g, 'w-auto h-16 sm:h-20 md:h-24 object-contain drop-shadow-sm');
  
  // 2. Auth Layout (Big Logo)
  content = content.replace(/w-auto h-16 sm:h-24 object-contain drop-shadow-xl mb-4/g, 'w-auto h-24 sm:h-32 md:h-40 object-contain drop-shadow-xl mb-6');

  // 3. Sidebar Logo
  content = content.replace(/w-auto h-10 object-contain drop-shadow-md/g, 'w-auto h-16 object-contain drop-shadow-md');
  
  // 4. Onboarding invert logo
  content = content.replace(/width=\{300\} height=\{200\} className="object-contain drop-shadow-md brightness-0 invert"/g, 'width={300} height={200} className="w-auto h-16 sm:h-20 object-contain drop-shadow-md brightness-0 invert"');

  // 5. Increase Navbar container height in app/page.tsx and app/(static)/layout.tsx
  if (filePath.endsWith('app/page.tsx') || filePath.endsWith('layout.tsx')) {
    content = content.replace(/h-16 flex items-center justify-between/g, 'h-24 sm:h-28 flex items-center justify-between');
    content = content.replace(/pt-16/g, 'pt-24 sm:pt-28');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

['./app', './components'].forEach(dir => walkDir(dir, processFile));
