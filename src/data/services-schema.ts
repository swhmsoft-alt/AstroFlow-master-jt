/**
 * src/data/services-schema.ts
 *
 * Static data layer for hierarchical Service Schema.org entities.
 *
 * All @id values are hardcoded to real URL paths for consistent
 * Google Knowledge Graph merging across hub and detail pages.
 *
 * Multi-language support with automatic fallback to 'en'.
 */

export interface LanguageDict {
  en: string;
  de?: string;
  ja?: string;
  fr?: string;
  es?: string;
  pt?: string;
  it?: string;
  ko?: string;
  nl?: string;
  pl?: string;
}

export interface ServiceNode {
  /** Absolute URL @id (including #service fragment) */
  id: string;
  /** Human-readable service name (multi-language) */
  name: LanguageDict;
  /** Service description (multi-language) */
  description: LanguageDict;
  /** Schema.org serviceType (e.g. "Contract Manufacturing", "Precision CNC Machining") */
  serviceType?: string;
  /** Material specification — used for Additive / powder-bed services */
  material?: LanguageDict;
  /** Child services (sub-services) */
  hasPart?: ServiceNode[];
}

/**
 * Complete 6-pillar service hierarchy for BOZE Metal Titanium Solutions.
 *
 * Key mapping used by BaseLayout:
 *   "master-service" → /services
 *   "cnc-machining"  → /titanium-cnc-machining-services
 *   "additive"       → /titanium-additive-manufacturing
 *   "fabrication"    → /titanium-fabrication-services
 *   "forming"        → /titanium-forming-heavy-manufacturing
 *   "surface"        → /titanium-surface-treatment
 */
export const servicesHierarchyData: Record<string, ServiceNode> = {

  /* ── Master Service (entry point for /services) ────────── */
  "master-service": {
    id: "https://cnc.bozemetal.com/#main-service",
    serviceType: "Contract Manufacturing",
    name: {
      en: "Comprehensive Titanium Manufacturing & Processing Services",
      de: "Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen",
      ja: "総合チタン加工・製造サービス",
      fr: "Services Complets de Fabrication et de Traitement du Titane",
      es: "Servicios Integrales de Fabricación y Procesamiento de Titanio",
      pt: "Serviços Abrangentes de Fabricação e Processamento de Titânio",
      it: "Servizi Complete di Produzione e Lavorazione del Titanio",
      ko: "종합 티타늄 가공 및 제조 서비스",
      nl: "Uitgebreide Titanium Productie- en Verwerkingsdiensten",
      pl: "Kompleksowe Usługi Produkcji i Obróbki Tytanu",
    },
    description: {
      en: "End-to-end titanium contract manufacturing solutions including 5-axis CNC machining, additive manufacturing, fabrication, heavy forming, and advanced surface treatments.",
      de: "End-to-End-Auftragsfertigung für Titan, einschließlich 5-Achsen-CNC-Bearbeitung, additiver Fertigung, Blechverarbeitung, Umformung und Oberflächenbehandlung.",
      ja: "5軸CNC加工、増材製造、製缶板金、熱間成形、高度表面処理を含むエンドツーエンドのチタン受託製造ソリューション。",
      fr: "Solutions de fabrication à forfait de titane de bout en bout, comprenant l'usinage CNC 5 axes, la fabrication additive, la tôlerie, le formage et les traitements de surface avancés.",
      es: "Soluciones integrales de fabricación de titanio bajo contrato, que incluyen mecanizado CNC de 5 ejes, fabricación aditiva, fabricación de chapa, conformado y tratamientos superficiales avanzados.",
      pt: "Soluções de fabricação sob contrato de titânio de ponta a ponta, incluindo usinagem CNC de 5 eixos, manufatura aditiva, fabricação de chapas, conformação e tratamentos de superfície avançados.",
      it: "Soluzioni di produzione a contratto di titanio end-to-end, inclusi lavorazione CNC a 5 assi, produzione additiva, fabbricazione di lamiere, formatura e trattamenti superficiali avanzati.",
      ko: "5축 CNC 가공, 적층 제조, 판금 제작, 열간 성형 및 고급 표면 처리를 포함한 엔드투엔드 티타늄 위탁 제조 솔루션.",
      nl: "End-to-end titanium productie-oplossingen op contractbasis, inclusief 5-assige CNC-bewerking, additieve productie, plaatwerk, zwaar vormen en geavanceerde oppervlaktebehandelingen.",
      pl: "Kompleksowe rozwiązania produkcyjne tytanu na zlecenie, obejmujące obróbkę CNC 5-osiową, wytwarzanie addytywne, obróbkę blach, formowanie i zaawansowane obróbki powierzchniowe.",
    },
  },

  /* ── Pillar 1: CNC Machining ──────────────────────────── */
  "cnc-machining": {
    id: "https://cnc.bozemetal.com/titanium-cnc-machining-services/#service",
    serviceType: "Precision CNC Machining",
    name: {
      en: "Titanium CNC Machining Services",
      de: "Titan-CNC-Bearbeitungsdienste",
      ja: "チタンCNC加工サービス",
      fr: "Services d'Usinage CNC du Titane",
      es: "Servicios de Mecanizado CNC de Titanio",
      pt: "Serviços de Usinagem CNC de Titânio",
      it: "Servizi di Lavorazione CNC del Titanio",
      ko: "티타늄 CNC 가공 서비스",
      nl: "Titanium CNC-bewerkingsdiensten",
      pl: "Usługi Obróbki CNC Tytanu",
    },
    description: {
      en: "High-precision subtractive manufacturing for medical and aerospace-grade titanium components.",
      de: "Hochpräzise subtraktive Fertigung für Titankomponenten in Medizin- und Luftfahrtqualität.",
      ja: "医療および航空宇宙グレードのチタン部品向けの超精密切削加工製造。",
      fr: "Fabrication soustractive de haute précision pour composants en titane de qualité médicale et aérospatiale.",
      es: "Fabricación sustractiva de alta precisión para componentes de titanio de grado médico y aeroespacial.",
      pt: "Fabricação subtrativa de alta precisão para componentes de titânio de grau médico e aeroespacial.",
      it: "Produzione sottrattiva di alta precisione per componenti in titanio di grado medico e aerospaziale.",
      ko: "의료 및 항공우주 등급 티타늄 부품을 위한 초정밀 절삭 가공.",
      nl: "Hoogprecieze subtractieve productie voor titaniumcomponenten van medische en luchtvaartkwaliteit.",
      pl: "Precyzyjna produkcja subtraktywna dla tytanowych komponentów klasy medycznej i lotniczej.",
    },
    hasPart: [
      {
        id: "https://cnc.bozemetal.com/titanium-cnc-machining-services/3-5-axis-cnc-machining/#service",
        name: { en: "3/5-Axis CNC Machining", de: "3/5-Achsen-CNC-Bearbeitung", ja: "3/5軸CNC加工", fr: "Usinage CNC 3/5 Axes", es: "Mecanizado CNC de 3/5 Ejes", pt: "Usinagem CNC de 3/5 Eixos", it: "Lavorazione CNC a 3/5 Assi", ko: "3/5축 CNC 가공", nl: "3/5-Assige CNC-bewerking", pl: "Obróbka CNC 3/5-osiowa" },
        description: { en: "High-speed multi-axis CNC milling for complex aerodynamic and structural titanium parts.", de: "Hochgeschwindigkeits-Mehrachsen-CNC-Fräsen für komplexe Titan-Strukturbauteile.", ja: "複雑な空力・構造チタン部品向け高速多軸CNCフライス加工。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-cnc-machining-services/cnc-milling-turning/#service",
        name: { en: "CNC Milling & Turning", de: "CNC-Fräsen & Drehen", ja: "CNCフライス・旋盤加工", fr: "Fraisage et Tournage CNC", es: "Fresado y Torneado CNC", pt: "Fresamento e Torneamento CNC", it: "Fresatura e Tornitura CNC", ko: "CNC 밀링 및 선반 가공", nl: "CNC Frezen en Draaien", pl: "Frezowanie i Toczenie CNC" },
        description: { en: "Precision live-tool turning and milling for rotationally symmetrical titanium components.", de: "Präzisionsdrehen und -fräsen für rotationssymmetrische Titanbauteile.", ja: "回転対称チタン部品向け精密複合旋盤・フライス加工。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-cnc-machining-services/wire-edm-machining/#service",
        name: { en: "Wire EDM Machining", de: "Drahterodieren (Wire EDM)", ja: "ワイヤー放電加工", fr: "Usinage par Électroérosion au Fil", es: "Mecanizado por Electroerosión por Hilo", pt: "Usinagem por Eletroerosão a Fio", it: "Lavorazione per Elettroerosione a Filo", ko: "와이어 방전 가공", nl: "Draadvonken (Wire EDM)", pl: "Obróbka Elektroerozyjna Drutowa (EDM)" },
        description: { en: "Non-contact electrical discharge erosion for stress-free, fragile titanium geometries.", de: "Berührungslose Funkenerosion für spannungsfreie, filigrane Titangeometrien.", ja: "応力フリー微細チタン形状向け非接触放電加工。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-cnc-machining-services/custom-industrial-components/#service",
        name: { en: "Custom Industrial Components", de: "Kundenspezifische Industriekomponenten", ja: "カスタム産業用部品", fr: "Composants Industriels Personnalisés", es: "Componentes Industriales Personalizados", pt: "Componentes Industriais Personalizados", it: "Componenti Industriali Personalizzati", ko: "맞춤형 산업용 부품", nl: "Op maat gemaakte industriële componenten", pl: "Niestandardowe Komponenty Przemysłowe" },
        description: { en: "Bespoke titanium components engineered to exact customer specifications.", de: "Maßgefertigte Titanbauteile nach exakten Kundenspezifikationen.", ja: "お客様の正確な仕様に合わせて設計されたオーダーメイドのチタン部品。" },
      },
    ],
  },

  /* ── Pillar 2: Additive Manufacturing ─────────────────── */
  "additive": {
    id: "https://cnc.bozemetal.com/titanium-additive-manufacturing/#service",
    serviceType: "3D Printing & Additive Manufacturing",
    name: {
      en: "Titanium Additive Manufacturing",
      de: "Additive Fertigung von Titan",
      ja: "チタン増材製造（3Dプリンティング）",
      fr: "Fabrication Additive de Titane",
      es: "Fabricación Aditiva de Titanio",
      pt: "Manufatura Aditiva de Titânio",
      it: "Produzione Additiva di Titanio",
      ko: "티타늄 적층 제조",
      nl: "Additieve Productie van Titanium",
      pl: "Wytwarzanie Addytywne Tytanu",
    },
    description: {
      en: "Industrial laser powder bed fusion (LPBF) for biomimetic implants and lightweight aerospace brackets.",
      de: "Industrielles Laserschmelzen im Pulverbett (LPBF) für biomimetische Implantate und Leichtbauteile.",
      ja: "生体模倣インプラントや軽量航空宇宙ブラケット向けの産業用レーザー粉末床溶融結合（LPBF）。",
      fr: "Fusion laser sur lit de poudre (LPBF) industrielle pour implants biomimétiques et supports aérospatiaux légers.",
      es: "Fusión de lecho de polvo por láser (LPBF) industrial para implantes biomiméticos y soportes aeroespaciales ligeros.",
      pt: "Fusão de leito de pó a laser (LPBF) industrial para implantes biomiméticos e suportes aeroespaciais leves.",
      it: "Fusione a letto di polvere laser (LPBF) industriale per impianti biomimetici e staffe aerospaziali leggere.",
      ko: "생체모방 임플란트 및 경량 항공우주 브래킷을 위한 산업용 레이저 분말 베드 용융(LPBF).",
      nl: "Industriële laserpoederbedfusie (LPBF) voor biomimetische implantaten en lichtgewicht luchtvaartbeugels.",
      pl: "Przemysłowe laserowe stapianie proszku w złożu (LPBF) dla biomimetycznych implantów i lekkich wsporników lotniczych.",
    },
    hasPart: [
      {
        id: "https://cnc.bozemetal.com/titanium-additive-manufacturing/3d-printing-slm/#service",
        name: { en: "3D Printing SLM/DMLS", de: "3D-Druck SLM/DMLS", ja: "3Dプリンティング SLM/DMLS", fr: "Impression 3D SLM/DMLS", es: "Impresión 3D SLM/DMLS", pt: "Impressão 3D SLM/DMLS", it: "Stampa 3D SLM/DMLS", ko: "3D 프린팅 SLM/DMLS", nl: "3D-printen SLM/DMLS", pl: "Druk 3D SLM/DMLS" },
        description: { en: "Direct Metal Laser Sintering utilizing high-grade Ti-6Al-4V powder.", de: "Direktes Metall-Lasersintern mit hochwertigem Ti-6Al-4V-Pulver.", ja: "高品質Ti-6Al-4V粉末を使用した直接金属レーザー焼結。" },
        material: {
          en: "Ti-6Al-4V Grade 5 Titanium Powder",
          de: "Ti-6Al-4V Klasse 5 Titanpulver",
          ja: "Ti-6Al-4V グレード5 チタン粉末",
          fr: "Poudre de titane Ti-6Al-4V Grade 5",
          es: "Polvo de titanio Ti-6Al-4V Grado 5",
          pt: "Pó de titânio Ti-6Al-4V Grau 5",
          it: "Polvere di titanio Ti-6Al-4V Grado 5",
          ko: "Ti-6Al-4V 5등급 티타늄 분말",
          nl: "Ti-6Al-4V klasse 5 titaniumpoeder",
          pl: "Proszek tytanowy Ti-6Al-4V klasy 5",
        },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-additive-manufacturing/rapid-prototyping/#service",
        name: { en: "Rapid Prototyping", de: "Rapid Prototyping", ja: "ラピッドプロトタイピング", fr: "Prototypage Rapide", es: "Prototipado Rápido", pt: "Prototipagem Rápida", it: "Prototipazione Rapida", ko: "래피드 프로토타이핑", nl: "Rapid Prototyping", pl: "Szybkie Prototypowanie" },
        description: { en: "Fast iteration titanium prototyping for design verification and functional testing.", de: "Schnelle Titan-Prototypeniteration für Designverifikation und Funktionstests.", ja: "設計検証と機能テストのための迅速なチタンプロトタイピング。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-additive-manufacturing/low-volume-production/#service",
        name: { en: "Low-Volume Production", de: "Kleinserienproduktion", ja: "少量生産", fr: "Production en Faible Volume", es: "Producción de Bajo Volumen", pt: "Produção de Baixo Volume", it: "Produzione a Basso Volume", ko: "소량 생산", nl: "Productie in kleine oplage", pl: "Produkcja Niskonakładowa" },
        description: { en: "Cost-effective low-volume titanium additive manufacturing for specialized applications.", de: "Kosteneffiziente additive Titan-Kleinserienfertigung für spezialisierte Anwendungen.", ja: "特殊用途向けの費用対効果の高い少量チタン積層造形。" },
      },
    ],
  },

  /* ── Pillar 3: Fabrication ───────────────────────────── */
  "fabrication": {
    id: "https://cnc.bozemetal.com/titanium-fabrication-services/#service",
    serviceType: "Titanium Fabrication",
    name: {
      en: "Titanium Fabrication Services",
      de: "Titan-Blechverarbeitungsdienste",
      ja: "チタン製缶板金サービス",
      fr: "Services de Fabrication de Tôlerie Titane",
      es: "Servicios de Fabricación de Titanio",
      pt: "Serviços de Fabricação de Titânio",
      it: "Servizi di Fabbricazione del Titanio",
      ko: "티타늄 판금 제작 서비스",
      nl: "Titanium Fabricagediensten",
      pl: "Usługi Obróbki Plastycznej Tytanu",
    },
    description: {
      en: "Sheet metal cutting, welding, and assembly for titanium structures and enclosures.",
      de: "Blechzuschnitt, Schweißen und Montage für Titanstrukturen und Gehäuse.",
      ja: "チタン構造体およびエンクロージャ向け板金切断、溶接、組立。",
      fr: "Découpe de tôle, soudage et assemblage pour structures et enceintes en titane.",
      es: "Corte de chapa, soldadura y montaje para estructuras y carcasas de titanio.",
      pt: "Corte de chapa, soldagem e montagem para estruturas e invólucros de titânio.",
      it: "Taglio lamiera, saldatura e assemblaggio per strutture e involucri in titanio.",
      ko: "티타늄 구조물 및 인클로저용 판금 절단, 용접 및 조립.",
      nl: "Plaatwerk snijden, lassen en assembleren voor titanium constructies en behuizingen.",
      pl: "Cięcie blachy, spawanie i montaż konstrukcji tytanowych i obudów.",
    },
    hasPart: [
      {
        id: "https://cnc.bozemetal.com/titanium-fabrication-services/laser-cutting/#service",
        name: { en: "Laser Cutting (Sheet & Tube)", de: "Laserschneiden (Blech & Rohr)", ja: "レーザー切断（シート＆チューブ）", fr: "Découpe Laser (Tôle et Tube)", es: "Corte Láser (Chapa y Tubo)", pt: "Corte a Laser (Chapa e Tubo)", it: "Taglio Laser (Lamiera e Tubo)", ko: "레이저 절단 (시트 및 튜브)", nl: "Lasersnijden (Plaat & Buis)", pl: "Cięcie Laserowe (Blacha i Rura)" },
        description: { en: "High-precision laser cutting of titanium sheet and tube with minimal HAZ.", de: "Hochpräzises Laserschneiden von Titanblech und -rohr mit minimaler Wärmeeinflusszone.", ja: "最小限の熱影響部でチタン板およびチューブを高精度レーザー切断。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-fabrication-services/waterjet-cutting/#service",
        name: { en: "Waterjet Cutting", de: "Wasserstrahlschneiden", ja: "ウォータージェット切断", fr: "Découpe au Jet d'Eau", es: "Corte por Chorro de Agua", pt: "Corte a Jato de Água", it: "Taglio a Getto d'Acqua", ko: "워터젯 절단", nl: "Waterjetsnijden", pl: "Cięcie Wodne" },
        description: { en: "Cold-cutting titanium without heat-affected zones, ideal for high-stress applications.", de: "Kalt-schneiden von Titan ohne Wärmeeinflusszonen, ideal für Hochbelastungsanwendungen.", ja: "熱影響部なしのチタン冷間切断、高応力用途に最適。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-fabrication-services/titanium-welding-assembly/#service",
        name: { en: "Titanium Welding & Assembly", de: "Titanschweißen & Montage", ja: "チタン溶接・組立", fr: "Soudage et Assemblage du Titane", es: "Soldadura y Ensamblaje de Titanio", pt: "Soldagem e Montagem de Titânio", it: "Saldatura e Assemblaggio del Titanio", ko: "티타늄 용접 및 조립", nl: "Titaniumlassen en Assemblage", pl: "Spawanie i Montaż Tytanu" },
        description: { en: "Precision TIG/MIG welding and certified assembly for titanium fabrications.", de: "Präzisions-WIG/MIG-Schweißen und zertifizierte Montage für Titanbauprodukte.", ja: "チタン加工品向け精密TIG/MIG溶接および認定組立。" },
      },
    ],
  },

  /* ── Pillar 4: Forming & Heavy Manufacturing ─────────── */
  "forming": {
    id: "https://cnc.bozemetal.com/titanium-forming-heavy-manufacturing/#service",
    serviceType: "Hot Forming & Heavy Manufacturing",
    name: {
      en: "Titanium Forming & Heavy Manufacturing",
      de: "Titan-Umformung & Schwerindustriefertigung",
      ja: "チタン成形・重型製造",
      fr: "Formage du Titane et Fabrication Lourde",
      es: "Conformado de Titanio y Fabricación Pesada",
      pt: "Conformação de Titânio e Fabricação Pesada",
      it: "Formatura del Titanio e Produzione Pesante",
      ko: "티타늄 성형 및 중공업 제조",
      nl: "Titanium Vormen en Zware Productie",
      pl: "Formowanie Tytanu i Produkcja Ciężka",
    },
    description: {
      en: "Hot and cold forming processes for large-format titanium structures and preforms.",
      de: "Warm- und Kaltumformprozesse für großformatige Titanstrukturen und Vorformen.",
      ja: "大型チタン構造体およびプリフォーム向け熱間・冷間成形プロセス。",
      fr: "Procédés de formage à chaud et à froid pour structures et préformes en titane de grand format.",
      es: "Procesos de conformado en caliente y en frío para estructuras y preformas de titanio de gran formato.",
      pt: "Processos de conformação a quente e a frio para estruturas e pré-formas de titânio de grande formato.",
      it: "Processi di formatura a caldo e a freddo per strutture e preforme in titanio di grandi dimensioni.",
      ko: "대형 티타늄 구조물 및 프리폼을 위한 열간 및 냉간 성형 공정.",
      nl: "Warm- en koudvormprocessen voor grootschalige titanium structuren en voorvormen.",
      pl: "Procesy formowania na gorąco i na zimno dla wielkogabarytowych konstrukcji tytanowych i preform.",
    },
    hasPart: [
      {
        id: "https://cnc.bozemetal.com/titanium-forming-heavy-manufacturing/titanium-forging/#service",
        name: { en: "Titanium Forging", de: "Titanschmieden", ja: "チタン鍛造", fr: "Forgeage du Titane", es: "Forja de Titanio", pt: "Forjamento de Titânio", it: "Forgiatura del Titanio", ko: "티타늄 단조", nl: "Titanium Smeden", pl: "Kucie Tytanu" },
        description: { en: "Hot and cold forging of titanium for high-strength aerospace and industrial components.", de: "Warm- und Kalt-Schmieden von Titan für hochfeste Luftfahrt- und Industriekomponenten.", ja: "高強度航空宇宙・産業用部品向けチタン熱間・冷間鍛造。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-forming-heavy-manufacturing/titanium-extrusion/#service",
        name: { en: "Titanium Extrusion", de: "Titan-Strangpressen", ja: "チタン押出加工", fr: "Extrusion du Titane", es: "Extrusión de Titanio", pt: "Extrusão de Titânio", it: "Estrusione del Titanio", ko: "티타늄 압출", nl: "Titanium Extrusie", pl: "Wyciskanie Tytanu" },
        description: { en: "Hot extrusion of titanium profiles for structural and architectural applications.", de: "Warmstrangpressen von Titanprofilen für strukturelle und architektonische Anwendungen.", ja: "構造用および建築用向けチタンプロファイルの熱間押出加工。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/#service",
        name: { en: "Raw Material Preparation & Sizing", de: "Rohmaterialvorbereitung & Zuschnitt", ja: "原材料準備・サイジング", fr: "Préparation et Dimensionnement des Matières Premières", es: "Preparación y Dimensionamiento de Materias Primas", pt: "Preparação e Dimensionamento de Matéria-Prima", it: "Preparazione e Dimensionamento delle Materie Prime", ko: "원자재 준비 및 사이징", nl: "Grondstofvoorbereiding en -bepaling", pl: "Przygotowanie i Wymiarowanie Surowca" },
        description: { en: "Precision sizing and preparation of titanium raw material for downstream processing.", de: "Präzisionszuschnitt und -vorbereitung von Titanrohmaterial für die Weiterverarbeitung.", ja: "下流加工向けチタン原材料の精密サイジングおよび準備。" },
      },
    ],
  },

  /* ── Pillar 5: Surface Treatment ─────────────────────── */
  "surface": {
    id: "https://cnc.bozemetal.com/titanium-surface-treatment/#service",
    serviceType: "Surface Treatment & Finishing",
    name: {
      en: "Titanium Surface Treatment",
      de: "Titan-Oberflächenbehandlung",
      ja: "チタン表面処理",
      fr: "Traitement de Surface du Titane",
      es: "Tratamiento de Superficie de Titanio",
      pt: "Tratamento de Superfície de Titânio",
      it: "Trattamento Superficiale del Titanio",
      ko: "티타늄 표면 처리",
      nl: "Oppervlaktebehandeling van Titanium",
      pl: "Obróbka Powierzchniowa Tytanu",
    },
    description: {
      en: "Advanced surface finishing technologies for corrosion resistance, wear protection, and aesthetic requirements.",
      de: "Fortschrittliche Oberflächentechnologien für Korrosionsbeständigkeit, Verschleißschutz und ästhetische Anforderungen.",
      ja: "耐食性、耐摩耗性、美的要件のための高度表面仕上げ技術。",
      fr: "Technologies de finition de surface avancées pour la résistance à la corrosion, la protection contre l'usure et les exigences esthétiques.",
      es: "Tecnologías avanzadas de acabado superficial para resistencia a la corrosión, protección contra el desgaste y requisitos estéticos.",
      pt: "Tecnologias avançadas de acabamento de superfície para resistência à corrosão, proteção contra desgaste e requisitos estéticos.",
      it: "Tecnologie avanzate di finitura superficiale per resistenza alla corrosione, protezione dall'usura e requisiti estetici.",
      ko: "내식성, 내마모성 및 미적 요구 사항을 위한 고급 표면 마감 기술.",
      nl: "Geavanceerde oppervlakteafwerkingstechnologieën voor corrosiebestendigheid, slijtagebescherming en esthetische vereisten.",
      pl: "Zaawansowane technologie wykończenia powierzchni dla odporności na korozję, ochrony przed zużyciem i wymagań estetycznych.",
    },
    hasPart: [
      {
        id: "https://cnc.bozemetal.com/titanium-surface-treatment/anodizing/#service",
        name: { en: "Anodizing (Type II & Type III)", de: "Eloxieren (Typ II & Typ III)", ja: "陽極酸化処理（タイプIIおよびIII）", fr: "Anodisation (Type II et Type III)", es: "Anodizado (Tipo II y Tipo III)", pt: "Anodização (Tipo II e Tipo III)", it: "Anodizzazione (Tipo II e Tipo III)", ko: "아노다이징 (타입 II 및 III)", nl: "Anodiseren (Type II & Type III)", pl: "Anodowanie (Typ II i Typ III)" },
        description: { en: "Electrochemical surface treatment for enhanced wear resistance and color coding.", de: "Elektrochemische Oberflächenbehandlung für verbesserte Verschleißfestigkeit und Farbcodierung.", ja: "耐摩耗性向上とカラーコーディングのための電気化学的表面処理。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-surface-treatment/chemical-passivation/#service",
        name: { en: "Chemical Passivation", de: "Chemische Passivierung", ja: "化学的不動態化処理", fr: "Passivation Chimique", es: "Pasivación Química", pt: "Passivação Química", it: "Passivazione Chimica", ko: "화학적 부동태화", nl: "Chemische Passivering", pl: "Pasywacja Chemiczna" },
        description: { en: "Chemical removal of surface contaminants to restore corrosion-resistant oxide layer.", de: "Chemische Entfernung von Oberflächenverunreinigungen zur Wiederherstellung der korrosionsbeständigen Oxidschicht.", ja: "耐食性酸化皮膜を回復するための表面汚染物の化学的除去。" },
      },
      {
        id: "https://cnc.bozemetal.com/titanium-surface-treatment/polishing-sandblasting/#service",
        name: { en: "Polishing & Sandblasting", de: "Polieren & Sandstrahlen", ja: "研磨・サンドブラスト", fr: "Polissage et Sablage", es: "Pulido y Chorreado de Arena", pt: "Polimento e Jateamento de Areia", it: "Lucidatura e Sabbiatura", ko: "연마 및 샌드블라스팅", nl: "Polijsten en Zandstralen", pl: "Polerowanie i Piaskowanie" },
        description: { en: "Mechanical surface finishing for desired roughness, gloss, or matte appearance.", de: "Mechanische Oberflächenveredelung für gewünschte Rauheit, Glanz oder mattes Erscheinungsbild.", ja: "所望の粗さ、光沢、またはマット外観のための機械的表面仕上げ。" },
      },
    ],
  },
};