/**
 * Translate product pages from English to all 9 target languages using DeepSeek API.
 *
 * Reads products from src/content/products/*.md
 * Translates frontmatter fields (title, description, category, seoTitle, seoDescription,
 *   btnText, gallery[].alt, specs[].param) and body content.
 * Writes translations to src/content/product-translations/{lang}-{slug}.md
 * with frontmatter fields: lang, originalSlug, translated fields
 *
 * Usage: node scripts/translate-products.mjs
 *        node scripts/translate-products.mjs --lang de     # translate only German
 *        node scripts/translate-products.mjs --slug titanium-cnc  # translate specific product
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.resolve(__dirname, '../src/content/products');
const OUTPUT_DIR = path.resolve(__dirname, '../src/content/product-translations');
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

/**
 * Parse a YAML-like frontmatter from a markdown file.
 * Handles multi-line values (indented arrays, wrapped strings).
 */
function parseMarkdown(md) {
  md = md.replace(/\r\n/g, '\n');
  const match = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: md };
  const fmRaw = match[1];
  const body = (match[2] || '').trim();

  // Use a simple line-based parser that understands indented blocks
  const frontmatter = {};
  let currentKey = null;       // The current top-level key being populated
  let inArray = null;          // The key name of the array we're currently adding to (e.g. 'gallery', 'specs')
  let bracketDepth = 0;

  const lines = fmRaw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Check if we're inside a bracket block
    if (bracketDepth > 0) {
      for (const ch of trimmed) {
        if (ch === '[') bracketDepth++;
        else if (ch === ']') bracketDepth--;
      }
      if (currentKey) {
        frontmatter[currentKey] += '\n' + line;
      }
      if (bracketDepth === 0 && currentKey) {
        try {
          const raw = frontmatter[currentKey].trim();
          if (raw.startsWith('[') && raw.endsWith(']')) {
            frontmatter[currentKey] = JSON.parse(raw.replace(/'/g, '"'));
          }
        } catch { /* keep as string */ }
      }
      continue;
    }

    // Determine indentation level (count leading spaces)
    const indent = line.search(/\S/);
    const isTopLevel = indent === 0;
    const isArrayItem = trimmed.startsWith('- ');
    const isProperty = !isArrayItem && indent > 0;

    if (isTopLevel) {
      // Top-level key: value
      const kvMatch = trimmed.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        currentKey = kvMatch[1];
        inArray = null; // Reset array tracking
        let value = kvMatch[2].trim();

        // Check for bracket start that spans multiple lines
        if (value.includes('[') && !value.includes(']')) {
          bracketDepth = 1;
          frontmatter[currentKey] = value;
          continue;
        }

        // Parse array values (inline JSON)
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value.replace(/'/g, '"'));
          } catch {
            value = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, '').replace(/'/g, ''));
          }
        } else if (value === 'true' || value === 'false') {
          value = value === 'true';
        } else if (/^\d+$/.test(value)) {
          value = parseInt(value, 10);
        } else {
          value = value.replace(/^["']|["']$/g, '');
        }
        frontmatter[currentKey] = value;
      }
    } else if (isArrayItem) {
      // Line starts with "- " - array item (could be simple value or object start)
      const itemContent = trimmed.slice(2).trim();
      const objMatch = itemContent.match(/^(\w+):\s*(.*)$/);
      
      if (objMatch) {
        // It's a `- key: value` pattern - object with first property
        let objValue = objMatch[2].trim();
        objValue = objValue.replace(/^["']|["']$/g, '');
        const newObj = { [objMatch[1]]: objValue };
        
        // Determine which top-level key this belongs to by checking parent
        // The array item belongs to the last top-level key that expects an array
        if (inArray && Array.isArray(frontmatter[inArray])) {
          frontmatter[inArray].push(newObj);
        } else if (currentKey) {
          if (!Array.isArray(frontmatter[currentKey])) {
            frontmatter[currentKey] = [];
          }
          inArray = currentKey;
          frontmatter[currentKey].push(newObj);
        }
      } else {
        // Simple array value (string)
        if (currentKey) {
          if (!Array.isArray(frontmatter[currentKey])) {
            frontmatter[currentKey] = [];
          }
          inArray = currentKey;
          frontmatter[currentKey].push(itemContent);
        }
      }
    } else if (isProperty && inArray && Array.isArray(frontmatter[inArray])) {
      // Indented property line - belongs to the last object in the current array
      const propMatch = trimmed.match(/^(\w+):\s*(.*)$/);
      if (propMatch) {
        let pValue = propMatch[2].trim();
        if (pValue.startsWith('[') && pValue.endsWith(']')) {
          try { pValue = JSON.parse(pValue.replace(/'/g, '"')); } catch {}
        } else {
          pValue = pValue.replace(/^["']|["']$/g, '');
        }
        
        const arr = frontmatter[inArray];
        const lastIdx = arr.length - 1;
        if (lastIdx >= 0) {
          const lastItem = arr[lastIdx];
          if (typeof lastItem === 'object' && lastItem !== null) {
            arr[lastIdx][propMatch[1]] = pValue;
          } else {
            // Convert simple string to object with this property
            arr[lastIdx] = { [propMatch[1]]: pValue };
          }
        }
      }
    }
  }

  return { frontmatter, body };
}

function buildFrontmatter(fm) {
  const lines = [];
  for (const [key, value] of Object.entries(fm)) {
    if (key === 'tags' && Array.isArray(value) && value.length > 0) {
      lines.push(`tags: [${value.map(t => `"${t}"`).join(', ')}]`);
    } else if (key === 'tags' && Array.isArray(value)) {
      lines.push('tags: []');
    } else if (['featured'].includes(key)) {
      lines.push(`${key}: ${value === true || value === 'true' ? 'true' : 'false'}`);
    } else if (['pubDate', 'updatedDate'].includes(key)) {
      lines.push(`${key}: ${value}`);
    } else if (key === 'order') {
      lines.push(`order: ${value}`);
    } else if (key === 'gallery' && Array.isArray(value)) {
      lines.push('gallery:');
      for (const item of value) {
        if (typeof item === 'object') {
          lines.push(`  - image: "${item.image}"`);
          lines.push(`    alt: "${(item.alt || '').replace(/"/g, '\\"')}"`);
        } else {
          lines.push(`  - ${item}`);
        }
      }
    } else if (key === 'specs' && Array.isArray(value)) {
      lines.push('specs:');
      for (const spec of value) {
        if (typeof spec === 'object') {
          lines.push(`  - param: "${(spec.param || '').replace(/"/g, '\\"')}"`);
          lines.push(`    value: "${(spec.value || '').replace(/"/g, '\\"')}"`);
        } else {
          lines.push(`  - ${spec}`);
        }
      }
    } else if (key === 'btnLink' || key === 'coverImage' || key === 'coverImageAlt') {
      lines.push(`${key}: "${(value || '').replace(/"/g, '\\"')}"`);
    } else if (['lang', 'originalSlug'].includes(key)) {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'string') {
      const escaped = value.replace(/"/g, '\\"');
      // Use block scalar if contains newlines
      if (escaped.includes('\n')) {
        lines.push(`${key}: |`);
        for (const l of escaped.split('\n')) {
          lines.push(`  ${l}`);
        }
      } else {
        lines.push(`${key}: "${escaped}"`);
      }
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value ? 'true' : 'false'}`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else if (value !== undefined && value !== null) {
      lines.push(`${key}: ${value}`);
    }
  }
  return lines.join('\n');
}

async function translateText(text, targetLang, targetLangName) {
  const prompt = `You are a professional industrial/manufacturing translator.

Translate the following English text to ${targetLangName} (${targetLang}).

RULES:
- Keep all technical terms and acronyms unchanged: CNC, ISO, AS9100, AS9102, AS9100D, CAD, CAM, DFM, CMM, EDM, SLM, DMLS, OES, MTR, PMI, NDT, FPI, UT, CAPA, IQC, IPQC, FQC, FAIR, GD&T, Cpk, ASTM, AMS, ELI, UID, RFQ, BOM, WPS, PQR, NDA, FOB, CIF, TLS, TIG, MIG, SDS, EDI, WMS, HACCP, C-TPAT, ITAR, NADCAP, PED, EN 10204 3.2, AMS 4928T, AMS 4911H, AMS 6415, Ti-6Al-4V, Ti-6Al-4V ELI, UNS R56400, Grade 5, Grade 2, IATF 16949, 3-axis, 4-axis, 5-axis, Ra, HRC, HB, FBH
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
  return content.replace(/```(?:markdown)?\s*/g, '').replace(/\s*```/g, '').trim();
}

function splitIntoChunks(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
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

async function translateProduct(filePath, targetLang) {
  const langName = LANGUAGE_NAMES[targetLang];
  const fileName = path.basename(filePath);
  const productContent = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseMarkdown(productContent);
  const slug = path.basename(fileName, '.md');

  const outputFile = path.join(OUTPUT_DIR, `${targetLang}-${fileName}`);

  if (fs.existsSync(outputFile)) {
    console.log(`  ⏭ ${targetLang}/${fileName} already exists, skipping`);
    return;
  }

  console.log(`  → Translating ${fileName} to ${langName} (${targetLang})...`);

  async function translateField(key, text) {
    if (!text || text === '') return text;
    try {
      return await translateText(text, targetLang, langName);
    } catch (err) {
      console.warn(`    ⚠ Could not translate ${key}: ${err.message}`);
      return text;
    }
  }

  // Translate simple frontmatter fields
  const translatedTitle = await translateField('title', frontmatter.title);
  const translatedDescription = await translateField('description', frontmatter.description);
  const translatedCategory = frontmatter.category ? await translateField('category', frontmatter.category) : '';
  const translatedSeoTitle = frontmatter.seoTitle ? await translateField('seoTitle', frontmatter.seoTitle) : '';
  const translatedSeoDescription = frontmatter.seoDescription ? await translateField('seoDescription', frontmatter.seoDescription) : '';
  const translatedBtnText = frontmatter.btnText ? await translateField('btnText', frontmatter.btnText) : 'Request Quote';

  // Translate gallery alt texts
  let translatedGallery = frontmatter.gallery || [];
  if (translatedGallery.length > 0 && typeof translatedGallery[0] === 'object') {
    translatedGallery = [];
    for (const item of (frontmatter.gallery || [])) {
      let translatedAlt = item.alt;
      if (item.alt) {
        try {
          translatedAlt = await translateText(item.alt, targetLang, langName);
        } catch {
          // keep original
        }
      }
      translatedGallery.push({ image: item.image, alt: translatedAlt });
    }
  }

  // Translate specs param names
  let translatedSpecs = frontmatter.specs || [];
  if (translatedSpecs.length > 0 && typeof translatedSpecs[0] === 'object') {
    translatedSpecs = [];
    for (const spec of (frontmatter.specs || [])) {
      let translatedParam = spec.param;
      if (spec.param) {
        try {
          translatedParam = await translateText(spec.param, targetLang, langName);
        } catch {
          // keep original
        }
      }
      // Keep value as-is (technical values don't need translation)
      translatedSpecs.push({ param: translatedParam, value: spec.value });
    }
  }

  // Translate body content
  let translatedBody = '';
  if (body) {
    const MAX_CHUNK = 12000;
    const bodyChunks = splitIntoChunks(body, MAX_CHUNK);

    if (bodyChunks.length === 1) {
      try {
        translatedBody = await translateText(body, targetLang, langName);
      } catch (err) {
        console.error(`    ✗ Body translation failed: ${err.message}`);
        translatedBody = body;
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
  }

  // Strip any frontmatter from translatedBody
  const cleanBody = translatedBody.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();

  // Build output frontmatter
  const outputFm = {
    title: translatedTitle,
    category: translatedCategory || frontmatter.category || '',
    description: translatedDescription,
    gallery: translatedGallery,
    specs: translatedSpecs,
    btnText: translatedBtnText,
    btnLink: frontmatter.btnLink || 'https://www.bozemetal.com/contact',
    seoTitle: translatedSeoTitle,
    seoDescription: translatedSeoDescription,
    featured: frontmatter.featured || false,
    order: frontmatter.order || 0,
    pubDate: frontmatter.pubDate || null,
    updatedDate: frontmatter.updatedDate || null,
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
  if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error(`Error: Products directory not found: ${PRODUCTS_DIR}`);
    process.exit(1);
  }

  const productFiles = fs.readdirSync(PRODUCTS_DIR)
    .filter(f => f.endsWith('.md'))
    .filter(f => fs.statSync(path.join(PRODUCTS_DIR, f)).isFile())
    .sort();

  console.log(`Found ${productFiles.length} English product files:`);
  productFiles.forEach(f => console.log(`  - ${f}`));

  const filteredFiles = onlySlugs.length > 0
    ? productFiles.filter(f => onlySlugs.some(s => f.toLowerCase().includes(s.toLowerCase())))
    : productFiles;

  const langs = onlyLangs.length > 0
    ? TARGET_LANGS.filter(l => onlyLangs.includes(l))
    : TARGET_LANGS;

  console.log(`\nTarget languages: ${langs.join(', ')}`);
  console.log(`Product files to translate: ${filteredFiles.length}\n`);

  let totalSuccess = 0;
  let totalFail = 0;

  for (const productFile of filteredFiles) {
    const filePath = path.join(PRODUCTS_DIR, productFile);
    console.log(`\n📄 Processing: ${productFile}`);

    for (const lang of langs) {
      const success = await translateProduct(filePath, lang);
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