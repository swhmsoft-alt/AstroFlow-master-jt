import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/content/blog-translations');
const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');

function parseMarkdown(md) {
  md = md.replace(/\r\n/g, '\n');
  const match = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: md };
  const fmRaw = match[1];
  const body = (match[2] || '').trim();
  const frontmatter = {};
  for (const line of fmRaw.split('\n')) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      let value = kvMatch[2].trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        try { value = JSON.parse(value.replace(/'/g, '"')); }
        catch { value = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, '').replace(/'/g, '')); }
      } else {
        value = value.replace(/^["']|["']$/g, '');
      }
      frontmatter[kvMatch[1]] = value;
    }
  }
  return { frontmatter, body };
}

function buildFrontmatter(fm) {
  const lines = [];
  for (const [key, value] of Object.entries(fm)) {
    if (key === 'tags' && Array.isArray(value) && value.length > 0)
      lines.push(`tags: [${value.map(t => `"${t}"`).join(', ')}]`);
    else if (key === 'tags' && Array.isArray(value))
      lines.push('tags: []');
    else if (key === 'featured')
      lines.push(`featured: ${value === true || value === 'true' ? 'true' : 'false'}`);
    else if (key === 'pubDate')
      lines.push(`pubDate: ${value}`);
    else if (typeof value === 'string')
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    else if (value !== undefined && value !== null)
      lines.push(`${key}: ${value}`);
  }
  return lines.join('\n');
}

async function main() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} translation files`);

  for (const file of files) {
    const transLang = file.split('-')[0];
    const originalFile = file.slice(transLang.length + 1);
    const engPath = path.join(BLOG_DIR, originalFile);

    if (!fs.existsSync(engPath)) {
      console.log(`  ⚠ No English source for ${file}`);
      continue;
    }

    const engContent = fs.readFileSync(engPath, 'utf-8');
    const { frontmatter: engFm } = parseMarkdown(engContent);

    const transContent = fs.readFileSync(path.join(DIR, file), 'utf-8');
    const { frontmatter: transFm, body } = parseMarkdown(transContent);

    // Fix undefined values by using English source as fallback
    const fixedFm = {
      title: transFm.title || engFm.title || file,
      description: transFm.description || engFm.description || '',
      pubDate: transFm.pubDate || engFm.pubDate,
      author: transFm.author || engFm.author || 'BOZE CNC Ti',
      category: transFm.category || engFm.category || '',
      tags: (Array.isArray(transFm.tags) && transFm.tags.length > 0) ? transFm.tags : (engFm.tags || []),
      coverImage: transFm.coverImage || engFm.coverImage || '',
      coverImageAlt: transFm.coverImageAlt || engFm.coverImageAlt || '',
      featured: transFm.featured !== undefined ? transFm.featured : (engFm.featured || false),
      lang: transLang,
      originalSlug: engFm.slug || file,
    };

    const fmStr = buildFrontmatter(fixedFm);
    const fullContent = `---\n${fmStr}\n---\n${body}`;
    fs.writeFileSync(path.join(DIR, file), fullContent, 'utf-8');

    console.log(`  ✓ Fixed ${file} (${fixedFm.lang})`);
  }

  console.log('\nDone! All translations fixed.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});