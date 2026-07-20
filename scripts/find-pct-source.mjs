import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

try {
  const result = execSync('grep -rn "12.5%\\|16.67%" src/', { cwd: root, encoding: 'utf-8' });
  console.log(result);
} catch (e) {
  console.log('No matches found or grep error:', e.message);
}
