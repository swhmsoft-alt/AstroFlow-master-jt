import fs from 'fs';

// Fix wrong implLabel keys in Lightweight and Kinetic components
const fixes = [
  {
    file: 'src/components/industries/uav-drones/UavLightweightSection.astro',
    wrong: "industries.uav.impact.card1.implLabel",
    correct: "industries.uav.lightweight.card1.implLabel",
    // Also add t() for card titles/desc/items that are still English
    h3cards: {
      'Thin-Wall Gimbal Mount Milling': 'industries.uav.lightweight.card1.title',
      'High-Vibration Structural Rigidity': 'industries.uav.lightweight.card2.title',
    },
    subtitles: {
      '5-Axis CNC · 0.5 mm Walls · 35% Weight Reduction': 'industries.uav.lightweight.card1.subtitle',
      'FEA-Optimized · Grade 5 Ti-6Al-4V': 'industries.uav.lightweight.card2.subtitle',
    },
    cardDescs: {
      'Our 5-axis machining centers produce drone gimbal mounts and camera enclosures with wall thicknesses down to 0.5 mm, achieving over 35% weight reduction versus conventionally machined components. Adaptive trochoidal tool paths eliminate deflection on thin-wall sections.': 'industries.uav.lightweight.card1.desc',
      'Thin-wall titanium components are FEA-optimized to maintain resonance-free performance across the operational vibration spectrum of UAV flight. Unlike aluminum or carbon fiber, titanium&#39;s damping characteristics naturally attenuate high-frequency vibrations.': 'industries.uav.lightweight.card2.desc',
    }
  },
  {
    file: 'src/components/industries/uav-drones/UavKineticSection.astro',
    wrong: "industries.uav.impact.card1.implLabel",
    correct: "industries.uav.kinetic.card1.implLabel",
    h3cards: {
      'Rotor Hub &amp; Shaft Connector Turning': 'industries.uav.kinetic.card1.title',
      'Dynamic Balancing &amp; Resonance Elimination': 'industries.uav.kinetic.card2.title',
    },
    subtitles: {
      'Multi-Tasking CNC · Grade 5 Ti · ±0.005 mm Concentricity': 'industries.uav.kinetic.card1.subtitle',
      'Concentricity ±0.005mm · ISO 1940 G2.5': 'industries.uav.kinetic.card2.subtitle',
    },
    cardDescs: {
      'UAV rotor hubs and motor shaft connectors operate at extreme rotational speeds where even micron-level asymmetry causes destructive vibration. Our multi-tasking CNC lathes produce these Grade 5 Titanium components in single-setup operations — turning, boring, threading, and milling all features relative to a single rotational axis to guarantee absolute concentricity.': 'industries.uav.kinetic.card1.desc',
      'Eliminating mechanical resonance begins with absolute geometric precision. Our multi-tasking turning process holds concentricity and cylindricity tolerances that eliminate mechanical resonance at the source — preventing bearing wear, reducing noise signature, and extending motor life in military and industrial drones.': 'industries.uav.kinetic.card2.desc',
    }
  },
];

for (const fix of fixes) {
  let c = fs.readFileSync(fix.file, 'utf8');
  
  // Fix wrong key
  c = c.replace(new RegExp(fix.wrong, 'g'), fix.correct);
  
  // Replace h3 card titles
  for (const [text, key] of Object.entries(fix.h3cards)) {
    const regex = new RegExp('>' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<\\/h3>', 'g');
    c = c.replace(regex, `>{t('${key}')}</h3>`);
  }
  
  // Replace subtitles
  for (const [text, key] of Object.entries(fix.subtitles)) {
    const regex = new RegExp('>' + text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<\\/span>', 'g');
    c = c.replace(regex, `>{t('${key}')}</span>`);
  }
  
  // Replace card descriptions - first ~80 chars to identify unique match
  for (const [text, key] of Object.entries(fix.cardDescs)) {
    const shortMatch = text.substring(0, 60);
    if (c.includes(shortMatch)) {
      c = c.replace(text, `{t('${key}')}`);
    }
  }
  
  fs.writeFileSync(fix.file, c, 'utf8');
  console.log(fix.file.split('/').pop() + ': fixed');
}

console.log('Done');
