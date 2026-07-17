import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';

interface GDTSymbol {
  symbol: string;
  name: string;
  category: string;
  toleranceZone: string;
  description: string;
  applicationNotes: string[];
  datumsRequired: boolean;
  materialCondition?: string;
  asmeRef: string;
}

const symbols: GDTSymbol[] = [
  // ─── FORM ───
  {
    symbol: '⏤', name: 'Straightness', category: 'Form',
    toleranceZone: 'Two parallel lines (2D) or a cylinder (3D) within which all surface elements must lie.',
    description: 'Controls how straight a line element or axis must be. Can be applied to a surface element (line straightness) or an axis (derived median line).',
    applicationNotes: [
      'Use on long shafts, guide rails, and sealing surfaces',
      'Axis straightness requires MMC/LMC modifiers',
      'Surface straightness does not require datums',
    ],
    datumsRequired: false,
    asmeRef: 'ASME Y14.5 Section 5.4',
  },
  {
    symbol: '⬤', name: 'Flatness', category: 'Form',
    toleranceZone: 'Two parallel planes within which the entire surface must lie.',
    description: 'Controls the deviation of a surface from a perfect plane. All points on the surface must fall between two parallel planes spaced at the tolerance value.',
    applicationNotes: [
      'Essential for mounting surfaces, sealing faces, and base plates',
      'Does not require datum references',
      'Can be applied to a single surface or a derived median plane',
    ],
    datumsRequired: false,
    asmeRef: 'ASME Y14.5 Section 5.5',
  },
  {
    symbol: '○', name: 'Circularity (Roundness)', category: 'Form',
    toleranceZone: 'Two concentric circles spaced at the tolerance value.',
    description: 'Controls how close a circular cross-section is to a perfect circle. Each circular element of the surface must independently conform.',
    applicationNotes: [
      'Used for bearing journals, seal surfaces, and O-ring grooves',
      'Measured at individual cross-sections along the axis',
      'No datum reference required',
    ],
    datumsRequired: false,
    asmeRef: 'ASME Y14.5 Section 5.6',
  },
  {
    symbol: '⌭', name: 'Cylindricity', category: 'Form',
    toleranceZone: 'Two concentric cylinders within which the entire surface must lie.',
    description: 'Simultaneously controls roundness, straightness, and taper of a cylindrical surface. More comprehensive than circularity.',
    applicationNotes: [
      'For precision hydraulic cylinders, engine bores, and mating shafts',
      'Combines circularity and straightness into one control',
      'No datum reference required — expensive to inspect',
    ],
    datumsRequired: false,
    asmeRef: 'ASME Y14.5 Section 5.7',
  },
  // ─── PROFILE ───
  {
    symbol: '⌓', name: 'Profile of a Line', category: 'Profile',
    toleranceZone: 'Two parallel lines (2D cross-section) following the true profile.',
    description: 'Controls the variation of a line element along a surface profile. Each cross-section independently evaluated.',
    applicationNotes: [
      'Used for edge profiles, gasket sealing surfaces, and aerodynamic contours',
      'Can be applied with or without datum references',
      'Often used for complex curved surfaces',
    ],
    datumsRequired: false,
    asmeRef: 'ASME Y14.5 Section 8.3',
  },
  {
    symbol: '⎓', name: 'Profile of a Surface', category: 'Profile',
    toleranceZone: 'Two parallel surfaces following the entire 3D true profile.',
    description: 'The most versatile GD&T control. Can control form, orientation, location, AND size of any surface simultaneously.',
    applicationNotes: [
      'Preferred for complex 3D surfaces (turbine blades, aerodynamic shapes)',
      'Can replace multiple individual tolerances',
      'With datums: controls location and orientation; without: controls form only',
    ],
    datumsRequired: false,
    asmeRef: 'ASME Y14.5 Section 8.4',
  },
  // ─── ORIENTATION ───
  {
    symbol: '∥', name: 'Parallelism', category: 'Orientation',
    toleranceZone: 'Two parallel planes (surface) or a cylinder (axis) that are parallel to the datum.',
    description: 'Controls how parallel a surface or axis is relative to a datum. The tolerance zone is oriented parallel to the datum.',
    applicationNotes: [
      'For sliding surfaces, guide rails, and mating faces',
      'Always requires a datum reference',
      'MMC modifier available for axis parallelism',
    ],
    datumsRequired: true,
    asmeRef: 'ASME Y14.5 Section 6.3',
  },
  {
    symbol: '⟂', name: 'Perpendicularity (Squareness)', category: 'Orientation',
    toleranceZone: 'Two parallel planes (surface) or a cylinder (axis) oriented at 90° to the datum.',
    description: 'Controls the angular relationship of a surface or axis at 90° to a datum.',
    applicationNotes: [
      'Essential for mounting flanges, column supports, and bolted joints',
      'Always requires a datum reference',
      'Available for both surface and axis control',
    ],
    datumsRequired: true,
    asmeRef: 'ASME Y14.5 Section 6.4',
  },
  {
    symbol: '∠', name: 'Angularity', category: 'Orientation',
    toleranceZone: 'Two parallel planes (surface) or a cylinder (axis) at a specified basic angle to the datum.',
    description: 'Controls the angular relationship of a surface or axis at any specified angle (not 90°) to a datum.',
    applicationNotes: [
      'For angled mounting surfaces, chamfers with functional requirements',
      'Always requires a datum reference and a basic angle',
      'Applied to both surfaces and features of size',
    ],
    datumsRequired: true,
    asmeRef: 'ASME Y14.5 Section 6.5',
  },
  // ─── LOCATION ───
  {
    symbol: '⊕', name: 'Position', category: 'Location',
    toleranceZone: 'A cylinder (3D) or circle (2D) defining the allowable variation in feature location.',
    description: 'The most commonly used location control. Defines the allowable deviation of a feature from its true position. Can be applied with MMC for bonus tolerance.',
    applicationNotes: [
      'Universal control for hole patterns, pin locations, and fastener clearance',
      'MMC modifier (±M) increases tolerance based on actual feature size',
      'Can control both location and orientation simultaneously',
    ],
    datumsRequired: true,
    materialCondition: 'MMC, LMC, RFS',
    asmeRef: 'ASME Y14.5 Section 7.3',
  },
  {
    symbol: '◎', name: 'Concentricity', category: 'Location',
    toleranceZone: 'A cylinder whose axis coincides with the datum axis. Controls median points.',
    description: 'Controls the coaxial relationship of two or more features. Unlike runout, concentricity controls the derived median points rather than the surface.',
    applicationNotes: [
      'For rotating shafts with tight dynamic balance requirements',
      'Difficult and expensive to inspect — prefer runout or position instead',
      'Requires a datum axis',
    ],
    datumsRequired: true,
    asmeRef: 'ASME Y14.5 Section 7.6',
  },
  {
    symbol: '⨁', name: 'Symmetry', category: 'Location',
    toleranceZone: 'Two parallel planes equally disposed about the datum center plane.',
    description: 'Controls how symmetrical a feature is relative to a datum center plane. Controls the median points of opposed elements.',
    applicationNotes: [
      'For mating halves, split-line features, and keyways',
      'Expensive to inspect — consider position or profile instead',
      'Rare in modern GD&T practice; many prefer surface profile',
    ],
    datumsRequired: true,
    asmeRef: 'ASME Y14.5 Section 7.7',
  },
  // ─── RUNOUT ───
  {
    symbol: '↗', name: 'Circular Runout', category: 'Runout',
    toleranceZone: 'A circular tolerance zone (annulus) applied at each individual measurement cross-section.',
    description: 'Controls the variation of a surface as it rotates about a datum axis. Checks circular elements independently.',
    applicationNotes: [
      'For individual cross-sections of rotating shafts',
      'Simple shop-floor inspection using a dial indicator',
      'Does not control cumulative surface variation along the axis',
    ],
    datumsRequired: true,
    asmeRef: 'ASME Y14.5 Section 9.3',
  },
  {
    symbol: '↗↗', name: 'Total Runout', category: 'Runout',
    toleranceZone: 'A cylindrical tolerance zone (for surfaces) along the entire length.',
    description: 'Controls ALL surface elements simultaneously — roundness, straightness, taper, and coaxiality along the entire feature length as it rotates.',
    applicationNotes: [
      'For entire shaft surfaces, sealing diameters, and critical bearing surfaces',
      'Simultaneous control in one measurement setup',
      'More comprehensive than circular runout',
    ],
    datumsRequired: true,
    asmeRef: 'ASME Y14.5 Section 9.4',
  },
];

const categories = ['Form', 'Profile', 'Orientation', 'Location', 'Runout'];

export default function GDTSymbolReference() {
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const filtered = symbols.filter(s => {
    if (category && s.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.symbol.includes(q) || s.description.toLowerCase().includes(q) || s.asmeRef.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 30%, transparent)' }} />
          <input type="text" placeholder="Search symbols, names, or ASME references..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setCategory('')} className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
          style={{
            backgroundColor: !category ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
            color: !category ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
            border: `1px solid ${!category ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
          }}
        >All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(category === c ? '' : c)} className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
            style={{
              backgroundColor: category === c ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
              color: category === c ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
              border: `1px solid ${category === c ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
            }}
          >{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(s => (
          <div key={s.name} onClick={() => setSelectedSymbol(selectedSymbol === s.name ? null : s.name)}
            className="rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: `1px solid ${selectedSymbol === s.name ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)', color: 'var(--theme-primary)' }}
              >
                {s.symbol}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold truncate" style={{ color: 'var(--theme-text)' }}>{s.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-2"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}
                  >{s.category}</span>
                </div>
                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>
                  {s.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px]" style={{ color: 'color-mix(in srgb, var(--theme-text) 35%, transparent)' }}>
                  <span>{s.datumsRequired ? 'Requires Datum' : 'No Datum Required'}</span>
                  {s.materialCondition && <span>· {s.materialCondition}</span>}
                  <span>· {s.asmeRef}</span>
                </div>
              </div>
            </div>

            {selectedSymbol === s.name && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}>
                <div className="mb-3">
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Tolerance Zone</div>
                  <p className="text-xs leading-relaxed" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}>{s.toleranceZone}</p>
                </div>
                <div>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Application Notes</div>
                  <ul className="space-y-1">
                    {s.applicationNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>
                        <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--theme-primary)' }} />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: 'color-mix(in srgb, var(--theme-text) 20%, transparent)' }} />
          <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>No symbols match your search</p>
        </div>
      )}
    </div>
  );
}
