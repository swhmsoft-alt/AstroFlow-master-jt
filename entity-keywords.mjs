/**
 * 实体锚文本映射表 (Entity Anchor Keyword Map) — 由关键词库自动生成
 * ================================================================
 * 本文件由 scripts/keywords-sync.mjs 从主库 data/keywords/main-db.json 派生生成。
 * 请勿直接手工编辑：修改主库后运行 `node scripts/keywords-sync.mjs`。
 *
 * 用途: 定义全站内链的锚文本 → 目标URL映射。
 *       英语页面无语言前缀，其他语言自动加 /{lang}/ 前缀。
 * ================================================================
 */

// ================================================================
// 英语 (English) — 默认语言，URL 无前缀
// ================================================================
export const en = [

  // ── 其他 (Other) ──
  ['3.1 MTC with VAR ingot traceability per ASME Section VIII',  '/capabilities/31-mtc-with-var-ingot-traceability-per-asme-section-viii/'],

  // ── CNC 加工 (CNC Machining) ──
  ['3/5-Axis CNC Machining',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['3/5-Axis CNC Milling',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 其他 (Other) ──
  ['3D CMM inspection',  '/products/capabilities/3d-cmm-inspection/'],
  ['3D CMM inspection of spherical bearing housing bores',  '/capabilities/3d-cmm-inspection-of-spherical-bearing-housing-bores/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3D Printing SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D Printing SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── CNC 加工 (CNC Machining) ──
  ['4/5-axis CNC milling',  '/capabilities/4-5-axis-cnc-milling/'],
  ['5-axis CNC contour milling',  '/capabilities/5-axis-cnc-contour-milling/'],
  ['5-Axis CNC Machining',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['5-axis CNC machining of blades',  '/capabilities/5-axis-cnc-machining-of-blades/'],
  ['5-axis CNC milling of aerofoils',  '/capabilities/5-axis-cnc-milling-of-aerofoils/'],
  ['5-axis CNC milling of clevis brackets',  '/capabilities/5-axis-cnc-milling-of-clevis-brackets/'],
  ['5-axis CNC milling of manipulator knuckles and swivel joints',  '/capabilities/5-axis-cnc-milling-of-manipulator-knuckles-and-swivel-joints/'],

  // ── 其他 (Other) ──
  ['5-axis machining center',  '/capabilities/5-axis-machining-center/'],
  ['5-Axis Machining',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── CNC 加工 (CNC Machining) ──
  ['5-axis milling of faces',  '/capabilities/5-axis-milling-of-faces/'],
  ['5-axis simultaneous CNC milling',  '/capabilities/5-axis-simultaneous-cnc-milling/'],

  // ── 其他 (Other) ──
  ['7-stage UHP cleanroom wash for hydrogen fuel cell components',  '/capabilities/7-stage-uhp-cleanroom-wash-for-hydrogen-fuel-cell-components/'],
  ['Accelerated aging test (1000h)',  '/capabilities/accelerated-aging-test-1000h/'],
  ['Adaptive machining',  '/capabilities/adaptive-machining/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Additive Manufacturing (AM) Builds',  '/systems/additive-manufacturing-am-builds/'],

  // ── 其他 (Other) ──
  ['Aero Engine Compressor Blisks & Blades',  '/systems/aero-engine-compressor-blisks-blades/'],
  ['Aerospace & Defense',  '/industries/aerospace/'],
  ['Aerospace Ducting & Pneumatic Systems',  '/systems/aerospace-ducting-pneumatic-systems/'],
  ['aerospace titanium',  '/industries/aerospace/'],
  ['AF temperature measurement (DSC)',  '/capabilities/af-temperature-measurement-dsc/'],
  ['AMS 2488',  '/materials/ams-2488/'],
  ['AMS 4911',  '/materials/ams-4911/'],
  ['AMS 4928',  '/materials/ams-4928/'],
  ['AMS 4928T',  '/materials/grade-5/'],
  ['AMS 4943',  '/materials/ams-4943/'],
  ['AMS 4944',  '/materials/ams-4944/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Anodizing (AMS 2488)',  '/capabilities/anodizing-ams-2488/'],
  ['Anodizing (colors)',  '/capabilities/anodizing-colors/'],
  ['Anodizing/DLC coating',  '/capabilities/anodizing-dlc-coating/'],
  ['Anodizing',  '/capabilities/anodizing/'],
  ['anodizing of titanium',  '/titanium-surface-treatment/anodizing/'],
  ['Anodizing / Surface Treatment Line',  '/equipment/anodizing-surface-treatment/'],
  ['Anodizing (Type II',  '/titanium-surface-treatment/anodizing/'],
  ['Anodizing (Type II & Type III)',  '/titanium-surface-treatment/anodizing/'],

  // ── 其他 (Other) ──
  ['AS9100',  '/capabilities/'],
  ['AS9100D',  '/capabilities/'],
  ['Assembly & riveting',  '/capabilities/assembly--riveting/'],
  ['ASTM B265',  '/materials/astm-b265/'],
  ['ASTM B338',  '/materials/astm-b338/'],
  ['ASTM B348',  '/materials/grade-5/'],
  ['ASTM B381',  '/materials/astm-b381/'],
  ['ASTM B861',  '/materials/astm-b861/'],
  ['ASTM F136',  '/materials/astm-f136/'],
  ['ASTM F2924',  '/materials/astm-f2924/'],
  ['ASTM F3001',  '/materials/astm-f3001/'],
  ['ASTM F67',  '/materials/astm-f67/'],
  ['ASTM F86',  '/materials/astm-f86/'],
  ['Automatic Bar Feeder',  '/equipment/automatic-bar-feeder/'],
  ['Automatic spring coiling',  '/capabilities/automatic-spring-coiling/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Automatic Swiss turning',  '/capabilities/automatic-swiss-turning/'],

  // ── 钣金加工 (Fabrication) ──
  ['Automatic TIG welding (tube end)',  '/capabilities/automatic-tig-welding-tube-end/'],

  // ── 其他 (Other) ──
  ['Automatic Tool Magazine',  '/equipment/automatic-tool-magazine/'],
  ['Automatic Tool Presetter',  '/equipment/tool-presetter/'],
  ['Automotive & Motorsports',  '/industries/automotive-motorsports/'],
  ['Ballistic Armor & Protection',  '/systems/ballistic-armor-protection/'],
  ['Ballistic testing (per NIJ/MIL-STD)',  '/capabilities/ballistic-testing-per-nij-mil-std/'],
  ['Batch testing (mechanical + metallographic)',  '/capabilities/batch-testing-mechanical--metallographic/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Bead blasting / anodizing / PVD',  '/capabilities/bead-blasting-anodizing-pvd/'],

  // ── 其他 (Other) ──
  ['bead blasting',  '/products/capabilities/bead-blasting-anodizing-pvd/'],
  ['Bead blasting of plasma-facing surfaces',  '/capabilities/bead-blasting-of-plasma-facing-surfaces/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Bend forming of stiffener ribs and gussets',  '/capabilities/bend-forming-of-stiffener-ribs-and-gussets/'],

  // ── 其他 (Other) ──
  ['Beta-C (Ti-3Al-8V-6Cr-4Mo-4Zr)',  '/materials/beta-c-ti-3al-8v-6cr-4mo-4zr/'],
  ['Beta-C wire cold coiling + shot peening + preset for shock springs',  '/capabilities/beta-c-wire-cold-coiling--shot-peening--preset-for-shock-springs/'],
  ['Bicycle Braking System Components',  '/systems/bicycle-braking-system-components/'],
  ['Bicycle Cockpit, Steering & Control Hardware',  '/systems/bicycle-cockpit-steering-control-hardware/'],
  ['Bicycle Drivetrain & Drivetrain Hardware',  '/systems/bicycle-drivetrain-drivetrain-hardware/'],
  ['Bicycle Suspension, Frame Hardware & Linkage',  '/systems/bicycle-suspension-frame-hardware-linkage/'],
  ['Bicycle Wheels, Saddle, Pedals & Accessories',  '/systems/bicycle-wheels-saddle-pedals-accessories/'],
  ['Brackets / Fittings / Connectors',  '/systems/brackets--fittings--connectors/'],
  ['Cardiovascular Stent & TAVI Frames',  '/systems/cardiovascular-stent-tavi-frames/'],
  ['Caseback threading',  '/capabilities/caseback-threading/'],
  ['CBN tool finishing',  '/capabilities/cbn-tool-finishing/'],
  ['Center-boring of vented vacuum screws',  '/capabilities/center-boring-of-vented-vacuum-screws/'],
  ['Centerless grinding + DLC coating of actuator piston rods',  '/capabilities/centerless-grinding--dlc-coating-of-actuator-piston-rods/'],
  ['Centerless grinding of core taper',  '/capabilities/centerless-grinding-of-core-taper/'],
  ['Charpy impact at -20C',  '/capabilities/charpy-impact-at-20c/'],
  ['Charpy impact testing at -253C',  '/capabilities/charpy-impact-testing-at-253c/'],
  ['Charpy impact testing at -253C for LH2 cryogenic hardware',  '/capabilities/charpy-impact-testing-at-253c-for-lh2-cryogenic-hardware/'],
  ['Chemical etching of diaphragm profiles',  '/capabilities/chemical-etching-of-diaphragm-profiles/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Chemical Passivation',  '/titanium-surface-treatment/chemical-passivation/'],
  ['chemical passivation treatment',  '/titanium-surface-treatment/chemical-passivation/'],

  // ── 其他 (Other) ──
  ['Chemical Pipe Fittings & Flow Control Components',  '/systems/chemical-pipe-fittings-flow-control-components/'],
  ['Chemical Processing',  '/industries/chemical/'],
  ['Chemical Reactor Internals & Agitators',  '/systems/chemical-reactor-internals-agitators/'],
  ['Chip Management & Fire Suppression System',  '/equipment/chip-management-fire-suppression/'],
  ['Class 10 cleanroom packaging',  '/capabilities/class-10-cleanroom-packaging/'],
  ['Cleaning & packaging (Class 8 cleanroom)',  '/capabilities/cleaning--packaging-class-8-cleanroom/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Cleaning & passivation',  '/capabilities/cleaning--passivation/'],

  // ── 其他 (Other) ──
  ['Cleanroom packaging (Class 100)',  '/capabilities/cleanroom-packaging-class-100/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Closed-die forging',  '/capabilities/closed-die-forging/'],

  // ── 其他 (Other) ──
  ['CMM alignment of hanger interface',  '/capabilities/cmm-alignment-of-hanger-interface/'],
  ['CMM blade profiling',  '/capabilities/cmm-blade-profiling/'],
  ['CMM contour inspection (+-0.2mm)',  '/capabilities/cmm-contour-inspection--02mm/'],
  ['CMM dimensional inspection (+-0.01mm)',  '/capabilities/cmm-dimensional-inspection--001mm/'],
  ['CMM dimensional inspection',  '/capabilities/cmm-dimensional-inspection/'],
  ['CMM dimensional inspection of contact spacing',  '/capabilities/cmm-dimensional-inspection-of-contact-spacing/'],
  ['CMM',  '/equipment/cmm/'],
  ['CMM inspection (+-0.001mm for critical features)',  '/capabilities/cmm-inspection--0001mm-for-critical-features/'],
  ['CMM inspection',  '/capabilities/cmm-inspection/'],
  ['CMM tooth profile inspection',  '/capabilities/cmm-tooth-profile-inspection/'],
  ['CMM / vision inspection',  '/capabilities/cmm-vision-inspection/'],

  // ── CNC 加工 (CNC Machining) ──
  ['CNC cutting / profile cutting',  '/capabilities/cnc-cutting-profile-cutting/'],
  ['CNC gun drilling + centerless grinding of pivot axles',  '/capabilities/cnc-gun-drilling--centerless-grinding-of-pivot-axles/'],
  ['CNC Machining',  '/titanium-cnc-machining-services/'],
  ['CNC machining of bores and attachment holes',  '/capabilities/cnc-machining-of-bores-and-attachment-holes/'],
  ['CNC machining of clamping plates and brackets',  '/capabilities/cnc-machining-of-clamping-plates-and-brackets/'],
  ['CNC machining of critical surfaces',  '/capabilities/cnc-machining-of-critical-surfaces/'],
  ['CNC Machining of Fittings & Flanges',  '/titanium-cnc-machining-services/'],
  ['CNC machining of flange faces and bolt holes',  '/capabilities/cnc-machining-of-flange-faces-and-bolt-holes/'],
  ['CNC machining of impeller profiles (5-axis)',  '/capabilities/cnc-machining-of-impeller-profiles-5-axis/'],
  ['CNC machining of mating flanges',  '/capabilities/cnc-machining-of-mating-flanges/'],
  ['CNC machining of ring and frame components',  '/capabilities/cnc-machining-of-ring-and-frame-components/'],
  ['CNC machining of rotor profile/brake track',  '/capabilities/cnc-machining-of-rotor-profile-brake-track/'],
  ['CNC machining of threaded couplings',  '/capabilities/cnc-machining-of-threaded-couplings/'],
  ['CNC machining of thumb-screw clamps and brackets',  '/capabilities/cnc-machining-of-thumb-screw-clamps-and-brackets/'],
  ['CNC machining of tooth profiles',  '/capabilities/cnc-machining-of-tooth-profiles/'],
  ['CNC machining of venturi nozzle profiles',  '/capabilities/cnc-machining-of-venturi-nozzle-profiles/'],
  ['CNC milling + diamond-cut beveling of watch bezels',  '/capabilities/cnc-milling--diamond-cut-beveling-of-watch-bezels/'],
  ['CNC Milling',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC milling from plate (or near-net forging)',  '/capabilities/cnc-milling-from-plate-or-near-net-forging/'],
  ['CNC milling of ergonomic contours',  '/capabilities/cnc-milling-of-ergonomic-contours/'],
  ['CNC milling of face/sole',  '/capabilities/cnc-milling-of-face-sole/'],
  ['CNC milling of lugs and crown guards',  '/capabilities/cnc-milling-of-lugs-and-crown-guards/'],
  ['CNC Milling & Turning',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC milling/turning of brackets and alignment blocks',  '/capabilities/cnc-milling-turning-of-brackets-and-alignment-blocks/'],
  ['CNC milling / turning of susceptor and arms',  '/capabilities/cnc-milling-turning-of-susceptor-and-arms/'],
  ['CNC multi-spindle turning',  '/capabilities/cnc-multi-spindle-turning/'],
  ['CNC pocket milling for weight reduction',  '/capabilities/cnc-pocket-milling-for-weight-reduction/'],
  ['CNC profiling + frame lock milling for folding knives',  '/capabilities/cnc-profiling--frame-lock-milling-for-folding-knives/'],
  ['CNC profiling of impeller blades',  '/capabilities/cnc-profiling-of-impeller-blades/'],
  ['CNC swaging/j-bend forming of spoke ends',  '/capabilities/cnc-swaging-j-bend-forming-of-spoke-ends/'],
  ['CNC tube bending',  '/capabilities/cnc-tube-bending/'],
  ['CNC turning & boring of ID/OD',  '/capabilities/cnc-turning--boring-of-id-od/'],
  ['CNC turning/boring of rings',  '/capabilities/cnc-turning-boring-of-rings/'],
  ['CNC Turning & Mill-Turn',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC Turning & Milling',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC turning & milling of housing',  '/capabilities/cnc-turning--milling-of-housing/'],
  ['CNC turning + nodal profile milling of sonotrode',  '/capabilities/cnc-turning--nodal-profile-milling-of-sonotrode/'],
  ['CNC turning of axle/spindle profiles',  '/capabilities/cnc-turning-of-axle-spindle-profiles/'],
  ['CNC turning of bolt heads and threads',  '/capabilities/cnc-turning-of-bolt-heads-and-threads/'],
  ['CNC turning of case profile',  '/capabilities/cnc-turning-of-case-profile/'],
  ['CNC turning of pushrods and droplinks',  '/capabilities/cnc-turning-of-pushrods-and-droplinks/'],
  ['CNC turning of ring profiles and knife-edges',  '/capabilities/cnc-turning-of-ring-profiles-and-knife-edges/'],
  ['CNC turning of valve stems',  '/capabilities/cnc-turning-of-valve-stems/'],
  ['CNC turning of VCR male/female components',  '/capabilities/cnc-turning-of-vcr-male-female-components/'],

  // ── 其他 (Other) ──
  ['Coating (if required)',  '/capabilities/coating-if-required/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Cold heading of hex nuts + CNC tapping',  '/capabilities/cold-heading-of-hex-nuts--cnc-tapping/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Cold / hot heading forming',  '/capabilities/cold-hot-heading-forming/'],

  // ── 其他 (Other) ──
  ['Collaborative Robot (Cobot) Actuator Housings',  '/systems/collaborative-robot-cobot-actuator-housings/'],

  // ── 首页 ──
  ['Comprehensive Titanium Manufacturing',  '/'],
  ['Comprehensive Titanium Manufacturing & Processing Services',  '/'],

  // ── 其他 (Other) ──
  ['Concentricity measurement',  '/capabilities/concentricity-measurement/'],
  ['Consumer Electronics',  '/industries/consumer-electronics/'],
  ['Contact resistance measurement (CNT method)',  '/capabilities/contact-resistance-measurement-cnt-method/'],
  ['Contact resistance testing',  '/capabilities/contact-resistance-testing/'],
  ['Continuous cold tube pilgering for condenser tubes',  '/capabilities/continuous-cold-tube-pilgering-for-condenser-tubes/'],
  ['Contour inspection (CMM/bluelight)',  '/capabilities/contour-inspection-cmm-bluelight/'],
  ['Coordinate accuracy verification (+-0.1mm)',  '/capabilities/coordinate-accuracy-verification--01mm/'],
  ['Coordinate measurement of fiducial markers',  '/capabilities/coordinate-measurement-of-fiducial-markers/'],
  ['Coordinate Measuring Machine (CMM)',  '/equipment/cmm/'],
  ['Corrosion testing',  '/capabilities/corrosion-testing/'],
  ['Corrosion testing (potentiodynamic)',  '/capabilities/corrosion-testing-potentiodynamic/'],
  ['Creep testing',  '/capabilities/creep-testing/'],
  ['Crimping & loading into delivery system',  '/capabilities/crimping--loading-into-delivery-system/'],
  ['Cryogenic dimensional inspection',  '/capabilities/cryogenic-dimensional-inspection/'],
  ['Cryogenic & LNG Components',  '/systems/cryogenic-lng-components/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Cryogenic polishing for medical sonotrodes',  '/capabilities/cryogenic-polishing-for-medical-sonotrodes/'],

  // ── 其他 (Other) ──
  ['Cryogenic proof testing',  '/capabilities/cryogenic-proof-testing/'],
  ['Cryogenic Propellant Tank Hardware',  '/systems/cryogenic-propellant-tank-hardware/'],
  ['Cryogenic testing (-196C)',  '/capabilities/cryogenic-testing-196c/'],
  ['CT scanning (internal defect detection)',  '/capabilities/ct-scanning-internal-defect-detection/'],

  // ── 钣金加工 (Fabrication) ──
  ['Custom fabrication to drawing',  '/capabilities/custom-fabrication-to-drawing/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Custom Industrial Components',  '/titanium-cnc-machining-services/custom-industrial-components/'],

  // ── 其他 (Other) ──
  ['Cycle testing (200,000 cycles)',  '/capabilities/cycle-testing-200000-cycles/'],
  ['Cycling / Bicycle',  '/industries/cycling---bicycle/'],
  ['Cylindrical / centerless grinding',  '/capabilities/cylindrical-centerless-grinding/'],
  ['Debinding & sintering',  '/capabilities/debinding--sintering/'],
  ['Deburring / edge rounding',  '/capabilities/deburring-edge-rounding/'],
  ['deburring of components',  '/products/capabilities/deburring-edge-rounding/'],
  ['Deep drawing of vacuum flask liners (Grade 1 Ti)',  '/capabilities/deep-drawing-of-vacuum-flask-liners-grade-1-ti/'],
  ['Deep-hole boring of multi-port manifolds',  '/capabilities/deep-hole-boring-of-multi-port-manifolds/'],
  ['Deep hole drilling (tube sheet)',  '/capabilities/deep-hole-drilling-tube-sheet/'],
  ['Deep-hole gun drilling of gas manifold blocks',  '/capabilities/deep-hole-gun-drilling-of-gas-manifold-blocks/'],
  ['Deep-hole gun drilling of pressure housings',  '/capabilities/deep-hole-gun-drilling-of-pressure-housings/'],
  ['Deep-Sea Exploration & ROV/AUV Hardware',  '/systems/deep-sea-exploration-rov-auv-hardware/'],
  ['Deepwater Drilling Risers & Components',  '/systems/deepwater-drilling-risers-components/'],
  ['Dental Implants & Prosthetics',  '/systems/dental-implants-prosthetics/'],
  ['Digital frequency analysis (DFA) tuning to +-50Hz target',  '/capabilities/digital-frequency-analysis-dfa-tuning-to--50hz-target/'],
  ['Dimensional certification',  '/capabilities/dimensional-certification/'],
  ['Dimensional certification of bolt circle patterns',  '/capabilities/dimensional-certification-of-bolt-circle-patterns/'],
  ['Dimensional certification with full traceability',  '/capabilities/dimensional-certification-with-full-traceability/'],
  ['dimensional inspection',  '/products/capabilities/100-dimensional-inspection-cmm/'],
  ['Dimensional inspection of mating surfaces',  '/capabilities/dimensional-inspection-of-mating-surfaces/'],
  ['Dimensional inspection of mounting interfaces',  '/capabilities/dimensional-inspection-of-mounting-interfaces/'],
  ['Dimensional inspection per ASME B16.5/B16.9',  '/capabilities/dimensional-inspection-per-asme-b165-b169/'],
  ['Dimensional inspection per ASME B16.5 / DIN standards',  '/capabilities/dimensional-inspection-per-asme-b165-din-standards/'],
  ['Dimensional sorting',  '/capabilities/dimensional-sorting/'],
  ['DLC coating for wear resistance',  '/capabilities/dlc-coating-for-wear-resistance/'],
  ['DLC coating (wear resistance)',  '/capabilities/dlc-coating-wear-resistance/'],
  ['Drilling of bolt holes with jig',  '/capabilities/drilling-of-bolt-holes-with-jig/'],
  ['Drilling of mounting holes',  '/capabilities/drilling-of-mounting-holes/'],
  ['Drilling / tapping',  '/capabilities/drilling-tapping/'],
  ['Drop impact testing (1.5m onto concrete)',  '/capabilities/drop-impact-testing-15m-onto-concrete/'],
  ['Drop/impact testing of knife lock-up',  '/capabilities/drop-impact-testing-of-knife-lock-up/'],
  ['Drop testing (MIL-STD-810)',  '/capabilities/drop-testing-mil-std-810/'],
  ['Dust ingress testing',  '/capabilities/dust-ingress-testing/'],
  ['Dynamic balancing',  '/capabilities/dynamic-balancing/'],
  ['Dynamic balancing for rotary horns',  '/capabilities/dynamic-balancing-for-rotary-horns/'],
  ['Dynamic balancing test',  '/capabilities/dynamic-balancing-test/'],

  // ── 钣金加工 (Fabrication) ──
  ['EB / laser welding of rib-skin assembly',  '/capabilities/eb-laser-welding-of-rib-skin-assembly/'],
  ['EB welding of hull seams under vacuum',  '/capabilities/eb-welding-of-hull-seams-under-vacuum/'],

  // ── 其他 (Other) ──
  ['Eddy current inspection',  '/capabilities/eddy-current-inspection/'],
  ['Electrical continuity testing',  '/capabilities/electrical-continuity-testing/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Electrochemical polishing',  '/capabilities/electrochemical-polishing/'],

  // ── 其他 (Other) ──
  ['Electroplating Anode Baskets & Current Delivery Systems',  '/systems/electroplating-anode-baskets-current-delivery-systems/'],
  ['Electroplating Racks, Jigs & PCB Fixtures',  '/systems/electroplating-racks-jigs-pcb-fixtures/'],
  ['Electroplating & Surface Finishing',  '/industries/electroplating-surface-finishing/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Electropolishing + Class 100 ultrasonic cleaning',  '/capabilities/electropolishing--class-100-ultrasonic-cleaning/'],
  ['electropolishing',  '/products/capabilities/electropolishing/'],
  ['Electropolishing of all vacuum-facing surfaces',  '/capabilities/electropolishing-of-all-vacuum-facing-surfaces/'],
  ['Electropolishing of all wetted surfaces',  '/capabilities/electropolishing-of-all-wetted-surfaces/'],

  // ── 其他 (Other) ──
  ['ELI Grade 4 – Low Interstitial Titanium',  '/materials/grade-4-eli/'],
  ['Gas chromatography for hydrogen embrittlement certification (H<125ppm)',  '/capabilities/gas-chromatography-for-hydrogen-embrittlement-certification-h125ppm/'],
  ['PVD color spectrophotometer audit (Delta-E <=1.0)',  '/capabilities/pvd-color-spectrophotometer-audit-delta-e-10/'],
  ['100% dimensional inspection (CMM)',  '/capabilities/100-dimensional-inspection-cmm/'],
  ['Manufacturing Example: UHV Gas Showerhead — 2,400 Micro-Drilled Holes',  '/case-studies/semiconductor-uhv-showerhead/'],
  ['Coaxiality measurement of pivot axles <0.02mm',  '/capabilities/coaxiality-measurement-of-pivot-axles-002mm/'],
  ['Grade 4 – Commercially Pure Titanium',  '/materials/grade-4/'],
  ['Magnetic permeability testing (mu <1.01)',  '/capabilities/magnetic-permeability-testing-mu-101/'],
  ['Fatigue testing (10^6 cycles at 10Nm)',  '/capabilities/fatigue-testing-106-cycles-at-10nm/'],
  ['100% eddy current testing (ECT) of condenser tubes',  '/capabilities/100-eddy-current-testing-ect-of-condenser-tubes/'],
  ['Grade 9 – Ti-3Al-2.5V Titanium Alloy',  '/materials/grade-9/'],
  ['Grade 21 – Ti-15V-3Cr-3Sn-3Al Beta Alloy',  '/materials/grade-21/'],
  ['Grade 19 – Ti-10V-2Fe-3Al Beta Titanium',  '/materials/grade-19/'],
  ['Manufacturing Example: Grade 23 ELI Bone Screws — Zero-Contamination',  '/case-studies/medical-bone-screws/'],
  ['Grade 1 – Commercially Pure Titanium',  '/materials/grade-1/'],
  ['Fatigue testing 10^5 cycles',  '/capabilities/fatigue-testing-105-cycles/'],
  ['Helium leak testing (1x10^-10 mbar.L/s)',  '/capabilities/helium-leak-testing-1x10-10-mbarl-s/'],
  ['Helium leak testing of hydrogen components (1x10^-9 mbar.L/s)',  '/capabilities/helium-leak-testing-of-hydrogen-components-1x10-9-mbarl-s/'],
  ['100% crack detection',  '/capabilities/100-crack-detection/'],
  ['Grade 3 – Commercially Pure Titanium',  '/materials/grade-3/'],
  ['Grade 6242 – Ti-6Al-2Sn-4Zr-2Mo Aerospace Ti',  '/materials/grade-6242/'],
  ['PVD coating with closed-loop gas mass-flow (Delta-E <=1.0)',  '/capabilities/pvd-coating-with-closed-loop-gas-mass-flow-delta-e-10/'],
  ['Helium leak testing (1x10^-9 mbar.L/s)',  '/capabilities/helium-leak-testing-1x10-9-mbarl-s/'],
  ['Grade 6 – Ti-5Al-2.5Sn Titanium Alloy',  '/materials/grade-6/'],
  ['Axle bending fatigue testing 10^6 cycles',  '/capabilities/axle-bending-fatigue-testing-106-cycles/'],
  ['Surface roughness measurement (Ra<0.05um on knife-edge)',  '/capabilities/surface-roughness-measurement-ra005um-on-knife-edge/'],
  ['Surface roughness inspection (Ra<0.2um)',  '/capabilities/surface-roughness-inspection-ra02um/'],
  ['Weld color inspection (silver/gold acceptable; blue/purple = contamination)',  '/capabilities/weld-color-inspection-silver-gold-acceptable-blue-purple--contamination/'],
  ['Surface roughness measurement (Ra<0.4um)',  '/capabilities/surface-roughness-measurement-ra04um/'],
  ['Surface roughness measurement (Ra<0.8um)',  '/capabilities/surface-roughness-measurement-ra08um/'],
  ['Grade 5 – Ti-6Al-4V Titanium Alloy',  '/materials/grade-5/'],
  ['Water contact angle measurement (>110 deg)',  '/capabilities/water-contact-angle-measurement-110-deg/'],
  ['Grade 23 – Ti-6Al-4V ELI Medical Titanium',  '/materials/grade-23/'],
  ['Manufacturing Example: Thin-Wall Titanium Aerospace Housing',  '/case-studies/aerospace-thin-wall-housing/'],
  ['Ti-6211 – Ti-6Al-2Nb-1Ta-0.8Mo Marine Grade Titanium',  '/materials/ti-6211/'],
  ['Magnetic permeability test (mu <1.00001)',  '/capabilities/magnetic-permeability-test-mu-100001/'],
  ['Grade 2 – Commercially Pure Titanium',  '/materials/grade-2/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['End forming / flaring',  '/capabilities/end-forming-flaring/'],

  // ── 其他 (Other) ──
  ['Energy',  '/industries/energy/'],
  ['Engine Valve Train Components (Spring Retainers & Keepers)',  '/systems/engine-valve-train-components-spring-retainers-keepers/'],
  ['Environmental Engineering',  '/industries/environmental-engineering/'],
  ['Expanded metal mesh production',  '/capabilities/expanded-metal-mesh-production/'],
  ['Fasteners',  '/systems/fasteners/'],
  ['Fatigue testing (accelerated 400M cycles)',  '/capabilities/fatigue-testing-accelerated-400m-cycles/'],
  ['Fatigue testing',  '/capabilities/fatigue-testing/'],
  ['Fatigue testing of release mechanisms (1000+ cycles)',  '/capabilities/fatigue-testing-of-release-mechanisms-1000-cycles/'],
  ['Fatigue testing (sprint load simulation)',  '/capabilities/fatigue-testing-sprint-load-simulation/'],
  ['Field durability testing (customer-specified)',  '/capabilities/field-durability-testing-customer-specified/'],
  ['Flavor leaching test (ISO 10304 for metal ions)',  '/capabilities/flavor-leaching-test-iso-10304-for-metal-ions/'],
  ['Flow rate testing of eductors',  '/capabilities/flow-rate-testing-of-eductors/'],
  ['Flow testing (cooled blades)',  '/capabilities/flow-testing-cooled-blades/'],
  ['Flow testing',  '/capabilities/flow-testing/'],
  ['Fluorescent penetrant inspection (FPI)',  '/capabilities/fluorescent-penetrant-inspection-fpi/'],
  ['Foldable Phone Hinge & Fold Mechanisms',  '/systems/foldable-phone-hinge-fold-mechanisms/'],
  ['Folding cycle test (200k+ cycles for hinges)',  '/capabilities/folding-cycle-test-200k-cycles-for-hinges/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Forged rod tapering + tip forming for tent stakes',  '/capabilities/forged-rod-tapering--tip-forming-for-tent-stakes/'],
  ['Forming & Bending',  '/titanium-forming-heavy-manufacturing/'],

  // ── 其他 (Other) ──
  ['FPI (fluorescent penetrant inspection)',  '/capabilities/fpi-fluorescent-penetrant-inspection/'],
  ['Full-length UT inspection',  '/capabilities/full-length-ut-inspection/'],
  ['Full-scale tension testing',  '/capabilities/full-scale-tension-testing/'],
  ['Full UT wall thickness verification',  '/capabilities/full-ut-wall-thickness-verification/'],
  ['Function testing',  '/capabilities/function-testing/'],
  ['Gamma-TiAl (Ti-48Al-2Cr-2Nb)',  '/materials/gamma-tial-ti-48al-2cr-2nb/'],
  ['General Industrial',  '/industries/general-industrial/'],
  ['Grade 1 CP-Ti',  '/materials/grade-1-cp-ti/'],
  ['Grade 1 Titanium',  '/materials/grade-1/'],
  ['Grade 12 Ti-0.3Mo-0.8Ni',  '/materials/grade-12-ti-03mo-08ni/'],
  ['Grade 2 CP-Ti',  '/materials/grade-2-cp-ti/'],
  ['Grade 2 Titanium',  '/materials/grade-2/'],
  ['Grade 23 Ti-6Al-4V ELI',  '/materials/grade-23-ti-6al-4v-eli/'],
  ['Grade 23 Titanium',  '/materials/grade-23/'],
  ['Grade 3 CP-Ti',  '/materials/grade-3-cp-ti/'],
  ['Grade 4 CP-Ti',  '/materials/grade-4-cp-ti/'],
  ['Grade 5 Ti-6Al-4V',  '/materials/grade-5-ti-6al-4v/'],
  ['Grade 5 Titanium',  '/materials/grade-5/'],
  ['Grade 7 Ti-0.15Pd',  '/materials/grade-7-ti-015pd/'],
  ['Grade 9 Ti-3Al-2.5V',  '/materials/grade-9-ti-3al-25v/'],
  ['Grade 9 Titanium',  '/materials/grade-9/'],
  ['Gun-drilling of intramedullary nails + cannulated screws',  '/capabilities/gun-drilling-of-intramedullary-nails--cannulated-screws/'],
  ['Hardness testing',  '/capabilities/hardness-testing/'],
  ['Hardness testing (HRB/HRC) of washers',  '/capabilities/hardness-testing-hrb-hrc-of-washers/'],
  ['Hardness testing (HRC)',  '/capabilities/hardness-testing-hrc/'],
  ['Heat Exchangers / Piping Systems',  '/systems/heat-exchangers--piping-systems/'],
  ['Heat transfer verification',  '/capabilities/heat-transfer-verification/'],
  ['Heat treatment',  '/capabilities/heat-treatment/'],
  ['Heat Treatment Fixtures & Racks',  '/systems/heat-treatment-fixtures-racks/'],
  ['Heat treatment (STA)',  '/capabilities/heat-treatment-sta/'],
  ['Heat treatment to optimize hardness',  '/capabilities/heat-treatment-to-optimize-hardness/'],
  ['Helium leak detection',  '/capabilities/helium-leak-detection/'],
  ['Helium leak testing',  '/capabilities/helium-leak-testing/'],
  ['Helium leak testing of electronic canisters',  '/capabilities/helium-leak-testing-of-electronic-canisters/'],
  ['Helium mass spectrometer leak test',  '/capabilities/helium-mass-spectrometer-leak-test/'],
  ['High-End Outdoor & Adventure Gear',  '/systems/high-end-outdoor-adventure-gear/'],
  ['High-precision grinding',  '/capabilities/high-precision-grinding/'],
  ['High-temperature Oxidation Protective Coating',  '/capabilities/high-temperature/'],
  ['High-temperature wind tunnel testing',  '/capabilities/high-temperature-wind-tunnel-testing/'],
  ['HIP densification',  '/capabilities/hip-densification/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Hot forging + thread rolling of all rotor & caliper bolts',  '/capabilities/hot-forging--thread-rolling-of-all-rotor--caliper-bolts/'],
  ['Hot forging + thread rolling of linkage bolts',  '/capabilities/hot-forging--thread-rolling-of-linkage-bolts/'],
  ['Hot forging + vacuum annealing of valve stems and bolts',  '/capabilities/hot-forging--vacuum-annealing-of-valve-stems-and-bolts/'],
  ['Hot forming of curved panels',  '/capabilities/hot-forming-of-curved-panels/'],
  ['Hot forming of seamless tube into elbows/tees',  '/capabilities/hot-forming-of-seamless-tube-into-elbows-tees/'],
  ['Hot forming of skin panels',  '/capabilities/hot-forming-of-skin-panels/'],

  // ── 其他 (Other) ──
  ['Hot heading + vacuum aging of beta hub bolts',  '/capabilities/hot-heading--vacuum-aging-of-beta-hub-bolts/'],
  ['Hot isostatic pressing (HIP)',  '/capabilities/hot-isostatic-pressing-hip/'],
  ['Housings / Chambers / Enclosures',  '/systems/housings--chambers--enclosures/'],
  ['Hydraulic pressure testing of tie rods',  '/capabilities/hydraulic-pressure-testing-of-tie-rods/'],
  ['Hydrostatic burst testing',  '/capabilities/hydrostatic-burst-testing/'],
  ['Hydrostatic pressure testing',  '/capabilities/hydrostatic-pressure-testing/'],
  ['Hydrostatic pressure testing of coils',  '/capabilities/hydrostatic-pressure-testing-of-coils/'],
  ['Hydrostatic pressure testing of flanged assemblies',  '/capabilities/hydrostatic-pressure-testing-of-flanged-assemblies/'],
  ['Hydrostatic pressure testing to 1.25x rated depth',  '/capabilities/hydrostatic-pressure-testing-to-125x-rated-depth/'],
  ['Hydrostatic pressure testing to 1.5x rated pressure',  '/capabilities/hydrostatic-pressure-testing-to-15x-rated-pressure/'],
  ['Hydrostatic proof testing',  '/capabilities/hydrostatic-proof-testing/'],
  ['Hydrostatic test',  '/capabilities/hydrostatic-test/'],
  ['Hydrostatic testing',  '/capabilities/hydrostatic-testing/'],
  ['Hypersonic Vehicle Control Surfaces',  '/systems/hypersonic-vehicle-control-surfaces/'],
  ['Impact testing at cryogenic temperature',  '/capabilities/impact-testing-at-cryogenic-temperature/'],
  ['Impedance / frequency analysis',  '/capabilities/impedance-frequency-analysis/'],
  ['Impeller dynamic balancing',  '/capabilities/impeller-dynamic-balancing/'],
  ['Impellers / Blades (Rotational)',  '/systems/impellers--blades-rotational/'],
  ['Industrial Standard Fasteners, Flanges & Hardware',  '/systems/industrial-standard-fasteners-flanges-hardware/'],
  ['Investment casting (alternative)',  '/capabilities/investment-casting-alternative/'],
  ['Investment casting',  '/capabilities/investment-casting/'],
  ['ISO 13485',  '/capabilities/'],
  ['ISO 5832-11',  '/materials/iso-5832-11/'],
  ['ISO 5832-3',  '/materials/iso-5832-3/'],
  ['ISO 9001',  '/capabilities/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Isothermal die forging',  '/capabilities/isothermal-die-forging/'],

  // ── 其他 (Other) ──
  ['ITAR',  '/capabilities/'],
  ['Keyway broaching',  '/capabilities/keyway-broaching/'],
  ['Kink resistance testing',  '/capabilities/kink-resistance-testing/'],
  ['Knife-edge profile inspection (optical microscopy)',  '/capabilities/knife-edge-profile-inspection-optical-microscopy/'],
  ['Landing Gear Structural Components',  '/systems/landing-gear-structural-components/'],

  // ── 钣金加工 (Fabrication) ──
  ['Laser cutting + die stamping of crampon spikes',  '/capabilities/laser-cutting--die-stamping-of-crampon-spikes/'],
  ['Laser Cutting',  '/titanium-fabrication-services/laser-cutting/'],
  ['Laser cutting of port holes',  '/capabilities/laser-cutting-of-port-holes/'],
  ['Laser Cutting (Sheet',  '/titanium-fabrication-services/laser-cutting/'],
  ['Laser Cutting (Sheet & Tube)',  '/titanium-fabrication-services/laser-cutting/'],

  // ── 其他 (Other) ──
  ['Laser engraving (marking)',  '/capabilities/laser-engraving-marking/'],
  ['Laser marking',  '/capabilities/laser-marking/'],
  ['Laser marking (traceability code)',  '/capabilities/laser-marking-traceability-code/'],
  ['Laser marking (UDI code)',  '/capabilities/laser-marking-udi-code/'],
  ['Laser micro-cutting of tube',  '/capabilities/laser-micro-cutting-of-tube/'],
  ['Laser micro-drilling of orifice disks',  '/capabilities/laser-micro-drilling-of-orifice-disks/'],

  // ── 钣金加工 (Fabrication) ──
  ['Laser or waterjet cutting of perforated bottom plates',  '/capabilities/laser-or-waterjet-cutting-of-perforated-bottom-plates/'],

  // ── 其他 (Other) ──
  ['Laser/perforation drilling of sparger pipes',  '/capabilities/laser-perforation-drilling-of-sparger-pipes/'],
  ['Laser / plasma cutting of plate',  '/capabilities/laser-plasma-cutting-of-plate/'],
  ['Laser Tracker / 3D Scanner',  '/equipment/laser-tracker-3d-scanner/'],

  // ── 钣金加工 (Fabrication) ──
  ['Laser / waterjet cutting',  '/capabilities/laser-waterjet-cutting/'],
  ['laser welding titanium',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 其他 (Other) ──
  ['Left/right hand thread rolling on multi-axis roller',  '/capabilities/left-right-hand-thread-rolling-on-multi-axis-roller/'],
  ['Load testing of hooks and welds',  '/capabilities/load-testing-of-hooks-and-welds/'],
  ['Low-Pressure Turbine Blades (Gamma-TiAl)',  '/systems/low-pressure-turbine-blades-gamma-tial/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Low-Volume Production',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['LPBF 3D printing of porous fusion cages',  '/capabilities/lpbf-3d-printing-of-porous-fusion-cages/'],

  // ── 其他 (Other) ──
  ['Magnetic field testing',  '/capabilities/magnetic-field-testing/'],
  ['Magnetic particle inspection (MPI)',  '/capabilities/magnetic-particle-inspection-mpi/'],
  ['Magnetic particle inspection (MPI) of all threaded parts',  '/capabilities/magnetic-particle-inspection-mpi-of-all-threaded-parts/'],
  ['Magnetic permeability testing',  '/capabilities/magnetic-permeability-testing/'],
  ['Marine & Offshore',  '/industries/marine/'],
  ['Marine Propellers & Shafting',  '/systems/marine-propellers-shafting/'],
  ['marine titanium components',  '/industries/marine/'],
  ['Material certification',  '/capabilities/material-certification/'],
  ['Material certification (EN 10204 3.1)',  '/capabilities/material-certification-en-10204-31/'],
  ['Material certification (EN 10204 3.1 / MTR)',  '/capabilities/material-certification-en-10204-31-mtr/'],
  ['Material traceability per NASA SP-R-0022',  '/capabilities/material-traceability-per-nasa-sp-r-0022/'],
  ['Mechanical testing per ASTM F543 (screw torque)',  '/capabilities/mechanical-testing-per-astm-f543-screw-torque/'],
  ['Medical Device',  '/industries/medical/'],
  ['medical implants',  '/industries/medical/'],
  ['Metal injection molding (MIM)',  '/capabilities/metal-injection-molding-mim/'],
  ['Metal injection molding (MIM) of foldable hinges',  '/capabilities/metal-injection-molding-mim-of-foldable-hinges/'],
  ['Metallographic evaluation',  '/capabilities/metallographic-evaluation/'],
  ['Micro-CT of flame arrestor pore structure',  '/capabilities/micro-ct-of-flame-arrestor-pore-structure/'],
  ['MIL-T-9047',  '/materials/mil-t-9047/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Mirror polishing of piston thermal barrier faces',  '/capabilities/mirror-polishing-of-piston-thermal-barrier-faces/'],

  // ── 其他 (Other) ──
  ['Missile & Rocket Motor Hardware',  '/systems/missile-rocket-motor-hardware/'],
  ['MOCVD Wafer Susceptor & Support Hardware',  '/systems/mocvd-wafer-susceptor-support-hardware/'],
  ['MPI of threads',  '/capabilities/mpi-of-threads/'],
  ['MRI artifact testing (3T phantom)',  '/capabilities/mri-artifact-testing-3t-phantom/'],
  ['MRI-Compatible Cranial Fixation & Stereotactic Frames',  '/systems/mri-compatible-cranial-fixation-stereotactic-frames/'],
  ['NADCAP',  '/capabilities/'],
  ['Neuro-Interventional Guidewires & Catheters',  '/systems/neuro-interventional-guidewires-catheters/'],
  ['Nitinol (Ni-Ti Shape Memory Alloy)',  '/materials/nitinol-ni-ti-shape-memory-alloy/'],
  ['Nuclear Power & Hydrogen Energy Infrastructure',  '/systems/nuclear-power-hydrogen-energy-infrastructure/'],
  ['Oleophobic nano-coating via electron beam evaporation',  '/capabilities/oleophobic-nano-coating-via-electron-beam-evaporation/'],
  ['Outgassing rate measurement (ASTM E595)',  '/capabilities/outgassing-rate-measurement-astm-e595/'],
  ['Outgassing test (ASTM E595)',  '/capabilities/outgassing-test-astm-e595/'],
  ['Oxidation testing',  '/capabilities/oxidation-testing/'],
  ['Particle count certification',  '/capabilities/particle-count-certification/'],
  ['Particle count testing',  '/capabilities/particle-count-testing/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Passivation (ASTM F86)',  '/capabilities/passivation-astm-f86/'],
  ['Passivation + Class 10,000 cleanroom ultrasonic wash',  '/capabilities/passivation--class-10000-cleanroom-ultrasonic-wash/'],
  ['Passivation + Class 10 cleanroom assembly',  '/capabilities/passivation--class-10-cleanroom-assembly/'],
  ['Passivation & cleaning',  '/capabilities/passivation--cleaning/'],
  ['Passivation',  '/capabilities/passivation/'],

  // ── 其他 (Other) ──
  ['PEM Electrolyzer Bipolar Plates',  '/systems/pem-electrolyzer-bipolar-plates/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Pickling & passivation',  '/capabilities/pickling--passivation/'],

  // ── 其他 (Other) ──
  ['Pickling to remove oxide scale',  '/capabilities/pickling-to-remove-oxide-scale/'],

  // ── 钣金加工 (Fabrication) ──
  ['Pipe Spool Fabrication',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 其他 (Other) ──
  ['Plasma Chamber Liners, Shields & Thermal Hardware',  '/systems/plasma-chamber-liners-shields-thermal-hardware/'],
  ['Plasma erosion testing (customer-specified recipe)',  '/capabilities/plasma-erosion-testing-customer-specified-recipe/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Plate laser cutting + CNC drilling of flange bolt holes',  '/capabilities/plate-laser-cutting--cnc-drilling-of-flange-bolt-holes/'],

  // ── 其他 (Other) ──
  ['PMI (positive material identification) verification',  '/capabilities/pmi-positive-material-identification-verification/'],
  ['PMI verification of all material',  '/capabilities/pmi-verification-of-all-material/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Polishing',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Polishing & Sandblasting',  '/titanium-surface-treatment/polishing-sandblasting/'],

  // ── 其他 (Other) ──
  ['Porosity testing of sintered filters (bubble point test)',  '/capabilities/porosity-testing-of-sintered-filters-bubble-point-test/'],
  ['Powder characterization',  '/capabilities/powder-characterization/'],
  ['Powder compaction + sintering for porous filter elements',  '/capabilities/powder-compaction--sintering-for-porous-filter-elements/'],
  ['Powder sintering of flame arrestor porous disks',  '/capabilities/powder-sintering-of-flame-arrestor-porous-disks/'],
  ['Precision boring of bearing journals',  '/capabilities/precision-boring-of-bearing-journals/'],
  ['Precision boring of wafer pockets',  '/capabilities/precision-boring-of-wafer-pockets/'],
  ['Precision chemical micro-etching of earbud grilles',  '/capabilities/precision-chemical-micro-etching-of-earbud-grilles/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Precision CNC Machining',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['Precision drilling of gas holes',  '/capabilities/precision-drilling-of-gas-holes/'],
  ['Precision drilling of pin guides',  '/capabilities/precision-drilling-of-pin-guides/'],
  ['Precision end grinding',  '/capabilities/precision-end-grinding/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Precision forging',  '/capabilities/precision-forging/'],

  // ── 其他 (Other) ──
  ['Precision grinding of root form',  '/capabilities/precision-grinding-of-root-form/'],
  ['Precision honing of bearing surface',  '/capabilities/precision-honing-of-bearing-surface/'],
  ['Precision Instrumentation & Optical Metrology Components',  '/systems/precision-instrumentation-optical-metrology-components/'],
  ['Precision stamping + vibratory deburring of flat/lock washers',  '/capabilities/precision-stamping--vibratory-deburring-of-flat-lock-washers/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Precision turning of caliper piston Ti-inserts',  '/capabilities/precision-turning-of-caliper-piston-ti-inserts/'],

  // ── 其他 (Other) ──
  ['Premium Consumer Electronics & Wearables',  '/systems/premium-consumer-electronics-wearables/'],
  ['Pressure test',  '/capabilities/pressure-test/'],
  ['Pressure testing',  '/capabilities/pressure-testing/'],
  ['Pressure testing of banjo bolt assemblies',  '/capabilities/pressure-testing-of-banjo-bolt-assemblies/'],
  ['Pressure testing (seal integrity)',  '/capabilities/pressure-testing-seal-integrity/'],
  ['Professional Dive Watch Cases & Components',  '/systems/professional-dive-watch-cases-components/'],
  ['PT/UT inspection',  '/capabilities/pt-ut-inspection/'],
  ['PTFE bonding / insert molding',  '/capabilities/ptfe-bonding-insert-molding/'],
  ['PTFE / hydrophilic coating application',  '/capabilities/ptfe-hydrophilic-coating-application/'],
  ['PVD coating (Pt or Au)',  '/capabilities/pvd-coating-pt-or-au/'],
  ['PVD / DLC coating',  '/capabilities/pvd-dlc-coating/'],
  ['Racing Suspension Rods, Linkages & Hardware',  '/systems/racing-suspension-rods-linkages-hardware/'],
  ['Radial force testing',  '/capabilities/radial-force-testing/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Rapid Prototyping',  '/titanium-additive-manufacturing/rapid-prototyping/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Raw Material Preparation',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Raw Material Preparation & Sizing',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],

  // ── 其他 (Other) ──
  ['RFQ',  '/rfq/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Ring rolling / forging',  '/capabilities/ring-rolling-forging/'],

  // ── 其他 (Other) ──
  ['Robotic Loading / Pallet System',  '/equipment/robotic-pallet-system/'],
  ['Saddle rail compression testing 200kg',  '/capabilities/saddle-rail-compression-testing-200kg/'],
  ['Salt spray corrosion testing (1000h ASTM B117)',  '/capabilities/salt-spray-corrosion-testing-1000h-astm-b117/'],
  ['Salt spray corrosion testing 100h ASTM B117',  '/capabilities/salt-spray-corrosion-testing-100h-astm-b117/'],
  ['Salt spray corrosion testing ASTM B117',  '/capabilities/salt-spray-corrosion-testing-astm-b117/'],
  ['Salt spray corrosion testing',  '/capabilities/salt-spray-corrosion-testing/'],
  ['Seal face grinding/lapping',  '/capabilities/seal-face-grinding-lapping/'],
  ['Seamless tube bending for backpack frames',  '/capabilities/seamless-tube-bending-for-backpack-frames/'],
  ['Semiconductor',  '/industries/semiconductor/'],
  ['Semiconductor Process Chamber Components',  '/systems/semiconductor-process-chamber-components/'],
  ['semiconductor titanium components',  '/industries/semiconductor/'],
  ['Semiconductor Vacuum Chamber Structural Hardware',  '/systems/semiconductor-vacuum-chamber-structural-hardware/'],
  ['Shape-setting heat treatment',  '/capabilities/shape-setting-heat-treatment/'],
  ['Shape-setting of distal tip',  '/capabilities/shape-setting-of-distal-tip/'],
  ['Shear strength testing of rotor bolts',  '/capabilities/shear-strength-testing-of-rotor-bolts/'],

  // ── 钣金加工 (Fabrication) ──
  ['Sheet metal fabrication of demister frame grids',  '/capabilities/sheet-metal-fabrication-of-demister-frame-grids/'],
  ['Sheet metal stamp-bending + spot TIG welding of rain cap flappers',  '/capabilities/sheet-metal-stamp-bending--spot-tig-welding-of-rain-cap-flappers/'],

  // ── 其他 (Other) ──
  ['Sheet stamping / chemical etching of flow fields',  '/capabilities/sheet-stamping-chemical-etching-of-flow-fields/'],

  // ── 钣金加工 (Fabrication) ──
  ['Shell and channel welding',  '/capabilities/shell-and-channel-welding/'],

  // ── 其他 (Other) ──
  ['Shot peening',  '/capabilities/shot-peening/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Single-point diamond turning of sealing surfaces',  '/capabilities/single-point-diamond-turning-of-sealing-surfaces/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['SLM 3D printing of complex pod geometries',  '/capabilities/slm-3d-printing-of-complex-pod-geometries/'],
  ['SLM 3D printing of custom stem/adapter bodies',  '/capabilities/slm-3d-printing-of-custom-stem-adapter-bodies/'],
  ['SLM 3D printing of flat-mount brake adapters',  '/capabilities/slm-3d-printing-of-flat-mount-brake-adapters/'],
  ['SLM 3D printing of flex-stay plates with argon shielding',  '/capabilities/slm-3d-printing-of-flex-stay-plates-with-argon-shielding/'],
  ['SLM/DMLS printing',  '/capabilities/slm-dmls-printing/'],
  ['SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['Smartphone Mid-Frame & Structural Chassis',  '/systems/smartphone-mid-frame-structural-chassis/'],
  ['Solution + aging heat treatment',  '/capabilities/solution--aging-heat-treatment/'],
  ['Solution treatment + aging',  '/capabilities/solution-treatment--aging/'],
  ['Spoke tensile testing each to 1200N',  '/capabilities/spoke-tensile-testing-each-to-1200n/'],
  ['Sports & Recreation Equipment',  '/systems/sports-recreation-equipment/'],
  ['Spring-back testing (1000+ cycle test)',  '/capabilities/spring-back-testing-1000-cycle-test/'],
  ['Spring rate testing of shock coils',  '/capabilities/spring-rate-testing-of-shock-coils/'],
  ['Springs / Elastic Elements',  '/systems/springs--elastic-elements/'],
  ['Static & dynamic balancing',  '/capabilities/static--dynamic-balancing/'],
  ['Steel wool abrasion test (5000 cycles)',  '/capabilities/steel-wool-abrasion-test-5000-cycles/'],
  ['Sterile packaging',  '/capabilities/sterile-packaging/'],
  ['Sterilization (EtO)',  '/capabilities/sterilization-eto/'],
  ['Sterilization validation',  '/capabilities/sterilization-validation/'],
  ['Sterilization validation (gamma/EtO)',  '/capabilities/sterilization-validation-gamma-eto/'],
  ['Stiffness sorting',  '/capabilities/stiffness-sorting/'],
  ['Straightening',  '/capabilities/straightening/'],
  ['Stress relief annealing',  '/capabilities/stress-relief-annealing/'],
  ['Stress-relief annealing of spring contacts',  '/capabilities/stress-relief-annealing-of-spring-contacts/'],
  ['Stress relief heat treatment',  '/capabilities/stress-relief-heat-treatment/'],
  ['Sub-zero impact testing (-40C Charpy)',  '/capabilities/sub-zero-impact-testing-40c-charpy/'],
  ['Submarine & Naval Propulsion Components',  '/systems/submarine-naval-propulsion-components/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Superplastic forming of spherical hull segments',  '/capabilities/superplastic-forming-of-spherical-hull-segments/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Support removal (EDM/machining)',  '/capabilities/support-removal-edm-machining/'],

  // ── 其他 (Other) ──
  ['Surface analysis (SEM)',  '/capabilities/surface-analysis-sem/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Surface anodizing (optional)',  '/capabilities/surface-anodizing-optional/'],
  ['Surface anodizing / painting',  '/capabilities/surface-anodizing-painting/'],
  ['Surface anodizing / PVD coating',  '/capabilities/surface-anodizing-pvd-coating/'],
  ['Surface blasting / passivation',  '/capabilities/surface-blasting-passivation/'],

  // ── 其他 (Other) ──
  ['Surface coating',  '/capabilities/surface-coating/'],
  ['Surface coating (if required)',  '/capabilities/surface-coating-if-required/'],
  ['Surface enhancement (shot peening)',  '/capabilities/surface-enhancement-shot-peening/'],
  ['Surface finish measurement',  '/capabilities/surface-finish-measurement/'],
  ['Surface finishing',  '/capabilities/surface-finishing/'],
  ['Surface hardness / scratch testing',  '/capabilities/surface-hardness-scratch-testing/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Surface polishing',  '/capabilities/surface-polishing/'],

  // ── 其他 (Other) ──
  ['Surface preparation & painting',  '/capabilities/surface-preparation--painting/'],
  ['Surface roughening / coating',  '/capabilities/surface-roughening-coating/'],
  ['Surface roughness measurement',  '/capabilities/surface-roughness-measurement/'],
  ['Surface roughness measurement of bead-blasted surface (Ra 3-6um)',  '/capabilities/surface-roughness-measurement-of-bead-blasted-surface-ra-3-6um/'],
  ['Surface roughness measurement (Ra 1.0-3.0um for osseointegration)',  '/capabilities/surface-roughness-measurement-ra-10-30um-for-osseointegration/'],
  ['Surface shot peening',  '/capabilities/surface-shot-peening/'],
  ['Surface texturing (SLA/TPS coating)',  '/capabilities/surface-texturing-sla-tps-coating/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Surface treatment (anodizing)',  '/capabilities/surface-treatment-anodizing/'],
  ['Surface Treatment',  '/titanium-surface-treatment/'],

  // ── 其他 (Other) ──
  ['Surgical Instruments',  '/systems/surgical-instruments/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Swiss-type automatic turning',  '/capabilities/swiss-type-automatic-turning/'],
  ['Swiss-type precision turning',  '/capabilities/swiss-type-precision-turning/'],
  ['Swiss-type turning of spindles/pins',  '/capabilities/swiss-type-turning-of-spindles-pins/'],

  // ── 其他 (Other) ──
  ['Tank Internals, Heating & Agitation Systems',  '/systems/tank-internals-heating-agitation-systems/'],
  ['Tensile/fracture toughness testing',  '/capabilities/tensile-fracture-toughness-testing/'],
  ['Tensile testing at cryogenic temperature',  '/capabilities/tensile-testing-at-cryogenic-temperature/'],
  ['Tensile testing',  '/capabilities/tensile-testing/'],
  ['Tensile testing per lot',  '/capabilities/tensile-testing-per-lot/'],
  ['Thermal cycling test (-20C to +150C)',  '/capabilities/thermal-cycling-test-20c-to-150c/'],
  ['Thermal imaging (bond line integrity)',  '/capabilities/thermal-imaging-bond-line-integrity/'],
  ['Thermal imaging of brake track',  '/capabilities/thermal-imaging-of-brake-track/'],
  ['Thread cutting/rolling for NPT connections',  '/capabilities/thread-cutting-rolling-for-npt-connections/'],
  ['Thread gauge inspection',  '/capabilities/thread-gauge-inspection/'],
  ['Thread insert installation',  '/capabilities/thread-insert-installation/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Thread milling of connector ports',  '/capabilities/thread-milling-of-connector-ports/'],

  // ── 其他 (Other) ──
  ['Thread rolling (all safety-critical bolts)',  '/capabilities/thread-rolling-all-safety-critical-bolts/'],
  ['Thread rolling',  '/capabilities/thread-rolling/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Thread rolling / forming',  '/capabilities/thread-rolling-forming/'],

  // ── 其他 (Other) ──
  ['Thread rolling of all fasteners',  '/capabilities/thread-rolling-of-all-fasteners/'],
  ['Thread rolling of pedicle screws (never cut threads)',  '/capabilities/thread-rolling-of-pedicle-screws-never-cut-threads/'],
  ['Thread rolling of stud bolts from STA rod stock',  '/capabilities/thread-rolling-of-stud-bolts-from-sta-rod-stock/'],
  ['Thread rolling of tie rods',  '/capabilities/thread-rolling-of-tie-rods/'],
  ['thread rolling of titanium',  '/products/capabilities/thread-rolling/'],
  ['Thread rolling / whirling',  '/capabilities/thread-rolling-whirling/'],
  ['Through-Spindle High-Pressure Coolant System',  '/equipment/high-pressure-coolant/'],
  ['Ti-1023 (Ti-10V-2Fe-3Al)',  '/materials/ti-1023-ti-10v-2fe-3al/'],
  ['Ti-1100',  '/materials/ti-1100/'],
  ['Ti-15V-3Cr-3Sn-3Al',  '/materials/ti-15v-3cr-3sn-3al/'],
  ['Ti-5Al-2.5Sn ELI',  '/materials/ti-5al-25sn-eli/'],
  ['Ti-5Al-5V-5Mo-3Cr High Strength Titanium',  '/materials/ti-5553/'],
  ['Ti-6242 (Ti-6Al-2Sn-4Zr-2Mo)',  '/materials/ti-6242-ti-6al-2sn-4zr-2mo/'],
  ['Ti-6246 (Ti-6Al-2Sn-4Zr-6Mo)',  '/materials/ti-6246-ti-6al-2sn-4zr-6mo/'],
  ['Ti-65 (Ti-6Al-4Sn-9Zr-1Mo-1W-0.3Si)',  '/materials/ti-65-ti-6al-4sn-9zr-1mo-1w-03si/'],
  ['Ti-6Al-4V ELI',  '/materials/grade-23/'],
  ['Ti-6Al-4V',  '/materials/grade-5/'],
  ['Ti-6Al-7Nb (ASTM F1295)',  '/materials/ti-6al-7nb-astm-f1295/'],

  // ── 钣金加工 (Fabrication) ──
  ['Ti tube bending + welding for bottle cages',  '/capabilities/ti-tube-bending--welding-for-bottle-cages/'],
  ['TIG / EB welding of case sections',  '/capabilities/tig-eb-welding-of-case-sections/'],
  ['TIG (GTAW) Pipe Welding',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['TIG/MIG welding',  '/capabilities/tig-mig-welding/'],
  ['TIG orbital welding',  '/capabilities/tig-orbital-welding/'],
  ['TIG Welding & Fabrication',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['TIG welding of assemblies',  '/capabilities/tig-welding-of-assemblies/'],
  ['TIG welding of basket seams and hooks',  '/capabilities/tig-welding-of-basket-seams-and-hooks/'],
  ['TIG welding of built-up propellers',  '/capabilities/tig-welding-of-built-up-propellers/'],
  ['TIG welding of frame assemblies',  '/capabilities/tig-welding-of-frame-assemblies/'],
  ['TIG welding of shield assemblies (back-side only to avoid weld spatter on plasma face)',  '/capabilities/tig-welding-of-shield-assemblies-back-side-only-to-avoid-weld-spatter-on-plasma-face/'],
  ['TIG welding of tank mounting brackets',  '/capabilities/tig-welding-of-tank-mounting-brackets/'],

  // ── 其他 (Other) ──
  ['Titanium 3D-Printed Ergonomic Mouse',  '/products/titanium-3d-printed-ergonomic-mouse/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['titanium 3D printing parts',  '/titanium-additive-manufacturing/'],

  // ── 其他 (Other) ──
  ['Titanium Acetabular Cup',  '/products/titanium-acetabular-cup/'],
  ['Titanium Acoustic Waveguide Extension',  '/products/titanium-acoustic-waveguide-extension/'],
  ['Titanium Action Camera Lens Bezel',  '/products/titanium-action-camera-lens-bezel/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Titanium Additive Manufacturing',  '/titanium-additive-manufacturing/'],

  // ── 其他 (Other) ──
  ['titanium AI infrastructure components',  '/industries/ai-infrastructure/'],
  ['Titanium Air Sparger Pipe',  '/products/titanium-air-sparger-pipe/'],
  ['Titanium Anode Basket Bottom Plate',  '/products/titanium-anode-basket-bottom-plate/'],
  ['Titanium Anode Basket (Expanded Mesh)',  '/products/titanium-anode-basket-expanded-mesh/'],
  ['Titanium Anode Basket Hook',  '/products/titanium-anode-basket-hook/'],
  ['Titanium Anode Basket Stiffener Rib',  '/products/titanium-anode-basket-stiffener-rib/'],
  ['Titanium Anti-Roll Bar Droplink',  '/products/titanium-anti-roll-bar-droplink/'],
  ['Titanium AUV Propeller Shaft',  '/products/titanium-auv-propeller-shaft/'],
  ['Titanium Ball Valve Stem',  '/products/titanium-ball-valve-stem/'],
  ['Titanium Ballistic Armor Plate',  '/products/titanium-ballistic-armor-plate/'],
  ['Titanium Bell Crank Rocker Arm',  '/products/titanium-bell-crank-rocker-arm/'],
  ['Titanium Bleed Air Duct',  '/products/titanium-bleed-air-duct/'],
  ['Titanium Blind Flange (ASME B16.5)',  '/products/titanium-blind-flange-asme-b165/'],
  ['Titanium Bone Plate',  '/products/titanium-bone-plate/'],
  ['Titanium Bone Screw',  '/products/titanium-bone-screw/'],
  ['Titanium Bottom Bracket Shell',  '/products/titanium-bottom-bracket-shell/'],
  ['Titanium Bottom Bracket Spindle',  '/products/titanium-bottom-bracket-spindle/'],
  ['Titanium Brake Bleed Port Screw',  '/products/titanium-brake-bleed-port-screw/'],
  ['Titanium Brake Caliper Mounting Bolt',  '/products/titanium-brake-caliper-mounting-bolt/'],
  ['Titanium Brake Caliper Piston Insert',  '/products/titanium-brake-caliper-piston-insert/'],
  ['Titanium Brake Lever Pivot Pin',  '/products/titanium-brake-lever-pivot-pin/'],
  ['Titanium Brake Pad Retaining Pin',  '/products/titanium-brake-pad-retaining-pin/'],
  ['Titanium Brake Rotor (Disc)',  '/products/titanium-brake-rotor-disc/'],
  ['Titanium Camber Adjustment Shim',  '/products/titanium-camber-adjustment-shim/'],
  ['Titanium Camera Hot Shoe Mount',  '/products/titanium-camera-hot-shoe-mount/'],
  ['Titanium Camera Lens Filter Ring',  '/products/titanium-camera-lens-filter-ring/'],
  ['Titanium Cardiovascular Stent',  '/products/titanium-cardiovascular-stent/'],
  ['Titanium Cassette Cog',  '/products/titanium-cassette-cog/'],
  ['Titanium Catalyst Basket Mesh Liner',  '/products/titanium-catalyst-basket-mesh-liner/'],
  ['Titanium Centering Ring (KF/ISO)',  '/products/titanium-centering-ring-kf-iso/'],
  ['Titanium Ceramic Heater Clamp Plate',  '/products/titanium-ceramic-heater-clamp-plate/'],
  ['Titanium Chainring Bolt',  '/products/titanium-chainring-bolt/'],
  ['Titanium Chainring',  '/products/titanium-chainring/'],
  ['Titanium Chamber Liner (Upper)',  '/products/titanium-chamber-liner-upper/'],
  ['titanium chemical processing equipment',  '/industries/chemical/'],
  ['Titanium Chlorine Compressor Impeller',  '/products/titanium-chlorine-compressor-impeller/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Titanium CNC Machining Services',  '/titanium-cnc-machining-services/'],
  ['titanium CNC parts',  '/parts/titanium-cnc-parts/'],

  // ── 其他 (Other) ──
  ['Titanium Coilover Spring',  '/products/titanium-coilover-spring/'],
  ['titanium components for the energy industry',  '/industries/energy/'],
  ['titanium components for UAVs and drones',  '/industries/uav-drones/'],
  ['Titanium Compressor Blade',  '/products/titanium-compressor-blade/'],
  ['Titanium Compressor Blisk',  '/products/titanium-compressor-blisk/'],
  ['Titanium Compressor Casing Segment',  '/products/titanium-compressor-casing-segment/'],
  ['Titanium Concentric Reducer',  '/products/titanium-concentric-reducer/'],
  ['Titanium Conflat Knife-Edge Ring',  '/products/titanium-conflat-knife-edge-ring/'],
  ['Titanium Connecting Rod',  '/products/titanium-connecting-rod/'],
  ['Titanium Control Rod Seal Housing',  '/products/titanium-control-rod-seal-housing/'],
  ['Titanium Copper-Cored Busbar',  '/products/titanium-copper-cored-busbar/'],
  ['Titanium Cotter Pin (DIN 94)',  '/products/titanium-cotter-pin-din-94/'],
  ['Titanium Countersunk Screw (ISO 10642)',  '/products/titanium-countersunk-screw-iso-10642/'],
  ['Titanium Craniofacial Mesh',  '/products/titanium-craniofacial-mesh/'],
  ['Titanium Cryogenic H2 Flange Bolt',  '/products/titanium-cryogenic-h2-flange-bolt/'],
  ['Titanium Cryogenic Tank Clamp Band',  '/products/titanium-cryogenic-tank-clamp-band/'],
  ['Titanium Deep-Sea Release Hook Pin',  '/products/titanium-deep-sea-release-hook-pin/'],
  ['Titanium Dental Abutment (Angled)',  '/products/titanium-dental-abutment-angled/'],
  ['Titanium Dental Abutment',  '/products/titanium-dental-abutment/'],
  ['Titanium Dental Implant Fixture',  '/products/titanium-dental-implant-fixture/'],
  ['Titanium Derailleur Hanger',  '/products/titanium-derailleur-hanger/'],
  ['Titanium Derailleur Limit Screw',  '/products/titanium-derailleur-limit-screw/'],
  ['Titanium Derailleur Pivot Pin',  '/products/titanium-derailleur-pivot-pin/'],
  ['Titanium Derailleur Pulley',  '/products/titanium-derailleur-pulley/'],
  ['Titanium Disc Brake Rotor Bolt',  '/products/titanium-disc-brake-rotor-bolt/'],
  ['Titanium Dive Watch Case',  '/products/titanium-dive-watch-case/'],
  ['Titanium Dive Watch Crown',  '/products/titanium-dive-watch-crown/'],
  ['Titanium Dosing Pump Impeller',  '/products/titanium-dosing-pump-impeller/'],
  ['Titanium Double Ferrule Back Ring',  '/products/titanium-double-ferrule-back-ring/'],
  ['Titanium Double Ferrule Front Sleeve',  '/products/titanium-double-ferrule-front-sleeve/'],
  ['Titanium Downhole Production Tubing',  '/products/titanium-downhole-production-tubing/'],
  ['Titanium Downhole Wireline Barrel',  '/products/titanium-downhole-wireline-barrel/'],
  ['Titanium ECCS Valve Stem',  '/products/titanium-eccs-valve-stem/'],
  ['Titanium EDC Pen Body',  '/products/titanium-edc-pen-body/'],
  ['Titanium EDC Utility Knife Handle',  '/products/titanium-edc-utility-knife-handle/'],
  ['Titanium Eductor Nozzle',  '/products/titanium-eductor-nozzle/'],
  ['Titanium Embolization Coil Mandrel',  '/products/titanium-embolization-coil-mandrel/'],
  ['Titanium Endoscope Sheath',  '/products/titanium-endoscope-sheath/'],
  ['Titanium Engine Pylon Bracket',  '/products/titanium-engine-pylon-bracket/'],
  ['Titanium Environmental Control Duct',  '/products/titanium-environmental-control-duct/'],
  ['Titanium Equal Tee (ASME B16.9)',  '/products/titanium-equal-tee-asme-b169/'],
  ['Titanium Exhaust Baffle Plate',  '/products/titanium-exhaust-baffle-plate/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Titanium Extrusion',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],

  // ── 其他 (Other) ──
  ['titanium fabricated parts',  '/parts/titanium-fabricated-parts/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium Fabrication Services',  '/titanium-fabrication-services/'],

  // ── 其他 (Other) ──
  ['titanium fasteners',  '/products/capabilities/cnc-turning-of-bolt-heads-and-threads/'],
  ['Titanium Femoral Condyle',  '/products/titanium-femoral-condyle/'],
  ['Titanium Fender Mounting Bolt',  '/products/titanium-fender-mounting-bolt/'],
  ['Titanium Filter Press Tie Rod',  '/products/titanium-filter-press-tie-rod/'],
  ['titanium flanges',  '/products/capabilities/cnc-machining-of-mating-flanges/'],
  ['Titanium Flashlight Body',  '/products/titanium-flashlight-body/'],
  ['Titanium Flat-Mount Brake Adapter',  '/products/titanium-flat-mount-brake-adapter/'],
  ['Titanium Flat Washer (ISO 7089)',  '/products/titanium-flat-washer-iso-7089/'],
  ['Titanium Foldable Phone Hinge',  '/products/titanium-foldable-phone-hinge/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Titanium Forging',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],

  // ── 其他 (Other) ──
  ['Titanium Fork Air Chamber Top Cap',  '/products/titanium-fork-air-chamber-top-cap/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Titanium Forming',  '/titanium-forming-heavy-manufacturing/'],
  ['Titanium Forming & Heavy Manufacturing',  '/titanium-forming-heavy-manufacturing/'],

  // ── 其他 (Other) ──
  ['Titanium Frame Flip Chip',  '/products/titanium-frame-flip-chip/'],
  ['Titanium Fuel Cell End Plate',  '/products/titanium-fuel-cell-end-plate/'],
  ['Titanium Fuel Pool Rack Spacer',  '/products/titanium-fuel-pool-rack-spacer/'],
  ['Titanium Gas Check Valve Plunger',  '/products/titanium-gas-check-valve-plunger/'],
  ['Titanium Gas Quick-Disconnect Coupler',  '/products/titanium-gas-quick-disconnect-coupler/'],
  ['Titanium Gas Y-Splitter Connector',  '/products/titanium-gas-y-splitter-connector/'],
  ['Titanium Gate Valve Seal Retainer',  '/products/titanium-gate-valve-seal-retainer/'],
  ['Titanium GPS Mount Bolt',  '/products/titanium-gps-mount-bolt/'],
  ['Titanium Handlebar End Plug',  '/products/titanium-handlebar-end-plug/'],
  ['Titanium Handlebar Grip Lock Ring',  '/products/titanium-handlebar-grip-lock-ring/'],
  ['Titanium Headphone Driver Enclosure',  '/products/titanium-headphone-driver-enclosure/'],
  ['Titanium Headset Compression Plug',  '/products/titanium-headset-compression-plug/'],
  ['Titanium Headset Crown Race',  '/products/titanium-headset-crown-race/'],
  ['Titanium Headset Spacer',  '/products/titanium-headset-spacer/'],
  ['Titanium Headset Top Cap Screw',  '/products/titanium-headset-top-cap-screw/'],
  ['Titanium Heat Exchanger Tube Bundle',  '/products/titanium-heat-exchanger-tube-bundle/'],
  ['Titanium Heat Exchanger Tube Sheet',  '/products/titanium-heat-exchanger-tube-sheet/'],
  ['Titanium Helicopter Rotor Hub',  '/products/titanium-helicopter-rotor-hub/'],
  ['Titanium Hex Bolt (ISO 4014)',  '/products/titanium-hex-bolt-iso-4014/'],
  ['Titanium Hex Nut (ISO 4032)',  '/products/titanium-hex-nut-iso-4032/'],
  ['Titanium High-Load Flange Washer',  '/products/titanium-high-load-flange-washer/'],
  ['Titanium Hip Stem',  '/products/titanium-hip-stem/'],
  ['Titanium Hub Bolt (M12)',  '/products/titanium-hub-bolt-m12/'],
  ['Titanium Hub Freehub Body Spline',  '/products/titanium-hub-freehub-body-spline/'],
  ['Titanium Hydraulic Brake Banjo Bolt',  '/products/titanium-hydraulic-brake-banjo-bolt/'],
  ['Titanium Hydrogen Flame Arrestor',  '/products/titanium-hydrogen-flame-arrestor/'],
  ['Titanium Hydrogen Storage Valve Stem',  '/products/titanium-hydrogen-storage-valve-stem/'],
  ['Titanium Hypersonic Control Surface',  '/products/titanium-hypersonic-control-surface/'],
  ['Titanium Immersion Heater Sheath',  '/products/titanium-immersion-heater-sheath/'],
  ['titanium industrial equipment components',  '/industries/industrial-equipment/'],
  ['Titanium Intramedullary Nail',  '/products/titanium-intramedullary-nail/'],
  ['Titanium Ion Implantation Electrode',  '/products/titanium-ion-implantation-electrode/'],
  ['Titanium Key Organizer Screw',  '/products/titanium-key-organizer-screw/'],
  ['Titanium Landing Gear Side Brace',  '/products/titanium-landing-gear-side-brace/'],
  ['Titanium Landing Gear Strut',  '/products/titanium-landing-gear-strut/'],
  ['Titanium Landing Gear Truck Beam',  '/products/titanium-landing-gear-truck-beam/'],
  ['Titanium Laparoscopic Stapler Anvil',  '/products/titanium-laparoscopic-stapler-anvil/'],
  ['Titanium Laptop Hinge Bracket',  '/products/titanium-laptop-hinge-bracket/'],
  ['Titanium Laptop Hinge Shaft',  '/products/titanium-laptop-hinge-shaft/'],
  ['Titanium Launch Canister Rail',  '/products/titanium-launch-canister-rail/'],
  ['Titanium Lens Retaining Ring (Metrology)',  '/products/titanium-lens-retaining-ring-metrology/'],
  ['Titanium Linkage Pivot Bolt',  '/products/titanium-linkage-pivot-bolt/'],
  ['Titanium Liquid Level Float',  '/products/titanium-liquid-level-float/'],
  ['Titanium Lithography Stage Flexure',  '/products/titanium-lithography-stage-flexure/'],
  ['Titanium Long Radius Elbow (ASME B16.9)',  '/products/titanium-long-radius-elbow-asme-b169/'],
  ['Titanium LPT Blade (Gamma-TiAl)',  '/products/titanium-lpt-blade-gamma-tial/'],
  ['Titanium Main Condenser Tube',  '/products/titanium-main-condenser-tube/'],
  ['Titanium Main Pivot Axle',  '/products/titanium-main-pivot-axle/'],
  ['titanium marine parts',  '/parts/titanium-marine-parts/'],
  ['Titanium Mechanical Keyboard Keycap',  '/products/titanium-mechanical-keyboard-keycap/'],
  ['titanium medical components',  '/parts/titanium-medical-components/'],
  ['Titanium Micro-Orifice Restrictor',  '/products/titanium-micro-orifice-restrictor/'],
  ['Titanium Missile Airframe Skin',  '/products/titanium-missile-airframe-skin/'],
  ['Titanium Mist Eliminator Frame',  '/products/titanium-mist-eliminator-frame/'],
  ['Titanium MMO-Coated Substrate Plate',  '/products/titanium-mmo-coated-substrate-plate/'],
  ['Titanium MOCVD Susceptor Support Arm',  '/products/titanium-mocvd-susceptor-support-arm/'],
  ['titanium motorsport parts',  '/parts/titanium-motorsport-parts/'],
  ['Titanium Multi-Port Gas Manifold',  '/products/titanium-multi-port-gas-manifold/'],
  ['Titanium Neuro Guidewire',  '/products/titanium-neuro-guidewire/'],
  ['Titanium Offshore Firewater Nozzle',  '/products/titanium-offshore-firewater-nozzle/'],
  ['Titanium Orifice Plate (Flow Meter)',  '/products/titanium-orifice-plate-flow-meter/'],
  ['Titanium Orthodontic Archwire',  '/products/titanium-orthodontic-archwire/'],
  ['Titanium Pacemaker Enclosure',  '/products/titanium-pacemaker-enclosure/'],
  ['titanium parts',  '/parts/'],
  ['Titanium PCB Edge Grip',  '/products/titanium-pcb-edge-grip/'],
  ['Titanium Pedal Cleat Screw',  '/products/titanium-pedal-cleat-screw/'],
  ['Titanium Pedal Spindle',  '/products/titanium-pedal-spindle/'],
  ['Titanium Pedal Traction Pin',  '/products/titanium-pedal-traction-pin/'],
  ['Titanium PEEK-Insulated Hybrid Bolt',  '/products/titanium-peek-insulated-hybrid-bolt/'],
  ['Titanium PEM Bipolar Plate',  '/products/titanium-pem-bipolar-plate/'],
  ['Titanium PEM Gas Diffusion Layer',  '/products/titanium-pem-gas-diffusion-layer/'],
  ['Titanium Pen Clip',  '/products/titanium-pen-clip/'],
  ['titanium pipe components',  '/parts/titanium-pipe-components/'],
  ['Titanium Pipe U-Bolt',  '/products/titanium-pipe-u-bolt/'],
  ['Titanium Pipeline Repair Sleeve',  '/products/titanium-pipeline-repair-sleeve/'],
  ['Titanium Pivot Bearing Retainer Circlip',  '/products/titanium-pivot-bearing-retainer-circlip/'],
  ['Titanium Pivot Bearing Spacer Sleeve',  '/products/titanium-pivot-bearing-spacer-sleeve/'],
  ['Titanium Plating Crane Lifting Eye',  '/products/titanium-plating-crane-lifting-eye/'],
  ['Titanium Plating Rack Cross Bar',  '/products/titanium-plating-rack-cross-bar/'],
  ['Titanium Plating Rack Spline',  '/products/titanium-plating-rack-spline/'],
  ['Titanium Plating Rack Thumb Screw',  '/products/titanium-plating-rack-thumb-screw/'],
  ['Titanium Pocket Comb',  '/products/titanium-pocket-comb/'],
  ['Titanium Propeller Hub Cap',  '/products/titanium-propeller-hub-cap/'],
  ['Titanium Propeller Pitch Linkage',  '/products/titanium-propeller-pitch-linkage/'],
  ['Titanium Propeller Shaft',  '/products/titanium-propeller-shaft/'],
  ['Titanium Pump Shaft Sleeve',  '/products/titanium-pump-shaft-sleeve/'],
  ['Titanium Quartz Window Retainer',  '/products/titanium-quartz-window-retainer/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Titanium Rapid Prototyping',  '/titanium-additive-manufacturing/rapid-prototyping/'],

  // ── 其他 (Other) ──
  ['Titanium Reactor Agitator Shaft',  '/products/titanium-reactor-agitator-shaft/'],
  ['Titanium Reactor Impeller Blade',  '/products/titanium-reactor-impeller-blade/'],
  ['Titanium Reactor Lining Plate',  '/products/titanium-reactor-lining-plate/'],
  ['Titanium Rear Shock Coil Spring',  '/products/titanium-rear-shock-coil-spring/'],
  ['Titanium Rear Shock Mounting Bolt',  '/products/titanium-rear-shock-mounting-bolt/'],
  ['Titanium RF Grounding Spring Finger',  '/products/titanium-rf-grounding-spring-finger/'],
  ['Titanium Rocket Motor Case',  '/products/titanium-rocket-motor-case/'],
  ['Titanium ROV Manipulator Knuckle',  '/products/titanium-rov-manipulator-knuckle/'],
  ['Titanium ROV Tether Swivel Joint',  '/products/titanium-rov-tether-swivel-joint/'],
  ['Titanium Saddle Clamp Washer',  '/products/titanium-saddle-clamp-washer/'],
  ['Titanium Saddle Rail Clamp Bolt',  '/products/titanium-saddle-rail-clamp-bolt/'],
  ['Titanium Satellite Deployment Shaft',  '/products/titanium-satellite-deployment-shaft/'],
  ['Titanium Seatpost Collar Bolt',  '/products/titanium-seatpost-collar-bolt/'],
  ['Titanium Seawater Strainer Housing',  '/products/titanium-seawater-strainer-housing/'],
  ['Titanium Segmented Clamping Ring',  '/products/titanium-segmented-clamping-ring/'],
  ['Titanium Serrated Lock Washer',  '/products/titanium-serrated-lock-washer/'],
  ['Titanium Shadow Ring Bracket',  '/products/titanium-shadow-ring-bracket/'],
  ['Titanium Shield Stand-off Bushing',  '/products/titanium-shield-stand-off-bushing/'],
  ['Titanium Shift Lever Clamp Band',  '/products/titanium-shift-lever-clamp-band/'],
  ['Titanium SIM Tray Eject Pin',  '/products/titanium-sim-tray-eject-pin/'],
  ['Titanium Sintered Filter Element',  '/products/titanium-sintered-filter-element/'],
  ['Titanium Slip-On Flange',  '/products/titanium-slip-on-flange/'],
  ['Titanium Slit-Valve Oval Bezel',  '/products/titanium-slit-valve-oval-bezel/'],
  ['Titanium Slit-Valve Protection Shunt',  '/products/titanium-slit-valve-protection-shunt/'],
  ['Titanium Sludge Scraper Blade',  '/products/titanium-sludge-scraper-blade/'],
  ['Titanium Smart Glasses Temple Arm',  '/products/titanium-smart-glasses-temple-arm/'],
  ['Titanium Smartphone Mid-Frame',  '/products/titanium-smartphone-mid-frame/'],
  ['Titanium Smartphone SIM Tray',  '/products/titanium-smartphone-sim-tray/'],
  ['Titanium Smartphone Volume Button',  '/products/titanium-smartphone-volume-button/'],
  ['Titanium Smartwatch Bezel',  '/products/titanium-smartwatch-bezel/'],
  ['Titanium Socket Head Cap Screw (ISO 4762)',  '/products/titanium-socket-head-cap-screw-iso-4762/'],
  ['Titanium Spent Fuel Cask Bolt',  '/products/titanium-spent-fuel-cask-bolt/'],
  ['Titanium Spinal Fixation Rod',  '/products/titanium-spinal-fixation-rod/'],
  ['Titanium Spinal Interbody Cage',  '/products/titanium-spinal-interbody-cage/'],
  ['Titanium Spinal Pedicle Screw',  '/products/titanium-spinal-pedicle-screw/'],
  ['Titanium Split-Ring Quick Flange',  '/products/titanium-split-ring-quick-flange/'],
  ['Titanium Spoke Nipple',  '/products/titanium-spoke-nipple/'],
  ['Titanium Spring Lock Washer (DIN 127)',  '/products/titanium-spring-lock-washer-din-127/'],
  ['Titanium SSD Armor Enclosure',  '/products/titanium-ssd-armor-enclosure/'],
  ['Titanium Steam Generator Nozzle',  '/products/titanium-steam-generator-nozzle/'],
  ['Titanium Steam Heating Coil',  '/products/titanium-steam-heating-coil/'],
  ['Titanium Stem Faceplate Bolt',  '/products/titanium-stem-faceplate-bolt/'],
  ['Titanium Stem Steerer Clamp Bolt',  '/products/titanium-stem-steerer-clamp-bolt/'],
  ['Titanium Stub End (Lap Joint)',  '/products/titanium-stub-end-lap-joint/'],
  ['Titanium Stud Bolt (ASTM A193)',  '/products/titanium-stud-bolt-astm-a193/'],
  ['Titanium Stylus Pen Core Rod',  '/products/titanium-stylus-pen-core-rod/'],
  ['Titanium Submarine Engine Mount Stud',  '/products/titanium-submarine-engine-mount-stud/'],
  ['Titanium Submarine Steering Rudder Pin',  '/products/titanium-submarine-steering-rudder-pin/'],
  ['Titanium Submersible Pressure Hull',  '/products/titanium-submersible-pressure-hull/'],
  ['Titanium Subsea Battery Clamp Ring',  '/products/titanium-subsea-battery-clamp-ring/'],
  ['Titanium Subsea Chemical Injection Mandrel',  '/products/titanium-subsea-chemical-injection-mandrel/'],
  ['Titanium Subsea Manifold Swivel Flange',  '/products/titanium-subsea-manifold-swivel-flange/'],
  ['Titanium Subsea Wellhead Valve Block',  '/products/titanium-subsea-wellhead-valve-block/'],
  ['Titanium Sulfuric Acid Injection Quill',  '/products/titanium-sulfuric-acid-injection-quill/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Titanium Surface Treatment',  '/titanium-surface-treatment/'],

  // ── 其他 (Other) ──
  ['Titanium Surgical Forceps',  '/products/titanium-surgical-forceps/'],
  ['Titanium Surgical Retractor Blade',  '/products/titanium-surgical-retractor-blade/'],
  ['Titanium Surgical Scissors Pivot Pin',  '/products/titanium-surgical-scissors-pivot-pin/'],
  ['Titanium Suspension Tie Rod',  '/products/titanium-suspension-tie-rod/'],
  ['Titanium Tank Rim Mounting Bracket',  '/products/titanium-tank-rim-mounting-bracket/'],
  ['Titanium TAVI Frame',  '/products/titanium-tavi-frame/'],
  ['Titanium Thermowell',  '/products/titanium-thermowell/'],
  ['Titanium Threaded Blind Stud (Interior)',  '/products/titanium-threaded-blind-stud-interior/'],
  ['Titanium Threaded NPT Nipple',  '/products/titanium-threaded-npt-nipple/'],
  ['Titanium Threaded Rod (1m)',  '/products/titanium-threaded-rod-1m/'],
  ['Titanium Thru-Axle',  '/products/titanium-thru-axle/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium TIG (GTAW) Welding',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 其他 (Other) ──
  ['Titanium Trim Tab Hydraulic Ram End',  '/products/titanium-trim-tab-hydraulic-ram-end/'],
  ['Titanium TWS Earbud Grille',  '/products/titanium-tws-earbud-grille/'],
  ['Titanium U-Bolt',  '/products/titanium-u-bolt/'],
  ['titanium UAV components',  '/parts/titanium-uav-components/'],
  ['Titanium UHP Hydrogen Tube Fitting',  '/products/titanium-uhp-hydrogen-tube-fitting/'],
  ['Titanium Ultrasonic Booster 35kHz',  '/products/titanium-ultrasonic-booster-35khz/'],
  ['Titanium Ultrasonic Connecting Stud',  '/products/titanium-ultrasonic-connecting-stud/'],
  ['Titanium Ultrasonic Food Cutting Blade',  '/products/titanium-ultrasonic-food-cutting-blade/'],
  ['Titanium Ultrasonic Horn 20kHz',  '/products/titanium-ultrasonic-horn-20khz/'],
  ['Titanium Ultrasonic Knurled Insert',  '/products/titanium-ultrasonic-knurled-insert/'],
  ['Titanium Ultrasonic Medical Sonotrode 40kHz',  '/products/titanium-ultrasonic-medical-sonotrode-40khz/'],
  ['Titanium Ultrasonic Nodal Clamp Ring',  '/products/titanium-ultrasonic-nodal-clamp-ring/'],
  ['Titanium Ultrasonic Rotary Horn',  '/products/titanium-ultrasonic-rotary-horn/'],
  ['Titanium Ultrasonic Slot-Patterned Horn',  '/products/titanium-ultrasonic-slot-patterned-horn/'],
  ['Titanium Underwater Camera Housing',  '/products/titanium-underwater-camera-housing/'],
  ['Titanium Upper Wishbone Clevis',  '/products/titanium-upper-wishbone-clevis/'],
  ['Titanium Valve Strainer Basket',  '/products/titanium-valve-strainer-basket/'],
  ['Titanium VCR Female Nut',  '/products/titanium-vcr-female-nut/'],
  ['Titanium VCR Male Gland',  '/products/titanium-vcr-male-gland/'],
  ['Titanium VCR Micro-Gasket',  '/products/titanium-vcr-micro-gasket/'],
  ['Titanium Vented Vacuum Screw',  '/products/titanium-vented-vacuum-screw/'],
  ['Titanium Wafer Handling End-Effector',  '/products/titanium-wafer-handling-end-effector/'],
  ['Titanium Wallet Card Case',  '/products/titanium-wallet-card-case/'],
  ['Titanium Water Bottle Cage Bolt',  '/products/titanium-water-bottle-cage-bolt/'],
  ['Titanium Water Bottle Cage',  '/products/titanium-water-bottle-cage/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium Waterjet Impeller',  '/products/titanium-waterjet-impeller/'],

  // ── 其他 (Other) ──
  ['Titanium Weld Neck Flange',  '/products/titanium-weld-neck-flange/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium Welding & Assembly',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Titanium Welding',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 其他 (Other) ──
  ['Titanium Wheel Hub Pawl Spring',  '/products/titanium-wheel-hub-pawl-spring/'],
  ['Titanium Wheel Spoke',  '/products/titanium-wheel-spoke/'],
  ['Torque response testing',  '/capabilities/torque-response-testing/'],
  ['Torque-to-tension verification',  '/capabilities/torque-to-tension-verification/'],
  ['Torsion testing',  '/capabilities/torsion-testing/'],
  ['Torsional rigidity testing',  '/capabilities/torsional-rigidity-testing/'],
  ['Trauma & Spine Fixation Hardware',  '/systems/trauma-spine-fixation-hardware/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Triaxial forging of billet for isotropic grain structure',  '/capabilities/triaxial-forging-of-billet-for-isotropic-grain-structure/'],

  // ── 其他 (Other) ──
  ['Tube bending of steam coils (mandrel bending to prevent collapse)',  '/capabilities/tube-bending-of-steam-coils-mandrel-bending-to-prevent-collapse/'],

  // ── 钣金加工 (Fabrication) ──
  ['Tube end expansion / seal welding',  '/capabilities/tube-end-expansion-seal-welding/'],
  ['Tube rolling & longitudinal seam welding (for large diameters)',  '/capabilities/tube-rolling--longitudinal-seam-welding-for-large-diameters/'],

  // ── 其他 (Other) ──
  ['Tube sheet drilling',  '/capabilities/tube-sheet-drilling/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Turn-Mill CNC (Multi-Tasking Machine)',  '/equipment/turn-mill-cnc/'],

  // ── 其他 (Other) ──
  ['UHV Gas Delivery Fittings & Manifolds',  '/systems/uhv-gas-delivery-fittings-manifolds/'],
  ['UHV Sealing Rings & Chamber Compression Hardware',  '/systems/uhv-sealing-rings-chamber-compression-hardware/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Ultra-precision CNC turning/milling (micron tolerance)',  '/capabilities/ultra-precision-cnc-turning-milling-micron-tolerance/'],

  // ── 其他 (Other) ──
  ['Ultra-sonic cleaning',  '/capabilities/ultra-sonic-cleaning/'],
  ['Ultra-sonic cleaning in Class 10',  '/capabilities/ultra-sonic-cleaning-in-class-10/'],
  ['ultrasonic cleaning',  '/products/capabilities/ultrasonic-cleaning/'],
  ['Ultrasonic inspection of clevis brackets',  '/capabilities/ultrasonic-inspection-of-clevis-brackets/'],
  ['Ultrasonic inspection (UT)',  '/capabilities/ultrasonic-inspection-ut/'],
  ['Ultrasonic thickness mapping of pressure hulls',  '/capabilities/ultrasonic-thickness-mapping-of-pressure-hulls/'],

  // ── 钣金加工 (Fabrication) ──
  ['Ultrasonic Welding Components',  '/systems/ultrasonic-welding-components/'],

  // ── 其他 (Other) ──
  ['Vacuum annealing',  '/capabilities/vacuum-annealing/'],
  ['Vacuum arc remelting (VAR) of ELI-grade ingot',  '/capabilities/vacuum-arc-remelting-var-of-eli-grade-ingot/'],
  ['Vacuum-arc remelting (VAR) of ELI-grade ingots',  '/capabilities/vacuum-arc-remelting-var-of-eli-grade-ingots/'],
  ['Vacuum brazing',  '/capabilities/vacuum-brazing/'],
  ['Vacuum brazing (if required)',  '/capabilities/vacuum-brazing-if-required/'],
  ['Vacuum heat treatment',  '/capabilities/vacuum-heat-treatment/'],
  ['Vacuum/Nitrogen Heat-Treat Furnace',  '/equipment/vacuum-heat-treat-furnace/'],
  ['Valves / Fluid Control Components',  '/systems/valves--fluid-control-components/'],
  ['Vibratory finishing',  '/capabilities/vibratory-finishing/'],
  ['VIV fatigue analysis',  '/capabilities/viv-fatigue-analysis/'],
  ['Wastewater Treatment & Environmental Engineering Hardware',  '/systems/wastewater-treatment-environmental-engineering-hardware/'],
  ['Water pressure testing (to rated depth x 1.25 safety factor)',  '/capabilities/water-pressure-testing-to-rated-depth-x-125-safety-factor/'],

  // ── 钣金加工 (Fabrication) ──
  ['Waterjet / abrasive cutting',  '/capabilities/waterjet-abrasive-cutting/'],
  ['Waterjet Cutting',  '/titanium-fabrication-services/waterjet-cutting/'],
  ['waterjet cutting of titanium',  '/titanium-fabrication-services/waterjet-cutting/'],
  ['Waterjet / laser cutting of band profiles',  '/capabilities/waterjet-laser-cutting-of-band-profiles/'],
  ['Waterjet/laser cutting of liner profiles',  '/capabilities/waterjet-laser-cutting-of-liner-profiles/'],
  ['Waterjet / Laser Cutting of Profiles',  '/capabilities/waterjet-laser-cutting-of-profiles/'],

  // ── 其他 (Other) ──
  ['Wear measurement',  '/capabilities/wear-measurement/'],
  ['Weight sorting',  '/capabilities/weight-sorting/'],
  ['Weld integrity inspection',  '/capabilities/weld-integrity-inspection/'],
  ['Weld map documentation',  '/capabilities/weld-map-documentation/'],
  ['Wire drawing & straightening',  '/capabilities/wire-drawing--straightening/'],
  ['Wire drawing to precise diameter +-0.02mm',  '/capabilities/wire-drawing-to-precise-diameter--002mm/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Wire EDM',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Wire EDM Machine',  '/equipment/wire-edm/'],
  ['Wire EDM Machining',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Wire EDM of bearing retainer rings from cold-rolled beta strip',  '/capabilities/wire-edm-of-bearing-retainer-rings-from-cold-rolled-beta-strip/'],
  ['Wire EDM of thin shutter blades and aperture disks',  '/capabilities/wire-edm-of-thin-shutter-blades-and-aperture-disks/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Wire forming of V-prong spring contacts',  '/capabilities/wire-forming-of-v-prong-spring-contacts/'],

  // ── 其他 (Other) ──
  ['X-ray / CT inspection',  '/capabilities/x-ray-ct-inspection/'],
  ['X-ray inspection',  '/capabilities/x-ray-inspection/'],
  ['X-ray inspection (for welds)',  '/capabilities/x-ray-inspection-for-welds/'],
  ['X-ray of weld joints',  '/capabilities/x-ray-of-weld-joints/'],
];

// ================================================================
// 德语 (Deutsch)
// ================================================================
export const de = [

  // ── CNC 加工 (CNC Machining) ──
  ['3/5-Achsen-CNC-Bearbeitung',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3D-Druck SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D-Druck SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Additive Fertigung von Titan',  '/titanium-additive-manufacturing/'],

  // ── 其他 (Other) ──
  ['Chemische Passivierung',  '/titanium-surface-treatment/chemical-passivation/'],
  ['Titan-Oberflächenbehandlung',  '/titanium-surface-treatment/'],
  ['Titanschweißen',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── CNC 加工 (CNC Machining) ──
  ['CNC-Fräsen & Drehen',  '/titanium-cnc-machining-services/cnc-milling-turning/'],

  // ── 其他 (Other) ──
  ['Titanschweißen & Montage',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── CNC 加工 (CNC Machining) ──
  ['CNC-Fräsen',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Drahterodieren (Wire EDM)',  '/titanium-cnc-machining-services/wire-edm-machining/'],

  // ── 其他 (Other) ──
  ['Eloxieren (Typ II',  '/titanium-surface-treatment/anodizing/'],
  ['Eloxieren (Typ II & Typ III)',  '/titanium-surface-treatment/anodizing/'],
  ['Kleinserienproduktion',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['Kundenspezifische Industriekomponenten',  '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Laserschneiden (Blech',  '/titanium-fabrication-services/laser-cutting/'],
  ['Laserschneiden (Blech & Rohr)',  '/titanium-fabrication-services/laser-cutting/'],
  ['Polieren',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Polieren & Sandstrahlen',  '/titanium-surface-treatment/polishing-sandblasting/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Rapid Prototyping',  '/titanium-additive-manufacturing/rapid-prototyping/'],

  // ── 其他 (Other) ──
  ['Rohmaterialvorbereitung',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Rohmaterialvorbereitung & Zuschnitt',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Titan-Blechverarbeitungsdienste',  '/titanium-fabrication-services/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Titan-CNC-Bearbeitungsdienste',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['Titan-Strangpressen',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Titan-Umformung',  '/titanium-forming-heavy-manufacturing/'],
  ['Titan-Umformung & Schwerindustriefertigung',  '/titanium-forming-heavy-manufacturing/'],
  ['Titanschmieden',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen',  '/'],
  ['Wasserstrahlschneiden',  '/titanium-fabrication-services/waterjet-cutting/'],
];

// ================================================================
// 日语 (日本語)
// ================================================================
export const ja = [

  // ── 其他 (Other) ──
  ['化学的不動態化処理',  '/titanium-surface-treatment/chemical-passivation/'],
  ['カスタム産業用部品',  '/titanium-cnc-machining-services/custom-industrial-components/'],

  // ── CNC 加工 (CNC Machining) ──
  ['CNCフライス・旋盤加工',  '/titanium-cnc-machining-services/cnc-milling-turning/'],

  // ── 其他 (Other) ──
  ['チタン増材製造（3Dプリンティング）',  '/titanium-additive-manufacturing/'],
  ['チタン押出加工',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['ワイヤー放電加工',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['総合チタン加工・製造サービス',  '/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3Dプリンティング SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['チタン製缶板金サービス',  '/titanium-fabrication-services/'],
  ['チタン表面処理',  '/titanium-surface-treatment/'],
  ['研磨・サンドブラスト',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['ラピッドプロトタイピング',  '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['チタン溶接・組立',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['チタン鍛造',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['陽極酸化処理（タイプIIおよびIII）',  '/titanium-surface-treatment/anodizing/'],

  // ── CNC 加工 (CNC Machining) ──
  ['チタンCNC加工サービス',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['少量生産',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['原材料準備・サイジング',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3Dプリンティング SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['レーザー切断（シート＆チューブ）',  '/titanium-fabrication-services/laser-cutting/'],
  ['ウォータージェット切断',  '/titanium-fabrication-services/waterjet-cutting/'],
  ['チタン成形・重型製造',  '/titanium-forming-heavy-manufacturing/'],

  // ── CNC 加工 (CNC Machining) ──
  ['3/5軸CNC加工',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
];

// ================================================================
// 法语 (Français)
// ================================================================
export const fr = [

  // ── 其他 (Other) ──
  ['Anodisation (Type II et Type III)',  '/titanium-surface-treatment/anodizing/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Extrusion du Titane',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Fabrication Additive de Titane',  '/titanium-additive-manufacturing/'],

  // ── 其他 (Other) ──
  ['Forgeage du Titane',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],

  // ── 钣金加工 (Fabrication) ──
  ['Formage du Titane et Fabrication Lourde',  '/titanium-forming-heavy-manufacturing/'],

  // ── 其他 (Other) ──
  ['Découpe Laser (Tôle et Tube)',  '/titanium-fabrication-services/laser-cutting/'],
  ['Usinage par Électroérosion au Fil',  '/titanium-cnc-machining-services/wire-edm-machining/'],

  // ── 钣金加工 (Fabrication) ──
  ['Services de Fabrication de Tôlerie Titane',  '/titanium-fabrication-services/'],

  // ── 其他 (Other) ──
  ['Composants Industriels Personnalisés',  '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Préparation et Dimensionnement des Matières Premières',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Découpe au Jet d\'Eau',  '/titanium-fabrication-services/waterjet-cutting/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Fraisage et Tournage CNC',  '/titanium-cnc-machining-services/cnc-milling-turning/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Impression 3D SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Impression 3D SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Passivation Chimique',  '/titanium-surface-treatment/chemical-passivation/'],

  // ── 其他 (Other) ──
  ['Polissage et Sablage',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Production en Faible Volume',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['Prototypage Rapide',  '/titanium-additive-manufacturing/rapid-prototyping/'],

  // ── 钣金加工 (Fabrication) ──
  ['Services Complets de Fabrication et de Traitement du Titane',  '/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Services d\'Usinage CNC du Titane',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['Soudage et Assemblage du Titane',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Traitement de Surface du Titane',  '/titanium-surface-treatment/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Usinage CNC 3/5 Axes',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Usinage CNC 3',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
];

// ================================================================
// 西班牙语 (Español)
// ================================================================
export const es = [

  // ── 其他 (Other) ──
  ['Anodizado (Tipo II y Tipo III)',  '/titanium-surface-treatment/anodizing/'],
  ['Componentes Industriales Personalizados',  '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Corte por Chorro de Agua',  '/titanium-fabrication-services/waterjet-cutting/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Impresión 3D SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['Preparación y Dimensionamiento de Materias Primas',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Impresión 3D SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['Conformado de Titanio y Fabricación Pesada',  '/titanium-forming-heavy-manufacturing/'],
  ['Producción de Bajo Volumen',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['Prototipado Rápido',  '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Extrusión de Titanio',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Mecanizado por Electroerosión por Hilo',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Fabricación Aditiva de Titanio',  '/titanium-additive-manufacturing/'],
  ['Servicios de Fabricación de Titanio',  '/titanium-fabrication-services/'],
  ['Pasivación Química',  '/titanium-surface-treatment/chemical-passivation/'],
  ['Servicios Integrales de Fabricación y Procesamiento de Titanio',  '/'],
  ['Corte Láser (Chapa y Tubo)',  '/titanium-fabrication-services/laser-cutting/'],
  ['Forja de Titanio',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Fresado y Torneado CNC',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Mecanizado CNC de 3/5 Ejes',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Mecanizado CNC de 3',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 其他 (Other) ──
  ['Pulido y Chorreado de Arena',  '/titanium-surface-treatment/polishing-sandblasting/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Servicios de Mecanizado CNC de Titanio',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['Soldadura y Ensamblaje de Titanio',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Tratamiento de Superficie de Titanio',  '/titanium-surface-treatment/'],
];

// ================================================================
// 葡萄牙语 (Português)
// ================================================================
export const pt = [

  // ── 其他 (Other) ──
  ['Componentes Industriais Personalizados',  '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Corte a Laser (Chapa e Tubo)',  '/titanium-fabrication-services/laser-cutting/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Fresamento e Torneamento CNC',  '/titanium-cnc-machining-services/cnc-milling-turning/'],

  // ── 其他 (Other) ──
  ['Polimento e Jateamento de Areia',  '/titanium-surface-treatment/polishing-sandblasting/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Impressão 3D SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['Preparação e Dimensionamento de Matéria-Prima',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Serviços de Usinagem CNC de Titânio',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['Usinagem por Eletroerosão a Fio',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Produção de Baixo Volume',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['Passivação Química',  '/titanium-surface-treatment/chemical-passivation/'],
  ['Soldagem e Montagem de Titânio',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Manufatura Aditiva de Titânio',  '/titanium-additive-manufacturing/'],
  ['Extrusão de Titânio',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Forjamento de Titânio',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Tratamento de Superfície de Titânio',  '/titanium-surface-treatment/'],
  ['Prototipagem Rápida',  '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Anodização (Tipo II e Tipo III)',  '/titanium-surface-treatment/anodizing/'],
  ['Corte a Jato de Água',  '/titanium-fabrication-services/waterjet-cutting/'],
  ['Serviços Abrangentes de Fabricação e Processamento de Titânio',  '/'],
  ['Serviços de Fabricação de Titânio',  '/titanium-fabrication-services/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Impressão 3D SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['Conformação de Titânio e Fabricação Pesada',  '/titanium-forming-heavy-manufacturing/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Usinagem CNC de 3/5 Eixos',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Usinagem CNC de 3',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
];

// ================================================================
// 意大利语 (Italiano)
// ================================================================
export const it = [

  // ── 其他 (Other) ──
  ['Anodizzazione (Tipo II e Tipo III)',  '/titanium-surface-treatment/anodizing/'],
  ['Componenti Industriali Personalizzati',  '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Estrusione del Titanio',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Forgiatura del Titanio',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Formatura del Titanio e Produzione Pesante',  '/titanium-forming-heavy-manufacturing/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Fresatura e Tornitura CNC',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Lavorazione CNC a 3/5 Assi',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Lavorazione CNC a 3',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 其他 (Other) ──
  ['Lavorazione per Elettroerosione a Filo',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Lucidatura e Sabbiatura',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Passivazione Chimica',  '/titanium-surface-treatment/chemical-passivation/'],
  ['Preparazione e Dimensionamento delle Materie Prime',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Produzione a Basso Volume',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['Produzione Additiva di Titanio',  '/titanium-additive-manufacturing/'],
  ['Prototipazione Rapida',  '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Saldatura e Assemblaggio del Titanio',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Servizi Complete di Produzione e Lavorazione del Titanio',  '/'],
  ['Servizi di Fabbricazione del Titanio',  '/titanium-fabrication-services/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Servizi di Lavorazione CNC del Titanio',  '/titanium-cnc-machining-services/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Stampa 3D SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Stampa 3D SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['Taglio a Getto d\'Acqua',  '/titanium-fabrication-services/waterjet-cutting/'],
  ['Taglio Laser (Lamiera e Tubo)',  '/titanium-fabrication-services/laser-cutting/'],
  ['Trattamento Superficiale del Titanio',  '/titanium-surface-treatment/'],
];

// ================================================================
// 韩语 (한국어)
// ================================================================
export const ko = [

  // ── 其他 (Other) ──
  ['소량 생산',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['티타늄 용접 및 조립',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['티타늄 단조',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['티타늄 압출',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['아노다이징 (타입 II 및 III)',  '/titanium-surface-treatment/anodizing/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3D 프린팅 SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['와이어 방전 가공',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['티타늄 표면 처리',  '/titanium-surface-treatment/'],
  ['래피드 프로토타이핑',  '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['원자재 준비 및 사이징',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['연마 및 샌드블라스팅',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['종합 티타늄 가공 및 제조 서비스',  '/'],
  ['티타늄 적층 제조',  '/titanium-additive-manufacturing/'],
  ['티타늄 판금 제작 서비스',  '/titanium-fabrication-services/'],
  ['맞춤형 산업용 부품',  '/titanium-cnc-machining-services/custom-industrial-components/'],

  // ── CNC 加工 (CNC Machining) ──
  ['티타늄 CNC 가공 서비스',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['티타늄 성형 및 중공업 제조',  '/titanium-forming-heavy-manufacturing/'],
  ['레이저 절단 (시트 및 튜브)',  '/titanium-fabrication-services/laser-cutting/'],

  // ── CNC 加工 (CNC Machining) ──
  ['3/5축 CNC 가공',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['CNC 밀링 및 선반 가공',  '/titanium-cnc-machining-services/cnc-milling-turning/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3D 프린팅 SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['화학적 부동태화',  '/titanium-surface-treatment/chemical-passivation/'],
  ['워터젯 절단',  '/titanium-fabrication-services/waterjet-cutting/'],
];

// ================================================================
// 荷兰语 (Nederlands)
// ================================================================
export const nl = [

  // ── CNC 加工 (CNC Machining) ──
  ['3/5-Assige CNC-bewerking',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3D-printen SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D-printen SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 其他 (Other) ──
  ['Additieve Productie van Titanium',  '/titanium-additive-manufacturing/'],
  ['Anodiseren (Type II',  '/titanium-surface-treatment/anodizing/'],
  ['Anodiseren (Type II & Type III)',  '/titanium-surface-treatment/anodizing/'],
  ['Chemische Passivering',  '/titanium-surface-treatment/chemical-passivation/'],

  // ── CNC 加工 (CNC Machining) ──
  ['CNC Frezen en Draaien',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Draadvonken (Wire EDM)',  '/titanium-cnc-machining-services/wire-edm-machining/'],

  // ── 其他 (Other) ──
  ['Grondstofvoorbereiding en -bepaling',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Lasersnijden (Plaat & Buis)',  '/titanium-fabrication-services/laser-cutting/'],
  ['Lasersnijden (Plaat',  '/titanium-fabrication-services/laser-cutting/'],
  ['Op maat gemaakte industriële componenten',  '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Oppervlaktebehandeling van Titanium',  '/titanium-surface-treatment/'],
  ['Polijsten en Zandstralen',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Productie in kleine oplage',  '/titanium-additive-manufacturing/low-volume-production/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Rapid Prototyping',  '/titanium-additive-manufacturing/rapid-prototyping/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Titanium CNC-bewerkingsdiensten',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['Titanium Extrusie',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Titanium Fabricagediensten',  '/titanium-fabrication-services/'],
  ['Titanium Smeden',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Titanium Vormen en Zware Productie',  '/titanium-forming-heavy-manufacturing/'],
  ['Titaniumlassen en Assemblage',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Uitgebreide Titanium Productie- en Verwerkingsdiensten',  '/'],

  // ── 钣金加工 (Fabrication) ──
  ['Waterjetsnijden',  '/titanium-fabrication-services/waterjet-cutting/'],
];

// ================================================================
// 波兰语 (Polski)
// ================================================================
export const pl = [

  // ── 其他 (Other) ──
  ['Anodowanie (Typ II i Typ III)',  '/titanium-surface-treatment/anodizing/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Druk 3D SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Druk 3D SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Frezowanie i Toczenie CNC',  '/titanium-cnc-machining-services/cnc-milling-turning/'],

  // ── 其他 (Other) ──
  ['Kucie Tytanu',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Pasywacja Chemiczna',  '/titanium-surface-treatment/chemical-passivation/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Usługi Obróbki CNC Tytanu',  '/titanium-cnc-machining-services/'],

  // ── 其他 (Other) ──
  ['Cięcie Laserowe (Blacha i Rura)',  '/titanium-fabrication-services/laser-cutting/'],
  ['Obróbka Powierzchniowa Tytanu',  '/titanium-surface-treatment/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Obróbka Elektroerozyjna Drutowa (EDM)',  '/titanium-cnc-machining-services/wire-edm-machining/'],

  // ── 其他 (Other) ──
  ['Niestandardowe Komponenty Przemysłowe',  '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Spawanie i Montaż Tytanu',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Produkcja Niskonakładowa',  '/titanium-additive-manufacturing/low-volume-production/'],
  ['Usługi Obróbki Plastycznej Tytanu',  '/titanium-fabrication-services/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Obróbka CNC 3',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 其他 (Other) ──
  ['Formowanie Tytanu i Produkcja Ciężka',  '/titanium-forming-heavy-manufacturing/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Obróbka CNC 3/5-osiowa',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 其他 (Other) ──
  ['Cięcie Wodne',  '/titanium-fabrication-services/waterjet-cutting/'],
  ['Kompleksowe Usługi Produkcji i Obróbki Tytanu',  '/'],
  ['Polerowanie i Piaskowanie',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Przygotowanie i Wymiarowanie Surowca',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Szybkie Prototypowanie',  '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Wyciskanie Tytanu',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Wytwarzanie Addytywne Tytanu',  '/titanium-additive-manufacturing/'],
];

// 导出汇总（供脚本使用）
export const ALL_LANGS = { en, de, ja, fr, es, pt, it, ko, nl, pl };
