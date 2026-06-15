import http from 'http';

const BASE = 'http://localhost:4322';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const opts = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + (path.includes('?') ? '' : url.search),
      headers: body ? { 'Content-Type': 'application/json' } : {},
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('=== 1. List posts ===');
  const posts = await request('GET', '/api/posts');
  console.log(JSON.stringify(posts, null, 2));

  console.log('\n=== 2. Create a new post ===');
  try {
    const createResult = await request('POST', '/api/posts', { title: 'Debug Test', slug: 'debug-test' });
    console.log(JSON.stringify(createResult, null, 2));

    console.log('\n=== 3. Save to the new post ===');
    const saveResult = await request('POST', '/api/posts/debug-test.md', {
      content: '---\ntitle: "Debug Test"\ndescription: "Testing"\npubDate: 2026-06-13\nauthor: "BOZE CNC Ti"\ncategory: "Test"\ntags: []\ncoverImage: ""\nfeatured: false\n---\n\n# Debug Test\n\nThis is a test.'
    });
    console.log(JSON.stringify(saveResult, null, 2));

    console.log('\n=== 4. Load the post back ===');
    const loaded = await request('GET', '/api/posts/debug-test.md');
    console.log(loaded.content?.substring(0, 100) || 'No content');

    console.log('\n=== 5. Test deploy ===');
    console.log('(Skipping deploy to avoid FTP issues)');
  
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();