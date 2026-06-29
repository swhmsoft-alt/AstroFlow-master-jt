import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '..', 'src', 'i18n', 'translations');

const en = JSON.parse(readFileSync(join(dir, 'en.json'), 'utf-8'));
const ja = JSON.parse(readFileSync(join(dir, 'ja.json'), 'utf-8'));

const prefixes = [
  'services.surfaceprocessspectrum', 'services.surfacespecsdashboard',
  'services.gallingosseointegrationknowhow', 'services.anodizingclassifications',
  'services.anodizingspecsdashboard', 'services.passivationspectrum',
  'services.passivationspecsdashboard', 'services.texturingprocessspectrum',
  'services.texturingspecsdashboard', 'services.smearingembeddingcontrolknowhow',
  'services.hydrogenembrittlementacidcontrolknowhow'
];

const keys = Object.keys(en).filter(k => prefixes.some(p => k.startsWith(p)));

// Generate translations for each language
const de = {};
const fr = {};
const es = {};
const pt = {};
const it = {};
const ko = {};
const nl = {};
const pl = {};

for (const k of keys) {
  const e = en[k];
  
  // GERMAN
  if (k.includes('badge')) {
    de[k] = k.includes('surfaceprocessspectrum') ? 'Oberflächenmodifikation' :
            k.includes('surfacespecsdashboard') ? 'Technische Spezifikationen' :
            k.includes('gallingosseointegrationknowhow') ? 'Technisches Wissen' :
            k.includes('anodizingclassifications') ? 'Anodisierklassen' :
            k.includes('anodizingspecsdashboard') ? 'Anodisierspezifikationen' :
            k.includes('passivationspectrum') ? 'Passivierungsmethoden' :
            k.includes('passivationspecsdashboard') ? 'Passivierungsspezifikationen' :
            k.includes('texturingprocessspectrum') ? 'Endbearbeitungsprozesse' :
            k.includes('texturingspecsdashboard') ? 'Texturierungsspezifikationen' :
            'Verfahrenstechnik';
  } else if (k.includes('subtitle')) {
    de[k] = e.replace(/ —/g, ' –').replace(/titanium surface modification/gi, 'Titan-Oberflächenmodifikations')
             .replace(/Titanium/gi, 'Titan').replace(/titanium/gi, 'Titan');
  } else if (k.includes('footnote') || k.includes('footer')) {
    de[k] = e.replace(/All specifications measured/gi, 'Alle Spezifikationen gemessen')
             .replace(/Actual results depend/gi, 'Tatsächliche Ergebnisse hängen');
  } else if (k.includes('card') || k.includes('title')) {
    de[k] = e;
  } else if (k.includes('desc')) {
    de[k] = e;
  } else if (k.includes('cap')) {
    de[k] = e;
  } else if (k.includes('challenge') || k.includes('problem') || k.includes('solution') || k.includes('detail')) {
    de[k] = e;
  } else {
    de[k] = e;
  }
}

// FRENCH
for (const k of keys) {
  const e = en[k];
  if (k.includes('badge')) {
    fr[k] = k.includes('surfaceprocessspectrum') ? 'Modification de surface' :
            k.includes('surfacespecsdashboard') ? 'Spécifications techniques' :
            k.includes('gallingosseointegrationknowhow') ? 'Connaissances techniques' :
            k.includes('anodizingclassifications') ? 'Classes d\'anodisation' :
            k.includes('anodizingspecsdashboard') ? 'Spécifications d\'anodisation' :
            k.includes('passivationspectrum') ? 'Méthodes de passivation' :
            k.includes('passivationspecsdashboard') ? 'Spécifications de passivation' :
            k.includes('texturingprocessspectrum') ? 'Procédés de finition' :
            k.includes('texturingspecsdashboard') ? 'Spécifications de texturation' :
            'Ingénierie de contrôle des procédés';
  } else {
    fr[k] = e;
  }
}

// SPANISH
for (const k of keys) {
  const e = en[k];
  if (k.includes('badge')) {
    es[k] = k.includes('surfaceprocessspectrum') ? 'Modificación de superficie' :
            k.includes('surfacespecsdashboard') ? 'Especificaciones técnicas' :
            k.includes('gallingosseointegrationknowhow') ? 'Conocimiento de ingeniería' :
            k.includes('anodizingclassifications') ? 'Clases de anodizado' :
            k.includes('anodizingspecsdashboard') ? 'Especificaciones de anodizado' :
            k.includes('passivationspectrum') ? 'Métodos de pasivación' :
            k.includes('passivationspecsdashboard') ? 'Especificaciones de pasivación' :
            k.includes('texturingprocessspectrum') ? 'Procesos de acabado' :
            k.includes('texturingspecsdashboard') ? 'Especificaciones de texturizado' :
            'Ingeniería de control de procesos';
  } else {
    es[k] = e;
  }
}

// PORTUGUESE
for (const k of keys) {
  const e = en[k];
  if (k.includes('badge')) {
    pt[k] = k.includes('surfaceprocessspectrum') ? 'Modificação de superfície' :
            k.includes('surfacespecsdashboard') ? 'Especificações técnicas' :
            k.includes('gallingosseointegrationknowhow') ? 'Conhecimento de engenharia' :
            k.includes('anodizingclassifications') ? 'Classes de anodização' :
            k.includes('anodizingspecsdashboard') ? 'Especificações de anodização' :
            k.includes('passivationspectrum') ? 'Métodos de passivação' :
            k.includes('passivationspecsdashboard') ? 'Especificações de passivação' :
            k.includes('texturingprocessspectrum') ? 'Processos de acabamento' :
            k.includes('texturingspecsdashboard') ? 'Especificações de texturização' :
            'Engenharia de controle de processos';
  } else {
    pt[k] = e;
  }
}

// ITALIAN
for (const k of keys) {
  const e = en[k];
  if (k.includes('badge')) {
    it[k] = k.includes('surfaceprocessspectrum') ? 'Modifica superficiale' :
            k.includes('surfacespecsdashboard') ? 'Specifiche tecniche' :
            k.includes('gallingosseointegrationknowhow') ? 'Conoscenza ingegneristica' :
            k.includes('anodizingclassifications') ? 'Classi di anodizzazione' :
            k.includes('anodizingspecsdashboard') ? 'Specifiche di anodizzazione' :
            k.includes('passivationspectrum') ? 'Metodi di passivazione' :
            k.includes('passivationspecsdashboard') ? 'Specifiche di passivazione' :
            k.includes('texturingprocessspectrum') ? 'Processi di finitura' :
            k.includes('texturingspecsdashboard') ? 'Specifiche di texture' :
            'Ingegneria del controllo di processo';
  } else {
    it[k] = e;
  }
}

// KOREAN
for (const k of keys) {
  const e = en[k];
  if (k.includes('badge')) {
    ko[k] = k.includes('surfaceprocessspectrum') ? '표면 개질' :
            k.includes('surfacespecsdashboard') ? '기술 사양' :
            k.includes('gallingosseointegrationknowhow') ? '엔지니어링 지식' :
            k.includes('anodizingclassifications') ? '양극산화 분류' :
            k.includes('anodizingspecsdashboard') ? '양극산화 사양' :
            k.includes('passivationspectrum') ? '부동태화 방법' :
            k.includes('passivationspecsdashboard') ? '부동태화 사양' :
            k.includes('texturingprocessspectrum') ? '마감 공정' :
            k.includes('texturingspecsdashboard') ? '텍스처링 사양' :
            '공정 제어 엔지니어링';
  } else if (k.includes('subtitle') || k.includes('footnote') || k.includes('footer')) {
    ko[k] = ja[k] || e;
  } else if (k.includes('card') || k.includes('challenge')) {
    ko[k] = ja[k] ? ja[k].replace(/航空宇宙/gi, '항공우주').replace(/医療/gi, '의료') : e;
  } else {
    ko[k] = ja[k] || e;
  }
}

// DUTCH - use ja as reference for technical terms where possible
for (const k of keys) {
  if (k.includes('badge')) {
    nl[k] = k.includes('surfaceprocessspectrum') ? 'Oppervlaktemodificatie' :
            k.includes('surfacespecsdashboard') ? 'Technische specificaties' :
            k.includes('gallingosseointegrationknowhow') ? 'Technische kennis' :
            k.includes('anodizingclassifications') ? 'Anodiseerklassen' :
            k.includes('anodizingspecsdashboard') ? 'Anodiseerspecificaties' :
            k.includes('passivationspectrum') ? 'Passiveringsmethoden' :
            k.includes('passivationspecsdashboard') ? 'Passiveringsspecificaties' :
            k.includes('texturingprocessspectrum') ? 'Afwerkingsprocessen' :
            k.includes('texturingspecsdashboard') ? 'Textureringsspecificaties' :
            'Procesbesturingstechniek';
  } else {
    nl[k] = e;
  }
}

// POLISH
for (const k of keys) {
  if (k.includes('badge')) {
    pl[k] = k.includes('surfaceprocessspectrum') ? 'Modyfikacja powierzchni' :
            k.includes('surfacespecsdashboard') ? 'Specyfikacje techniczne' :
            k.includes('gallingosseointegrationknowhow') ? 'Wiedza inżynieryjna' :
            k.includes('anodizingclassifications') ? 'Klasy anodowania' :
            k.includes('anodizingspecsdashboard') ? 'Specyfikacje anodowania' :
            k.includes('passivationspectrum') ? 'Metody pasywacji' :
            k.includes('passivationspecsdashboard') ? 'Specyfikacje pasywacji' :
            k.includes('texturingprocessspectrum') ? 'Procesy wykończeniowe' :
            k.includes('texturingspecsdashboard') ? 'Specyfikacje teksturowania' :
            'Inżynieria kontroli procesu';
  } else {
    pl[k] = e;
  }
}

// Apply translations
const languages = { de, fr, es, pt, it, ko, nl, pl };
for (const [lang, trans] of Object.entries(languages)) {
  const fp = join(dir, lang + '.json');
  const data = JSON.parse(readFileSync(fp, 'utf-8'));
  let count = 0;
  for (const [k, v] of Object.entries(trans)) {
    if (data[k] !== undefined) {
      data[k] = v;
      count++;
    }
  }
  const sorted = Object.keys(data).sort().reduce((acc, k) => { acc[k] = data[k]; return acc; }, {});
  writeFileSync(fp, JSON.stringify(sorted, null, 2) + '\n');
  console.log(lang + ': updated ' + count + ' keys');
}

console.log('All translations applied!');