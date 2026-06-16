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

  // Header and general usages (small)
  content = content.replace(
    /<Image src="\/logo\.png"([^>]+)className="[^"]*w-[0-9]+\s+h-[0-9]+[^"]*"([^>]*)>/g,
    (match, p1, p2) => {
      // Find the context to see if it's large or small.
      // If it's the auth layout or page.tsx main, it might be different, but let's standardise the props
      return `<Image src="/logo.png"${p1}className="w-auto h-8 sm:h-10 object-contain drop-shadow-sm"${p2}>`;
    }
  );

  // But we need to fix width and height props which are hardcoded (e.g., width={32} height={32})
  // Let's replace width={...} height={...} with width={150} height={100}
  content = content.replace(
    /<Image src="\/logo\.png"(.*?)width=\{\d+\}\s*height=\{\d+\}(.*?)\/?>/g,
    `<Image src="/logo.png"$1width={300} height={200}$2/>`
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

['./app', './components'].forEach(dir => walkDir(dir, processFile));
