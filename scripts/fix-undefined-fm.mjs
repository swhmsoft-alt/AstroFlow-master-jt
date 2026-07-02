import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/content/blog-translations');
const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');

// Read all translation files
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const lang = file.split('-')[0];
  const originalFile = file.slice(lang.length + 1);
  const engPath = path.join(BLOG_DIR, originalFile);
  if (!fs.existsSync(engPath)) {
    console.log(`Skip ${file}: no English source`);
    continue;
  }

  // Read English file and get its frontmatter values
  const engRaw = fs.readFileSync(engPath, 'utf-8').replace(/\r\n/g, '\n');
  const engMatch = engRaw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!engMatch) { console.log(`Skip ${file}: bad English frontmatter`); continue; }

  const engFm = {};
  for (const line of engMatch[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      let v = kv[2].trim().replace(/^["']|["']$/g, '');
      engFm[kv[1]] = v;
    }
  }

  // Read translation file
  let content = fs.readFileSync(path.join(DIR, file), 'utf-8');

  // Replace literal string "undefined" and actual undefined with English values
  const replacements = [
    ['title: "undefined"', `title: "${engFm.title || ''}"`],
    ['description: "undefined"', `description: "${(engFm.description || '').replace(/"/g, '\\"')}"`],
    ['pubDate: undefined', `pubDate: ${engFm.pubDate || '2026-01-01'}`],
    ['originalSlug: undefined', `originalSlug: "${engFm.slug || ''}"`],
    ['originalSlug: "undefined"', `originalSlug: "${engFm.slug || ''}"`],
  ];

  let changed = false;
  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(path.join(DIR, file), content, 'utf-8');
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`OK:   ${file}`);
  }
}

console.log('\nDone!');