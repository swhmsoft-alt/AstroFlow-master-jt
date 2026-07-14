import fs from 'fs';

/**
 * UAV 组件完整 i18n 化 — 替换所有残留的硬编码英语为 t() 调用
 * 日语翻译已全部就绪（102 keys 中 96 已翻译，6 标准名保持原文）
 */
const FILES = {
  // Lightweight 组件 — 替换 2 个卡片的全部文本
  'src/components/industries/uav-drones/UavLightweightSection.astro': [
    // Card 1 h3
    {from: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">Thin-Wall Gimbal Mount Milling</h3>',
     to: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">{t(\'industries.uav.lightweight.card1.title\')}</h3>'},
    // Card 1 subtitle  
    {from: '<span class="text-sm font-medium" style="color: var(--theme-primary);">5-Axis CNC · 0.5 mm Walls · 35% Weight Reduction</span>',
     to: '<span class="text-sm font-medium" style="color: var(--theme-primary);">{t(\'industries.uav.lightweight.card1.subtitle\')}</span>'},
    // Card 1 desc
    {from: 'Our 5-axis machining centers produce drone gimbal mounts and camera enclosures with wall thicknesses down to 0.5 mm, achieving over 35% weight reduction versus conventionally machined components. Adaptive trochoidal tool paths eliminate deflection on thin-wall sections.',
     to: '{t(\'industries.uav.lightweight.card1.desc\')}'},
    // Card 1 item 1
    {from: 'Adaptive trochoidal tool paths suppress regenerative chatter on thin-wall Ti-6Al-4V sections',
     to: '{t(\'industries.uav.lightweight.card1.item1\')}'},
    // Card 1 item 2
    {from: 'Single-setup machining of complex gimbal geometries — eliminates re-clamping distortion on thin frames',
     to: '{t(\'industries.uav.lightweight.card1.item2\')}'},
    // Card 1 item 3
    {from: 'Thin-wall pocketing to 0.5 mm wall thickness — reduces gimbal weight by 35%+ without compromising rigidity',
     to: '{t(\'industries.uav.lightweight.card1.item3\')}'},
    // Card 2 h3
    {from: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">Gimbal Mounts &amp; Sensor Enclosures</h3>',
     to: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">{t(\'industries.uav.lightweight.card2.title\')}</h3>'},
    // Card 2 subtitle
    {from: '<span class="text-sm font-medium" style="color: var(--theme-primary);">LiDAR Housing · Camera Gimbals · Payload Chassis</span>',
     to: '<span class="text-sm font-medium" style="color: var(--theme-primary);">{t(\'industries.uav.lightweight.card2.subtitle\')}</span>'},
    // Card 2 desc — first match
    {from: 'Drone gimbal mounts and LiDAR sensor enclosures must maintain absolute geometric stability under continuous vibration and thermal cycling.',
     to: '{t(\'industries.uav.lightweight.card2.desc\')}'},
    // Card 2 item 1
    {from: 'Titanium gimbal brackets with integrated optical-axis alignment features — ±0.01 mm positional accuracy',
     to: '{t(\'industries.uav.lightweight.card2.item1\')}'},
    // Card 2 item 2
    {from: 'LiDAR enclosure sealing surfaces machined to Ra 0.8 µm — ensures IP67 ingress protection fit',
     to: '{t(\'industries.uav.lightweight.card2.item2\')}'},
    // Card 2 item 3
    {from: 'Vibration-dampening ribbed chassis designs — tuned for specific UAV operating frequencies',
     to: '{t(\'industries.uav.lightweight.card2.item3\')}'},
  ],

  // Kinetic 组件
  'src/components/industries/uav-drones/UavKineticSection.astro': [
    {from: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">Rotor Hub &amp; Shaft Connector Turning</h3>',
     to: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">{t(\'industries.uav.kinetic.card1.title\')}</h3>'},
    {from: '<span class="text-sm font-medium" style="color: var(--theme-primary);">Multi-Tasking CNC · Grade 5 Ti · ±0.005 mm Concentricity</span>',
     to: '<span class="text-sm font-medium" style="color: var(--theme-primary);">{t(\'industries.uav.kinetic.card1.subtitle\')}</span>'},
    {from: 'UAV rotor hubs and motor shaft connectors operate at extreme rotational speeds where even micron-level asymmetry causes destructive vibration.',
     to: '{t(\'industries.uav.kinetic.card1.desc\')}'},
    {from: 'Single-setup turn-bore-thread cycle — all features concentric to rotational axis within ±0.005 mm',
     to: '{t(\'industries.uav.kinetic.card1.item1\')}'},
    {from: 'Cylindrical tolerance held to Grade 5 (IT5) — essential for high-speed bearing fit surfaces',
     to: '{t(\'industries.uav.kinetic.card1.item2\')}'},
    {from: 'Dynamic balancing verification available — G2.5 grade or better per ISO 1940',
     to: '{t(\'industries.uav.kinetic.card1.item3\')}'},
    {from: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">Dynamic Balancing &amp; Resonance Elimination</h3>',
     to: '<h3 class="text-lg font-bold" style="color: var(--theme-text);">{t(\'industries.uav.kinetic.card2.title\')}</h3>'},
    {from: '<span class="text-sm font-medium" style="color: var(--theme-primary);">Concentricity ±0.005mm · ISO 1940 G2.5</span>',
     to: '<span class="text-sm font-medium" style="color: var(--theme-primary);">{t(\'industries.uav.kinetic.card2.subtitle\')}</span>'},
    {from: 'Eliminating mechanical resonance begins with absolute geometric precision.',
     to: '{t(\'industries.uav.kinetic.card2.desc\')}'},
    {from: 'Concentricity ≤ 0.005 mm between bore and shaft diameter — eliminates mass offset at high RPM',
     to: '{t(\'industries.uav.kinetic.card2.item1\')}'},
    {from: 'Grade 5 Ti-6Al-4V provides superior vibration damping vs. aluminum — reduces airframe resonance',
     to: '{t(\'industries.uav.kinetic.card2.item2\')}'},
    {from: '100% CMM dimensional validation per ASME Y14.5 — runout, concentricity, and cylindricity reported',
     to: '{t(\'industries.uav.kinetic.card2.item3\')}'},
  ],

  // Impact 组件
  'src/components/industries/uav-drones/UavImpactSection.astro': [
    {from: '<h3 class="text-lg font-bold mb-3" style="color: var(--theme-text);">Superior to Aluminum 7075</h3>',
     to: '<h3 class="text-lg font-bold mb-3" style="color: var(--theme-text);">{t(\'industries.uav.impact.card1.title\')}</h3>'},
    {from: 'Grade 5 Titanium offers nearly double the strength-to-weight ratio of aluminum 7075-T6',
     to: '{t(\'industries.uav.impact.card1.desc\')}'},
    {from: 'Ti-6Al-4V: 900 MPa tensile vs. Al 7075-T6: 572 MPa — 57% stronger',
     to: '{t(\'industries.uav.impact.card1.item1\')}'},
    {from: 'Fatigue endurance limit: Ti ~500 MPa vs. Al 7075 ~160 MPa — 3x longer service life',
     to: '{t(\'industries.uav.impact.card1.item2\')}'},
    {from: 'Plastic deformation before failure — Titanium bends, aluminum 7075 shatters',
     to: '{t(\'industries.uav.impact.card1.item3\')}'},
    {from: '<h3 class="text-lg font-bold mb-3" style="color: var(--theme-text);">Beyond Carbon Fiber Limitations</h3>',
     to: '<h3 class="text-lg font-bold mb-3" style="color: var(--theme-text);">{t(\'industries.uav.impact.card2.title\')}</h3>'},
    {from: 'Carbon fiber composites offer weight savings but suffer from impact fragility',
     to: '{t(\'industries.uav.impact.card2.desc\')}'},
    {from: 'Impact toughness: Ti absorbs 4-5x more energy before failure than carbon fiber laminate',
     to: '{t(\'industries.uav.impact.card2.item1\')}'},
    {from: 'Zero UV degradation — carbon fiber epoxy matrix embrittles after extended sun exposure',
     to: '{t(\'industries.uav.impact.card2.item2\')}'},
    {from: 'No moisture absorption or galvanic corrosion — unlike carbon fiber / aluminum galvanic couples',
     to: '{t(\'industries.uav.impact.card2.item3\')}'},
    {from: '<h3 class="text-lg font-bold mb-3" style="color: var(--theme-text);">High-G &amp; Extreme Environment</h3>',
     to: '<h3 class="text-lg font-bold mb-3" style="color: var(--theme-text);">{t(\'industries.uav.impact.card3.title\')}</h3>'},
    {from: 'Military and industrial UAVs operate in extreme temperatures, salt spray, and high-vibration environments',
     to: '{t(\'industries.uav.impact.card3.desc\')}'},
    {from: 'Operating range: -269°C to +400°C — no embrittlement or softening in extreme environments',
     to: '{t(\'industries.uav.impact.card3.item1\')}'},
    {from: 'Zero corrosion in salt spray — ideal for maritime drone operations',
     to: '{t(\'industries.uav.impact.card3.item2\')}'},
    {from: 'Non-magnetic — zero interference with compass, GPS, or magnetometer sensors',
     to: '{t(\'industries.uav.impact.card3.item3\')}'},
    // Fix partial desc that was left over
    {from: ' — delivering superior durability over aluminum 7075 and carbon fiber alternatives in military and industrial drone applications.',
     to: ''},
  ],
};

for (const [file, replacements] of Object.entries(FILES)) {
  let c = fs.readFileSync(file, 'utf8');
  let changes = 0;
  for (const {from, to} of replacements) {
    if (c.includes(from)) {
      c = c.replace(from, to);
      changes++;
    }
  }
  fs.writeFileSync(file, c, 'utf8');
  console.log(`${file.split('/').pop()}: ${changes} replacements`);
}

console.log('\n✅ All components updated with t() calls');
