import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');

let c = readFileSync(templatePath, 'utf-8');

// Replace the entry/props section to add Content rendering
c = c.replace(
  `const { entry } = Astro.props;
const { data } = entry;

const isRichSpec = !!data.sku;`,
  `const { entry } = Astro.props;
const { data } = entry;

const isRichSpec = !!data.sku;

// Pre-render markdown content for rich spec blueprint pages
let Content;
if (isRichSpec) {
  const rendered = await entry.render();
  Content = rendered.Content;
}`
);

// Replace <entry.Content /> with <Content />
c = c.replace('<entry.Content />', '<Content />');

writeFileSync(templatePath, c, 'utf-8');
console.log('Content rendering fixed.');
