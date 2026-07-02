import { glob } from 'glob';
import fs from 'fs';

const files = glob.sync('dist/**/*.html');
let found = 0;
files.forEach(file => {
  const html = fs.readFileSync(file, 'utf-8');
  const matches = html.match(/href="\/\/[^"]+"/g);
  if (matches) {
    console.log('双斜杠 found in', file, ':', matches);
    found += matches.length;
  }
});
if (found === 0) {
  console.log('✅ 无任何双斜杠残留');
} else {
  console.log('❌ 发现', found, '个双斜杠');
}