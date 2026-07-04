import { GRADE_DATA } from './src/data/titanium-grades.ts';
import { writeFileSync } from 'fs';

const keys = {};
for (const [gk, g] of Object.entries(GRADE_DATA)) {
  const p = 'materials.' + gk;
  const set = (k, v) => { keys[p + '.' + k] = v; };
  set('entity.title', g.entityDefinition.title);
  set('entity.description', g.entityDefinition.description);
  set('entity.classification', g.entityDefinition.classification);
  g.entityDefinition.commonNames.forEach((v,i) => set('entity.commonNames.'+i, v));
  g.entityDefinition.keyCharacteristics.forEach((v,i) => set('entity.keyCharacteristics.'+i, v));
  set('conformsTo.title', g.conformsTo.title);
  set('conformsTo.description', g.conformsTo.description);
  g.conformsTo.items.forEach((v,i) => set('conformsTo.items.'+i, v));
  set('hasProperty.title', g.hasProperty.title);
  set('hasProperty.description', g.hasProperty.description);
  g.hasProperty.properties.forEach((v,i) => set('hasProperty.properties.'+i+'.label', v.label));
  set('processedBy.title', g.processedBy.title);
  set('processedBy.description', g.processedBy.description);
  g.processedBy.items.forEach((v,i) => set('processedBy.items.'+i, v));
  set('manufacturedFrom.title', g.manufacturedFrom.title);
  set('manufacturedFrom.description', g.manufacturedFrom.description);
  g.manufacturedFrom.items.forEach((v,i) => set('manufacturedFrom.items.'+i, v));
  set('usedIn.title', g.usedIn.title);
  set('usedIn.description', g.usedIn.description);
  g.usedIn.items.forEach((v,i) => set('usedIn.items.'+i, v));
  set('alternativeTo.title', g.alternativeTo.title);
  set('alternativeTo.description', g.alternativeTo.description);
  g.alternativeTo.items.forEach((v,i) => set('alternativeTo.items.'+i, v));
}
writeFileSync('src/i18n/translations/grade-keys-en.json', JSON.stringify(keys, null, 2) + '\n', 'utf-8');
console.log('OK: ' + Object.keys(keys).length + ' keys');