import fs from 'fs/promises';
import path from 'path';

const root = process.cwd();
const targetDir = path.join(root, 'src');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(res));
    else files.push(res);
  }
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const oldArg = args.find(a => a.startsWith('--old='));
  const newArg = args.find(a => a.startsWith('--new='));
  if (!oldArg || !newArg) {
    console.error('Usage: node scripts/update-image-ref.js --old=oldname --new=newname');
    process.exit(1);
  }
  const oldName = oldArg.split('=')[1];
  const newName = newArg.split('=')[1];

  const files = await walk(targetDir);
  const textFiles = files.filter(f => /\.(astro|ts|tsx|js|jsx|html|md|mdx)$/.test(f));
  for (const file of textFiles) {
    let content = await fs.readFile(file, 'utf8');
    if (content.includes(oldName)) {
      content = content.split(oldName).join(newName);
      await fs.writeFile(file, content, 'utf8');
      console.log('Patched', file);
    }
  }
  console.log('Done replacing references.');
}

main().catch(err => { console.error(err); process.exit(1); });
