const fs=require('fs'); 
const path=require('path'); 
const e={}; 
fs.readFileSync('.env.production','utf8').split('\n').forEach(l=>{const t=l.trim();if(!t||t.startsWith('#')||!t.includes('='))return;const i=t.indexOf('=');e[t.slice(0,i).trim()]=t.slice(i+1).trim()}); 
const H=e.PRODUCTION_FTP_HOST,U=e.PRODUCTION_FTP_USER,PW=e.PRODUCTION_FTP_PASSWORD,R=(e.PRODUCTION_SERVER_PATH||"/").replace(/\/+$/,"");
const D=path.resolve("dist"),MF=path.join(D,".deploy-manifest.json");
console.log("Scanning...");const lf=[];
(function sc(d,b){fs.readdirSync(d,{withFileTypes:true}).forEach(i=>{const f=path.join(d,i.name),n=b?b+"/"+i.name:i.name;if(i.isDirectory())sc(f,n);else if(i.isFile()&&i.name!==".deploy-manifest.json"){const s=fs.statSync(f);lf.push({path:n.replace(/\\/g,"/"),size:s.size,mtime:s.mtimeMs})}})})(D,"");
console.log("  "+lf.length+" files");
let om={};try{if(fs.existsSync(MF))om=JSON.parse(fs.readFileSync(MF,"utf8"))}catch(e){}
console.log("  Manifest: "+Object.keys(om).length+" files");
const ch=lf.filter(f=>{const o=om[f.path];return!o||o.size!==f.size||Math.abs(o.mtime-f.mtime)>1000});
console.log("  Changed: "+ch.length);
if(ch.length===0){console.log("No changes.");process.exit(0)}
let bat="@echo off\r\n";
ch.forEach(f=>{const lp=path.join(D,f.path).replace(/\\/g,"/");let url="ftp://"+H+R+"/"+f.path;url=url.replace(/([^:])\/+/g,"$1/");bat+="curl -T \""+lp+"\" \""+url+"\" --user \""+U+":"+PW+"\" --ftp-create-dirs -s -o nul --\r\n"});
bat+="echo Done.\r\n";
const bp=path.resolve("temp/deploy-incremental.bat");
fs.writeFileSync(bp,bat,"ascii");
console.log("Batch: "+bp);
const nm={};lf.forEach(f=>{nm[f.path]={size:f.size,mtime:f.mtime}});
fs.writeFileSync(MF,JSON.stringify(nm,null,2),"utf8");
console.log("Manifest saved. Run: temp\\deploy-incremental.bat");
