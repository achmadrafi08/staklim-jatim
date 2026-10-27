/**
 * Script to remove Header and Footer imports/tags from ALL page files in src/app/
 * and shared components that render them.
 * The MainLayoutWrapper already provides Header and Footer for non-PPID routes.
 * The pelayanan-publik/layout.tsx provides PpidHeader and Footer for PPID routes.
 * 
 * EXCLUDED files (they legitimately need Header/Footer):
 * - src/app/layout.tsx (root layout)
 * - src/app/pelayanan-publik/layout.tsx (PPID layout - uses Footer)
 * - src/components/layout/main-layout-wrapper.tsx (the wrapper itself)
 */
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

// Files that should keep their Header/Footer imports
const EXCLUDED_FILES = new Set([
  path.resolve('src/app/layout.tsx'),
  path.resolve('src/app/pelayanan-publik/layout.tsx'),
  path.resolve('src/components/layout/main-layout-wrapper.tsx'),
  path.resolve('src/components/layout/header.tsx'),
  path.resolve('src/components/layout/footer.tsx'),
  path.resolve('src/components/layout/ppid-header.tsx'),
]);

function getAllTsxFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules, .next
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      results.push(...getAllTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllTsxFiles(SRC_DIR);
let cleanedCount = 0;

for (const filePath of files) {
  if (EXCLUDED_FILES.has(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Remove import lines for Header from @/components/layout/header
  content = content.replace(/^.*import\s*\{?\s*Header\s*\}?\s*from\s*["']@\/components\/layout\/header["'].*\r?\n/gm, '');
  
  // Remove import lines for Footer from @/components/layout/footer
  content = content.replace(/^.*import\s*\{?\s*Footer\s*\}?\s*from\s*["']@\/components\/layout\/footer["'].*\r?\n/gm, '');

  // Remove <Header ... /> tags (with any props, any indentation)
  content = content.replace(/^[ \t]*<Header\b[^>]*\/>\s*\r?\n?/gm, '');

  // Remove <Footer /> or <Footer/> tags (any indentation)  
  content = content.replace(/^[ \t]*<Footer\s*\/>\s*\r?\n?/gm, '');

  // Fix pt-24/pt-28 padding that was meant to compensate for fixed header
  // (the layout wrapper's header is sticky, content flows normally)
  content = content.replace(/className="min-h-screen bg-slate-50 pt-24 sm:pt-28/g, 'className="min-h-screen bg-slate-50');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    cleanedCount++;
    console.log(`✅ Cleaned: ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log(`\nDone! Cleaned ${cleanedCount} files.`);
