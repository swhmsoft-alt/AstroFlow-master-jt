import fs from 'fs';

const keys = [
  'industries.ai.metrology.badge','industries.ai.metrology.title.main','industries.ai.metrology.title.suffix',
  'industries.ai.metrology.desc','industries.ai.metrology.card1.title','industries.ai.metrology.card1.subtitle',
  'industries.ai.metrology.card1.desc','industries.ai.metrology.card1.implLabel','industries.ai.metrology.card1.item1',
  'industries.ai.metrology.card1.item2','industries.ai.metrology.card1.item3','industries.ai.metrology.card2.title',
  'industries.ai.metrology.card2.subtitle','industries.ai.metrology.card2.desc','industries.ai.metrology.card2.implLabel',
  'industries.ai.metrology.card2.item1','industries.ai.metrology.card2.item2','industries.ai.metrology.card2.item3',
  'industries.ai.metrology.entityLabel','industries.ai.metrology.entity.0','industries.ai.metrology.entity.1',
  'industries.ai.metrology.entity.2','industries.ai.metrology.entity.3','industries.ai.metrology.entity.4',
];

// === JA ===
const ja = {
  'industries.ai.metrology.badge': '精密測定技術',
  'industries.ai.metrology.title.main': 'CMM寸法検証',
  'industries.ai.metrology.title.suffix': '光学サブアセンブリ向けGD&T共平面性と幾何学的アライメント',
  'industries.ai.metrology.desc': 'ASME Y14.5 GD&T規格に準拠したCMMマッピングによる絶対寸法検証により、光トランシーバサブアセンブリにおける高歩留まりのファイバアライメントのための共平面性、平面度、位置精度を保証します。',
  'industries.ai.metrology.card1.title': '光学部品検証のためのCMM',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1.9 μm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': '光トランシーバハウジングと液冷マニホールドにはミクロンレベルの幾何学的精度が求められます。当社のZEISS CMMプラットフォームは、すべてのシール面にわたって平面度、平行度、真位置度、プロファイル公差を測定します。',
  'industries.ai.metrology.card1.implLabel': '技術実装',
  'industries.ai.metrology.card1.item1': 'ZEISS CMM ±1.9 μm 体積精度 — ISO 17025トレーサブル校正（光学部品対応）',
  'industries.ai.metrology.card1.item2': 'シール面共平面性 ≤ 0.01 mm — 一貫したレーザー溶接気密性を保証',
  'industries.ai.metrology.card1.item3': 'ASME Y14.5に準拠した完全GD&Tレポート — 全ロットの平面度、平行度、プロファイル、真位置度',
  'industries.ai.metrology.card2.title': '高歩留まり組立のためのGD&T',
  'industries.ai.metrology.card2.subtitle': '真位置度 ±0.01mm · 平面度 ≤0.005mm/25mm',
  'industries.ai.metrology.card2.desc': '光トランシーバハウジングのサブミクロン幾何学公差は、光結合効率と製造歩留まりを直接決定します。当社のGD&T検証体制により、すべての部品がASME Y14.5仕様を満たすことを確認します。',
  'industries.ai.metrology.card2.implLabel': '技術実装',
  'industries.ai.metrology.card2.item1': 'ファイバアレイとレーザーダイオード実装部品の真位置度 ≤ ±0.01 mm',
  'industries.ai.metrology.card2.item2': '表面平面度 ≤ 0.005 mm/25mm — 応力のないPCBおよびサブマウント実装を保証',
  'industries.ai.metrology.card2.item3': '製造監視のためのSPC傾向分析 — 工具摩耗や熱ドリフトの早期検出',
  'industries.ai.metrology.entityLabel': 'エンティティクラスター',
  'industries.ai.metrology.entity.0': 'CMM（三次元測定機）',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': '共平面性',
  'industries.ai.metrology.entity.3': 'ファイバアライメント',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === DE ===
const de = {
  'industries.ai.metrology.badge': 'Präzisionsmesstechnik',
  'industries.ai.metrology.title.main': 'CMM-Maßprüfung',
  'industries.ai.metrology.title.suffix': 'GD&T-Koplanarität und geometrische Ausrichtung für optische Unterbaugruppen',
  'industries.ai.metrology.desc': 'Absolute Maßprüfung mittels CMM-Mapping nach ASME Y14.5 GD&T-Normen gewährleistet Koplanarität, Ebenheit und Positionsgenauigkeit für eine ertragreiche Faserausrichtung in optischen Transceiver-Unterbaugruppen.',
  'industries.ai.metrology.card1.title': 'CMM für optische Komponentenprüfung',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 µm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Optische Transceiver-Gehäuse und Flüssigkeitskühlungsverteiler erfordern mikrongenaue geometrische Präzision. Unsere ZEISS CMM-Plattformen messen Ebenheit, Parallelität, true position und Profiltoleranzen auf allen Dichtflächen.',
  'industries.ai.metrology.card1.implLabel': 'Technische Umsetzung',
  'industries.ai.metrology.card1.item1': 'ZEISS CMM ±1,9 µm Volumengenauigkeit — ISO 17025 rückführbare Kalibrierung für optische Komponenten',
  'industries.ai.metrology.card1.item2': 'Dichtflächen-Koplanarität ≤ 0,01 mm — gewährleistet konsistente Laserschweiß-Hermetizität',
  'industries.ai.metrology.card1.item3': 'Vollständiger GD&T-Bericht nach ASME Y14.5 — Ebenheit, Parallelität, Profil, true position für jede Charge',
  'industries.ai.metrology.card2.title': 'GD&T für ertragreiche Montage',
  'industries.ai.metrology.card2.subtitle': 'True Position ±0,01mm · Ebenheit ≤0,005mm/25mm',
  'industries.ai.metrology.card2.desc': 'Submikron-Geometrietoleranzen an optischen Transceiver-Gehäusen bestimmen direkt die optische Kopplungseffizienz und die Fertigungsausbeute. Unsere GD&T-Prüfkultur stellt sicher, dass jede Komponente den ASME Y14.5-Spezifikationen entspricht.',
  'industries.ai.metrology.card2.implLabel': 'Technische Umsetzung',
  'industries.ai.metrology.card2.item1': 'True position ≤ ±0,01 mm für Faserarray- und Laserdiodenmontagemerkmale',
  'industries.ai.metrology.card2.item2': 'Oberflächenebenheit ≤ 0,005 mm pro 25 mm — gewährleistet spannungsfreie PCB- und Submount-Bestückung',
  'industries.ai.metrology.card2.item3': 'SPC-Trendanalyse für die Fertigungsüberwachung — frühzeitige Erkennung von Werkzeugverschleiß oder thermischer Drift',
  'industries.ai.metrology.entityLabel': 'Entitätscluster',
  'industries.ai.metrology.entity.0': 'CMM (Koordinatenmessmaschine)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Koplanarität',
  'industries.ai.metrology.entity.3': 'Faserausrichtung',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === FR ===
const fr = {
  'industries.ai.metrology.badge': 'Métrologie de Précision',
  'industries.ai.metrology.title.main': 'Validation Dimensionnelle CMM',
  'industries.ai.metrology.title.suffix': 'Coplanarité GD&T et Alignement Géométrique pour Sous-Ensembles Optiques',
  'industries.ai.metrology.desc': 'La vérification dimensionnelle absolue par cartographie CMM selon les normes ASME Y14.5 GD&T garantit la coplanéité, la planéité et la précision de position pour un alignement de fibres à haut rendement dans les sous-ensembles de transmetteurs optiques.',
  'industries.ai.metrology.card1.title': 'CMM pour la Vérification des Composants Optiques',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 µm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Les boîtiers de transmetteurs optiques et les collecteurs de refroidissement liquide exigent une précision géométrique au micron près. Nos plates-formes ZEISS CMM mesurent la planéité, le parallélisme, la position vraie et les tolérances de profil sur toutes les surfaces d\'étanchéité.',
  'industries.ai.metrology.card1.implLabel': 'Mise en Œuvre Technique',
  'industries.ai.metrology.card1.item1': 'Précision volumétrique ZEISS CMM ±1,9 µm — étalonnage traçable ISO 17025 pour composants optiques',
  'industries.ai.metrology.card1.item2': 'Coplanéité de surface d\'étanchéité ≤ 0,01 mm — assure une herméticté constante par soudure laser',
  'industries.ai.metrology.card1.item3': 'Rapport GD&T complet selon ASME Y14.5 — planéité, parallélisme, profil, position vraie sur chaque lot',
  'industries.ai.metrology.card2.title': 'GD&T pour l\'Assemblage à Haut Rendement',
  'industries.ai.metrology.card2.subtitle': 'Position Vraie ±0,01mm · Planéité ≤0,005mm/25mm',
  'industries.ai.metrology.card2.desc': 'Les tolérances géométriques submicroniques sur les boîtiers de transmetteurs optiques déterminent directement l\'efficacité du couplage optique et le rendement de fabrication. Notre culture de vérification GD&T garantit que chaque composant répond aux spécifications ASME Y14.5.',
  'industries.ai.metrology.card2.implLabel': 'Mise en Œuvre Technique',
  'industries.ai.metrology.card2.item1': 'Position vraie ≤ ±0,01 mm pour les caractéristiques de montage du réseau de fibres et de la diode laser',
  'industries.ai.metrology.card2.item2': 'Planéité de surface ≤ 0,005 mm par 25 mm — assure un positionnement PCB et sous-montage sans contrainte',
  'industries.ai.metrology.card2.item3': 'Tendance SPC pour la surveillance de la production — détection précoce de l\'usure des outils ou de la dérive thermique',
  'industries.ai.metrology.entityLabel': 'Groupe d\'Entités',
  'industries.ai.metrology.entity.0': 'CMM (Machine à Mesurer Tridimensionnelle)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Coplanéité',
  'industries.ai.metrology.entity.3': 'Alignement de Fibres',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === ES ===
const es = {
  'industries.ai.metrology.badge': 'Metrología de Precisión',
  'industries.ai.metrology.title.main': 'Validación Dimensional CMM',
  'industries.ai.metrology.title.suffix': 'Coplanaridad GD&T y Alineación Geométrica para Subconjuntos Ópticos',
  'industries.ai.metrology.desc': 'La verificación dimensional absoluta mediante mapeo CMM según estándares ASME Y14.5 GD&T garantiza coplanaridad, planitud y precisión posicional para una alineación de fibra de alto rendimiento en subconjuntos de transceptores ópticos.',
  'industries.ai.metrology.card1.title': 'CMM para Verificación de Componentes Ópticos',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 µm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Las carcasas de transceptores ópticos y los colectores de refrigeración líquida exigen precisión geométrica a nivel micrométrico. Nuestras plataformas ZEISS CMM miden planitud, paralelismo, posición verdadera y tolerancias de perfil en todas las superficies de sellado.',
  'industries.ai.metrology.card1.implLabel': 'Implementación Técnica',
  'industries.ai.metrology.card1.item1': 'Precisión volumétrica ZEISS CMM ±1,9 µm — calibración trazable ISO 17025 para componentes ópticos',
  'industries.ai.metrology.card1.item2': 'Coplanaridad de superficie de sellado ≤ 0,01 mm — asegura hermeticidad constante por soldadura láser',
  'industries.ai.metrology.card1.item3': 'Informe GD&T completo según ASME Y14.5 — planitud, paralelismo, perfil, posición verdadera en cada lote',
  'industries.ai.metrology.card2.title': 'GD&T para Ensamblaje de Alto Rendimiento',
  'industries.ai.metrology.card2.subtitle': 'Posición Verdadera ±0,01mm · Planitud ≤0,005mm/25mm',
  'industries.ai.metrology.card2.desc': 'Las tolerancias geométricas submicrónicas en las carcasas de transceptores ópticos determinan directamente la eficiencia de acoplamiento óptico y el rendimiento de fabricación. Nuestra cultura de verificación GD&T asegura que cada componente cumple con las especificaciones ASME Y14.5.',
  'industries.ai.metrology.card2.implLabel': 'Implementación Técnica',
  'industries.ai.metrology.card2.item1': 'Posición verdadera ≤ ±0,01 mm para características de montaje de matriz de fibras y diodo láser',
  'industries.ai.metrology.card2.item2': 'Planitud superficial ≤ 0,005 mm por 25 mm — asegura el asentamiento de PCB y submontaje sin tensión',
  'industries.ai.metrology.card2.item3': 'Tendencia SPC para monitoreo de producción — detección temprana de desgaste de herramienta o deriva térmica',
  'industries.ai.metrology.entityLabel': 'Grupo de Entidades',
  'industries.ai.metrology.entity.0': 'CMM (Máquina de Medición por Coordenadas)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Coplanaridad',
  'industries.ai.metrology.entity.3': 'Alineación de Fibras',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === PT ===
const pt = {
  'industries.ai.metrology.badge': 'Metrologia de Precisão',
  'industries.ai.metrology.title.main': 'Validação Dimensional CMM',
  'industries.ai.metrology.title.suffix': 'Coplanaridade GD&T e Alinhamento Geométrico para Subconjuntos Ópticos',
  'industries.ai.metrology.desc': 'A verificação dimensional absoluta por mapeamento CMM conforme normas ASME Y14.5 GD&T garante coplanaridade, planeza e precisão posicional para alinhamento de fibra de alto rendimento em subconjuntos de transceptores ópticos.',
  'industries.ai.metrology.card1.title': 'CMM para Verificação de Componentes Ópticos',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 µm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Os invólucros de transceptores ópticos e os múltiplos de refrigeração líquida exigem precisão geométrica em nível micrométrico. Nossas plataformas ZEISS CMM medem planeza, paralelismo, posição verdadeira e tolerâncias de perfil em todas as superfícies de vedação.',
  'industries.ai.metrology.card1.implLabel': 'Implementação Técnica',
  'industries.ai.metrology.card1.item1': 'Precisão volumétrica ZEISS CMM ±1,9 µm — calibração rastreável ISO 17025 para componentes ópticos',
  'industries.ai.metrology.card1.item2': 'Coplanaridade da superfície de vedação ≤ 0,01 mm — garante hermeticidade consistente por soldagem a laser',
  'industries.ai.metrology.card1.item3': 'Relatório GD&T completo conforme ASME Y14.5 — planeza, paralelismo, perfil, posição verdadeira em cada lote',
  'industries.ai.metrology.card2.title': 'GD&T para Montagem de Alto Rendimento',
  'industries.ai.metrology.card2.subtitle': 'Posição Verdadeira ±0,01mm · Planeza ≤0,005mm/25mm',
  'industries.ai.metrology.card2.desc': 'As tolerâncias geométricas submicrônicas em invólucros de transceptores ópticos determinam diretamente a eficiência de acoplamento óptico e o rendimento de fabricação. Nossa cultura de verificação GD&T garante que cada componente atenda às especificações ASME Y14.5.',
  'industries.ai.metrology.card2.implLabel': 'Implementação Técnica',
  'industries.ai.metrology.card2.item1': 'Posição verdadeira ≤ ±0,01 mm para recursos de montagem de matriz de fibras e diodo laser',
  'industries.ai.metrology.card2.item2': 'Planeza superficial ≤ 0,005 mm por 25 mm — garante assentamento de PCB e submount sem tensão',
  'industries.ai.metrology.card2.item3': 'Tendência SPC para monitoramento de produção — detecção precoce de desgaste de ferramenta ou deriva térmica',
  'industries.ai.metrology.entityLabel': 'Agrupamento de Entidades',
  'industries.ai.metrology.entity.0': 'CMM (Máquina de Medição por Coordenadas)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Coplanaridade',
  'industries.ai.metrology.entity.3': 'Alinhamento de Fibras',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === IT ===
const it = {
  'industries.ai.metrology.badge': 'Metrologia di Precisione',
  'industries.ai.metrology.title.main': 'Validazione Dimensionale CMM',
  'industries.ai.metrology.title.suffix': 'Coplanarità GD&T e Allineamento Geometrico per Sottoassiemi Ottici',
  'industries.ai.metrology.desc': 'La verifica dimensionale assoluta tramite mappatura CMM secondo gli standard ASME Y14.5 GD&T garantisce coplanarità, planarità e precisione posizionale per un allineamento delle fibre ad alta resa nei sottoassiemi di trasceivitori ottici.',
  'industries.ai.metrology.card1.title': 'CMM per la Verifica di Componenti Ottici',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 µm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Gli involucri dei trasceivitori ottici e i collettori di raffreddamento liquido richiedono una precisione geometrica a livello micrometrico. Le nostre piattaforme ZEISS CMM misurano planarità, parallelismo, posizione reale e tolleranze di profilo su tutte le superfici di tenuta.',
  'industries.ai.metrology.card1.implLabel': 'Implementazione Tecnica',
  'industries.ai.metrology.card1.item1': 'Precisione volumetrica ZEISS CMM ±1,9 µm — calibrazione tracciabile ISO 17025 per componenti ottici',
  'industries.ai.metrology.card1.item2': 'Coplanarità della superficie di tenuta ≤ 0,01 mm — garantisce ermeticità costante della saldatura laser',
  'industries.ai.metrology.card1.item3': 'Report GD&T completo secondo ASME Y14.5 — planarità, parallelismo, profilo, posizione reale su ogni lotto',
  'industries.ai.metrology.card2.title': 'GD&T per Assemblaggio ad Alta Resa',
  'industries.ai.metrology.card2.subtitle': 'Posizione Reale ±0,01mm · Planarità ≤0,005mm/25mm',
  'industries.ai.metrology.card2.desc': 'Le tolleranze geometriche submicrometriche sugli involucri dei trasceivitori ottici determinano direttamente l\'efficienza di accoppiamento ottico e la resa di produzione. La nostra cultura di verifica GD&T garantisce che ogni componente soddisfi le specifiche ASME Y14.5.',
  'industries.ai.metrology.card2.implLabel': 'Implementazione Tecnica',
  'industries.ai.metrology.card2.item1': 'Posizione reale ≤ ±0,01 mm per le caratteristiche di montaggio dell\'array di fibre e del diodo laser',
  'industries.ai.metrology.card2.item2': 'Planarità superficiale ≤ 0,005 mm per 25 mm — garantisce l\'assestamento di PCB e submount senza stress',
  'industries.ai.metrology.card2.item3': 'Andamento SPC per il monitoraggio della produzione — rilevamento precoce dell\'usura dell\'utensile o della deriva termica',
  'industries.ai.metrology.entityLabel': 'Cluster di Entità',
  'industries.ai.metrology.entity.0': 'CMM (Macchina di Misura a Coordinate)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Coplanarità',
  'industries.ai.metrology.entity.3': 'Allineamento Fibre',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === KO ===
const ko = {
  'industries.ai.metrology.badge': '정밀 측정 기술',
  'industries.ai.metrology.title.main': 'CMM 치수 검증',
  'industries.ai.metrology.title.suffix': '광학 서브어셈블리용 GD&T 공면도 및 형상 정렬',
  'industries.ai.metrology.desc': 'ASME Y14.5 GD&T 표준에 따른 CMM 매핑을 통한 절대 치수 검증으로 광트랜시버 서브어셈블리에서 높은 수율의 광섬유 정렬을 위한 공면도, 평면도 및 위치 정밀도를 보장합니다.',
  'industries.ai.metrology.card1.title': '광학 부품 검증용 CMM',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1.9 μm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': '광트랜시버 하우징과 액체 냉각 매니폴드에는 미크론 수준의 형상 정밀도가 필요합니다. 당사의 ZEISS CMM 플랫폼은 모든 밀봉 표면에서 평면도, 평행도, 진위치도 및 프로파일 공차를 측정합니다.',
  'industries.ai.metrology.card1.implLabel': '기술 구현',
  'industries.ai.metrology.card1.item1': 'ZEISS CMM ±1.9 μm 체적 정밀도 — ISO 17025 소급 가능 교정(광학 부품용)',
  'industries.ai.metrology.card1.item2': '밀봉 표면 공면도 ≤ 0.01 mm — 일관된 레이저 용접 밀봉성 보장',
  'industries.ai.metrology.card1.item3': 'ASME Y14.5 기준 완전 GD&T 보고서 — 모든 로트의 평면도, 평행도, 프로파일, 진위치도',
  'industries.ai.metrology.card2.title': '고수율 조립을 위한 GD&T',
  'industries.ai.metrology.card2.subtitle': '진위치도 ±0.01mm · 평면도 ≤0.005mm/25mm',
  'industries.ai.metrology.card2.desc': '광트랜시버 하우징의 서브미크론 형상 공차는 광 결합 효율과 제조 수율을 직접 결정합니다. 당사의 GD&T 검증 문화는 모든 부품이 ASME Y14.5 사양을 충족하도록 보장합니다.',
  'industries.ai.metrology.card2.implLabel': '기술 구현',
  'industries.ai.metrology.card2.item1': '광섬유 어레이 및 레이저 다이오드 실장 형상의 진위치도 ≤ ±0.01 mm',
  'industries.ai.metrology.card2.item2': '표면 평면도 ≤ 0.005mm/25mm — 응력 없는 PCB 및 서브마운트 안착 보장',
  'industries.ai.metrology.card2.item3': '생산 모니터링을 위한 SPC 추세 분석 — 공구 마모 또는 열 드리프트 조기 감지',
  'industries.ai.metrology.entityLabel': '엔터티 클러스터',
  'industries.ai.metrology.entity.0': 'CMM (3차원 측정기)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': '공면도',
  'industries.ai.metrology.entity.3': '광섬유 정렬',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === NL ===
const nl = {
  'industries.ai.metrology.badge': 'Precisiemetrologie',
  'industries.ai.metrology.title.main': 'CMM Dimensionale Validatie',
  'industries.ai.metrology.title.suffix': 'GD&T-Coplanariteit en Geometrische Uitlijning voor Optische Subassemblages',
  'industries.ai.metrology.desc': 'Absolute dimensionale verificatie via CMM-mapping volgens ASME Y14.5 GD&T-normen garandeert coplanariteit, vlakheid en positionele nauwkeurigheid voor hoogrenderende vezeluitlijning in optische transceiver-subassemblages.',
  'industries.ai.metrology.card1.title': 'CMM voor Optische Componentenverificatie',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 µm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Optische transceiverbehuizingen en vloeistofkoelverdelers vereisen micron-nauwkeurige geometrische precisie. Onze ZEISS CMM-platforms meten vlakheid, parallelliteit, ware positie en profieltoleranties op alle afdichtingsoppervlakken.',
  'industries.ai.metrology.card1.implLabel': 'Technische Implementatie',
  'industries.ai.metrology.card1.item1': 'ZEISS CMM ±1,9 µm volumetrische nauwkeurigheid — ISO 17025 herleidbare kalibratie voor optische componenten',
  'industries.ai.metrology.card1.item2': 'Coplanariteit afdichtingsoppervlak ≤ 0,01 mm — verzekert consistente laserlas-hermeticiteit',
  'industries.ai.metrology.card1.item3': 'Volledig GD&T-rapport per ASME Y14.5 — vlakheid, parallelliteit, profiel, ware positie op elke partij',
  'industries.ai.metrology.card2.title': 'GD&T voor Hoogrenderende Montage',
  'industries.ai.metrology.card2.subtitle': 'Ware Positie ±0,01mm · Vlakheid ≤0,005mm/25mm',
  'industries.ai.metrology.card2.desc': 'Submicron geometrische toleranties op optische transceiverbehuizingen bepalen direct de optische koppelingsefficiëntie en de fabricage-opbrengst. Onze GD&T-verificatiecultuur zorgt ervoor dat elk onderdeel voldoet aan ASME Y14.5-specificaties.',
  'industries.ai.metrology.card2.implLabel': 'Technische Implementatie',
  'industries.ai.metrology.card2.item1': 'Ware positie ≤ ±0,01 mm voor fiberarray- en laserdiodemontagekenmerken',
  'industries.ai.metrology.card2.item2': 'Oppervlaktevlakheid ≤ 0,005 mm per 25 mm — verzekert spanningsvrije PCB- en submount-bevestiging',
  'industries.ai.metrology.card2.item3': 'SPC-trendanalyse voor productiebewaking — vroege detectie van gereedschapsslijtage of thermische drift',
  'industries.ai.metrology.entityLabel': 'Entiteitscluster',
  'industries.ai.metrology.entity.0': 'CMM (Coördinatenmeetmachine)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Coplanariteit',
  'industries.ai.metrology.entity.3': 'Vezeluitlijning',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === PL ===
const pl = {
  'industries.ai.metrology.badge': 'Metrologia Precyzyjna',
  'industries.ai.metrology.title.main': 'Walidacja Wymiarowa CMM',
  'industries.ai.metrology.title.suffix': 'Współpłaszczyznowość GD&T i Wyrównanie Geometryczne dla Podzespołów Optycznych',
  'industries.ai.metrology.desc': 'Bezwzględna weryfikacja wymiarowa poprzez mapowanie CMM zgodnie z normami ASME Y14.5 GD&T gwarantuje współpłaszczyznowość, płaskość i dokładność pozycyjną dla wysokowydajnego wyrównania włókien w podzespołach transceiverów optycznych.',
  'industries.ai.metrology.card1.title': 'CMM do Weryfikacji Komponentów Optycznych',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 µm · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Obudowy transceiverów optycznych i rozdzielacze chłodzenia cieczą wymagają precyzji geometrycznej na poziomie mikronów. Nasze platformy ZEISS CMM mierzą płaskość, równoległość, pozycję rzeczywistą i tolerancje profilu na wszystkich powierzchniach uszczelniających.',
  'industries.ai.metrology.card1.implLabel': 'Implementacja Techniczna',
  'industries.ai.metrology.card1.item1': 'Dokładność objętościowa ZEISS CMM ±1,9 µm — wzorcowanie z identyfikowalnością ISO 17025 dla komponentów optycznych',
  'industries.ai.metrology.card1.item2': 'Współpłaszczyznowość powierzchni uszczelniającej ≤ 0,01 mm — zapewnia stałą szczelność spawania laserowego',
  'industries.ai.metrology.card1.item3': 'Pełny raport GD&T zgodnie z ASME Y14.5 — płaskość, równoległość, profil, pozycja rzeczywista dla każdej partii',
  'industries.ai.metrology.card2.title': 'GD&T do Montażu Wysokowydajnego',
  'industries.ai.metrology.card2.subtitle': 'Pozycja Rzeczywista ±0,01mm · Płaskość ≤0,005mm/25mm',
  'industries.ai.metrology.card2.desc': 'Submikronowe tolerancje geometryczne na obudowach transceiverów optycznych bezpośrednio determinują wydajność sprzężenia optycznego i wydajność produkcyjną. Nasza kultura weryfikacji GD&T zapewnia, że każdy komponent spełnia specyfikacje ASME Y14.5.',
  'industries.ai.metrology.card2.implLabel': 'Implementacja Techniczna',
  'industries.ai.metrology.card2.item1': 'Pozycja rzeczywista ≤ ±0,01 mm dla cech montażowych układu włókien i diody laserowej',
  'industries.ai.metrology.card2.item2': 'Płaskość powierzchni ≤ 0,005 mm na 25 mm — zapewnia osadzenie PCB i podłoża bez naprężeń',
  'industries.ai.metrology.card2.item3': 'Analiza trendów SPC do monitorowania produkcji — wczesne wykrywanie zużycia narzędzi lub dryfu termicznego',
  'industries.ai.metrology.entityLabel': 'Klaster Jednostek',
  'industries.ai.metrology.entity.0': 'CMM (Współrzędnościowa Maszyna Pomiarowa)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Współpłaszczyznowość',
  'industries.ai.metrology.entity.3': 'Wyrównanie Włókien',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === RU ===
const ru = {
  'industries.ai.metrology.badge': 'Прецизионная Метрология',
  'industries.ai.metrology.title.main': 'CMM Контроль Размеров',
  'industries.ai.metrology.title.suffix': 'Копланарность GD&T и Геометрическое Выравнивание для Оптических Узлов',
  'industries.ai.metrology.desc': 'Абсолютный контроль размеров с помощью CMM-картирования по стандартам ASME Y14.5 GD&T гарантирует копланарность, плоскостность и позиционную точность для высокоэффективного выравнивания волокон в оптических узлах трансиверов.',
  'industries.ai.metrology.card1.title': 'CMM для Контроля Оптических Компонентов',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1,9 мкм · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'Корпуса оптических трансиверов и коллекторы жидкостного охлаждения требуют микронной геометрической точности. Наши платформы ZEISS CMM измеряют плоскостность, параллельность, истинное положение и допуски профиля на всех уплотнительных поверхностях.',
  'industries.ai.metrology.card1.implLabel': 'Техническая Реализация',
  'industries.ai.metrology.card1.item1': 'Объемная точность ZEISS CMM ±1,9 мкм — калибровка с прослеживаемостью ISO 17025 для оптических компонентов',
  'industries.ai.metrology.card1.item2': 'Копланарность уплотнительной поверхности ≤ 0,01 мм — обеспечивает постоянную герметичность лазерной сварки',
  'industries.ai.metrology.card1.item3': 'Полный отчет GD&T по ASME Y14.5 — плоскостность, параллельность, профиль, истинное положение для каждой партии',
  'industries.ai.metrology.card2.title': 'GD&T для Высокопроизводительной Сборки',
  'industries.ai.metrology.card2.subtitle': 'Истинное Положение ±0,01мм · Плоскостность ≤0,005мм/25мм',
  'industries.ai.metrology.card2.desc': 'Субмикронные геометрические допуски на корпусах оптических трансиверов напрямую определяют эффективность оптической связи и выход годного производства. Наша культура верификации GD&T гарантирует, что каждый компонент соответствует спецификациям ASME Y14.5.',
  'industries.ai.metrology.card2.implLabel': 'Техническая Реализация',
  'industries.ai.metrology.card2.item1': 'Истинное положение ≤ ±0,01 мм для элементов крепления волоконного массива и лазерного диода',
  'industries.ai.metrology.card2.item2': 'Плоскостность поверхности ≤ 0,005 мм на 25 мм — обеспечивает посадку PCB и подложки без напряжения',
  'industries.ai.metrology.card2.item3': 'SPC-мониторинг тенденций производства — раннее обнаружение износа инструмента или термического дрейфа',
  'industries.ai.metrology.entityLabel': 'Кластер Сущностей',
  'industries.ai.metrology.entity.0': 'CMM (Координатно-измерительная машина)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'Копланарность',
  'industries.ai.metrology.entity.3': 'Выравнивание Волокон',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

// === AR ===
const ar = {
  'industries.ai.metrology.badge': 'القياس الدقيق',
  'industries.ai.metrology.title.main': 'التحقق من الأبعاد باستخدام CMM',
  'industries.ai.metrology.title.suffix': 'التسطح GD&T والمحاذاة الهندسية للتجميعات الفرعية البصرية',
  'industries.ai.metrology.desc': 'يضمن التحقق المطلق من الأبعاد عبر رسم خرائط CMM وفقًا لمعايير ASME Y14.5 GD&T التسطح والاستواء والدقة الموضعية لمحاذاة الألياف عالية الإنتاجية في التجميعات الفرعية لأجهزة الإرسال والاستقبال البصرية.',
  'industries.ai.metrology.card1.title': 'CMM للتحقق من المكونات البصرية',
  'industries.ai.metrology.card1.subtitle': 'ZEISS CMM · ±1.9 ميكرومتر · ASME Y14.5 GD&T',
  'industries.ai.metrology.card1.desc': 'تتطلب علب أجهزة الإرسال والاستقبال البصرية ومشعبات التبريد السائل دقة هندسية على مستوى الميكرون. تقيس منصات ZEISS CMM لدينا الاستواء والتوازي والموضع الحقيقي وتفاوتات المظهر الجانبي على جميع أسطح الختم.',
  'industries.ai.metrology.card1.implLabel': 'التنفيذ التقني',
  'industries.ai.metrology.card1.item1': 'دقة حجمية ZEISS CMM ±1.9 ميكرومتر — معايرة قابلة للتتبع ISO 17025 للمكونات البصرية',
  'industries.ai.metrology.card1.item2': 'تسطح سطح الختم ≤ 0.01 مم — يضمن إحكام اللحام بالليزر بشكل ثابت',
  'industries.ai.metrology.card1.item3': 'تقرير GD&T كامل وفقًا لـ ASME Y14.5 — الاستواء والتوازي والمظهر الجانبي والموضع الحقيقي لكل دفعة',
  'industries.ai.metrology.card2.title': 'GD&T للتجميع عالي الإنتاجية',
  'industries.ai.metrology.card2.subtitle': 'الموضع الحقيقي ±0.01 مم · الاستواء ≤0.005 مم/25 مم',
  'industries.ai.metrology.card2.desc': 'تحدد التفاوتات الهندسية دون الميكرونية على علب أجهزة الإرسال والاستقبال البصرية بشكل مباشر كفاءة الاقتران البصري وإنتاجية التصنيع. تضمن ثقافة التحقق GD&T لدينا أن كل مكون يفي بمواصفات ASME Y14.5.',
  'industries.ai.metrology.card2.implLabel': 'التنفيذ التقني',
  'industries.ai.metrology.card2.item1': 'الموضع الحقيقي ≤ ±0.01 مم لميزات تركيب مصفوفة الألياف وديود الليزر',
  'industries.ai.metrology.card2.item2': 'استواء السطح ≤ 0.005 مم لكل 25 مم — يضمن تركيب PCB والقاعدة بدون إجهاد',
  'industries.ai.metrology.card2.item3': 'اتجاهات SPC لمراقبة الإنتاج — الكشف المبكر عن تآكل الأداة أو الانحراف الحراري',
  'industries.ai.metrology.entityLabel': 'مجموعة الكيانات',
  'industries.ai.metrology.entity.0': 'CMM (آلة القياس الإحداثية)',
  'industries.ai.metrology.entity.1': 'ASME Y14.5 GD&T',
  'industries.ai.metrology.entity.2': 'التسطح',
  'industries.ai.metrology.entity.3': 'محاذاة الألياف',
  'industries.ai.metrology.entity.4': 'ZEISS CMM',
};

const all = { ja, de, fr, es, pt, it, ko, nl, pl, ru, ar };

for (const [lang, vals] of Object.entries(all)) {
  let c = fs.readFileSync(`src/i18n/translations/${lang}.json`, 'utf8');
  const last = c.lastIndexOf('}');
  let ins = '';
  for (const k of keys) {
    const v = vals[k];
    if (!v) { console.log(`WARN ${lang} missing ${k}`); continue; }
    if (c.includes(`"${k}"`)) { console.log(`${lang}: ${k} exists`); continue; }
    ins += `,\n  "${k}": "${v.replace(/"/g, '\\"')}"`;
  }
  if (ins) {
    c = c.slice(0, last) + ins + '\n}';
    try { JSON.parse(c); fs.writeFileSync(`src/i18n/translations/${lang}.json`, c, 'utf8'); console.log(`${lang}: 24 keys added`); }
    catch(e) { console.log(`${lang}: INVALID ${e.message.substring(0,60)}`); }
  }
}
console.log('Done');
