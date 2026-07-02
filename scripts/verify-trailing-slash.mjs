import { glob } from 'glob';
import fs from 'fs';

const files = glob.sync('dist/**/*.html');
let totalFixed = 0;
let filesChecked = 0;
files.forEach(file => {
  const html = fs.readFileSync(file, 'utf-8');
  const matches = html.match(/href="\/([^".#?]+)"/g);
  if (matches) {
    const noSlash = matches.filter(m => !m.endsWith('/"'));
    if (noSlash.length > 0) {
      console.log('MISSING SLASH in', file, ':', noSlash.slice(0, 5));
      totalFixed += noSlash.length;
    }
    filesChecked++;
  }
});
console.log(`\n检查了 ${filesChecked} 个文件`);
if (totalFixed === 0) {
  console.log('✅ 所有内部链接均已正确添加尾部斜杠！');
} else {
  console.log('❌ 仍有', totalFixed, '个链接缺少斜杠');
}