import http from 'http';

const BASE = 'http://localhost:4322';

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(path, BASE);
    const opts = { method, hostname: u.hostname, port: u.port, path: u.pathname };
    if (body) { opts.headers = { 'Content-Type': 'application/json' }; }
    const r = http.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function main() {
  console.log('--- Test Create ---');
  try {
    const c = await req('POST', '/api/posts', { title: 'Test123', slug: 'test-123' });
    console.log('Create result:', JSON.stringify(c));
  } catch(e) { console.log('Create error:', e.message); }

  console.log('--- Test Save ---');
  try {
    const s = await req('POST', '/api/posts/test-123.md', { content: '---\ntitle: "Test123"\npubDate: 2026-06-13\ndescription: "test"\nauthor: "BOZE CNC Ti"\n---\n\nHello World' });
    console.log('Save result:', JSON.stringify(s));
  } catch(e) { console.log('Save error:', e.message); }

  console.log('--- Test Load ---');
  try {
    const l = await req('GET', '/api/posts/test-123.md');
    console.log('Load result (first 100 chars):', l.content?.substring(0, 100));
  } catch(e) { console.log('Load error:', e.message); }

  console.log('--- Test Deploy ---');
  try {
    const d = await req('POST', '/api/deploy');
    console.log('Deploy result:', JSON.stringify(d));
  } catch(e) { console.log('Deploy error:', e.message); }
}

main();
</write_to_file>