import fs from 'fs';
const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';

const en = JSON.parse(fs.readFileSync(DIR+'/en.json','utf8'));
const ja = JSON.parse(fs.readFileSync(DIR+'/ja.json','utf8'));
const keys = Object.keys(en).filter(k => k.startsWith('industries.') && !k.includes('.page.'));
const toTranslate = {};
keys.forEach(k => { if(!ja[k]||ja[k]===en[k]) toTranslate[k]=en[k]; });
const list = Object.keys(toTranslate);
console.log('Untranslated industry keys in ja.json:', list.length);
// Just first 5 to test
const test = {}; list.slice(0,5).forEach(k => { test[k]=toTranslate[k]; });
const r = await fetch('https://api.deepseek.com/v1/chat/completions',{
  method:'POST',
  headers:{'Content-Type':'application/json','Authorization':'Bearer '+KEY},
  body:JSON.stringify({
    model:'deepseek-chat',
    messages:[{role:'system',content:'Professional Japanese (JIS) translator for titanium manufacturing. 敬語使用。Keep standards: AS9100D, ASTM, CMM, GD&T, MPa, µm, Grade 5, Ti-6Al-4V as-is. Return ONLY valid JSON.'},{role:'user',content:JSON.stringify(test,null,2)}],
    temperature:0.1
  })
});
const d = await r.json();
const t = JSON.parse(d.choices[0].message.content.replace(/```json\s*/gi,'').replace(/```/g,''));
Object.assign(ja,t);
const s={};Object.keys(ja).sort().forEach(k=>{s[k]=ja[k]});
fs.writeFileSync(DIR+'/ja.json',JSON.stringify(s,null,2)+'\n','utf8');
console.log('Translated 5 keys to Japanese:');
Object.entries(t).forEach(([k,v])=>console.log(' '+k.split('.').slice(-2).join('.')+': '+v));
