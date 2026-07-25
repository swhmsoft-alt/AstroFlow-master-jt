const fs = require('fs');
const path = require('path');
const env = {};
fs.readFileSync('.env.production','utf8').split('\\n').forEach(l=>{const t=l.trim();if(!t||t.startsWith('#')||!t.includes('='))return;const i=t.indexOf('=');env[t.slice(0,i).trim()]=t.slice(i+1).trim()});
const H=env.PRODUCTION_FTP_HOST,U=env.PRODUCTION_FTP_USER,P=env.PRODUCTION_FTP_PASSWORD,R=(env.PRODUCTION_SERVER_PATH||'/').replace(/\\/+$/,'');
const D=path.resolve('dist'),MF=path.join(D,'.deploy-manifest.json');
console.log('Scanning...');const lf=[];
(function sc(d,b){fs.readdirSync(d,{withFileTypes:true}).forEach(i=>{var f=path.join(d,i.name),n=b?b+'/'+i.name:i.name;if(i.isDirectory())sc(f,n);else if(i.isFile()&&i.name!=='.deploy-manifest.json'){var s=fs.statSync(f);lf.push({path:n.replace(/\\\\/g,'/'),size:s.size,mtime:s.mtimeMs})}})})(D,'');
console.log('  '+lf.length+' files');
var om={};try{if(fs.existsSync(MF))om=JSON.parse(fs.readFileSync(MF,'utf8'))}catch(e){}
console.log('  Manifest: '+Object.keys(om).length+' files');
var ch=lf.filter(f=>{var o=om[f.path];return!o||o.size!==f.size||Math.abs(o.mtime-f.mtime)>1000});
console.log('  Changed: '+ch.length);
if(ch.length===0){console.log('No changes.');process.exit(0)}
var bat='@echo off\\r\\n';
ch.forEach(function(f){
  var lp=path.join(D,f.path).replace(/\\\\/g,'/');
  var url='ftp://'+H+R+'/'+f.path;
  url=url.replace(/([^:])\\/+/g,'/');
});
bat+='echo Done.\\r\\n';
var bp=path.resolve('temp/deploy-incremental.bat');
fs.writeFileSync(bp,bat,'ascii');
console.log('Batch: '+bp);
var nm={};lf.forEach(function(f){nm[f.path]={size:f.size,mtime:f.mtime}});
fs.writeFileSync(MF,JSON.stringify(nm,null,2),'utf8');
console.log('Manifest saved. Run: temp\\\\deploy-incremental.bat');
