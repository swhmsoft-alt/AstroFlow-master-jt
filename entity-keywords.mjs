/**
 * ====================================================================
 * 实体锚文本映射表 (Entity Anchor Keyword Map)
 * ====================================================================
 *
 * 用途: 定义全站内链的锚文本 → 目标URL映射。
 *       当页面内容中出现锚文本时，rehype 插件自动将其转换为指向目标URL的链接。
 *       英语页面无语言前缀，其他语言自动加 /{lang}/ 前缀。
 *
 * 编辑方式: 直接编辑此文件中的条目，然后运行:
 *   node scripts/generate-entity-keywords.mjs
 *   脚本会读取此文件并写入 astro.config.mjs
 *
 * 格式: [锚文本, 目标路径]
 *       目标路径不需要语言前缀（脚本自动处理）
 * ====================================================================
 */

// ====================================================================
// 英语 (English) — 默认语言，URL 无前缀
// ====================================================================
export const en = [
  // ── 首页 ──
  ['Comprehensive Titanium Manufacturing & Processing Services', '/'],
  ['Comprehensive Titanium Manufacturing', '/'],

  // ── CNC 加工 (CNC Machining) ──
  ['Titanium CNC Machining Services',            '/titanium-cnc-machining-services/'],
  ['3/5-Axis CNC Machining',                     '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['5-Axis CNC Machining',                       '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['CNC Milling & Turning',                      '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC Milling',                                '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Wire EDM Machining',                          '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Wire EDM',                                   '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Custom Industrial Components',               '/titanium-cnc-machining-services/custom-industrial-components/'],

  // ── 增材制造 (Additive Manufacturing) ──
  ['Titanium Additive Manufacturing',            '/titanium-additive-manufacturing/'],
  ['3D Printing SLM/DMLS',                        '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D Printing SLM',                             '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['SLM',                                         '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Rapid Prototyping',                           '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Low-Volume Production',                       '/titanium-additive-manufacturing/low-volume-production/'],

  // ── 钣金加工 (Fabrication) ──
  ['Titanium Fabrication Services',              '/titanium-fabrication-services/'],
  ['Laser Cutting (Sheet & Tube)',                '/titanium-fabrication-services/laser-cutting/'],
  ['Laser Cutting (Sheet',                        '/titanium-fabrication-services/laser-cutting/'],
  ['Waterjet Cutting',                            '/titanium-fabrication-services/waterjet-cutting/'],
  ['Titanium Welding & Assembly',                 '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Titanium Welding',                            '/titanium-fabrication-services/titanium-welding-assembly/'],

  // ── 成型与重型制造 (Forming & Heavy Manufacturing) ──
  ['Titanium Forming & Heavy Manufacturing',      '/titanium-forming-heavy-manufacturing/'],
  ['Titanium Forming',                            '/titanium-forming-heavy-manufacturing/'],
  ['Titanium Forging',                            '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Titanium Extrusion',                          '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Raw Material Preparation & Sizing',           '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Raw Material Preparation',                    '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],

  // ── 表面处理 (Surface Treatment) ──
  ['Titanium Surface Treatment',                  '/titanium-surface-treatment/'],
  ['Anodizing (Type II & Type III)',              '/titanium-surface-treatment/anodizing/'],
  ['Anodizing (Type II',                          '/titanium-surface-treatment/anodizing/'],
  ['Chemical Passivation',                        '/titanium-surface-treatment/chemical-passivation/'],
  ['Polishing & Sandblasting',                    '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Polishing',                                   '/titanium-surface-treatment/polishing-sandblasting/'],

  // ── 材料牌号 (Material Grades) ──
  ['Ti-6Al-4V',                                   '/materials/grade-5/'],
  ['Grade 5 Titanium',                            '/materials/grade-5/'],
  ['AMS 4928T',                                   '/materials/grade-5/'],
  ['Ti-6Al-4V ELI',                               '/materials/grade-23/'],
  ['Grade 23 Titanium',                           '/materials/grade-23/'],
  ['Grade 2 Titanium',                            '/materials/grade-2/'],
  ['Grade 1 Titanium',                            '/materials/grade-1/'],
  ['Grade 9 Titanium',                            '/materials/grade-9/'],

  // ── 认证标准 (Certifications & Standards) ──
  ['AS9100',                                      '/capabilities/'],
  ['AS9100D',                                     '/capabilities/'],
  ['ISO 9001',                                    '/capabilities/'],
  ['ISO 13485',                                   '/capabilities/'],
  ['ITAR',                                        '/capabilities/'],
  ['NADCAP',                                      '/capabilities/'],

  // ── 设备 (Equipment) ──
  ['CMM',                                         '/equipment/cmm/'],

  // ── 其他 (Others) ──
  ['RFQ',                                         '/rfq/'],
];

// ====================================================================
// 德语 (Deutsch)
// ====================================================================
export const de = [
  ['Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen', '/'],
  ['Titan-CNC-Bearbeitungsdienste',     '/titanium-cnc-machining-services/'],
  ['3/5-Achsen-CNC-Bearbeitung',       '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['CNC-Fräsen & Drehen',              '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['CNC-Fräsen',                       '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Drahterodieren (Wire EDM)',         '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Kundenspezifische Industriekomponenten', '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Additive Fertigung von Titan',     '/titanium-additive-manufacturing/'],
  ['3D-Druck SLM/DMLS',                '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D-Druck SLM',                     '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Rapid Prototyping',               '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Kleinserienproduktion',            '/titanium-additive-manufacturing/low-volume-production/'],
  ['Titan-Blechverarbeitungsdienste',  '/titanium-fabrication-services/'],
  ['Laserschneiden (Blech & Rohr)',    '/titanium-fabrication-services/laser-cutting/'],
  ['Laserschneiden (Blech',            '/titanium-fabrication-services/laser-cutting/'],
  ['Wasserstrahlschneiden',            '/titanium-fabrication-services/waterjet-cutting/'],
  ['Titanschweißen & Montage',         '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Titanschweißen',                   '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Titan-Umformung & Schwerindustriefertigung', '/titanium-forming-heavy-manufacturing/'],
  ['Titan-Umformung',                  '/titanium-forming-heavy-manufacturing/'],
  ['Titanschmieden',                   '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Titan-Strangpressen',              '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Rohmaterialvorbereitung & Zuschnitt', '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Rohmaterialvorbereitung',          '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Titan-Oberflächenbehandlung',      '/titanium-surface-treatment/'],
  ['Eloxieren (Typ II & Typ III)',     '/titanium-surface-treatment/anodizing/'],
  ['Eloxieren (Typ II',                '/titanium-surface-treatment/anodizing/'],
  ['Chemische Passivierung',          '/titanium-surface-treatment/chemical-passivation/'],
  ['Polieren & Sandstrahlen',          '/titanium-surface-treatment/polishing-sandblasting/'],
  ['Polieren',                         '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 日语 (日本語)
// ====================================================================
export const ja = [
  ['総合チタン加工・製造サービス', '/'],
  ['チタンCNC加工サービス',        '/titanium-cnc-machining-services/'],
  ['3/5軸CNC加工',                '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['CNCフライス・旋盤加工',        '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['ワイヤー放電加工',             '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['カスタム産業用部品',          '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['チタン増材製造（3Dプリンティング）', '/titanium-additive-manufacturing/'],
  ['3Dプリンティング SLM/DMLS',   '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3Dプリンティング SLM',        '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['ラピッドプロトタイピング',    '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['少量生産',                    '/titanium-additive-manufacturing/low-volume-production/'],
  ['チタン製缶板金サービス',       '/titanium-fabrication-services/'],
  ['レーザー切断（シート＆チューブ）', '/titanium-fabrication-services/laser-cutting/'],
  ['ウォータージェット切断',       '/titanium-fabrication-services/waterjet-cutting/'],
  ['チタン溶接・組立',             '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['チタン成形・重型製造',         '/titanium-forming-heavy-manufacturing/'],
  ['チタン鍛造',                  '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['チタン押出加工',               '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['原材料準備・サイジング',       '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['チタン表面処理',               '/titanium-surface-treatment/'],
  ['陽極酸化処理（タイプIIおよびIII）', '/titanium-surface-treatment/anodizing/'],
  ['化学的不動態化処理',          '/titanium-surface-treatment/chemical-passivation/'],
  ['研磨・サンドブラスト',         '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 法语 (Français)
// ====================================================================
export const fr = [
  ['Services Complets de Fabrication et de Traitement du Titane', '/'],
  ["Services d'Usinage CNC du Titane",  '/titanium-cnc-machining-services/'],
  ['Usinage CNC 3/5 Axes',            '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Usinage CNC 3',                   '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Fraisage et Tournage CNC',        '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ["Usinage par Électroérosion au Fil", '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Composants Industriels Personnalisés', '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Fabrication Additive de Titane',  '/titanium-additive-manufacturing/'],
  ['Impression 3D SLM/DMLS',          '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Impression 3D SLM',               '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Prototypage Rapide',              '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Production en Faible Volume',     '/titanium-additive-manufacturing/low-volume-production/'],
  ['Services de Fabrication de Tôlerie Titane', '/titanium-fabrication-services/'],
  ['Découpe Laser (Tôle et Tube)',    '/titanium-fabrication-services/laser-cutting/'],
  ["Découpe au Jet d'Eau",            '/titanium-fabrication-services/waterjet-cutting/'],
  ['Soudage et Assemblage du Titane', '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Formage du Titane et Fabrication Lourde', '/titanium-forming-heavy-manufacturing/'],
  ['Forgeage du Titane',              '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Extrusion du Titane',             '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Préparation et Dimensionnement des Matières Premières', '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Traitement de Surface du Titane', '/titanium-surface-treatment/'],
  ['Anodisation (Type II et Type III)', '/titanium-surface-treatment/anodizing/'],
  ['Passivation Chimique',            '/titanium-surface-treatment/chemical-passivation/'],
  ['Polissage et Sablage',            '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 西班牙语 (Español)
// ====================================================================
export const es = [
  ['Servicios Integrales de Fabricación y Procesamiento de Titanio', '/'],
  ['Servicios de Mecanizado CNC de Titanio', '/titanium-cnc-machining-services/'],
  ['Mecanizado CNC de 3/5 Ejes',      '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Mecanizado CNC de 3',             '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Fresado y Torneado CNC',          '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Mecanizado por Electroerosión por Hilo', '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Componentes Industriales Personalizados', '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Fabricación Aditiva de Titanio',  '/titanium-additive-manufacturing/'],
  ['Impresión 3D SLM/DMLS',           '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Impresión 3D SLM',                '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Prototipado Rápido',             '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Producción de Bajo Volumen',      '/titanium-additive-manufacturing/low-volume-production/'],
  ['Servicios de Fabricación de Titanio', '/titanium-fabrication-services/'],
  ['Corte Láser (Chapa y Tubo)',       '/titanium-fabrication-services/laser-cutting/'],
  ['Corte por Chorro de Agua',         '/titanium-fabrication-services/waterjet-cutting/'],
  ['Soldadura y Ensamblaje de Titanio','/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Conformado de Titanio y Fabricación Pesada', '/titanium-forming-heavy-manufacturing/'],
  ['Forja de Titanio',                '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Extrusión de Titanio',            '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Preparación y Dimensionamiento de Materias Primas', '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Tratamiento de Superficie de Titanio', '/titanium-surface-treatment/'],
  ['Anodizado (Tipo II y Tipo III)', '/titanium-surface-treatment/anodizing/'],
  ['Pasivación Química',              '/titanium-surface-treatment/chemical-passivation/'],
  ['Pulido y Chorreado de Arena',     '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 葡萄牙语 (Português)
// ====================================================================
export const pt = [
  ['Serviços Abrangentes de Fabricação e Processamento de Titânio', '/'],
  ['Serviços de Usinagem CNC de Titânio', '/titanium-cnc-machining-services/'],
  ['Usinagem CNC de 3/5 Eixos',      '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Usinagem CNC de 3',              '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Fresamento e Torneamento CNC',   '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Usinagem por Eletroerosão a Fio', '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Componentes Industriais Personalizados', '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Manufatura Aditiva de Titânio',   '/titanium-additive-manufacturing/'],
  ['Impressão 3D SLM/DMLS',          '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Impressão 3D SLM',               '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Prototipagem Rápida',            '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Produção de Baixo Volume',        '/titanium-additive-manufacturing/low-volume-production/'],
  ['Serviços de Fabricação de Titânio', '/titanium-fabrication-services/'],
  ['Corte a Laser (Chapa e Tubo)',    '/titanium-fabrication-services/laser-cutting/'],
  ['Corte a Jato de Água',           '/titanium-fabrication-services/waterjet-cutting/'],
  ['Soldagem e Montagem de Titânio', '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Conformação de Titânio e Fabricação Pesada', '/titanium-forming-heavy-manufacturing/'],
  ['Forjamento de Titânio',          '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Extrusão de Titânio',            '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Preparação e Dimensionamento de Matéria-Prima', '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Tratamento de Superfície de Titânio', '/titanium-surface-treatment/'],
  ['Anodização (Tipo II e Tipo III)', '/titanium-surface-treatment/anodizing/'],
  ['Passivação Química',             '/titanium-surface-treatment/chemical-passivation/'],
  ['Polimento e Jateamento de Areia', '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 意大利语 (Italiano)
// ====================================================================
export const it = [
  ['Servizi Complete di Produzione e Lavorazione del Titanio', '/'],
  ['Servizi di Lavorazione CNC del Titanio', '/titanium-cnc-machining-services/'],
  ['Lavorazione CNC a 3/5 Assi',      '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Lavorazione CNC a 3',             '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Fresatura e Tornitura CNC',       '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Lavorazione per Elettroerosione a Filo', '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Componenti Industriali Personalizzati', '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Produzione Additiva di Titanio',  '/titanium-additive-manufacturing/'],
  ['Stampa 3D SLM/DMLS',             '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Stampa 3D SLM',                  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Prototipazione Rapida',          '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Produzione a Basso Volume',       '/titanium-additive-manufacturing/low-volume-production/'],
  ['Servizi di Fabbricazione del Titanio', '/titanium-fabrication-services/'],
  ['Taglio Laser (Lamiera e Tubo)',   '/titanium-fabrication-services/laser-cutting/'],
  ["Taglio a Getto d'Acqua",          '/titanium-fabrication-services/waterjet-cutting/'],
  ['Saldatura e Assemblaggio del Titanio', '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Formatura del Titanio e Produzione Pesante', '/titanium-forming-heavy-manufacturing/'],
  ['Forgiatura del Titanio',          '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Estrusione del Titanio',          '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Preparazione e Dimensionamento delle Materie Prime', '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Trattamento Superficiale del Titanio', '/titanium-surface-treatment/'],
  ['Anodizzazione (Tipo II e Tipo III)', '/titanium-surface-treatment/anodizing/'],
  ['Passivazione Chimica',           '/titanium-surface-treatment/chemical-passivation/'],
  ['Lucidatura e Sabbiatura',         '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 韩语 (한국어)
// ====================================================================
export const ko = [
  ['종합 티타늄 가공 및 제조 서비스', '/'],
  ['티타늄 CNC 가공 서비스',         '/titanium-cnc-machining-services/'],
  ['3/5축 CNC 가공',                 '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['CNC 밀링 및 선반 가공',          '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['와이어 방전 가공',               '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['맞춤형 산업용 부품',             '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['티타늄 적층 제조',               '/titanium-additive-manufacturing/'],
  ['3D 프린팅 SLM/DMLS',             '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D 프린팅 SLM',                  '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['래피드 프로토타이핑',           '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['소량 생산',                      '/titanium-additive-manufacturing/low-volume-production/'],
  ['티타늄 판금 제작 서비스',        '/titanium-fabrication-services/'],
  ['레이저 절단 (시트 및 튜브)',     '/titanium-fabrication-services/laser-cutting/'],
  ['워터젯 절단',                    '/titanium-fabrication-services/waterjet-cutting/'],
  ['티타늄 용접 및 조립',            '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['티타늄 성형 및 중공업 제조',     '/titanium-forming-heavy-manufacturing/'],
  ['티타늄 단조',                    '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['티타늄 압출',                    '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['원자재 준비 및 사이징',          '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['티타늄 표면 처리',               '/titanium-surface-treatment/'],
  ['아노다이징 (타입 II 및 III)',    '/titanium-surface-treatment/anodizing/'],
  ['화학적 부동태화',               '/titanium-surface-treatment/chemical-passivation/'],
  ['연마 및 샌드블라스팅',          '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 荷兰语 (Nederlands)
// ====================================================================
export const nl = [
  ['Uitgebreide Titanium Productie- en Verwerkingsdiensten', '/'],
  ['Titanium CNC-bewerkingsdiensten', '/titanium-cnc-machining-services/'],
  ['3/5-Assige CNC-bewerking',       '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['CNC Frezen en Draaien',          '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Draadvonken (Wire EDM)',         '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Op maat gemaakte industriële componenten', '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Additieve Productie van Titanium','/titanium-additive-manufacturing/'],
  ['3D-printen SLM/DMLS',            '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['3D-printen SLM',                 '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Rapid Prototyping',              '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Productie in kleine oplage',     '/titanium-additive-manufacturing/low-volume-production/'],
  ['Titanium Fabricagediensten',     '/titanium-fabrication-services/'],
  ['Lasersnijden (Plaat & Buis)',    '/titanium-fabrication-services/laser-cutting/'],
  ['Lasersnijden (Plaat',            '/titanium-fabrication-services/laser-cutting/'],
  ['Waterjetsnijden',                '/titanium-fabrication-services/waterjet-cutting/'],
  ['Titaniumlassen en Assemblage',   '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Titanium Vormen en Zware Productie', '/titanium-forming-heavy-manufacturing/'],
  ['Titanium Smeden',                '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Titanium Extrusie',              '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Grondstofvoorbereiding en -bepaling', '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Oppervlaktebehandeling van Titanium', '/titanium-surface-treatment/'],
  ['Anodiseren (Type II & Type III)', '/titanium-surface-treatment/anodizing/'],
  ['Anodiseren (Type II',            '/titanium-surface-treatment/anodizing/'],
  ['Chemische Passivering',          '/titanium-surface-treatment/chemical-passivation/'],
  ['Polijsten en Zandstralen',       '/titanium-surface-treatment/polishing-sandblasting/'],
];

// ====================================================================
// 波兰语 (Polski)
// ====================================================================
export const pl = [
  ['Kompleksowe Usługi Produkcji i Obróbki Tytanu', '/'],
  ['Usługi Obróbki CNC Tytanu',      '/titanium-cnc-machining-services/'],
  ['Obróbka CNC 3/5-osiowa',         '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Obróbka CNC 3',                  '/titanium-cnc-machining-services/3-5-axis-cnc-machining/'],
  ['Frezowanie i Toczenie CNC',      '/titanium-cnc-machining-services/cnc-milling-turning/'],
  ['Obróbka Elektroerozyjna Drutowa (EDM)', '/titanium-cnc-machining-services/wire-edm-machining/'],
  ['Niestandardowe Komponenty Przemysłowe', '/titanium-cnc-machining-services/custom-industrial-components/'],
  ['Wytwarzanie Addytywne Tytanu',   '/titanium-additive-manufacturing/'],
  ['Druk 3D SLM/DMLS',              '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Druk 3D SLM',                   '/titanium-additive-manufacturing/3d-printing-slm/'],
  ['Szybkie Prototypowanie',         '/titanium-additive-manufacturing/rapid-prototyping/'],
  ['Produkcja Niskonakładowa',       '/titanium-additive-manufacturing/low-volume-production/'],
  ['Usługi Obróbki Plastycznej Tytanu', '/titanium-fabrication-services/'],
  ['Cięcie Laserowe (Blacha i Rura)','/titanium-fabrication-services/laser-cutting/'],
  ['Cięcie Wodne',                   '/titanium-fabrication-services/waterjet-cutting/'],
  ['Spawanie i Montaż Tytanu',       '/titanium-fabrication-services/titanium-welding-assembly/'],
  ['Formowanie Tytanu i Produkcja Ciężka', '/titanium-forming-heavy-manufacturing/'],
  ['Kucie Tytanu',                   '/titanium-forming-heavy-manufacturing/titanium-forging/'],
  ['Wyciskanie Tytanu',              '/titanium-forming-heavy-manufacturing/titanium-extrusion/'],
  ['Przygotowanie i Wymiarowanie Surowca', '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/'],
  ['Obróbka Powierzchniowa Tytanu',  '/titanium-surface-treatment/'],
  ['Anodowanie (Typ II i Typ III)',  '/titanium-surface-treatment/anodizing/'],
  ['Pasywacja Chemiczna',           '/titanium-surface-treatment/chemical-passivation/'],
  ['Polerowanie i Piaskowanie',      '/titanium-surface-treatment/polishing-sandblasting/'],
];

// 导出汇总（供脚本使用）
export const ALL_LANGS = { en, de, ja, fr, es, pt, it, ko, nl, pl };