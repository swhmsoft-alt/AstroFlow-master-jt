import { useState, useMemo } from 'react';

/* ── 知识库：常见钛合金成品件与匹配方案 ── */

interface PartProfile {
  keywords: string[];            // 匹配关键词
  industries: string[];          // 所属行业
  category: string;              // 类别
  geometry: string;              // 几何特征
  painPoints: string[];          // 核心痛点
  alloyId: string;               // 推荐牌号
  alloyReason: string;           // 选材理由
  formId: string;                // 原材料形态
  formReason: string;            // 选型理由
  process: string[];             // 推荐工艺
  tollServices: string[];        // 外协加工
  pitfalls: string[];            // 避坑
  specNote: string;              // 采购技术条件备注
  servicePage: string;           // 关联服务页面
  image: string;                 // 表情图标
}

const ALLOYS: Record<string, string> = {
  'cp1': 'Grade 1 CP-Ti (TA1) — 纯钛，最高延展性',
  'cp2': 'Grade 2 CP-Ti (TA2) — 工业纯钛，综合耐蚀',
  'cp3': 'Grade 3 CP-Ti (TA3) — 中强度纯钛',
  'tc4': 'Grade 5 Ti-6Al-4V (TC4) — 通用α-β型，高强度',
  'tc4eli': 'Grade 23 Ti-6Al-4V ELI (TC4 ELI) — 超低间隙，植入物级',
  'ta9': 'Grade 7 Ti-0.15Pd (TA9) — 钯改性，耐强酸',
  'ta10': 'Grade 12 Ti-0.3Mo-0.8Ni (TA10) — 钼镍改性，化工级',
  'ta18': 'Grade 9 Ti-3Al-2.5V (TA18) — 中等强度，易成型',
};

const FORMS: Record<string, string> = {
  'bar': '棒材 / 圆棒 — 适合车削加工、紧固件',
  'plate': '板材 / 中厚板 — 适合焊接、机加工壳体',
  'tube': '无缝管 — 适合流体系统、换热器',
  'forging': '模锻件 / 环件 — 适合高应力关键件',
  'wire': '丝材 / 小棒 — 适合紧固件、弹簧、医疗',
};

/* ── 成品知识库 ── */

const PART_DB: PartProfile[] = [
  {
    keywords: ['阀针', '阀杆', '阀芯', '阀门', 'valve', 'needle', 'stem', 'nozzle'],
    industries: ['能源', '化工', '氢能', '石油'],
    category: '阀门/流体控制部件',
    geometry: '细长轴类，小直径，高长径比，精密锥面/球面密封端',
    painPoints: ['高压密封', '高频开关冲击', '介质腐蚀', '氢脆', '微泄漏'],
    alloyId: 'tc4',
    alloyReason: 'TC4 兼具高强度（屈服≥830MPa）和良好韧性，抗氢脆性能优于纯钛，适合高压氢气和腐蚀介质环境。如有生物相容性要求应选用 TC4 ELI。',
    formId: 'bar',
    formReason: '细长轴类适合从棒材直接走心机/纵切车削，材料利用率约60-70%，相比板材切割+焊接方案降低50%加工成本。',
    process: ['走心机精密车削', 'CBN刀具精加工', '高精度磨削'],
    tollServices: ['外圆磨削/无心磨', 'PVD/DLC涂层', '激光打标追溯码'],
    pitfalls: ['长径比＞10:1时易弹刀变形，建议分段加工或采用跟刀架支撑', '锥面密封面粗糙度需Ra≤0.2µm，需超精磨削'],
    specNote: '退火态(A)，UT Class B，表面粗糙度Ra≤0.4µm，密封面Ra≤0.2µm',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '🔧',
  },
  {
    keywords: ['叶片', '叶轮', 'impeller', 'blade', 'fan', '涡轮', 'propeller'],
    industries: ['航空航天', '能源', '船舶'],
    category: '叶轮/叶片类旋转件',
    geometry: '三维复杂曲面，薄壁扭曲叶片，轮毂+叶片整体结构',
    painPoints: ['高转速离心力', '交变疲劳', '高温', '气蚀', '动平衡'],
    alloyId: 'tc4',
    alloyReason: 'TC4 具有优异的比强度（强度/密度比约230MPa/g·cm⁻³）和疲劳寿命（10⁷次旋转弯曲疲劳≥500MPa），是航空发动机和压缩机叶轮的行业标准用材。',
    formId: 'forging',
    formReason: '模锻件可优化金属流线沿叶片轮廓分布，比棒材直接铣削提高疲劳寿命30%以上，同时减少90%的切削浪费。',
    process: ['五轴联动数控铣削', '自适应加工', '振动光饰'],
    tollServices: ['五轴加工中心', '三坐标测量(CMM)', '动平衡测试', '荧光渗透检测(FPI)'],
    pitfalls: ['薄壁叶片（<1mm）加工变形风险大，建议采用高速铣削+减应力切削路径', '难达到G2.5动平衡等级，需多次迭代补偿'],
    specNote: '模锻件，AMS 4928，退火态，100% FPI + UT Class A，动平衡 G2.5',
    servicePage: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
    image: '🌀',
  },
  {
    keywords: ['植入', '骨钉', '骨板', '髋关节', '膝关节', '脊柱', 'implant', 'screw', 'plate', 'hip', 'knee'],
    industries: ['医疗器械'],
    category: '医用植入物',
    geometry: '小型精密件，复杂曲面（关节面），内六角/十字驱动头，自攻螺纹',
    painPoints: ['生物相容性', '疲劳断裂', '骨结合', '无菌处理', '应力遮挡'],
    alloyId: 'tc4eli',
    alloyReason: 'TC4 ELI (ASTM F136) 是外科植入物标准用材，超低间隙元素（O≤0.13%）提高了断裂韧性和抗疲劳性能，优于普通TC4。不可使用工业级TC4替代。',
    formId: 'bar',
    formReason: '棒材是骨钉/骨板的标准供货形态，可直接走心机一次成型，表面质量好，批次一致性高。',
    process: ['走心机自动车削', '滚丝/螺纹成型', '电化学抛光'],
    tollServices: ['钝化处理(ASTM F86)', '清洗包装(Class 8洁净室)', '激光打标UDI码'],
    pitfalls: ['自攻螺纹不允许毛刺，建议采用滚丝而非切削螺纹', '植入物表面不可有加工污染（铁污染），需专用钛合金刀具'],
    specNote: 'ASTM F136，退火态，100%尺寸检测 + 表面污染测试，无菌包装',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🏥',
  },
  {
    keywords: ['换热器', '热交换', '管板', '管道', '冷却', '反应釜', 'heat exchanger', 'tube', 'pipe'],
    industries: ['化工', '能源', '船舶', '海水淡化'],
    category: '换热器/管道系统',
    geometry: '管材/板材组合结构，管板+管束+壳体，大量钻孔和管孔',
    painPoints: ['缝隙腐蚀', '流体冲蚀', '管板密封', '热应力', '氯离子应力腐蚀'],
    alloyId: 'cp2',
    alloyReason: 'Grade 2 CP-Ti 在海水和氯化物环境中具有极佳的耐腐蚀性（耐蚀电位＞+0.8V vs SCE），成本适中。若介质含强还原性酸（如H₂SO₄），应升级为 Grade 7 (TA9) 或 Grade 12 (TA10)。',
    formId: 'tube',
    formReason: '无缝管是换热管束的标准形态，规格成熟（外径6-50mm），供货周期短，成本可控。管板采用中厚板。',
    process: ['管板钻孔', '管端胀接/密封焊', '壳体和管箱焊接'],
    tollServices: ['管板深孔钻', '管端自动氩弧焊', '水压试验', '酸洗钝化'],
    pitfalls: ['钛管与管板焊接需高纯氩气保护（99.999%），背面充氩防止氧化', '管板孔公差要求H8以上，保证胀接密封性'],
    specNote: 'ASTM B338 Gr2 无缝管，退火态，100%水压试验 + 涡流探伤(ET)',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🔥',
  },
  {
    keywords: ['外壳', '腔体', '容器', '箱体', 'housing', 'chamber', 'enclosure', 'vessel'],
    industries: ['航空航天', '医疗设备', '化工', '半导体'],
    category: '壳体/腔体类结构件',
    geometry: '盒状/筒状薄壁结构，含安装耳座、法兰口、观察窗等多处特征',
    painPoints: ['整体刚度', '密封性', '焊接变形', '减重', '内部清洁度'],
    alloyId: 'tc4',
    alloyReason: 'TC4 比强度高，在同等刚度下比不锈钢减重45%。适用于航空航天和医疗设备外壳。若仅需耐腐蚀且无高强度要求，可采用 Grade 2 CP-Ti 降低成本。',
    formId: 'plate',
    formReason: '板材拼焊是壳体类的最经济方案，可利用 CNC 下料和自动焊接减少加工余量。大批量时可考虑精铸件。',
    process: ['CNC 下料/仿形切割', 'TIG/MIG 焊接', '五轴铣削加工面', '热处理去应力'],
    tollServices: ['激光/水切割下料', '真空钎焊（如需要）', '打压测试', '表面喷砂/钝化'],
    pitfalls: ['钛合金焊接变形大，需设计焊接工装和预留反变形量', '焊后必须进行去应力退火（600-650°C / 2h）'],
    specNote: 'ASTM B265 Gr5 退火板，焊后去应力退火，100%渗透检测(PT)',
    servicePage: '/titanium-fabrication-services/',
    image: '📦',
  },
  {
    keywords: ['螺栓', '螺母', '紧固件', '螺钉', '螺柱', '垫圈', 'bolt', 'nut', 'fastener', 'screw', 'stud'],
    industries: ['航空航天', '化工', '船舶', '医疗'],
    category: '紧固件',
    geometry: '标准/非标螺纹件，小尺寸为主，头部形状多样（六角/内六角/一字）',
    painPoints: ['螺纹强度', '咬死（galling）', '氢脆', '扭矩控制', '耐热松脱'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 (Ti-3Al-2.5V) 是航空紧固件的标准用材，强度略低于 TC4 但冷镦成型性更好，适合大批量生产。TC4 适合高强螺栓。',
    formId: 'wire',
    formReason: '丝材/小棒是紧固件的标准原料形态，可直接冷镦或热镦成型，材料利用率高达95%以上。',
    process: ['冷镦/热镦成型', '滚螺纹', '热处理', '表面处理'],
    tollServices: ['真空退火', '阳极氧化(AMS 2488)', '批次检测(力学+金相)'],
    pitfalls: ['钛合金紧固件必须使用抗咬合涂层（如铝青铜镀层、MoS₂涂层）', '螺纹滚压比切削强度高30%，必须采用滚丝工艺'],
    specNote: 'AMS 4934 / ASTM B348 Gr9，固溶+时效态(STA)，100%螺纹检测',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🔩',
  },
  {
    keywords: ['支架', ' bracket', 'fitting', '连接件', '接头', 'connector', 'adapter'],
    industries: ['航空航天', '汽车', '通用工业'],
    category: '支架/连接件',
    geometry: 'L型/T型/异形结构件，含安装孔、减重槽、加强筋',
    painPoints: ['振动疲劳', '多轴应力', '减重', '安装对位精度'],
    alloyId: 'tc4',
    alloyReason: 'TC4 优异的综合力学性能和减重效果（密度4.43g/cm³），是航空航天支架的标准选材。',
    formId: 'plate',
    formReason: '板材 CNC 铣削成型是支架的常用方案，小批量灵活。大批量可考虑模锻件。',
    process: ['4/5轴 CNC 铣削', '钻孔/攻丝', '去毛刺/倒圆'],
    tollServices: ['水切割下料', '振动光饰', '阳极氧化', '尺寸检测'],
    pitfalls: ['薄壁处（<2mm）铣削易振刀，需采用高速小切深策略', '安装孔位置度要求±0.05mm时，建议一次装夹完成'],
    specNote: 'AMS 4928 TC4 退火板，100%尺寸检测，阳极化处理',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '📐',
  },
  {
    keywords: ['弹簧', 'spring', '弹性', '卡箍', 'clip'],
    industries: ['航空航天', '医疗', '化工'],
    category: '弹性元件',
    geometry: '细丝螺旋/异形截面，高弹性变形量',
    painPoints: ['弹性衰减', '疲劳断裂', '应力松弛', '工作温度'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 (Ti-3Al-2.5V) 弹性模量约110GPa，比钢低一半但弹性极限高，是钛合金弹簧的标准选材。需固溶+时效处理获得最佳弹性性能。',
    formId: 'wire',
    formReason: '丝材是弹簧的唯一原料形态，可直接卷簧成型，效率高。',
    process: ['自动卷簧机成型', '精密磨端面', '固溶+时效热处理', '表面强化喷丸'],
    tollServices: ['真空热处理', '喷丸强化', '疲劳测试', '刚度分选'],
    pitfalls: ['钛弹簧设计应力应为剪切屈服强度的40-50%，不可按钢弹簧设计经验直接套用', '卷簧后必须进行去应力退火，否则弹性衰减严重'],
    specNote: 'AMS 4934 / ASTM B863 Gr9，固溶+时效态(STA)',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '〰️',
  },
];

/* ── 主组件 ── */

export default function ReverseEngineerTool() {
  const [input, setInput] = useState('');
  const [industry, setIndustry] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!input.trim()) return [];
    const kw = input.toLowerCase().split(/[\s,，、]+/);
    const matched: { profile: PartProfile; score: number }[] = [];

    for (const p of PART_DB) {
      let score = 0;
      for (const kw of kw) {
        for (const pk of p.keywords) {
          if (pk.toLowerCase().includes(kw) || kw.includes(pk.toLowerCase())) {
            score += 10;
          }
        }
        for (const ind of p.industries) {
          if (ind.toLowerCase().includes(kw) || kw.includes(ind.toLowerCase())) {
            score += 5;
          }
        }
      }
      // Industry filter bonus
      if (industry && p.industries.some(i => industry.includes(i))) {
        score += 3;
      }
      if (score > 0) matched.push({ profile: p, score });
    }

    return matched.sort((a, b) => b.score - a.score);
  }, [input, industry]);

  const display = selectedIdx !== null ? [results[selectedIdx]].filter(Boolean) : results;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSelectedIdx(null);
  };

  return (
    <div className="w-full">
      {/* 表单 */}
      <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
        <form onSubmit={handleSearch} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
              成品件名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入零件名称，如：阀针、叶轮、骨钉、换热器管板、外壳..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
            >
              <option value="">全部行业</option>
              <option value="航空航天">✈️ 航空航天</option>
              <option value="医疗器械">🏥 医疗器械</option>
              <option value="化工">🧪 化工/石油</option>
              <option value="能源">⚡ 能源/氢能</option>
              <option value="船舶">🚢 船舶/海洋</option>
              <option value="半导体">💻 半导体</option>
            </select>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all text-base whitespace-nowrap"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >🔍 查询匹配方案</button>
          </div>
        </form>

        {/* 快速入口 */}
        {!searched && (
          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <p className="text-xs mb-3" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>或直接查看常见成品件的逆向方案：</p>
            <div className="flex flex-wrap gap-2">
              {PART_DB.map((p, i) => (
                <button key={i} onClick={() => { setInput(p.keywords[0]); setSearched(true); setSelectedIdx(i); }}
                  className="px-3 py-1.5 text-xs rounded-lg transition-all"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
                >{p.image} {p.category}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 搜索结果 */}
      {searched && results.length === 0 && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm mb-4" style={{ color: 'var(--theme-text)' }}>未找到匹配的成品方案。</p>
          <p className="text-xs mb-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>建议更换关键词搜索，或直接联系我们的工程团队获取定制方案。</p>
          <a href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white"
            style={{ backgroundColor: 'var(--theme-primary)' }}>📩 联系工程团队</a>
        </div>
      )}

      {/* 匹配结果列表 */}
      {searched && results.length > 0 && selectedIdx === null && (
        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
            找到 {results.length} 个匹配方案，点击查看详情：
          </p>
          {results.slice(0, 5).map((r, i) => (
            <button key={i} onClick={() => setSelectedIdx(results.indexOf(r))}
              className="w-full text-left rounded-xl p-4 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.profile.image}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{r.profile.category}</div>
                  <div className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>匹配度: {Math.min(100, r.score * 10)}% · {r.profile.industries.join(' / ')}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 详细方案 */}
      {display.map((r, i) => {
        const p = r.profile;
        const alloyName = ALLOYS[p.alloyId as keyof typeof ALLOYS] || p.alloyId;
        const formName = FORMS[p.formId as keyof typeof FORMS] || p.formId;
        return (
          <div key={i} className="rounded-2xl p-6 md:p-8 mb-6" style={{ backgroundColor: 'var(--theme-surface)', border: '2px solid var(--theme-primary)' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{p.image}</span>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>{p.category}</h3>
                <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>{p.industries.join(' · ')}</p>
              </div>
            </div>

            {/* 1. 成品特征 */}
            <Section title="1. 成品特征解析" content={p.geometry} />
            <ul className="text-sm space-y-1 mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}>
              {p.painPoints.map((pt, j) => <li key={j}>⚠️ {pt}</li>)}
            </ul>

            {/* 2. 选材 */}
            <Section title="2. 逆向选材推导" content={alloyName} />
            <p className="text-sm mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>{p.alloyReason}</p>

            {/* 3. 选型 */}
            <Section title="3. 逆向选型推导" content={formName} />
            <p className="text-sm mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>{p.formReason}</p>

            {/* 4. 制造工艺 */}
            <Section title="4. 推荐制造工艺与加工服务" content="" />
            <div className="ml-4 mb-4">
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>核心工艺：</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {p.process.map((pr, j) => <span key={j} className="px-2.5 py-1 text-xs rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)', color: 'var(--theme-primary)' }}>{pr}</span>)}
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>外协加工服务：</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {p.tollServices.map((ts, j) => <span key={j} className="px-2.5 py-1 text-xs rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)', color: '#22c55e' }}>{ts}</span>)}
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>工艺避坑：</p>
              <ul className="text-xs space-y-1" style={{ color: 'color-mix(in srgb, #ef4444, 70%)' }}>
                {p.pitfalls.map((pf, j) => <li key={j}>⚠️ {pf}</li>)}
              </ul>
            </div>

            {/* 5. 采购技术条件 */}
            <Section title="5. 推荐的供货技术条件" content={p.specNote} />

            {/* CTA */}
            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-center" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
              <a href={p.servicePage} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all"
                style={{ color: 'var(--theme-primary)', border: '1px solid var(--theme-primary)' }}>
                查看相关服务 →
              </a>
              <a href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all"
                style={{ backgroundColor: 'var(--theme-primary)' }}>
                📩 获取正式报价
              </a>
            </div>

            {selectedIdx !== null && (
              <div className="mt-4 text-center">
                <button onClick={() => setSelectedIdx(null)}
                  className="text-xs underline" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                  ← 返回全部结果
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="mb-2">
      <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--theme-text)' }}>{title}</h4>
      {content && <p className="text-sm ml-4" style={{ color: 'var(--theme-primary)', fontWeight: 600 }}>{content}</p>}
    </div>
  );
}
