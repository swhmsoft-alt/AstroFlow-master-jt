import { glob } from 'glob';
import fs from 'fs';

const files = glob.sync('dist/**/*.html');
files.forEach(file => {
  let html = fs.readFileSync(file, 'utf-8');
  // 替换所有内部链接（排除外部、锚点、查询参数、文件扩展名）
  html = html.replace(/href="\/([^".#?]+)"/g, (match, p) => `href="/${p}/"`);
  fs.writeFileSync(file, html, 'utf-8');
});