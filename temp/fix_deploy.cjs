const fs = require("fs");
const p = "scripts/deploy-incremental-ftp.js";
let content = fs.readFileSync(p, "utf-8");

const oldUpload = content.match(/for \(const f of toUpload\) \{[^}]+\}[^}]+}/);
if (oldUpload) {
  console.log("Found old upload block");
}

// Replace the entire upload logic to use uploadFromDir
const searchStr = "if (toUpload.length > 0) {";
const idx = content.indexOf(searchStr);
if (idx >= 0) {
  const uploadEnd = content.indexOf("}", idx);
  const nextLine = content.indexOf("}", uploadEnd + 1);
  const replaceBlock = content.substring(idx, nextLine + 1);
  
  const newBlock = `if (toUpload.length > 0) {
      console.log("Uploading " + toUpload.length + " files...");
      await client.uploadFromDir(LOCAL_ROOT);
    }`;
  
  content = content.replace(replaceBlock, newBlock);
  console.log("Replaced upload block");
}

fs.writeFileSync(p, content, "utf-8");
console.log("Done: " + content.length + " bytes");
