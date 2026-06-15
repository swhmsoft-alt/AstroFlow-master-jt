/**
 * BOZE CNC Ti 本地可视化博客编辑后台
 *
 * 启动:   npm run cms
 * 打开:   http://localhost:4322
 *
 * 完全独立的本地服务，不影响线上网站。
 */

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4322;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ============ API: 获取文章列表 ============
app.get('/api/posts', (req, res) => {
  const blogDir = path.join(__dirname, 'src', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const fm = content.match(/^---\n([\s\S]*?)\n---\n/);
    const meta = {};
    if (fm) {
      fm[1].split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) meta[match[1]] = match[2].replace(/^"(.*)"$/, '$1');
      });
    }
    return {
      file,
      title: meta.title || file,
      date: meta.pubDate || '',
      desc: (meta.description || '').substring(0, 120),
    };
  }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  res.json(posts);
});

// ============ API: 获取单篇文章 ============
app.get('/api/posts/:file', (req, res) => {
  const fp = path.join(__dirname, 'src', 'content', 'blog', req.params.file);
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Not found' });
  const content = fs.readFileSync(fp, 'utf-8');
  res.json({ content, file: req.params.file });
});

// ============ API: 保存文章 ============
app.post('/api/posts/:file', (req, res) => {
  const fp = path.join(__dirname, 'src', 'content', 'blog', req.params.file);
  fs.writeFileSync(fp, req.body.content, 'utf-8');
  res.json({ success: true });
});

// ============ API: 新建文章 ============
app.post('/api/posts', (req, res) => {
  const { title, slug } = req.body;
  if (!slug) return res.status(400).json({ error: 'slug required' });
  const now = new Date().toISOString().split('.')[0] + '+08:00';
  const content = '---\n' +
    'title: "' + (title || slug) + '"\n' +
    'description: ""\n' +
    'pubDate: ' + now + '\n' +
    'author: "BOZE CNC Ti"\n' +
    'category: ""\n' +
    'tags: []\n' +
    'coverImage: ""\n' +
    'featured: false\n' +
    '---\n\n' +
    '# ' + (title || slug) + '\n\n' +
    '在此处开始撰写内容...\n';
  const fp = path.join(__dirname, 'src', 'content', 'blog', slug + '.md');
  if (fs.existsSync(fp)) return res.status(409).json({ error: 'File exists' });
  fs.writeFileSync(fp, content, 'utf-8');
  res.json({ success: true, file: slug + '.md' });
});

// ============ API: 一键部署 ============
app.post('/api/deploy', (req, res) => {
  try {
    execSync('npx astro build 2>&1 && node scripts/deploy.js', {
      cwd: __dirname, stdio: 'pipe', timeout: 120000,
    });
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false, error: (e.stderr || e.message).toString() });
  }
});

// ============ Admin 前端页面 ============
const html = fs.readFileSync(path.join(__dirname, 'cms-server.html'), 'utf-8');
app.get('/', (req, res) => res.send(html));

app.listen(PORT, () => {
  console.log('');
  console.log('===============================');
  console.log('  BOZE 博客管理后台');
  console.log('===============================');
  console.log('  打开: http://localhost:' + PORT);
  console.log('');
  console.log('  写文章 -> 保存 -> 发布到线上');
  console.log('  或手动: npm run deploy');
  console.log('');
  console.log('  本服务仅限本地，不影响线上网站');
  console.log('===============================');
  console.log('');
});