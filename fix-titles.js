const fs = require('fs');
const files = [
  'titanium-cnc-machining-deformation-causes-and-prevention.md',
  'titanium-surface-finish-achieving-ra-04um.md',
  'titanium-tool-wear-causes-and-solutions.md',
  'titanium-work-hardening-how-to-avoid.md'
];
files.forEach(f => {
  let c = fs.readFileSync('src/content/blog/' + f, 'utf8');
  c = c.replace(/^title: (.+)$/m, 'title: "$1"');
  fs.writeFileSync('src/content/blog/' + f, c, 'utf8');
  console.log('Fixed: ' + f);
});
