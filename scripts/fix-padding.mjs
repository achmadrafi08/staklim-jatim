/**
 * Remove pt-24 and pt-28 top padding from all page files.
 * The header is now sticky (not fixed), so content flows normally after it.
 * No extra top padding is needed.
 */
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

function getAllTsxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      results.push(...getAllTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTsxFiles(SRC_DIR);
let count = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Remove pt-24 patterns (with optional sm:pt-28 or sm:pt-32 variants)
  content = content.replace(/\bpt-24\s*/g, '');
  content = content.replace(/\bsm:pt-28\s*/g, '');
  content = content.replace(/\bsm:pt-32\s*/g, '');
  content = content.replace(/\bpt-28\s*/g, '');
  content = content.replace(/\blg:pt-32\s*/g, '');
  content = content.replace(/\blg:pt-28\s*/g, '');

  // Clean up double spaces left after removal
  content = content.replace(/  +/g, ' ');
  // Clean up space before closing quote
  content = content.replace(/ "/g, '"');
  content = content.replace(/ '/g, "'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    count++;
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log(`\nDone! Fixed ${count} files.`);
