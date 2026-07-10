const fs = require('fs');
let c = fs.readFileSync('src/components/capabilities/CapacityPage.astro', 'utf-8');
const q = "'";
const L = 'capabilities.capacity.faq.';

// FAQ Q1
c = c.replace('What is your maximum monthly output capacity for titanium CNC machined parts?', "{t('"+L+"q1')}");
// FAQ Q2
c = c.replace('How do you manage lead times for urgent or expedited titanium production orders?', "{t('"+L+"q2')}");
// FAQ Q3
c = c.replace('Can BOZE handle both prototype R&amp;D and mass production under one roof?', "{t('"+L+"q3')}");
// FAQ Q4
c = c.replace('How do you guarantee raw material supply stability for long-term production programs?', "{t('"+L+"q4')}");

// FAQ A1 - replace entire <p> block
let idx = c.indexOf('<strong style="color: var(--theme-text)">{t('cap.capacitypage.badge30')}</strong>');
let start = c.lastIndexOf('<p', idx);
let end = c.indexOf('</p>', idx) + 4;
c = c.substring(0, start) + '<p class="text-sm leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 55%, transparent);">\n          {t(\'' + L + 'a1\')}\n        </p>' + c.substring(end);

// FAQ A2 - replace entire <p> block
idx = c.indexOf('We maintain');
start = c.lastIndexOf('<p', idx);
end = c.indexOf('</p>', idx) + 4;
c = c.substring(0, start) + '<p class="text-sm leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 55%, transparent);">\n          {t(\'' + L + 'a2\')}\n        </p>' + c.substring(end);

// FAQ A3 - replace entire <p> block
idx = c.indexOf('Yes. Our production scaling matrix');
start = c.lastIndexOf('<p', idx);
end = c.indexOf('</p>', idx) + 4;
c = c.substring(0, start) + '<p class="text-sm leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 55%, transparent);">\n          {t(\'' + L + 'a3\')}\n        </p>' + c.substring(end);

// FAQ A4 - replace entire <p> block
idx = c.indexOf('Through three coordinated strategies');
start = c.lastIndexOf('<p', idx);
end = c.indexOf('</p>', idx) + 4;
c = c.substring(0, start) + '<p class="text-sm leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 55%, transparent);">\n          {t(\'' + L + 'a4\')}\n        </p>' + c.substring(end);

fs.writeFileSync('src/components/capabilities/CapacityPage.astro', c);
console.log('All FAQ Q&A replaced successfully');
