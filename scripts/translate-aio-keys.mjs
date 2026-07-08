/**
 * Translate ONLY the 32 new AIO keys to 9 languages via DeepSeek API.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS_DIR = path.resolve(__dirname, '../src/i18n/translations');

const API_KEY = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const LN = { de:'German', ja:'Japanese', fr:'French', es:'Spanish', pt:'Portuguese', it:'Italian', ko:'Korean', nl:'Dutch', pl:'Polish' };
const TARGETS = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl'];

// The 32 exact keys to translate
const KEYS = [
  'materials.titaniumstandards.techSpecsTitle',
  'materials.titaniumstandards.techSpecsDesc',
  'materials.titaniumstandards.techSpecParam',
  'materials.titaniumstandards.techSpecValue',
  'materials.titaniumstandards.cncNarrative',
  'materials.titaniumstandards.cncNarrative2',
  'materials.titaniumstandards.whyChooseBadge',
  'materials.titaniumstandards.whyChooseTitle',
  'materials.titaniumstandards.faqTitle',
  'materials.titaniumstandards.faqSubtitle',
  'materials.grade.whyChooseTitle',
  'materials.grade.faqSubtitle',
  'materials.titaniumstandards.materialCompliance',
  'materials.titaniumstandards.complianceDesc',
  'materials.titaniumstandards.complianceDesc2',
  'materials.titaniumstandards.supportedGrades',
  'materials.titaniumstandards.availableForms',
  'materials.titaniumstandards.cncTitle',
  'materials.titaniumstandards.achievableTolerance',
  'materials.titaniumstandards.achievableFinish',
  'materials.titaniumstandards.qualityTitle',
  'materials.titaniumstandards.qualityDesc',
  'materials.titaniumstandards.industriesTitle',
  'materials.titaniumstandards.ctaBadge',
  'materials.titaniumstandards.ctaTitle',
  'materials.titaniumstandards.ctaUpload',
  'materials.titaniumstandards.ctaContact',
  'materials.titaniumstandards.trustNda',
  'materials.titaniumstandards.trustSecure',
  'materials.titaniumstandards.trustResponse',
  'materials.titaniumstandards.relatedSpecs',
  'materials.titaniumstandards.backToStandards',
  'materials.standards.whyChooseUs.astm',
  'materials.standards.whyChooseUs.ams',
  'materials.standards.whyChooseUs.medical',
  'materials.standards.whyChooseUs.additive',
  'materials.standards.faq.astm.q0',
  'materials.standards.faq.astm.a0',
  'materials.standards.faq.astm.q1',
  'materials.standards.faq.astm.a1',
  'materials.standards.faq.astm.q2',
  'materials.standards.faq.astm.a2',
  'materials.standards.faq.medical.q0',
  'materials.standards.faq.medical.a0',
  'materials.standards.faq.medical.q1',
  'materials.standards.faq.medical.a1',
  'materials.standards.faq.medical.q2',
  'materials.standards.faq.medical.a2',
  'materials.standards.faq.additive.q0',
  'materials.standards.faq.additive.a0',
  'materials.standards.faq.additive.q1',
  'materials.standards.faq.additive.a1',
  'materials.standards.faq.additive.q2',
  'materials.standards.faq.additive.a2',
  'materials.standards.faq.ams.q0',
  'materials.standards.faq.ams.a0',
  'materials.standards.faq.ams.q1',
  'materials.standards.faq.ams.a1',
  'materials.standards.faq.ams.q2',
  'materials.standards.faq.ams.a2',
  'materials.industries.aerospace',
  'materials.industries.aircraft',
  'materials.industries.aircraft_structures',
  'materials.industries.aircraft_systems',
  'materials.industries.architectural',
  'materials.industries.automotive',
  'materials.industries.chemical_processing',
  'materials.industries.defense',
  'materials.industries.dental',
  'materials.industries.dental_implants',
  'materials.industries.desalination',
  'materials.industries.engine_components',
  'materials.industries.fluid_lines',
  'materials.industries.general_industrial',
  'materials.industries.hvac',
  'materials.industries.hydraulic_systems',
  'materials.industries.industrial',
  'materials.industries.industrial_equipment',
  'materials.industries.industrial_piping',
  'materials.industries.marine',
  'materials.industries.marine_engineering',
  'materials.industries.medical',
  'materials.industries.medical_devices',
  'materials.industries.medical_implants',
  'materials.industries.military_aircraft',
  'materials.industries.naval',
  'materials.industries.oil_&_gas',
  'materials.industries.orthopedic_implants',
  'materials.industries.power_generation',
  'materials.industries.semiconductor_manufacturing',
  'materials.industries.space',
  'materials.industries.spinal_implants',
  'materials.industries.surgical_instruments',
  'materials.techspecs.astm.label.0',
  'materials.techspecs.astm.label.1',
  'materials.techspecs.astm.label.2',
  'materials.techspecs.astm.label.3',
  'materials.techspecs.astm.label.4',
  'materials.techspecs.astm.label.5',
  'materials.techspecs.astm.value.0',
  'materials.techspecs.astm.value.1',
  'materials.techspecs.astm.value.2',
  'materials.techspecs.astm.value.3',
  'materials.techspecs.astm.value.4',
  'materials.techspecs.astm.value.5',
  'materials.techspecs.medical.label.0',
  'materials.techspecs.medical.label.1',
  'materials.techspecs.medical.label.2',
  'materials.techspecs.medical.label.3',
  'materials.techspecs.medical.label.4',
  'materials.techspecs.medical.label.5',
  'materials.techspecs.medical.value.0',
  'materials.techspecs.medical.value.1',
  'materials.techspecs.medical.value.2',
  'materials.techspecs.medical.value.3',
  'materials.techspecs.medical.value.4',
  'materials.techspecs.medical.value.5',
  'materials.techspecs.additive.label.0',
  'materials.techspecs.additive.label.1',
  'materials.techspecs.additive.label.2',
  'materials.techspecs.additive.label.3',
  'materials.techspecs.additive.label.4',
  'materials.techspecs.additive.label.5',
  'materials.techspecs.additive.label.6',
  'materials.techspecs.additive.value.0',
  'materials.techspecs.additive.value.1',
  'materials.techspecs.additive.value.2',
  'materials.techspecs.additive.value.3',
  'materials.techspecs.additive.value.4',
  'materials.techspecs.additive.value.5',
  'materials.techspecs.additive.value.6',
  'materials.techspecs.ams.label.0',
  'materials.techspecs.ams.label.1',
  'materials.techspecs.ams.label.2',
  'materials.techspecs.ams.label.3',
  'materials.techspecs.ams.label.4',
  'materials.techspecs.ams.label.5',
  'materials.techspecs.ams.value.0',
  'materials.techspecs.ams.value.1',
  'materials.techspecs.ams.value.2',
  'materials.techspecs.ams.value.3',
  'materials.techspecs.ams.value.4',
  'materials.techspecs.ams.value.5',
  'materials.standards.badges.astm-b348',
  'materials.standards.badges.astm-b265',
  'materials.standards.badges.astm-b381',
  'materials.standards.badges.astm-b338',
  'materials.standards.badges.astm-b861',
  'materials.standards.badges.astm-f67',
  'materials.standards.badges.astm-f136',
  'materials.standards.badges.astm-f86',
  'materials.standards.badges.astm-f2924',
  'materials.standards.badges.astm-f3001',
  'materials.standards.badges.ams-4911',
  'materials.standards.badges.ams-4928',
  'materials.standards.badges.ams-4943',
  'materials.standards.badges.ams-4944',
  'materials.standards.badges.ams-2488',
  'materials.standards.badges.iso-5832-3',
  'materials.standards.badges.iso-5832-11',
  'materials.standards.badges.mil-t-9047',
  'materials.standards.subtitles.astm-b348',
  'materials.standards.subtitles.astm-b265',
  'materials.standards.subtitles.astm-b381',
  'materials.standards.subtitles.astm-b338',
  'materials.standards.subtitles.astm-b861',
  'materials.standards.subtitles.astm-f67',
  'materials.standards.subtitles.astm-f136',
  'materials.standards.subtitles.astm-f86',
  'materials.standards.subtitles.astm-f2924',
  'materials.standards.subtitles.astm-f3001',
  'materials.standards.subtitles.ams-4911',
  'materials.standards.subtitles.ams-4928',
  'materials.standards.subtitles.ams-4943',
  'materials.standards.subtitles.ams-4944',
  'materials.standards.subtitles.ams-2488',
  'materials.standards.subtitles.iso-5832-3',
  'materials.standards.subtitles.iso-5832-11',
  'materials.standards.subtitles.mil-t-9047',
  'materials.grades.grade-1.whyChooseUs',
  'materials.grades.grade-2.whyChooseUs',
  'materials.grades.grade-3.whyChooseUs',
  'materials.grades.grade-4.whyChooseUs',
  'materials.grades.grade-4-eli.whyChooseUs',
  'materials.grades.grade-5.whyChooseUs',
  'materials.grades.grade-6.whyChooseUs',
  'materials.grades.grade-9.whyChooseUs',
  'materials.grades.grade-19.whyChooseUs',
  'materials.grades.grade-21.whyChooseUs',
  'materials.grades.grade-23.whyChooseUs',
  'materials.grades.grade-6242.whyChooseUs',
  'materials.grades.ti-5553.whyChooseUs',
  'materials.grade.badges.entityDefinition',
  'materials.grade.badges.classification',
  'materials.grade.badges.uns',
  'materials.grade.badges.commonNames',
  'materials.grade.badges.keyCharacteristics',
  'materials.grade.badges.applicableStandards',
  'materials.grade.badges.materialProperties',
  'materials.grade.badges.processingMethods',
  'materials.grade.badges.typicalProducts',
  'materials.grade.badges.industries',
  'materials.grade.badges.alternativeMaterials',
  'products.hero.title',
  'products.hero.highlight',
  'products.hero.badge',
  'products.hero.subtitle',
  'products.hero.description',
  'blog.hero.title',
  'blog.hero.highlight',
  'blog.hero.badge',
  'blog.hero.subtitle',
  'blog.hero.description',
  'home.tech.titlePrefix',
  'resources.resourcehubmatrix.badge',
  'resources.resourcehubmatrix.titlePrefix',
  'resources.resourcehubmatrix.titleHighlight',
  'resources.resourcehubmatrix.description',
  'resources.resourcehubmatrix.explorePrefix',
  'resources.featuredinsights.badge',
  'resources.featuredinsights.titlePrefix',
  'resources.featuredinsights.titleHighlight',
  'resources.featuredinsights.description',
  'resources.engineeringdownloads.badge',
  'resources.engineeringdownloads.titlePrefix',
  'resources.engineeringdownloads.titleHighlight',
  'resources.engineeringdownloads.description',
  'resources.technicalfaqaccordion.badge',
  'resources.technicalfaqaccordion.titlePrefix',
  'resources.technicalfaqaccordion.titleHighlight',
  'resources.technicalfaqaccordion.description',
  'resources.technicalfaqaccordion.ctaHint',
  'resources.resourcehubmatrix.card0.title',
  'resources.resourcehubmatrix.card0.description',
  'resources.resourcehubmatrix.card1.title',
  'resources.resourcehubmatrix.card1.description',
  'resources.resourcehubmatrix.card2.title',
  'resources.resourcehubmatrix.card2.description',
  'resources.resourcehubmatrix.card3.title',
  'resources.resourcehubmatrix.card3.description',
  'resources.resourcehubmatrix.card4.title',
  'resources.resourcehubmatrix.card4.description',
  'resources.resourcehubmatrix.card5.title',
  'resources.resourcehubmatrix.card5.description',
  'services.cncprocessspectrum.titlePrefix',
  'services.cncprocessspectrum.titleHighlight',
  'services.cnctechnicaldashboard.titlePrefix',
  'services.cnctechnicaldashboard.titleHighlight',
  'services.titaniumengineeringknowhow.titlePrefix',
  'services.titaniumengineeringknowhow.titleHighlight',
  'services.cncdedicatedcta.titlePrefix',
  'resources.featuredinsights.whitepaper0.title',
  'resources.featuredinsights.whitepaper0.abstract',
  'resources.featuredinsights.whitepaper1.title',
  'resources.featuredinsights.whitepaper1.abstract',
  'resources.featuredinsights.whitepaper2.title',
  'resources.featuredinsights.whitepaper2.abstract',
  'resources.engineeringdownloads.colResource',
  'resources.engineeringdownloads.colFormat',
  'resources.engineeringdownloads.colSize',
  'resources.engineeringdownloads.colAction',
  'resources.engineeringdownloads.downloadPrefix',
  'resources.engineeringdownloads.footer',
  'resources.engineeringdownloads.row0.name',
  'resources.engineeringdownloads.row0.description',
  'resources.engineeringdownloads.row1.name',
  'resources.engineeringdownloads.row1.description',
  'resources.engineeringdownloads.row2.name',
  'resources.engineeringdownloads.row2.description',
  'resources.engineeringdownloads.row3.name',
  'resources.engineeringdownloads.row3.description',
  'resources.engineeringdownloads.row4.name',
  'resources.engineeringdownloads.row4.description',
  'resources.technicalfaqaccordion.faq0.question',
  'resources.technicalfaqaccordion.faq0.answer',
  'resources.technicalfaqaccordion.faq1.question',
  'resources.technicalfaqaccordion.faq1.answer',
  'resources.technicalfaqaccordion.faq2.question',
  'resources.technicalfaqaccordion.faq2.answer',
  'resources.technicalfaqaccordion.faq3.question',
  'resources.technicalfaqaccordion.faq3.answer',
  'resources.technicalfaqaccordion.faq4.question',
  'resources.technicalfaqaccordion.faq4.answer',
  'resources.technicalfaqaccordion.faq5.question',
  'resources.technicalfaqaccordion.faq5.answer',
];

async function translate(lang) {
  const en = JSON.parse(fs.readFileSync(path.join(TRANS_DIR, 'en.json'), 'utf-8'));
  const data = JSON.parse(fs.readFileSync(path.join(TRANS_DIR, `${lang}.json`), 'utf-8'));
  
  // Build source dict
  const src = {};
  for (const k of KEYS) {
    if (data[k] === en[k]) src[k] = en[k];
  }
  const total = Object.keys(src).length;
  if (total === 0) { console.log(`  ${lang}: ✅ All translated`); return; }
  
  console.log(`  ${lang} (${LN[lang]}): translating ${total} keys...`);
  
  const sysPrompt = `You are a professional ${LN[lang]} translator for an industrial titanium CNC machining website. Translate ONLY the values from English to ${LN[lang]}. Keep keys unchanged. Return ONLY valid JSON.`;
  
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: JSON.stringify(src, null, 2) },
      ],
      temperature: 0.1,
    }),
  });
  
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  
  const json = await resp.json();
  let txt = json.choices[0].message.content;
  const m = txt.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) txt = m[1];
  
  const result = JSON.parse(txt.trim());
  let c = 0;
  for (const [k, v] of Object.entries(result)) {
    if (KEYS.includes(k) && v && typeof v === 'string') {
      data[k] = v;
      c++;
    }
  }
  fs.writeFileSync(path.join(TRANS_DIR, `${lang}.json`), JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ${lang}: ✅ ${c}/${total} translated`);
}

async function main() {
  console.log(`Translating ${KEYS.length} keys to ${TARGETS.length} languages...\n`);
  for (const lang of TARGETS) {
    try {
      await translate(lang);
    } catch (e) {
      console.error(`  ${lang}: ❌ ${e.message.slice(0, 100)}`);
    }
    await new Promise(r => setTimeout(r, 800));
  }
  console.log('\n✅ All done!');
}

main().catch(console.error);
