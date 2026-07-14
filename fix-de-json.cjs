const fs = require('fs');
const path = 'src/i18n/translations/de.json';
let c = fs.readFileSync(path, 'utf8');

// The issue: there are strings like "value?,\r\n  "nextkey"
// where the closing " before the comma was lost due to corruption.
// Pattern to fix: a string value ending with ? followed by ,\r\n  "key
// We need to add a " before the comma

let fixCount = 0;

// Fix: Pattern is "... ?,\r\n  \"" (value ending with ? then comma+newline+spaces+quote for next key)
// We need to change to "... ?",\r\n  \"" (adding missing closing quote before comma)
// But we need to be careful not to break already-valid entries.

// Strategy: Find lines that are JSON key:value pairs where the value 
// appears to have no closing quote.
// Pattern: "key": "value?,\n  "nextkey" (the ? before ,\n indicates missing closing ")
// We should look for: ?\n or ?\r\n without a preceding closing "

// Find all instances of "?\r\n" or "?\n" inside what should be a JSON object
const regex = /(\u201E|\u201C|: ")([^"]*?)\u003F\r\n/g;
// This is too complex. Let me just fix the specific remaining errors by iterating.

let iterations = 0;
while (iterations < 20) {
  iterations++;
  try {
    JSON.parse(c);
    console.log('JSON VALID after', iterations, 'iterations');
    break;
  } catch(e) {
    const msg = e.message;
    const posMatch = msg.match(/position (\d+)/);
    if (!posMatch) break;
    const pos = parseInt(posMatch[1]);
    
    // Check if this is a missing closing quote before comma+newline
    // The error is a "Bad control character" which means \r or \n is inside a string
    // This happens when the closing " is missing before ,\r\n
    
    // Walk backwards from the error position to find the start of the string value
    // Find the opening " of the string value
    let valueStart = c.lastIndexOf('": "', pos);
    if (valueStart < 0) {
      valueStart = c.lastIndexOf('": \u201C', pos); // try fancy quote
    }
    
    if (valueStart >= 0) {
      valueStart += 4; // skip past '": "'
      
      // Now find the next ,\r\n or ,\n after the error position
      const commaPos = c.indexOf(',', pos);
      const nlAfterComma = c.indexOf('\n', commaPos);
      
      // The value starts at valueStart and should end at some "
      // Check if there's a " between valueStart and the ,
      const quoteBeforeComma = c.lastIndexOf('"', commaPos - 1);
      
      if (quoteBeforeComma < valueStart) {
        // No closing quote between value start and comma - insert one
        // Insert " before the comma
        c = c.substring(0, commaPos) + '"' + c.substring(commaPos);
        console.log(`Fix ${iterations}: Inserted " at position ${commaPos}`);
        fixCount++;
        continue;
      }
    }
    
    // If we can't fix intelligently, look for the bad control char
    const badChar = c[pos];
    if (badChar && (badChar < ' ' && badChar !== '\t' && badChar !== '\n' && badChar !== '\r')) {
      console.log(`Removing control char 0x${badChar.charCodeAt(0).toString(16)} at ${pos}`);
      c = c.substring(0, pos) + c.substring(pos + 1);
      fixCount++;
      continue;
    }
    
    // Check if there's a raw \n inside a string (unescaped newline)
    // This means there's no closing " before a ,\r\n
    // Look backwards for the most recent : " to find the value start
    const beforePos = c.substring(0, pos);
    const lastColon = beforePos.lastIndexOf('": "');
    if (lastColon >= 0) {
      const afterColon = lastColon + 4;
      const contentBetween = c.substring(afterColon, pos);
      // If there's no " in contentBetween, then this is an unclosed string
      if (!contentBetween.includes('"')) {
        // Find the ,\r\n or ,\n after pos
        const comma = c.indexOf(',', pos);
        const newline = c.indexOf('\n', pos);
        if (comma >= 0 && (newline < 0 || comma < newline)) {
          // Check if there's already a " before the comma
          const lastQuote = c.lastIndexOf('"', comma - 1);
          if (lastQuote < afterColon) {
            c = c.substring(0, comma) + '"' + c.substring(comma);
            console.log(`Fix ${iterations}: Inserted " at position ${comma}`);
            fixCount++;
            continue;
          }
        }
      }
    }
    
    console.log(`Cannot fix iteration ${iterations}: ${msg.substring(0,200)}`);
    break;
  }
}

console.log(`Total fixes: ${fixCount}`);
fs.writeFileSync(path, c, 'utf8');
console.log('Done');
