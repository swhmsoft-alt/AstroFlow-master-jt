import https from 'https';

const pages = [
  '/',
  '/titanium-surface-treatment/',
  '/titanium-surface-treatment/anodizing/',
  '/titanium-cnc-machining-services/',
  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
  '/titanium-additive-manufacturing/',
  '/titanium-additive-manufacturing/3d-printing-slm/',
  '/titanium-fabrication-services/',
  '/titanium-fabrication-services/laser-cutting/',
  '/titanium-forming-heavy-manufacturing/',
  '/titanium-forming-heavy-manufacturing/titanium-forging/',
  '/branded-custom-packaging-services/',
  '/laser-marking-custom-logo/',
];

let completed = 0;
const total = pages.length;

pages.forEach((path) => {
  const url = `https://cnc.bozemetal.com${path}`;
  https.get(url, { timeout: 15000 }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      completed++;
      const status = res.statusCode;
      const htmlStart = data.substring(0, 200).replace(/\n/g, ' ');
      console.log(`${status === 200 ? '✅' : '❌'} ${status} ${path} (${data.length}b) ${htmlStart.substring(0, 80)}`);
      if (completed === total) {
        console.log(`\n📊 Checked ${total} pages`);
      }
    });
  }).on('error', (err) => {
    completed++;
    console.log(`❌ ERROR ${path}: ${err.message}`);
    if (completed === total) {
      console.log(`\n📊 Checked ${total} pages`);
    }
  });
});