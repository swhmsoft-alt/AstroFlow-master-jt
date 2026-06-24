// 精确查找 de.json 中英德混合条目（如 "Final Qualität Control"）
// 只检测真正混合的条目，忽略纯德语（不含变音的德语词）的误报
import { readFileSync } from 'fs';

const de = JSON.parse(readFileSync('src/i18n/translations/de.json', 'utf-8'));
const en = JSON.parse(readFileSync('src/i18n/translations/en.json', 'utf-8'));

const GERMAN_RE = /[üöäßÜÖÄß]/;

// 常见英语词（只有在和德语变音词相邻时才警告）
const ENGLISH_WORDS = new Set([
  'the', 'and', 'for', 'are', 'has', 'have', 'been', 'that', 'this', 'with',
  'from', 'our', 'your', 'all', 'will', 'can', 'not', 'but', 'its', 'each',
  'their', 'these', 'those', 'about', 'over', 'into', 'more',
  'final', 'control', 'quality', 'process', 'management', 'standard',
  'international', 'incoming', 'solution', 'spectrum', 'dashboard',
  'challenge', 'engineering', 'applications', 'preparation',
  'manufacturing', 'purity', 'mitigation', 'protocols', 'advantages',
  'certified', 'demonstration', 'excellence', 'production', 'machining',
  'fabrication', 'cutting', 'forming', 'finishing', 'treatment',
  'polishing', 'passivation', 'marking', 'packaging', 'branded',
  'custom', 'components', 'industrial', 'additive', 'cnc', 'edm',
  'laser', 'waterjet', 'milling', 'turning', 'grinding', 'welding',
  'assembly', 'extrusion', 'forging', 'anodizing', 'sandblasting',
  'chemical', 'greeting', 'morning', 'afternoon', 'evening',
  'standards', 'system', 'systems', 'plans', 'view', 'service',
  'services', 'parts', 'which', 'define', 'feedback',
  'what', 'when', 'where', 'why', 'how', 'submit', 'upload',
  'get', 'download', 'learn', 'read', 'view', 'show', 'browse',
  'new', 'old', 'top', 'bottom', 'next', 'prev', 'back', 'home',
  'explore', 'discover', 'start', 'stop', 'begin', 'end',
  'need', 'have', 'make', 'take', 'give', 'send', 'receive',
  'your', 'my', 'his', 'her', 'its', 'our', 'their',
  'some', 'any', 'many', 'much', 'few', 'several', 'most',
  'all', 'both', 'each', 'every', 'no', 'none', 'other',
  'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'also', 'well', 'even', 'still', 'already',
  'here', 'there', 'now', 'then', 'always', 'never',
  'often', 'usually', 'sometimes', 'finally', 'first', 'last',
  'because', 'since', 'while', 'though', 'although',
  'however', 'therefore', 'thus', 'hence', 'furthermore',
  'meanwhile', 'nevertheless', 'nonetheless', 'otherwise',
  'besides', 'indeed', 'instead', 'rather', 'quite',
  'pretty', 'fairly', 'highly', 'deeply', 'strongly',
  'significantly', 'substantially', 'dramatically',
  'rapidly', 'quickly', 'slowly', 'gradually',
  'immediately', 'directly', 'indirectly',
  'powered', 'driven', 'based', 'related', 'connected',
  'inspection', 'certified', 'approved', 'tested',
  'track', 'trace', 'check', 'verify', 'validate',
  'ensure', 'assure', 'guarantee', 'warranty',
  'in-house', 'state-of-the-art', 'cutting-edge',
  'high-performance', 'high-quality', 'high-precision',
  'top-of-the-line', 'world-class', 'best-in-class',
  'one-stop', 'turnkey', 'end-to-end',
  'paperless', 'digital', 'automated', 'smart',
  'real-time', 'on-time', 'just-in-time',
  'customer', 'client', 'partner', 'supplier',
  'request', 'inquiry', 'quote', 'quotation',
  'contract', 'agreement', 'order', 'purchase',
  'delivery', 'shipment', 'shipping', 'logistics',
  // 网络/UI 常用英语词
  'email', 'phone', 'fax', 'address', 'website',
  'contact', 'support', 'help', 'faq', 'about',
  'privacy', 'terms', 'conditions', 'policy',
  'login', 'logout', 'signup', 'register',
  'search', 'filter', 'sort', 'menu', 'nav',
  'page', 'pages', 'home', 'dashboard', 'profile',
  'account', 'setting', 'config', 'preference',
  'save', 'cancel', 'close', 'open', 'edit',
  'delete', 'remove', 'add', 'create', 'update',
  'loading', 'error', 'success', 'warning', 'info',
  'yes', 'no', 'ok', 'done', 'ready',
  'continue', 'proceed', 'confirm', 'submit',
  'prev', 'next', 'first', 'last', 'previous',
  'step', 'steps', 'stage', 'phase', 'level',
  'basic', 'advanced', 'expert', 'beginner',
  'simple', 'complex', 'easy', 'hard', 'difficult',
  'full', 'empty', 'complete', 'partial',
  'active', 'inactive', 'enabled', 'disabled',
  'on', 'off', 'auto', 'manual',
  'open', 'closed', 'locked', 'unlocked',
  'free', 'paid', 'premium', 'pro',
  'trial', 'demo', 'sample', 'example',
  'default', 'custom', 'standard', 'premium',
  'minimum', 'maximum', 'average', 'median',
  'total', 'subtotal', 'sum', 'balance',
  'rate', 'price', 'cost', 'fee', 'charge',
  'tax', 'discount', 'coupon', 'voucher',
  'currency', 'dollar', 'euro', 'pound',
  'payment', 'checkout', 'cart', 'wishlist',
  'invoice', 'receipt', 'transaction',
  'refund', 'return', 'exchange', 'cancel',
  'subscription', 'renewal', 'expiry',
  'member', 'membership', 'user', 'admin',
  'moderator', 'editor', 'contributor',
  'author', 'writer', 'publisher',
  'comment', 'review', 'rating', 'feedback',
  'message', 'notification', 'alert',
  'inbox', 'outbox', 'draft', 'sent',
  'attachment', 'file', 'folder', 'document',
  'image', 'photo', 'picture', 'video',
  'audio', 'music', 'media', 'gallery',
  'calendar', 'schedule', 'event', 'meeting',
  'appointment', 'deadline', 'due',
  'reminder', 'task', 'todo', 'checklist',
  'project', 'portfolio', 'resume', 'cv',
  'job', 'career', 'position', 'role',
  'hire', 'apply', 'interview', 'offer',
  'salary', 'benefit', 'bonus', 'commission',
  'team', 'department', 'division', 'branch',
  'office', 'headquarters', 'location',
  'meeting', 'conference', 'seminar', 'workshop',
  'training', 'education', 'course', 'class',
  'certificate', 'diploma', 'degree',
  'skill', 'talent', 'ability', 'expertise',
  'knowledge', 'experience', 'background',
  'summary', 'overview', 'introduction', 'conclusion',
  'feature', 'benefit', 'advantage', 'value',
  'solution', 'service', 'product', 'offer',
  'technology', 'innovation', 'improvement',
  'growth', 'development', 'progress', 'result',
  'goal', 'objective', 'target', 'mission',
  'vision', 'strategy', 'plan', 'initiative',
  'success', 'achievement', 'milestone',
  'challenge', 'problem', 'issue', 'concern',
  'risk', 'opportunity', 'threat', 'weakness',
  'strength', 'advantage', 'benefit',
  'analysis', 'assessment', 'evaluation',
  'report', 'study', 'research', 'survey',
  'data', 'information', 'insight', 'intelligence',
  'metric', 'measure', 'indicator', 'kpi',
  'performance', 'efficiency', 'productivity',
  'quality', 'reliability', 'durability',
  'safety', 'security', 'compliance',
  'standard', 'specification', 'requirement',
  'regulation', 'policy', 'procedure', 'protocol',
  'guideline', 'instruction', 'direction',
  'manual', 'guide', 'handbook', 'reference',
  'documentation', 'literature', 'material',
  'resource', 'tool', 'equipment', 'instrument',
  'machine', 'device', 'apparatus', 'system',
  'software', 'hardware', 'firmware',
  'network', 'server', 'database', 'storage',
  'cloud', 'platform', 'infrastructure',
  'api', 'interface', 'integration', 'portal',
  'web', 'site', 'app', 'application',
  'browser', 'client', 'mobile', 'desktop',
  'responsive', 'adaptive', 'interactive',
  'dynamic', 'static', 'flexible', 'scalable',
  'reliable', 'secure', 'efficient', 'robust',
  'modern', 'innovative', 'advanced', 'sophisticated',
  'comprehensive', 'complete', 'integrated',
  'seamless', 'smooth', 'fast', 'quick',
  'easy', 'simple', 'intuitive', 'user-friendly',
  'dedicated', 'committed', 'focused', 'specialized',
  'experienced', 'professional', 'expert', 'skilled',
  'knowledgeable', 'qualified', 'certified',
  'reliable', 'trusted', 'dependable',
  'responsive', 'attentive', 'caring',
  'global', 'worldwide', 'international', 'local',
  'domestic', 'regional', 'nationwide',
  'industrial', 'commercial', 'residential',
  'private', 'public', 'government', 'military',
  'aerospace', 'automotive', 'medical', 'dental',
  'energy', 'power', 'oil', 'gas', 'mining',
  'construction', 'infrastructure', 'architecture',
  'transportation', 'logistics', 'supply', 'chain',
  'retail', 'wholesale', 'distribution',
  'food', 'beverage', 'agriculture', 'farming',
  'pharmaceutical', 'biotech', 'chemical',
  'electronics', 'semiconductor', 'telecom',
  'defense', 'security', 'safety',
  'environmental', 'sustainable', 'green',
  'education', 'research', 'science', 'technology',
  'finance', 'banking', 'insurance', 'real', 'estate',
  'hospitality', 'tourism', 'travel', 'entertainment',
  'media', 'publishing', 'advertising', 'marketing',
  'consulting', 'legal', 'accounting', 'audit',
  // 品质相关
  'incoming', 'outgoing', 'in-process', 'final',
  'first-article', 'capability', 'capabilities',
  'protocol', 'protocols', 'specification',
  'tolerance', 'tolerances', 'calibration',
  'validation', 'verification', 'qualification',
  'audit', 'auditor', 'certification', 'certificate',
  'compliance', 'conformity', 'non-conformance',
  'corrective', 'preventive', 'action', 'actions',
  'improvement', 'improvements', 'effectiveness',
  'suitability', 'adequacy', 'efficiency',
  'monitoring', 'measurement', 'analysis',
  'traceability', 'identification', 'status',
  'preservation', 'delivery', 'post-delivery',
  'design', 'development', 'production',
  'purchasing', 'procurement', 'supplier',
  'evaluation', 'selection', 're-evaluation',
  'criteria', 'records', 'documented',
  'infrastructure', 'work', 'environment',
  'competence', 'awareness', 'communication',
  'planning', 'operational', 'planning', 'control',
  'determination', 'review', 'requirements',
  'customer-related', 'communication', 'enquiry',
  'contract', 'order', 'amendments',
  'product', 'acceptance', 'release',
  'property', 'belonging', 'customers',
  'post-delivery', 'activities', 'nonconforming',
  'analysis', 'evaluation', 'improvement',
  'correction', 'corrective', 'action',
  'preventive', 'action', 'continual',
  'change', 'changes', 'outsourced',
  'control', 'controlled', 'conditions',
  'identified', 'identifiable', 'unique',
  'preservation', 'handling', 'storage',
  'packaging', 'protection', 'shipping',
  'inspection', 'testing', 'test', 'tests',
  'gage', 'gages', 'gauge', 'gauges',
  'fixture', 'fixtures', 'tooling',
  'master', 'reference', 'standard', 'standards',
  'database', 'log', 'logs', 'report', 'reports',
]);

function isEnglishWord(word) {
  const clean = word.replace(/[.,;:!?()\[\]{}"'«»»–— ]/g, '').toLowerCase();
  if (!clean) return false;
  if (clean.length <= 1) return false;
  // Numbers, symbols, units
  if (/^[0-9+\-./µ≥≤×°%€$#@&±%‰]+$/.test(clean)) return false;
  // German word - has umlaut
  if (GERMAN_RE.test(clean)) return false;
  // Check English word list
  return ENGLISH_WORDS.has(clean);
}

function getWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0);
}

function hasGermanUmlaut(word) {
  return GERMAN_RE.test(word);
}

const mixed = [];

for (const [key, value] of Object.entries(de)) {
  // Skip values identical to English
  if (value === en[key]) continue;

  // Must contain at least one word with German umlaut to be a DE entry
  const words = getWords(value);
  const hasAnyGerman = words.some(w => hasGermanUmlaut(w));
  if (!hasAnyGerman) continue; // Skip pure non-umlaut German - it's valid

  // Now check for mixing: English word adjacent to German word
  let isMixed = false;
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].replace(/[.,;:!?()\[\]{}"'«»»–— ]/g, '');
    const w2 = words[i + 1].replace(/[.,;:!?()\[\]{}"'«»»–— ]/g, '');
    
    // English word next to German word (either direction)
    const g1 = hasGermanUmlaut(w1);
    const g2 = hasGermanUmlaut(w2);
    
    if (g1 !== g2 && isEnglishWord(w1) !== isEnglishWord(w2) && (isEnglishWord(w1) || isEnglishWord(w2))) {
      // Only flag if one side is a known English word and the other has a German umlaut
      if ((g1 && isEnglishWord(w2)) || (g2 && isEnglishWord(w1)) || 
          (isEnglishWord(w1) && g2) || (isEnglishWord(w2) && g1)) {
        isMixed = true;
        break;
      }
    }
  }

  if (isMixed) {
    mixed.push({ key, de: value, en: en[key] });
  }
}

console.log(`\nFound ${mixed.length} truly mixed entries (German umlaut word adjacent to English word):\n`);

// Sort by key for easier reading
mixed.sort((a, b) => a.key.localeCompare(b.key));

for (const item of mixed) {
  console.log(`KEY:   ${item.key}`);
  console.log(`DE:    ${item.de}`);
  console.log(`EN:    ${item.en}`);
  console.log();
}

if (mixed.length === 0) {
  console.log('No mixed entries found! All German translations look clean.');
}