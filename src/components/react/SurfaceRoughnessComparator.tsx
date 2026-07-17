import { useState } from 'react';
import { Paintbrush, Eye } from 'lucide-react';

interface RoughnessLevel {
  ra: string;
  raMin: number;
  raMax: number;
  rz: string;
  label: string;
  description: string;
  visualBar: number;
  color: string;
  applications: string[];
  achievableBy: string[];
  comparator: string;
}

const levels: RoughnessLevel[] = [
  {
    ra: '0.025', raMin: 0.0125, raMax: 0.05, rz: '0.1 – 0.4',
    label: 'Mirror Finish', visualBar: 5, color: '#22c55e',
    description: 'Polished, reflective surface. Requires lapping or fine polishing.',
    applications: ['Dental implants', 'Femoral heads', 'Optical mirrors', 'Seal faces'],
    achievableBy: ['Polishing', 'Lapping', 'Fine Grinding'],
    comparator: 'Like a high-quality bathroom mirror',
  },
  {
    ra: '0.05', raMin: 0.025, raMax: 0.1, rz: '0.4 – 0.8',
    label: 'Ultra-Fine Finish', visualBar: 12, color: '#22c55e',
    description: 'Very smooth matte surface. Fine grinding or superfinishing.',
    applications: ['Bearing surfaces', 'Hydraulic piston rods', 'Precision valve seats'],
    achievableBy: ['Superfinishing', 'Fine Grinding', 'High-feed Turning'],
    comparator: 'High-end phone screen protector — smooth, barely any texture',
  },
  {
    ra: '0.1', raMin: 0.05, raMax: 0.2, rz: '0.8 – 1.6',
    label: 'Fine Finish', visualBar: 20, color: '#06b6d4',
    description: 'Smooth surface with faint tool marks visible under close inspection.',
    applications: ['Precision shafts', 'Aerospace mating surfaces', 'CMM datum features'],
    achievableBy: ['Fine Turning', 'Surface Grinding', 'Precision Milling'],
    comparator: 'New ceramic knife blade — smooth with faint lines',
  },
  {
    ra: '0.2', raMin: 0.1, raMax: 0.4, rz: '1.6 – 3.2',
    label: 'Smooth Finish', visualBar: 30, color: '#06b6d4',
    description: 'Standard smooth machined surface. Acceptable for most precision components.',
    applications: ['CNC machined parts', 'Aerospace brackets', 'Hydraulic manifold faces'],
    achievableBy: ['CNC Milling', 'CNC Turning', 'Wire EDM'],
    comparator: 'New laptop chassis — smooth with slight directional texture',
  },
  {
    ra: '0.4', raMin: 0.2, raMax: 0.6, rz: '3.2 – 6.3',
    label: 'Standard Machined', visualBar: 40, color: '#06b6d4',
    description: 'Clean machined surface with visible but consistent tool marks.',
    applications: ['Aerospace parts', 'Engine components', 'Industrial fittings'],
    achievableBy: ['CNC Milling', 'CNC Turning', 'EDM', 'Laser Cutting'],
    comparator: 'Cast iron skillet — visible but uniform machining marks',
  },
  {
    ra: '0.8', raMin: 0.6, raMax: 1.2, rz: '6.3 – 12.5',
    label: 'Commercial Machined', visualBar: 52, color: '#f59e0b',
    description: 'Distinct tool marks but no gouges. Acceptable for non-critical surfaces.',
    applications: ['Non-sealing flanges', 'Structural components', 'Mounting brackets'],
    achievableBy: ['CNC Milling', 'CNC Turning', 'Drilling'],
    comparator: 'Standard steel ruler — visible machining texture',
  },
  {
    ra: '1.6', raMin: 1.2, raMax: 2.5, rz: '12.5 – 25',
    label: 'Rough Machined', visualBar: 65, color: '#f59e0b',
    description: 'Coarser surface with prominent tool marks for non-critical functional surfaces.',
    applications: ['Weld prep surfaces', 'Heavy structural parts', 'Conveyor components'],
    achievableBy: ['Rough Milling', 'Rough Turning', 'Sawing'],
    comparator: 'Coarse nail file — distinctly rough but uniform',
  },
  {
    ra: '3.2', raMin: 2.5, raMax: 6.3, rz: '25 – 50',
    label: 'Very Rough', visualBar: 80, color: '#ef4444',
    description: 'Heavy machining marks where surface finish is not functionally important.',
    applications: ['Raw stock surfaces', 'Weld beads', 'Heavy forging surfaces'],
    achievableBy: ['Rough Sawing', 'Heavy Grinding', 'Flame Cutting'],
    comparator: 'Unfinished concrete wall — rough, irregular texture',
  },
  {
    ra: '6.3', raMin: 6.3, raMax: 12.5, rz: '50 – 100',
    label: 'As-Rough / Unfinished', visualBar: 95, color: '#ef4444',
    description: 'As-rolled or as-forged surface. Minimal post-processing.',
    applications: ['Hot-rolled stock', 'As-cast bases', 'Forging pre-forms'],
    achievableBy: ['Hot Rolling', 'Casting', 'Forging'],
    comparator: 'Rough gravel road — very coarse and irregular',
  },
];

const allProcesses = Array.from(new Set(levels.flatMap(l => l.achievableBy))).sort();

export default function SurfaceRoughnessComparator() {
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredLevels = selectedProcess
    ? levels.filter(l => l.achievableBy.some(p => p === selectedProcess))
    : levels;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-medium mr-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
          Filter by process:
        </span>
        <button onClick={() => setSelectedProcess('')} className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
          style={{
            backgroundColor: !selectedProcess ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
            color: !selectedProcess ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
            border: `1px solid ${!selectedProcess ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
          }}
        >All</button>
        {allProcesses.map(p => (
          <button key={p} onClick={() => setSelectedProcess(selectedProcess === p ? '' : p)}
            className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
            style={{
              backgroundColor: selectedProcess === p ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
              color: selectedProcess === p ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
              border: `1px solid ${selectedProcess === p ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
            }}
          >{p}</button>
        ))}
      </div>

      <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
        <div className="text-xs font-bold mb-3" style={{ color: 'var(--theme-text)' }}>Ra Roughness Scale (µm)</div>
        <div className="relative h-8 rounded-lg overflow-hidden flex">
          {levels.map(l => (
            <div key={l.ra} className="h-full flex items-center justify-center text-[8px] font-bold cursor-pointer transition-all"
              style={{ width: `${l.visualBar}%`, backgroundColor: l.color, opacity: selectedLevel === l.label ? 1 : 0.85 }}
              onClick={() => setSelectedLevel(selectedLevel === l.label ? null : l.label)}
              title={`${l.label} (Ra ${l.ra} µm)`}
            >
              {l.visualBar > 12 && <span style={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Ra {l.ra}</span>}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] mt-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 30%, transparent)' }}>
          <span>Mirror</span><span>As-Rough</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredLevels.map(level => (
          <div key={level.ra} onClick={() => setSelectedLevel(selectedLevel === level.label ? null : level.label)}
            className="rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: `1px solid ${selectedLevel === level.label ? level.color : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
              boxShadow: selectedLevel === level.label ? `0 4px 20px ${level.color}20` : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: level.color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{level.label}</span>
                  <span className="text-sm font-mono font-bold" style={{ color: level.color }}>Ra {level.ra}</span>
                </div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
                  Rz {level.rz} µm
                </div>
              </div>
            </div>

            <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(level.visualBar * 0.7, 8)}%`, backgroundColor: level.color }} />
            </div>

            <div className="flex items-start gap-1.5 text-[10px] italic" style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}>
              <Eye className="w-3 h-3 shrink-0 mt-0.5" />
              {level.comparator}
            </div>

            {selectedLevel === level.label && (
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid color-mix(in srgb, ${level.color} 20%, transparent)` }}>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}>{level.description}</p>
                <div className="mb-2">
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Applications</div>
                  <div className="flex flex-wrap gap-1">
                    {level.applications.map((a, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>{a}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Achievable By</div>
                  <div className="flex flex-wrap gap-1">
                    {level.achievableBy.map((p, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
