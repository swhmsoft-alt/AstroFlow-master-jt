/**
 * Translate inspection page s4/s5 keys to all 9 languages.
 * Usage: node scripts/add-inspection-s45-keys-all.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '../src/i18n/translations');
const KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API = 'https://api.deepseek.com/v1/chat/completions';
const LN = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };

async function tr(texts,lang){const k=Object.keys(texts);const r={};
for(let i=0;i<k.length;i+=5){const b={};for(const x of k.slice(i,i+5))b[x]=texts[x];
const resp=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+KEY},
body:JSON.stringify({model:'deepseek-chat',messages:[{role:'system',content:'Professional '+lang+' translator for industrial content. Return ONLY valid JSON.'},{role:'user',content:'Translate to '+lang+'. Return JSON with SAME keys:\n'+JSON.stringify(b,null,2)}],temperature:0.3})});
const d=await resp.json();const c=d.choices[0].message.content.trim();const m=c.match(/\{[\s\S]*\}/);
if(m)Object.assign(r,JSON.parse(m[0]));}return r;}

async function main(){
  const en=JSON.parse(fs.readFileSync(path.join(DIR,'en.json'),'utf-8'));
  const keys={};for(const[k,v]of Object.entries(en))if(k.startsWith('cap.inspectionpage.s4')||k.startsWith('cap.inspectionpage.s5'))keys[k]=v;
  console.log('📦 '+Object.keys(keys).length+' keys\n');
  for(const[code,name]of Object.entries(LN)){
    const fp=path.join(DIR,code+'.json');const j=JSON.parse(fs.readFileSync(fp,'utf-8'));
    const m={};for(const[k,v]of Object.entries(keys))if(!j[k])m[k]=v;
    if(!Object.keys(m).length){console.log('⏭️ '+code);continue;}
    console.log('🌐 '+code+' ('+name+')...');
    const t=await tr(m,name);let a=0;
    for(const[k,v]of Object.entries(t)){if(!j[k]){j[k]=v;a++;}}
    const s={};for(const k of Object.keys(j).sort())s[k]=j[k];
    fs.writeFileSync(fp,JSON.stringify(s,null,2)+'\n');
    console.log('  ✅ '+a+' keys');}
  console.log('\n🎉 Done!');}
main().catch(e=>console.error('❌ '+e.message));
