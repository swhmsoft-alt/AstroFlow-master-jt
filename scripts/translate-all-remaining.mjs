/**
 * 批量翻译剩余语言 — 按您的规范
 * 运行方式: node scripts/translate-all-remaining.mjs
 * 会逐个处理语言，每批15条，写入磁盘
 */
import fs from 'fs';

const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const URL = 'https://api.deepseek.com/v1/chat/completions';

const LANGS = {
  ko: { name: 'Korean', std: 'KS', tone: 'Formal business 존댓말' },
  nl: { name: 'Dutch', std: 'NEN', tone: 'Corporate B2B' },
  pl: { name: 'Polish', std: 'PN', tone: 'Corporate B2B' },
  ru: { name: 'Russian', std: 'GOST', tone: 'Formal technical' },
  ar: { name: 'Arabic', std: 'SASO', tone: 'Formal MSA (فصحى), RTL' },
};

const en = JSON.parse(fs.readFileSync(`${DIR}/en.json`, 'utf8'));

async function translate(code, info) {
  const target = JSON.parse(fs.readFileSync(`${DIR}/${code}.json`, 'utf8'));
  const allKeys = Object.keys(en).filter(k => k.startsWith('industries.') && !k.includes('.page.'));
  const todo = {};
  for (const k of allKeys) {
    if (!target[k] || target[k] === en[k]) todo[k] = en[k];
  }
  
  const keys = Object.keys(todo);
  console.log(`[${code}] ${info.name} — ${keys.length} to translate`);
  
  let total = 0;
  for (let i = 0; i < keys.length; i += 15) {
    const batch = keys.slice(i, i + 15);
    const batchObj = {};
    for (const k of batch) batchObj[k] = todo[k];
    
    try {
      const resp = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `Professional ${info.name} (${info.std}) industrial translator for titanium manufacturing. ${info.tone}. Keep standard names (AS9100D, ASTM, CMM, GD&T, EN 10204, ISO, Grade 5, etc.) EXACTLY as-is. Return ONLY valid JSON. No markdown.` },
            { role: 'user', content: JSON.stringify(batchObj, null, 2) }
          ],
          temperature: 0.1,
          max_tokens: 4096
        })
      });
      
      const data = await resp.json();
      const raw = data.choices?.[0]?.message?.content || '{}';
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleaned);
      
      let batchDone = 0;
      for (const [k, v] of Object.entries(result)) {
        if (v && typeof v === 'string' && v.length > 0 && v !== en[k]) {
          target[k] = v;
          batchDone++;
          total++;
        }
      }
      console.log(`  ${code} batch ${Math.floor(i/15)+1}: ${batchDone} done`);
      
      // Save after each batch
      const sorted = {};
      Object.keys(target).sort().forEach(k => { sorted[k] = target[k]; });
      fs.writeFileSync(`${DIR}/${code}.json`, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
      
    } catch (e) {
      console.error(`  ${code} batch ${Math.floor(i/15)+1} FAILED: ${e.message}`);
    }
    
    if (i + 15 < keys.length) await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`[${code}] ✅ ${total} translated`);
}

// Process all remaining languages
const targetLang = process.argv[2];
if (targetLang && LANGS[targetLang]) {
  await translate(targetLang, LANGS[targetLang]);
} else {
  for (const [code, info] of Object.entries(LANGS)) {
    await translate(code, info);
  }
}
console.log('\n🎉 All translations complete!');
