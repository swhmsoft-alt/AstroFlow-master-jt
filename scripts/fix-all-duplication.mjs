/**
 * Fix all duplication issues in one pass using index-based manipulation.
 * This avoids all CRLF/regex matching problems.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = join(__dirname, '..', 'src', 'pages', 'products', 'product-entities', '[...slug].astro');
let c = readFileSync(templatePath, 'utf-8');
const eol = c.includes('\r\n') ? '\r\n' : '\n';

// Function to find exact index of a substring (case-sensitive, trimmed)
function findAfter(startFrom, text, afterChars) {
  // Skip 'afterChars' characters from startFrom
  let searchFrom = startFrom + afterChars;
  if (searchFrom >= c.length) return -1;
  
  // Now search for the specific markers we need
  return searchFrom;
}

// ===================================================================
// Strategy: Remove duplicate sections by finding their exact positions
// and wrapping them in {!specEntry && (...) } conditionals.
// 
// Sections to hide when specEntry exists:
// A) "Why Titanium" paragraph (lines 127-136 area)
// B) Manufacturing Process + Inspection + Surface Treatment (lines 156-200 area)
// C) Original FAQ (lines 168-188 area)
// ===================================================================

// --- Part A: Find and mark "Why Titanium" section ---
// Pattern: `<!-- Why Titanium (product-specific) -->`
const whyTiMarker = '<!-- Why Titanium (product-specific) -->';
const whyTiIdx = c.indexOf(whyTiMarker);
if (whyTiIdx === -1) throw new Error('Could not find Why Titanium marker');

// Find the END of the Why Titanium section - it's the closing </div> before Engineering Challenges
const engChallMarker = '<!-- Engineering Challenges';
const engChallIdx = c.indexOf(engChallMarker, whyTiIdx);
if (engChallIdx === -1) throw new Error('Could not find Engineering Challenges marker');

// The Why Ti section ends with </div> just before Engineering Challenges
// Find the </div> closest before engChallIdx
const endWhyTi = c.lastIndexOf('</div>', engChallIdx);
if (endWhyTi === -1) throw new Error('Could not find Why Ti closing div');

// Insert {!specEntry && ( BEFORE the Why Ti section
// and )} AFTER it (but keeping Engineering Challenges visible)
// The Why Ti is {data.alloyReason && ...} wrapped in a <div>
// We need to wrap ONLY the Why Ti div, not Engineering Challenges.

// Better approach: Find the {data.alloyReason line and wrap from there to the </div> before engChall
const alloyLine = c.indexOf('{data.alloyReason', whyTiIdx);
if (alloyLine === -1) throw new Error('Could not find alloyReason line');

// Build the replacement
const beforeWhyTi = c.substring(0, alloyLine);
const afterWhyTi = c.substring(alloyLine);

// Find the closing of the alloyReason block: it ends with </div>
// But that </div> belongs to the condition. We need to find the </div> that closes the
// <div> that contains {data.alloyReason && (...)}

// Actually, the structure is:
// {data.alloyReason && (
//   <div>
//     <h2>Why Titanium</h2>
//     <p>{data.alloyReason}</p>
//     <a href={materialLink}>Full specs →</a>
//   </div>
// )}

// The closing </div> and )) are at specific positions. Let me find them by looking for the pattern
// after alloyLine. The first `)` after the alloy block's last </div> is the close of the && expression.

// Let me find the material link anchor to locate the end of the block
const matLinkMarker = 'Full Ti-';
const matLinkIdx = c.indexOf('Full', alloyLine);
if (matLinkIdx === -1) throw new Error('Could not find material link');

// After the material link, there's </div>${eol}        )}
// Then ${eol}${eol}          <!-- Engineering Challenges -->
// So we wrap from alloyLine to the }) after </div>

const closeDivAfterMatLink = c.indexOf('</div>', matLinkIdx);
const afterCloseDiv = closeDivAfterMatLink + 6; // length of '</div>'
const closeParen = c.indexOf(')}', afterCloseDiv);
if (closeParen === -1) throw new Error('Could not find closing paren for Why Ti');

const afterCloseParen = closeParen + 2; // length of ')}'

// Build new content: wrap the Why Ti section
const beforeWrap = c.substring(0, alloyLine);
const wrapContent = c.substring(alloyLine, afterCloseParen);
const afterWrap = c.substring(afterCloseParen);

const newSectionA = beforeWrap + '{!specEntry && (' + wrapContent + ')}' + afterWrap;

// Now update c and continue
c = newSectionA;

// --- Part B: Wrap Manufacturing Process + Inspection + Surface Treatment ---
// Find the Manufacturing Process marker
const procMarker = '<!-- Process (product-specific) -->';
const procIdx = c.indexOf(procMarker);
if (procIdx === -1) throw new Error('Could not find Process marker');

// Find the start of the process rendering: {data.process && ...}
const procRender = c.indexOf('{data.process', procIdx);
if (procRender === -1) throw new Error('Could not find process render start');

// Find where the Surface Treatment section ends (before SECTION 3 FAQ)
const faqSection = '<!-- ── SECTION 3: FAQ';
const faqIdx = c.indexOf(faqSection, procRender);
if (faqIdx === -1) throw new Error('Could not find FAQ section');

// Go back from faqIdx to find the last ')}' which closes the surface treatment block
// The block structure ends with: multiple </div> + )} + newlines
// Let me search backward from faqIdx for ')}'
const closeSurfaceTreatment = c.lastIndexOf(')}', faqIdx);
// But this might find the wrong )} - let me find the )} closest to faqIdx
// Actually, let me search backward more carefully

// The surface treatment structure ends with:
//       )}  ← close of .map
//     </div>  ← close of <div> container
//   )}  ← close of {data.surfaceTreatment && (...) }
// </div> ← close of grid column
// </div> ← close of grid
// </div> ← close of container
// </section> ← close of section

// Then: <!-- ── SECTION 3: FAQ
// So I need to find the )} that closes the {data.surfaceTreatment && (...)} block

let searchStart = faqIdx - 500;
if (searchStart < 0) searchStart = 0;
const sectionBefore = c.substring(searchStart, faqIdx);

// Find the last occurrence of ')}' within sectionBefore that represents the end of surface treatment
// This is tricky. Let me look for a specific pattern.
// The surface treatment ends with: </div>${eol}          )}
// Where )} closes the {data.surfaceTreatment && ( ... )} expression

// Search for the pattern: </div>${eol}          )}
const endOfSurfaceTreatment = sectionBefore.lastIndexOf(')}');
if (endOfSurfaceTreatment === -1) throw new Error('Could not find end of surface treatment');

const absoluteEnd = searchStart + endOfSurfaceTreatment + 2; // +2 for ')}'

// Now we know the range: procRender to absoluteEnd
// Insert {!specEntry && ( at procRender and )} at absoluteEnd
const beforeProc = c.substring(0, procRender);
const procContent = c.substring(procRender, absoluteEnd);
const afterProc = c.substring(absoluteEnd);

c = beforeProc + '{!specEntry && (' + procContent + ')}' + afterProc;

// --- Part C: Wrap original FAQ ---
// Now the FAQ section position has shifted because we inserted text
// Find it again
const faqIdx2 = c.indexOf('<!-- ── SECTION 3: FAQ');
if (faqIdx2 === -1) throw new Error('Could not find FAQ section after process wrap');

// Find the end of FAQ section - before SECTION 4
const section4 = '<!-- ── SECTION 4: Shared Knowledge Links';
const section4Idx = c.indexOf(section4, faqIdx2);
if (section4Idx === -1) throw new Error('Could not find Section 4');

// Wrap the entire FAQ section (from faqIdx2 to section4Idx)
const beforeFaq = c.substring(0, faqIdx2);
const faqContent = c.substring(faqIdx2, section4Idx);
const afterFaq = c.substring(section4Idx);

c = beforeFaq + '{!specEntry && (' + faqContent + ')}' + afterFaq;

// ===================================================================
// Write the fixed template
// ===================================================================
writeFileSync(templatePath, c, 'utf-8');
console.log('All duplication fixes applied successfully.');
console.log('Template size:', c.length, 'bytes');
