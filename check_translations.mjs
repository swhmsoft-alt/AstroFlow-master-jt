// 翻译检查脚本 — 用于检测任何语言文件中仍为英语的行业相关条目
// 用法: node check_translations.mjs
// 注意: 标准名称 (AS9100D / NADCAP 等) 和同形词 (Industrial/Naval)
//       会显示为 "untranslated" 但实际上是正确的，需要人工判断
import fs from 'fs';
const en = JSON.parse(fs.readFileSync('src/i18n/translations/en.json', 'utf8'));
const langs = ['de','ja','fr','es','pt','it','ko','nl','pl','ru','ar'];
const keys = Object.keys(en).filter(k => k.includes('industries.'));
let allOk = true;
for (const l of langs) {
  const f = JSON.parse(fs.readFileSync(`src/i18n/translations/${l}.json`, 'utf8'));
  let cnt = 0;
  for (const k of keys) { 
    if (f[k] && f[k] === en[k] && f[k].length > 3) { 
      cnt++; 
      console.log(`  ${l}: ${k} = "${f[k].substring(0,80)}"`); 
    } 
  }
  if (cnt) { allOk = false; console.log(`${l}: ${cnt} potential untranslated`); }
}
if (allOk) console.log('ALL 12 LANGUAGES: 0 potential untranslated industry keys ✅');
else console.log('\nNOTE: Some may be false positives (standard names, loan words)');
