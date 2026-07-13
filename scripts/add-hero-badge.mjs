// add-hero-badge.mjs - Add home.hero.badge key to en/ru/ar.json
import fs from 'fs';
const dir = 'src/i18n/translations';
const data = {
  en: 'Industry-Leading Solutions | AS9100D Certified',
  ru: 'Передовые решения | Сертифицировано AS9100D',
  ar: 'حلول رائدة في الصناعة | معتمدة AS9100D'
};
for (const lang of ['en', 'ru', 'ar']) {
  const j = JSON.parse(fs.readFileSync(`${dir}/${lang}.json`, 'utf-8'));
  j['home.hero.badge'] = data[lang];
  fs.writeFileSync(`${dir}/${lang}.json`, JSON.stringify(j, null, 2), 'utf-8');
  console.log(`Added home.hero.badge to ${lang}.json`);
}
