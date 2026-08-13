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

  // ── CNC 加工 (CNC Machining) ──
  ['3/5-Axis CNC Machining',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['3/5-Axis CNC Milling',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 其他 (Other) ──
  ['3D CMM inspection',  '/products/capabilities/3d-cmm-inspection/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['3D Printing SLM/DMLS',  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D Printing SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── CNC 加工 (CNC Machining) ──
  ['5-Axis CNC Machining',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],

  // ── 其他 (Other) ──
  ['5-Axis Machining',  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['aerospace titanium',  '/industries/aerospace/'],
  ['AMS 4928T',  '/materials/grade-5/'],

  // ── 表面处理 (Surface Treatment) ──
  ['anodizing of titanium',  '/titanium-surface-treatment/anodizing/'],
  ['Anodizing (Type II',  '/titanium-surface-treatment/anodizing/'],
  ['Anodizing (Type II & Type III)',  '/titanium-surface-treatment/anodizing/'],

  // ── 其他 (Other) ──
  ['AS9100',  '/capabilities/'],
  ['AS9100D',  '/capabilities/'],
  ['ASTM B348',  '/materials/grade-5/'],
  ['bead blasting',  '/products/capabilities/bead-blasting-anodizing-pvd/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Chemical Passivation',  '/titanium-surface-treatment/chemical-passivation/'],
  ['chemical passivation treatment',  '/titanium-surface-treatment/chemical-passivation/'],

  // ── 其他 (Other) ──
  ['CMM',  '/equipment/cmm/'],

  // ── CNC 加工 (CNC Machining) ──
  ['CNC Machining',  '/titanium-cnc-machining-services/'],
  ['CNC Machining of Fittings & Flanges',  '/titanium-cnc-machining-services/'],
  ['CNC Milling',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC Milling & Turning',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC Turning & Mill-Turn',  '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC Turning & Milling',  '/titanium-cnc-machining-services/cnc-milling-turning/'],

  // ── 首页 ──
  ['Comprehensive Titanium Manufacturing',  '/'],
  ['Comprehensive Titanium Manufacturing & Processing Services',  '/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Custom Industrial Components',  '/titanium-cnc-machining-services/custom-industrial-components/'],

  // ── 其他 (Other) ──
  ['deburring of components',  '/products/capabilities/deburring-edge-rounding/'],
  ['dimensional inspection',  '/products/capabilities/100-dimensional-inspection-cmm/'],

  // ── 表面处理 (Surface Treatment) ──
  ['electropolishing',  '/products/capabilities/electropolishing/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Forming & Bending',  '/titanium-forming-heavy-manufacturing/'],

  // ── 其他 (Other) ──
  ['Grade 1 Titanium',  '/materials/grade-1/'],
  ['Grade 2 Titanium',  '/materials/grade-2/'],
  ['Grade 23 Titanium',  '/materials/grade-23/'],
  ['Grade 5 Titanium',  '/materials/grade-5/'],
  ['Grade 9 Titanium',  '/materials/grade-9/'],
  ['high precision grinding',  '/products/capabilities/high-precision-grinding/'],
  ['ISO 13485',  '/capabilities/'],
  ['ISO 9001',  '/capabilities/'],
  ['ITAR',  '/capabilities/'],

  // ── 钣金加工 (Fabrication) ──
  ['Laser Cutting',  '/titanium-fabrication-services/laser-cutting/'],
  ['Laser Cutting (Sheet',  '/titanium-fabrication-services/laser-cutting/'],
  ['Laser Cutting (Sheet & Tube)',  '/titanium-fabrication-services/laser-cutting/'],
  ['laser welding titanium',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Low-Volume Production',  '/titanium-additive-manufacturing/low-volume-production/'],

  // ── 其他 (Other) ──
  ['marine titanium components',  '/industries/marine/'],
  ['medical implants',  '/industries/medical/'],
  ['NADCAP',  '/capabilities/'],

  // ── 钣金加工 (Fabrication) ──
  ['Pipe Spool Fabrication',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Polishing',  '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Polishing & Sandblasting',  '/titanium-surface-treatment/polishing-sandblasting/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Precision CNC Machining',  '/titanium-cnc-machining-services/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Rapid Prototyping',  '/titanium-additive-manufacturing/rapid-prototyping/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Raw Material Preparation',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Raw Material Preparation & Sizing',  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],

  // ── 其他 (Other) ──
  ['RFQ',  '/rfq/'],
  ['semiconductor titanium components',  '/industries/semiconductor/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['SLM',  '/titanium-additive-manufacturing/3d-printing-slm/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Surface Treatment',  '/titanium-surface-treatment/'],

  // ── 其他 (Other) ──
  ['thread rolling of titanium',  '/products/capabilities/thread-rolling/'],
  ['Ti-6Al-4V ELI',  '/materials/grade-23/'],
  ['Ti-6Al-4V',  '/materials/grade-5/'],

  // ── 钣金加工 (Fabrication) ──
  ['TIG (GTAW) Pipe Welding',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['TIG Welding & Fabrication',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['titanium 3D printing parts',  '/titanium-additive-manufacturing/'],
  ['Titanium Additive Manufacturing',  '/titanium-additive-manufacturing/'],

  // ── 其他 (Other) ──
  ['titanium AI infrastructure components',  '/industries/ai-infrastructure/'],
  ['titanium chemical processing equipment',  '/industries/chemical/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Titanium CNC Machining Services',  '/titanium-cnc-machining-services/'],
  ['titanium CNC parts',  '/parts/titanium-cnc-parts/'],

  // ── 其他 (Other) ──
  ['titanium components for the energy industry',  '/industries/energy/'],
  ['titanium components for UAVs and drones',  '/industries/uav-drones/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Titanium Extrusion',  '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],

  // ── 其他 (Other) ──
  ['titanium fabricated parts',  '/parts/titanium-fabricated-parts/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium Fabrication Services',  '/titanium-fabrication-services/'],

  // ── 其他 (Other) ──
  ['titanium fasteners',  '/products/capabilities/cnc-turning-of-bolt-heads-and-threads/'],
  ['titanium flanges',  '/products/capabilities/cnc-machining-of-mating-flanges/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Titanium Forging',  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Titanium Forming',  '/titanium-forming-heavy-manufacturing/'],
  ['Titanium Forming & Heavy Manufacturing',  '/titanium-forming-heavy-manufacturing/'],

  // ── 其他 (Other) ──
  ['titanium industrial equipment components',  '/industries/industrial-equipment/'],
  ['titanium marine parts',  '/parts/titanium-marine-parts/'],
  ['titanium medical components',  '/parts/titanium-medical-components/'],
  ['titanium motorsport parts',  '/parts/titanium-motorsport-parts/'],
  ['titanium parts',  '/parts/'],
  ['titanium pipe components',  '/parts/titanium-pipe-components/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Titanium Rapid Prototyping',  '/titanium-additive-manufacturing/rapid-prototyping/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Titanium Surface Treatment',  '/titanium-surface-treatment/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium TIG (GTAW) Welding',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 其他 (Other) ──
  ['titanium UAV components',  '/parts/titanium-uav-components/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium Welding & Assembly',  '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Titanium Welding',  '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 其他 (Other) ──
  ['ultrasonic cleaning',  '/products/capabilities/ultrasonic-cleaning/'],

  // ── 钣金加工 (Fabrication) ──
  ['Waterjet Cutting',  '/titanium-fabrication-services/waterjet-cutting/'],
  ['waterjet cutting of titanium',  '/titanium-fabrication-services/waterjet-cutting/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Wire EDM',  '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Wire EDM Machining',  '/titanium-cnc-machining-services/wire-edm-machining/'],
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
