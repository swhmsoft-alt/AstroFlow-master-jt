import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = path.resolve(__dirname, '../src/content/product-specs');

const STATIC_METADATA = `moq: 1
sampleLeadTime: "3-5 Business Days"
bulkLeadTime: "15-25 Business Days (Batch Dependent)"
incoterms: "EXW / FOB Shenzhen"`;

function extractSemanticArray(body, type) {
  const regex = new RegExp(`${type}(?:\\s*Integration)?\\s*:\\s*([^\\n]+)`, 'i');
  const match = body.match(regex);
  if (!match) return '[]';
  
  return JSON.stringify(
    match[1]
      .split(/[;,]/)
      .map(item => item.replace(/^[•\s-*]+|[•\s-*]+$/g, '').trim())
      .filter(item => item.length > 0)
  );
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parts = content.split('---');
  if (parts.length < 3) return;

  let frontmatter = parts[1].trim();
  let body = parts.slice(2).join('---');

  // Check if already migrated
  if (frontmatter.includes('moq:')) {
    console.log(`  SKIP (already has moq): ${path.basename(filePath)}`);
    return;
  }

  // Extract topologies dynamically before stripping from body
  const upstreamArr = extractSemanticArray(body, 'Upstream');
  const downstreamArr = extractSemanticArray(body, 'Downstream');

  // Strip raw SEO graph text from human-visible body
  body = body.replace(/Semantic Graph[\s\S]*?(?=\n\n|\n#|$)/gi, '').trim();

  // Inject updated frontmatter matrix
  const cleanFrontmatter = `${frontmatter}
${STATIC_METADATA}
upstream: ${upstreamArr}
downstream: ${downstreamArr}`;

  const finalPayload = `---\n${cleanFrontmatter}\n---\n\n${body}\n`;
  fs.writeFileSync(filePath, finalPayload, 'utf8');
  console.log(`  OK: ${path.basename(filePath)}`);
}

console.log('Migrating spec files...');
const files = fs.readdirSync(TARGET_DIR)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

console.log(`Found ${files.length} files.`);
files.forEach(file => processFile(path.join(TARGET_DIR, file)));

console.log(`\nMigration complete: ${files.length} spec files processed.`);
