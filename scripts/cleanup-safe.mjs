/**
 * Comprehensive cleanup script:
 * 1. Remove <Header /> and <Footer /> from all page.tsx files (layout handles them)
 * 2. Fix pt-24/pt-28 padding ONLY in <main> tags inside page files
 * 3. Does NOT touch components, layout files, or admin files
 */
import fs from 'fs';
import path from 'path';

const APP_DIR = path.resolve('src/app');

// Files that should NOT be touched
const SKIP_FILES = new Set([
  path.resolve('src/app/layout.tsx'),
  path.resolve('src/app/pelayanan-publik/layout.tsx'),
]);

// Also skip admin directory entirely
const SKIP_DIRS = new Set(['admin']);

function getAllPageFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name === 'node_modules' || entry.name === '.next') continue;
      results.push(...getAllPageFiles(fullPath));
    } else if (entry.name === 'page.tsx' || entry.name === 'not-found.tsx') {
      if (!SKIP_FILES.has(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const files = getAllPageFiles(APP_DIR);
let count = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 1. Remove import { Header } from "@/components/layout/header" lines
  content = content.replace(/^.*import\s*\{?\s*Header\s*\}?\s*from\s*["']@\/components\/layout\/header["'].*\r?\n/gm, '');
  
  // 2. Remove import { Footer } from "@/components/layout/footer" lines
  content = content.replace(/^.*import\s*\{?\s*Footer\s*\}?\s*from\s*["']@\/components\/layout\/footer["'].*\r?\n/gm, '');

  // 3. Remove <Header ... /> tags (any indentation, any props)
  content = content.replace(/^[ \t]*<Header\b[^>]*\/>\s*\r?\n?/gm, '');

  // 4. Remove <Footer /> tags
  content = content.replace(/^[ \t]*<Footer\s*\/>\s*\r?\n?/gm, '');

  // 5. Fix pt-24 padding ONLY in className strings on main tags
  // Replace "pt-24 sm:pt-28" or just "pt-24" in main className
  content = content.replace(/(className="[^"]*)\bpt-24\s+sm:pt-28\b/g, '$1pt-4');
  content = content.replace(/(className="[^"]*)\bpt-24\s+sm:pt-32\b/g, '$1pt-4');
  content = content.replace(/(className="[^"]*)\bpt-28\b/g, '$1pt-4');
  // Only remaining standalone pt-24 in main/section tags
  content = content.replace(/(className="[^"]*)\bpt-24\b/g, '$1pt-4');
  // Fix lg:pt-32 that was for fixed header compensation
  content = content.replace(/(className="[^"]*)\blg:pt-32\b/g, '$1lg:pt-8');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    count++;
    console.log(`✅ Cleaned: ${path.relative(process.cwd(), filePath)}`);
  }
}

// Also clean shared components used by PPID pages
const COMPONENT_FILES = [
  path.resolve('src/components/pelayanan/PelayananList.tsx'),
  path.resolve('src/components/pelayanan/PelayananDetail.tsx'),
  path.resolve('src/components/ui/placeholder-page.tsx'),
  path.resolve('src/components/publikasi/SurveyPageClient.tsx'),
];

for (const filePath of COMPONENT_FILES) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  content = content.replace(/^.*import\s*\{?\s*Header\s*\}?\s*from\s*["']@\/components\/layout\/header["'].*\r?\n/gm, '');
  content = content.replace(/^.*import\s*\{?\s*Footer\s*\}?\s*from\s*["']@\/components\/layout\/footer["'].*\r?\n/gm, '');
  content = content.replace(/^[ \t]*<Header\b[^>]*\/>\s*\r?\n?/gm, '');
  content = content.replace(/^[ \t]*<Footer\s*\/>\s*\r?\n?/gm, '');
  // Fix padding
  content = content.replace(/(className="[^"]*)\bpt-24\s+sm:pt-28\b/g, '$1pt-4');
  content = content.replace(/(className="[^"]*)\bpt-24\b/g, '$1pt-4');
  content = content.replace(/(className="[^"]*)\bpt-28\b/g, '$1pt-4');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    count++;
    console.log(`✅ Cleaned component: ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log(`\nDone! Cleaned ${count} files total.`);
