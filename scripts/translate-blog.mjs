/**
 * Translate blog posts from English to all 9 target languages using DeepSeek API.
 *
 * Writes translations to src/content/blog-translations/{lang}-{slug}.md
 * with frontmatter fields: lang, originalSlug, translated title/description/category/tags
 *
 * Usage: node scripts/translate-blog.mjs
 *        node scripts/translate-blog.mjs --lang de     # translate only German
 *        node scripts/translate-blog.mjs --slug custom-titanium  # translate specific article
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');
const OUTPUT_DIR = path.resolve(__dirname, '../src/content/blog-translations');
const DEEPSEEK_API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const TARGET_LANGS = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

const LANGUAGE_NAMES = {
  de: 'German',
  ja: 'Japanese',
  fr: 'French',
  es: 'Spanish',
  pt: 'Portuguese',
  it: 'Italian',
  ko: 'Korean',
  nl: 'Dutch',
  pl: 'Polish',
};

const args = process.argv.slice(2);
const onlyLangs = [];
const onlySlugs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--lang' && args[i + 1]) onlyLangs.push(args[++i]);
  else if (args[i] === '--slug' && args[i + 1]) onlySlugs.push(args[++i]);
}

function parseMarkdown(md) {
  // Normalize line endings (handle both \r\n and \n)
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
    else if (key === 'slug')
      lines.push(`slug: ${value}`);
    else if (typeof value === 'string')
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    else
      lines.push(`${key}: ${value}`);
  }
  return lines.join('\n');
}

async function translateText(text, targetLang, targetLangName) {
  const prompt = `You are a professional industrial/manufacturing translator.

Translate the following English text to ${targetLangName} (${targetLang}).

RULES:
- Keep all technical terms and acronyms unchanged: CNC, ISO, AS9100, AS9102, AS9100D, CAD, CAM, DFM, CMM, EDM, SLM, DMLS, OES, MTR, PMI, NDT, FPI, UT, CAPA, IQC, IPQC, FQC, FAIR, GD&T, Cpk, ASTM, AMS, ELI, UID, RFQ, BOM, WPS, PQR, NDA, FOB, CIF, TLS, TIG, MIG, SDS, EDI, WMS, HACCP, C-TPAT, ITAR, NADCAP, PED, EN 10204 3.2, AMS 4928T, AMS 4911H, AMS 6415, Ti-6Al-4V, Ti-6Al-4V ELI, UNS R56400, Grade 5, Grade 2
- Keep proper names unchanged: "BOZE CNC Ti", "BOZE CNC", "BOZE Metal", company names, person names
- Keep measurement units, values, and numbers unchanged: "±0.005 mm", "650 × 650 × 500 mm", "24/7", "500+", "50M+", "99.9%", "Cpk ≥ 1.67", "Ra 0.4 µm", "0.20 wt%", "15–35 m/min", "$18,000", percentages, etc.
- Keep all URLs, file paths, and image references unchanged
- Keep all Markdown formatting, table structures, code blocks, and HTML tags EXACTLY as-is
- Use proper ${targetLangName} grammar and industry terminology
- Return ONLY the translated text, nothing else.

TEXT TO TRANSLATE:
${text}`;

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: `You are a professional ${targetLangName} translator for industrial manufacturing content.` },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 32768,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  // Remove code block wrapping if present
  return content.replace(/```(?:markdown)?\s*/g, '').replace(/\s*```/g, '').trim();
}

function splitIntoChunks(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  // Split on double newlines (paragraph boundaries)
  const paragraphs = text.split(/\n\n+/);
  let current = '';
  for (const p of paragraphs) {
    if ((current + '\n\n' + p).length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = p;
    } else {
      current = current ? current + '\n\n' + p : p;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function translateBlogPost(filePath, targetLang) {
  const langName = LANGUAGE_NAMES[targetLang];
  const fileName = path.basename(filePath);
  const blogContent = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseMarkdown(blogContent);
  const slug = frontmatter.slug;

  const outputFile = path.join(OUTPUT_DIR, `${targetLang}-${fileName}`);

  if (fs.existsSync(outputFile)) {
    console.log(`  ⏭ ${targetLang}/${fileName} already exists, skipping`);
    return;
  }

  console.log(`  → Translating ${fileName} to ${langName} (${targetLang})...`);

  // Translate frontmatter fields one by one
  async function translateField(key, text) {
    if (!text || text === '') return text;
    try {
      return await translateText(text, targetLang, langName);
    } catch (err) {
      console.warn(`    ⚠ Could not translate ${key}: ${err.message}`);
      return text; // Fallback to original
    }
  }

  const translatedTitle = await translateField('title', frontmatter.title);
  const translatedDescription = await translateField('description', frontmatter.description);
  const translatedCategory = frontmatter.category ? await translateField('category', frontmatter.category) : '';
  let translatedTags = frontmatter.tags || [];
  if (translatedTags.length > 0) {
    try {
      const tagsStr = await translateField('tags', translatedTags.join(', '));
      translatedTags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    } catch { /* keep original */ }
  }

  // Translate body content - split into chunks if too long
  const MAX_CHUNK = 12000;
  const bodyChunks = splitIntoChunks(body, MAX_CHUNK);
  let translatedBody = '';

  if (bodyChunks.length === 1) {
    try {
      translatedBody = await translateText(body, targetLang, langName);
    } catch (err) {
      console.error(`    ✗ Body translation failed: ${err.message}`);
      translatedBody = body; // Fallback
    }
  } else {
    console.log(`    ℹ Splitting body into ${bodyChunks.length} chunks`);
    for (let i = 0; i < bodyChunks.length; i++) {
      try {
        const chunkResult = await translateText(bodyChunks[i], targetLang, langName);
        translatedBody += (i > 0 ? '\n\n' : '') + chunkResult;
        if (i < bodyChunks.length - 1) await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.warn(`    ⚠ Chunk ${i + 1} failed: ${err.message}`);
        translatedBody += (i > 0 ? '\n\n' : '') + bodyChunks[i];
      }
    }
  }

  // Strip any frontmatter from translatedBody in case the API returned it
  const cleanBody = translatedBody.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();

  // Build output
  const outputFm = {
    title: translatedTitle,
    description: translatedDescription,
    pubDate: frontmatter.pubDate,
    author: frontmatter.author || 'BOZE CNC Ti',
    category: translatedCategory || '',
    tags: translatedTags,
    coverImage: frontmatter.coverImage || '',
    coverImageAlt: frontmatter.coverImageAlt || '',
    featured: frontmatter.featured || false,
    lang: targetLang,
    originalSlug: slug,
  };

  const finalFmStr = buildFrontmatter(outputFm);
  const finalContent = `---\n${finalFmStr}\n---\n${cleanBody}`;

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(outputFile, finalContent, 'utf-8');

  console.log(`  ✓ ${targetLang}/${fileName} saved`);
  return true;
}

async function main() {
  const blogFiles = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => fs.statSync(path.join(BLOG_DIR, f)).isFile())
    .sort();

  console.log(`Found ${blogFiles.length} English blog posts:`);
  blogFiles.forEach(f => console.log(`  - ${f}`));

  const filteredFiles = onlySlugs.length > 0
    ? blogFiles.filter(f => onlySlugs.some(s => f.toLowerCase().includes(s.toLowerCase())))
    : blogFiles;

  const langs = onlyLangs.length > 0
    ? TARGET_LANGS.filter(l => onlyLangs.includes(l))
    : TARGET_LANGS;

  console.log(`\nTarget languages: ${langs.join(', ')}`);
  console.log(`Blog posts to translate: ${filteredFiles.length}\n`);

  let totalSuccess = 0;
  let totalFail = 0;

  for (const blogFile of filteredFiles) {
    const filePath = path.join(BLOG_DIR, blogFile);
    console.log(`\n📄 Processing: ${blogFile}`);

    for (const lang of langs) {
      const success = await translateBlogPost(filePath, lang);
      if (success) totalSuccess++;
      else totalFail++;
      await new Promise(r => setTimeout(r, 600));
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Translation complete: ${totalSuccess} successful, ${totalFail} failed`);

  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.md'));
    console.log(`\n📁 ${OUTPUT_DIR} → ${files.length} files`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});