/**
 * SEO Configuration — Centralized management for all fixed pages.
 *
 * Usage: SEO_CONFIG is auto-resolved by BaseLayout.astro.
 * Each key is the canonical path (no lang prefix).
 * title/description are defined per language.
 */
export interface SeoEntry {
  title?: { en: string; zh: string };
  description?: { en: string; zh: string };
  /** Override OG image for this page (relative to site URL) */
  ogImage?: string;
}

export const SEO_CONFIG: Record<string, SeoEntry> = {
  '/': {
    title: {
      en: 'BOZE CNC Ti | AS9100D Certified Titanium CNC Machining & Manufacturing',
      zh: '博泽钛业 CNC 精密加工 | AS9100D 认证钛合金制造',
    },
    description: {
      en: 'End-to-end titanium manufacturing: precision CNC machining, additive manufacturing, fabrication, surface treatment. AS9100D & ISO 9001 certified. From prototype to production.',
      zh: '端到端钛合金制造服务：精密 CNC 加工、增材制造、钣金制造、表面处理。AS9100D & ISO 9001认证。从原型到批量生产的一站式解决方案。',
    },
  },
  '/services': {
    title: {
      en: 'Titanium CNC Machining Services | Precision Manufacturing | BOZE CNC Ti',
      zh: '钛合金 CNC 精密加工服务 | 精密制造 | 博泽钛业',
    },
    description: {
      en: 'End-to-end titanium manufacturing solutions from rapid prototyping to high-volume precision CNC machining and heavy industrial fabrication. AS9100D & ISO 9001 certified.',
      zh: '从快速原型到大批量精密 CNC 加工和重工业制造的端到端钛合金制造解决方案。AS9100D & ISO 9001认证。',
    },
  },
  '/materials': {
    title: {
      en: 'Titanium Grades & Materials Engineering Guide | BOZE CNC Ti',
      zh: '钛合金等级与材料工程指南 | 技术参考 | 博泽钛业',
    },
    description: {
      en: 'Comprehensive titanium grades reference: Grade 1-23 CP titanium, Ti-6Al-4V, Ti-6Al-4V ELI. Mechanical properties, corrosion resistance, and application guidance for procurement engineers.',
      zh: '全面钛合金等级参考：1-23级工业纯钛、Ti-6Al-4V、Ti-6Al-4V ELI。为采购工程师提供机械性能、耐腐蚀性和应用指导。',
    },
  },
  '/capabilities': {
    title: {
      en: 'Technical Capabilities | CNC Precision & Manufacturing Engineering | BOZE CNC Ti',
      zh: '技术能力 | CNC 精密与制造工程 | 博泽钛业',
    },
    description: {
      en: 'AS9100D & ISO 9001 certified precision manufacturing infrastructure: micron-level CNC tolerancing, SLM additive manufacturing, CMM inspection, full material traceability.',
      zh: 'AS9100D & ISO 9001认证的精密制造基础设施：微米级 CNC 公差、SLM 增材制造、三坐标测量机检测、完整材料可追溯性。',
    },
  },
  '/industries': {
    title: {
      en: 'Industry Solutions | Aerospace Medical & Industrial Titanium Applications',
      zh: '行业应用 | 航空航天·医疗·工业钛合金解决方案',
    },
    description: {
      en: 'Engineered titanium solutions for aerospace, medical, UAV/drones, marine, semiconductor, and energy industries. AS9100D certified precision components.',
      zh: '为航空航天、医疗、无人机、船舶、半导体和能源行业提供工程钛合金解决方案。AS9100D认证精密零部件。',
    },
  },
  '/resources': {
    title: {
      en: 'Technical Resources Library | Titanium Engineering Guides & Downloads | BOZE CNC Ti',
      zh: '技术资源库 | 钛合金工程指南与下载 | 博泽钛业',
    },
    description: {
      en: 'Comprehensive technical documentation, engineering guides, whitepapers, CAD resources, and FAQs for titanium manufacturing professionals.',
      zh: '为钛合金制造专业人士提供的全面技术文档、工程指南、白皮书、CAD资源和常见问题解答。',
    },
  },
  '/products': {
    title: {
      en: 'Precision CNC Machined Titanium Products | B2B Manufacturing | BOZE CNC Ti',
      zh: '精密 CNC 加工钛合金产品 | 工业零部件 | 博泽钛业',
    },
    description: {
      en: 'Browse our catalog of precision CNC machined titanium components. Custom manufacturing available for aerospace, medical, and industrial applications.',
      zh: '浏览我们的精密 CNC 加工钛合金零部件目录。可为航空航天、医疗和工业应用提供定制制造。',
    },
  },
  '/rfq': {
    title: {
      en: 'Request a Quote | Titanium CNC Machining RFQ | BOZE CNC Ti',
      zh: '获取报价 | 钛合金 CNC 加工询价 | 博泽钛业',
    },
    description: {
      en: 'Submit your engineering RFQ for titanium CNC machining, additive manufacturing, fabrication, or surface treatment. Get a formal quote within 24-48 hours. Secure CAD upload.',
      zh: '提交您的钛合金 CNC 加工、增材制造、钣金制造或表面处理工程询价。24-48小时内获得正式报价。安全 CAD 上传。',
    },
  },
  '/blog': {
    title: {
      en: 'Titanium CNC Machining Blog | Manufacturing Insights | BOZE CNC Ti',
      zh: '钛合金 CNC 加工博客 | 制造洞察 | 博泽钛业',
    },
    description: {
      en: 'Expert insights on CNC machining, titanium manufacturing, material science, and industry best practices. Stay informed with the latest from BOZE CNC Ti.',
      zh: '关于 CNC 加工、钛合金制造、材料科学和行业最佳实践的专家见解。关注博泽钛业的最新资讯。',
    },
  },
  '/documentation': {
    title: {
      en: 'Documentation Center | Technical Guides & Resources | BOZE CNC Ti',
      zh: '文档中心 | 技术指南与资源 | 博泽钛业',
    },
    description: {
      en: 'Access comprehensive documentation, technical guides, compliance certificates, and resources for titanium CNC machining operations.',
      zh: '访问全面的文档、技术指南、合规认证和资源，优化您的钛合金 CNC 加工运营。',
    },
  },
  '/use-cases': {
    title: {
      en: 'Titanium CNC Machining Use Cases | Industry Applications | BOZE CNC Ti',
      zh: '钛合金 CNC 加工用例 | 行业应用场景 | 博泽钛业',
    },
    description: {
      en: 'Real-world use cases and application examples of titanium CNC machining across aerospace, medical, automotive, and industrial sectors.',
      zh: '钛合金 CNC 加工在航空航天、医疗、汽车和工业领域的真实用例和应用示例。',
    },
  },
  '/facilities': {
    title: {
      en: 'Our Manufacturing Facilities | ISO 9001 & AS9100D Certified | BOZE CNC Ti',
      zh: '制造工厂 | ISO 9001 & AS9100D 认证 | 博泽钛业',
    },
    description: {
      en: 'State-of-the-art titanium manufacturing facilities with multi-axis CNC machining centers, SLM additive manufacturing, and CMM inspection labs.',
      zh: '最先进的钛合金制造工厂，配备多轴 CNC 加工中心、SLM 增材制造和三坐标测量机检测实验室。',
    },
  },
  '/titanium-cnc-machining-services': {
    title: {
      en: 'Titanium CNC Machining Services | Precision Milling & Turning | BOZE CNC Ti',
      zh: '钛合金 CNC 加工服务 | 精密铣削与车削 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium CNC machining services: 3/5-axis milling, turning, wire EDM, and custom industrial components. Aerospace-grade tolerances down to ±0.005 mm.',
      zh: '精密钛合金 CNC 加工服务：3/5轴铣削、车削、线切割和定制工业零部件。航空级公差低至 ±0.005 mm。',
    },
  },
  '/titanium-cnc-machining-services/3-5-axis-cnc-machining': {
    title: {
      en: '3/5-Axis CNC Machining for Titanium | Multi-Axis Precision | BOZE CNC Ti',
      zh: '钛合金 3/5 轴 CNC 加工 | 多轴精密制造 | 博泽钛业',
    },
    description: {
      en: 'Precision 3/4-axis and simultaneous 5-axis CNC machining for titanium: complex geometries, single-setup accuracy, aerospace-grade tolerances ±0.005 mm.',
      zh: '钛合金精密 3/4 轴和同步 5 轴 CNC 加工：复杂几何形状、单次装夹精度、航空级公差 ±0.005 mm。',
    },
  },
  '/titanium-cnc-machining-services/cnc-milling-turning': {
    title: {
      en: 'CNC Milling & Turning for Titanium | Precision Machining | BOZE CNC Ti',
      zh: '钛合金 CNC 铣削与车削 | 精密加工 | 博泽钛业',
    },
    description: {
      en: 'Precision CNC turning, milling, and turn-mill multi-tasking for titanium: bone screws, prismatic components, complete single-setup parts. Tolerances ±0.005 mm.',
      zh: '钛合金精密 CNC 车削、铣削和车铣复合加工：骨钉、棱柱组件、单次装夹完整零件。公差 ±0.005 mm。',
    },
  },
  '/titanium-cnc-machining-services/wire-edm-machining': {
    title: {
      en: 'Wire EDM Machining for Titanium | Precision EDM | BOZE CNC Ti',
      zh: '钛合金线切割加工 | 精密放电加工 | 博泽钛业',
    },
    description: {
      en: 'Precision wire EDM machining for titanium: zero mechanical stress, sharp internal corners (ø 0.1 mm wire), hardened alloy cutting, ±0.002 mm accuracy, Ra 0.25 µm finish.',
      zh: '钛合金精密线切割加工：零机械应力、锋利内角（ø 0.1 mm 丝）、硬化合金切割、±0.002 mm 精度、Ra 0.25 µm 光洁度。',
    },
  },
  '/titanium-cnc-machining-services/custom-industrial-components': {
    title: {
      en: 'Custom Titanium Industrial Components | CNC Machining | BOZE CNC Ti',
      zh: '定制钛合金工业零部件 | CNC 加工 | 博泽钛业',
    },
    description: {
      en: 'Custom titanium industrial components: complex structural assemblies, high-vacuum chambers, fluid manifolds, and precision micro-components. AS9100D quality.',
      zh: '定制钛合金工业零部件：复杂结构组件、高真空腔体、流体歧管和精密微型组件。AS9100D 质量认证。',
    },
  },
  '/titanium-additive-manufacturing': {
    title: {
      en: 'Titanium Additive Manufacturing | SLM/DMLS 3D Printing | BOZE CNC Ti',
      zh: '钛合金增材制造 | SLM/DMLS 3D 打印 | 博泽钛业',
    },
    description: {
      en: 'Industrial titanium additive manufacturing: SLM/DMLS 3D printing, rapid prototyping in 3-5 days, low-volume production. Full-density Ti-6Al-4V, ASTM F2924, AS9100D.',
      zh: '工业钛合金增材制造：SLM/DMLS 3D 打印、3-5 天快速原型、小批量生产。全致密 Ti-6Al-4V，ASTM F2924，AS9100D。',
    },
  },
  '/titanium-additive-manufacturing/3d-printing-slm': {
    title: {
      en: 'SLM/DMLS 3D Printing for Titanium | Metal Additive | BOZE CNC Ti',
      zh: '钛合金 SLM/DMLS 3D 打印 | 金属增材制造 | 博泽钛业',
    },
    description: {
      en: 'Industrial SLM/DMLS 3D printing for titanium: Yb-fiber laser, 20-60 µm layer thickness, ≥99.5% density, 950-1,050 MPa tensile strength. ASTM F2924, AS9100D.',
      zh: '钛合金工业 SLM/DMLS 3D 打印：镱光纤激光、20-60 µm 层厚、≥99.5% 密度、950-1,050 MPa 抗拉强度。ASTM F2924，AS9100D。',
    },
  },
  '/titanium-additive-manufacturing/rapid-prototyping': {
    title: {
      en: 'Titanium Rapid Prototyping | 3D Printing Services | BOZE CNC Ti',
      zh: '钛合金快速原型 | 3D 打印服务 | 博泽钛业',
    },
    description: {
      en: 'Titanium rapid prototyping via SLM: 3-5 day lead time, single-unit MOQ, ≥99.5% density, 950-1,050 MPa tensile strength. Zero tooling cost design iterations.',
      zh: '钛合金 SLM 快速原型：3-5 天交货期、单件起订、≥99.5% 密度、950-1,050 MPa 抗拉强度。零模具成本设计迭代。',
    },
  },
  '/titanium-additive-manufacturing/low-volume-production': {
    title: {
      en: 'Low-Volume Titanium Production | Additive Manufacturing | BOZE CNC Ti',
      zh: '小批量钛合金生产 | 增材制造 | 博泽钛业',
    },
    description: {
      en: 'Low-volume titanium production via SLM: 10-1,000+ unit batches, zero tooling costs, ≥95% material utilization, multi-laser sync, SPC witness bar validation. AS9100D.',
      zh: 'SLM 小批量钛合金生产：10-1,000+ 件批次、零模具成本、≥95% 材料利用率、多激光同步、SPC 见证棒验证。AS9100D。',
    },
  },
  '/titanium-fabrication-services': {
    title: {
      en: 'Titanium Fabrication Services | Welding & Cutting | BOZE CNC Ti',
      zh: '钛合金钣金制造服务 | 焊接与切割 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium fabrication: TIG/laser welding with full argon purge, CNC sheet metal profiling, industrial vessels and piping. AWS D1.6, ASME Sec IX, AS9100D.',
      zh: '精密钛合金钣金制造：TIG/激光焊接（全氩气保护）、CNC 钣金成型、工业容器和管道。AWS D1.6，ASME Sec IX，AS9100D。',
    },
  },
  '/titanium-fabrication-services/laser-cutting': {
    title: {
      en: 'Titanium Laser Cutting Services | Sheet & Tube | BOZE CNC Ti',
      zh: '钛合金激光切割服务 | 板材与管材 | 博泽钛业',
    },
    description: {
      en: 'Precision fiber laser cutting for titanium sheets and tubes: 3,000 x 1,500 mm sheet capacity, ø 20-220 mm tube, ±0.03 mm accuracy, 0.1 mm kerf, weld-ready edges.',
      zh: '钛合金板材和管材精密光纤激光切割：3,000 x 1,500 mm 板材能力、ø 20-220 mm 管材、±0.03 mm 精度、0.1 mm 切口、可焊边缘。',
    },
  },
  '/titanium-fabrication-services/waterjet-cutting': {
    title: {
      en: 'Titanium Waterjet Cutting Services | Precision Cutting | BOZE CNC Ti',
      zh: '钛合金水刀切割服务 | 精密切割 | 博泽钛业',
    },
    description: {
      en: 'Precision abrasive waterjet cutting for titanium: 60,000 PSI, 120 mm thickness capacity, 3,000 x 2,000 mm bed, ±0.05 mm angular repeatability, zero HAZ.',
      zh: '钛合金精密磨料水刀切割：60,000 PSI、120 mm 厚度能力、3,000 x 2,000 mm 工作台、±0.05 mm 角度重复性、零热影响区。',
    },
  },
  '/titanium-fabrication-services/titanium-welding-assembly': {
    title: {
      en: 'Titanium Welding & Assembly Services | Precision Fabrication | BOZE CNC Ti',
      zh: '钛合金焊接与装配服务 | 精密制造 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium welding and assembly: ultra-pure TIG, laser welding, multi-component system assembly with anti-galling and CMM verification. AWS D1.6, AS9100D.',
      zh: '精密钛合金焊接与装配：超纯 TIG、激光焊接、多组件系统装配，含防咬合和三坐标测量机验证。AWS D1.6，AS9100D。',
    },
  },
  '/titanium-forming-heavy-manufacturing': {
    title: {
      en: 'Titanium Forming & Heavy Manufacturing | Forging & Extrusion | BOZE CNC Ti',
      zh: '钛合金成型与重工制造 | 锻造与挤压 | 博泽钛业',
    },
    description: {
      en: 'Heavy titanium forming and manufacturing: hot plate rolling, open/closed-die forging, large-scale assembly. 12,000 x 4,500 x 4,000 mm capacity, 50+ mm hot forming, 30 ton crane, AS9100D.',
      zh: '重型钛合金成型与制造：热板卷制、开/闭模锻造、大型装配。12,000 x 4,500 x 4,000 mm 能力、50+ mm 热成型、30 吨吊车、AS9100D。',
    },
  },
  '/titanium-forming-heavy-manufacturing/titanium-forging': {
    title: {
      en: 'Titanium Forging Services | Closed & Open Die | BOZE CNC Ti',
      zh: '钛合金锻造服务 | 闭模与开模 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium forging: closed-die, open-die, and seamless rolled ring forging. 8,000 metric ton press, ø 2,500 mm rings, AMS 2631 Class AA, ≥95% equiaxed α+β.',
      zh: '精密钛合金锻造：闭模、开模和无缝轧环锻造。8,000 吨压力机、ø 2,500 mm 环件、AMS 2631 AA 级、≥95% 等轴 α+β 组织。',
    },
  },
  '/titanium-forming-heavy-manufacturing/titanium-extrusion': {
    title: {
      en: 'Titanium Extrusion Services | Complex Profiles | BOZE CNC Ti',
      zh: '钛合金挤压服务 | 复杂型材 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium extrusion: complex structural profiles, seamless heavy-wall tubes, multi-channel hollow shapes. 6,000 ton press, 12 m length, ø 350 mm envelope, AS9100D.',
      zh: '精密钛合金挤压：复杂结构型材、无缝厚壁管、多通道中空形状。6,000 吨挤压机、12 m 长度、ø 350 mm 外廓、AS9100D。',
    },
  },
  '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing': {
    title: {
      en: 'Titanium Raw Material Preparation & Sizing | BOZE CNC Ti',
      zh: '钛合金原材料准备与定尺 | 博泽钛业',
    },
    description: {
      en: 'Titanium raw material preparation: heavy-duty CNC band sawing up to ø 800 mm, mechanical surface peeling, chemical decontamination. PMI validated, AS9100D.',
      zh: '钛合金原材料准备：重型 CNC 带锯切割（ø 800 mm）、机械表面剥皮、化学去污。PMI 验证，AS9100D。',
    },
  },
  '/titanium-surface-treatment': {
    title: {
      en: 'Titanium Surface Treatment Services | Anodizing & Passivation | BOZE CNC Ti',
      zh: '钛合金表面处理服务 | 阳极氧化与钝化 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium surface treatment services: anodizing, micro-arc oxidation (MAO), acid pickling & passivation. AMS 2488, ISO 13485, ASTM F86 certified surface engineering.',
      zh: '精密钛合金表面处理服务：阳极氧化、微弧氧化（MAO）、酸洗与钝化。AMS 2488、ISO 13485、ASTM F86 认证表面工程。',
    },
  },
  '/titanium-surface-treatment/anodizing': {
    title: {
      en: 'Titanium Anodizing Services | AMS 2488 Certified | BOZE CNC Ti',
      zh: '钛合金阳极氧化服务 | AMS 2488 认证 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium anodizing services: AMS 2488 Type II anti-galling anodizing, Type III pigment-free color coding, and high-purity acid pre-treatment. ISO 13485, AMS 2488D certified.',
      zh: '精密钛合金阳极氧化服务：AMS 2488 Type II 防咬合阳极氧化、Type III 无色素颜色编码和高纯酸预处理。ISO 13485、AMS 2488D 认证。',
    },
  },
  '/titanium-surface-treatment/chemical-passivation': {
    title: {
      en: 'Titanium Chemical Passivation Services | ASTM F86 | BOZE CNC Ti',
      zh: '钛合金化学钝化服务 | ASTM F86 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium chemical passivation services: nitric acid passivation, citric acid biocompatible lines, HF-HNO3 acid pickling. ASTM F86, ASTM A967, AMS 2700 certified.',
      zh: '精密钛合金化学钝化服务：硝酸钝化、柠檬酸生物相容性生产线、HF-HNO3 酸洗。ASTM F86、ASTM A967、AMS 2700 认证。',
    },
  },
  '/titanium-surface-treatment/polishing-sandblasting': {
    title: {
      en: 'Titanium Polishing & Sandblasting Services | BOZE CNC Ti',
      zh: '钛合金抛光与喷砂服务 | 表面精加工 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium mechanical finishing: multi-stage mirror polishing down to Ra 0.01 µm and engineered abrasive sandblasting for medical-grade anchor pore grids. Zero-contamination certified.',
      zh: '精密钛合金机械精加工：多级镜面抛光低至 Ra 0.01 µm 和工程磨料喷砂，用于医疗级锚定孔格。零污染认证。',
    },
  },
  '/laser-marking-custom-logo': {
    title: {
      en: 'Titanium Laser Marking & Custom Logo Services | BOZE CNC Ti',
      zh: '钛合金激光打标与定制 Logo 服务 | 博泽钛业',
    },
    description: {
      en: 'Precision titanium laser marking services: laser annealing, deep engraving, UID/DataMatrix serialization. MIL-STD-130, UDI compliant, ≤0.01 mm beam precision.',
      zh: '精密钛合金激光打标服务：激光退火、深雕、UID/DataMatrix 序列化。MIL-STD-130、UDI 合规、≤0.01 mm 光束精度。',
    },
  },
  '/branded-custom-packaging-services': {
    title: {
      en: 'Branded & Custom Titanium Packaging Services | BOZE CNC Ti',
      zh: '品牌定制钛合金包装服务 | 工业包装 | 博泽钛业',
    },
    description: {
      en: 'Industrial titanium packaging solutions: CNC foam milling, VCI marine corrosion barriers, ISPM-15 export crating. ISTA 2A/3A certified, ERP-linked traceability.',
      zh: '工业钛合金包装解决方案：CNC 泡沫铣削、VCI 海洋防腐蚀屏障、ISPM-15 出口木箱。ISTA 2A/3A 认证、ERP 关联可追溯性。',
    },
  },
  '/theme-demo': {
    title: {
      en: 'Theme Demo | BOZE CNC Ti',
      zh: '主题演示 | 博泽钛业',
    },
    description: {
      en: 'Interactive theme demonstration page showcasing all available color schemes for the BOZE CNC Ti website.',
      zh: '互动主题演示页面，展示博泽钛业网站所有可用的颜色方案。',
    },
  },
};
