import fs from 'fs';
const DIR = 'c:/Users/Administrator/Desktop/AstroFlow-master-jt/src/i18n/translations';
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const en = JSON.parse(fs.readFileSync(DIR+'/en.json','utf8'));
const code = process.argv[2] || 'ko';
const target = JSON.parse(fs.readFileSync(DIR+'/'+code+'.json','utf8'));
const allKeys = Object.keys(en).filter(k=>k.startsWith('industries.')&&!k.includes('.page.'));
const todo = {};
for(const k of allKeys){if(!target[k]||target[k]===en[k])todo[k]=en[k]}
const keys=Object.keys(todo);
if(keys.length===0){console.log(code+': nothing to translate');process.exit(0)}
console.log(code+': '+keys.length+' pending, translating first 5...');
const batch={};keys.slice(0,5).forEach(k=>{batch[k]=todo[k]});
const resp = await fetch('https://api.deepseek.com/v1/chat/completions',{
  method:'POST',
  headers:{'Content-Type':'application/json','Authorization':'Bearer '+KEY},
  body:JSON.stringify({model:'deepseek-chat',messages:[{role:'system',content:'Professional translator. Keep standards as-is. Return ONLY valid JSON.'},{role:'user',content:JSON.stringify(batch,null,2)}],temperature:0.1})
});
const d=await resp.json();
const t=JSON.parse(d.choices[0].message.content.replace(/```json\s*/gi,'').replace(/```/g,'').trim());
let n=0;Object.entries(t).forEach(([k,v])=>{if(v&&v!==en[k]){target[k]=v;n++}});
const s={};Object.keys(target).sort().forEach(k=>{s[k]=target[k]});
fs.writeFileSync(DIR+'/'+code+'.json',JSON.stringify(s,null,2)+'\n','utf8');
console.log(code+': translated '+n+' (first batch). Run again for more.');
