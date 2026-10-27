/**
 * Script to remove Header and Footer imports/tags from all PPID sub-pages.
 * The layout.tsx already provides PpidHeader and Footer for all /pelayanan-publik routes.
 */
import fs from 'fs';
import path from 'path';

const PPID_DIR = path.resolve('src/app/pelayanan-publik');

function getAllTsxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx') && entry.name !== 'layout.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTsxFiles(PPID_DIR);

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Remove import lines for Header and Footer from @/components/layout/*
  content = content.replace(/^.*import\s*\{?\s*Header\s*\}?\s*from\s*["']@\/components\/layout\/header["'].*\r?\n/gm, '');
  content = content.replace(/^.*import\s*\{?\s*Footer\s*\}?\s*from\s*["']@\/components\/layout\/footer["'].*\r?\n/gm, '');

  // Remove <Header ... /> tags (with any props, any indentation)
  content = content.replace(/^[ \t]*<Header\b[^>]*\/>\s*\r?\n?/gm, '');

  // Remove <Footer /> tags (any indentation)
  content = content.replace(/^[ \t]*<Footer\s*\/>\s*\r?\n?/gm, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Cleaned: ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log('\nDone! All PPID sub-pages cleaned.');
