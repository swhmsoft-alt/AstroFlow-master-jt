import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const p = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(p, 'utf-8');

const script = `<script is:inline>
(function() {
  var headings = document.querySelectorAll('article.prose h2, article.prose h3');
  var map = {
    'supply': 'supply-chain',
    'application': 'application',
    'manufacturing': 'manufacturing',
    'faq': 'faq-section',
    'graph': 'knowledge-graph',
    'specifications': 'tech-specs'
  };
  headings.forEach(function(h) {
    var text = h.textContent.toLowerCase().trim();
    for (var key in map) {
      if (text.indexOf(key) === 0) {
        h.id = map[key];
        break;
      }
    }
  });
})();
</script>
`;

c = c.replace('</BaseLayout>', script + '</BaseLayout>');
writeFileSync(p, c, 'utf-8');
console.log('Anchor script added.');
