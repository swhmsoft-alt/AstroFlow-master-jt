import fs from 'fs';

// Fix all remaining hardcoded text in UAV components
const REPLACEMENTS = {
  // Lightweight - card titles, desc, items
  'Thin-Wall Gimbal Mount Milling': "{t('industries.uav.lightweight.card1.title')}",
  '5-Axis CNC · 0.5 mm Walls · 35% Weight Reduction': "{t('industries.uav.lightweight.card1.subtitle')}",
  'Our 5-axis machining centers produce drone gimbal mounts and camera enclosures with wall thicknesses down to 0.5 mm': "{t('industries.uav.lightweight.card1.desc')}",
  'High-Vibration Structural Rigidity': "{t('industries.uav.lightweight.card2.title')}",
  'FEA-Optimized · Grade 5 Ti-6Al-4V': "{t('industries.uav.lightweight.card2.subtitle')}",
  'Thin-wall titanium components are FEA-optimized to maintain resonance-free performance across the operational vibration spectrum of UAV flight': "{t('industries.uav.lightweight.card2.desc')}",
  'Technical Implementation': "{t('industries.uav.lightweight.card1.implLabel')}",
  '5-Axis CNC Milling</span>': "5-Axis CNC Milling</span>",
  'Grade 5 Ti-6Al-4V</span>': "Grade 5 Ti-6Al-4V</span>",
  'Gimbal Mounts</span>': "Gimbal Mounts</span>",
  'LiDAR Enclosures</span>': "LiDAR Enclosures</span>",
  'Thin-Wall 0.5mm</span>': "Thin-Wall 0.5mm</span>",
};

const files = [
  'src/components/industries/uav-drones/UavLightweightSection.astro',
  'src/components/industries/uav-drones/UavKineticSection.astro',
  'src/components/industries/uav-drones/UavImpactSection.astro',
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  let changes = 0;
  
  // All entity chips (e.g. "5-Axis CNC Milling</span>" → t('...'))
  const chipMap = {
    '5-Axis CNC Milling': 'industries.uav.lightweight.entity.0',
    'Grade 5 Ti-6Al-4V': 'industries.uav.lightweight.entity.1',
    'Gimbal Mounts': 'industries.uav.lightweight.entity.2',
    'LiDAR Enclosures': 'industries.uav.lightweight.entity.3',
    'Thin-Wall 0.5mm': 'industries.uav.lightweight.entity.4',
    'Multi-Tasking CNC Turning': 'industries.uav.kinetic.entity.0',
    'Structural Rotor Hubs': 'industries.uav.kinetic.entity.1',
    'Motor Shaft Connectors': 'industries.uav.kinetic.entity.2',
    'Dynamic Balancing': 'industries.uav.kinetic.entity.3',
    'ISO 1940 G2.5': 'industries.uav.kinetic.entity.4',
    'Impact Resistance': 'industries.uav.impact.entity.0',
    'Fracture Toughness': 'industries.uav.impact.entity.1',
    'vs. Al 7075': 'industries.uav.impact.entity.3',
    'vs. Carbon Fiber': 'industries.uav.impact.entity.4',
  };
  
  // Replace entity chips in content
  for (const [chip, key] of Object.entries(chipMap)) {
    // Match: `>chip</span>` → `>{t('key')}</span>`
    const regex = new RegExp('>' + chip.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<\\/span>', 'g');
    const replacement = '>{t(\'' + key + '\')}</span>';
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changes++;
    }
  }
  
  // Replace "Entity Cluster:" with t('...entityLabel')
  const entityLabelMatch = content.match(/<span class="font-semibold"[^>]*>Entity Cluster:<\/span>/);
  if (entityLabelMatch) {
    const section = f.includes('lightweight') ? 'lightweight' : f.includes('kinetic') ? 'kinetic' : 'impact';
    content = content.replace(
      entityLabelMatch[0],
      `<span class="font-semibold" style="color: var(--theme-primary);">{t('industries.uav.${section}.entityLabel')}:</span>`
    );
    changes++;
  }
  
  // Replace "Technical Implementation" labels
  const implMatch = content.match(/>Technical Implementation</g);
  if (implMatch) {
    const section = f.includes('lightweight') ? 'lightweight' : f.includes('kinetic') ? 'kinetic' : 'impact';
    content = content.replace(/>Technical Implementation</g, `>{t('industries.uav.${section}.card1.implLabel')}<`);
    changes++;
  }
  
  if (changes > 0) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`${f.split('/').pop()}: ${changes} replacements`);
  }
}
console.log('Done');
