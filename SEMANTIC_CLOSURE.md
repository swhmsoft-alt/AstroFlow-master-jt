# Semantic Closure Global Guidelines for Astro with Cline

**Purpose:** Ensure every output—whether code, content, or structure—forms a complete semantic loop between user intent, information architecture, and machine understanding.

> **核心原则：** *"生成 → 验证 → 反馈 → 修正"* — 每一个输出都必须完成从用户意图到机器可读的完整语义循环。

---

## 1. User Intent Closure（意图闭环）

Cline must verify before generating and validate after generating.

### 1.1 Pre-Generation: 意图确认
- **分级确认策略：**
  - **高风险/模糊任务**（新增页面结构、改动架构、新增依赖）：必须反问澄清（例如："你需要的是静态数据展示页，还是交互式工具？"），并列出拆解计划，待用户确认后再动手。
  - **低风险/明确任务**（样式微调、文案修改、Bug 修复）：基于合理假设直接执行，并在输出中说明假设。
- **上下文对齐：** 始终基于现有的 Memory Bank 和业务目标思考，不越界增删非相关功能。

### 1.2 Post-Generation: 自检与验证
- **逻辑闭环检查：** 每次生成代码后，自我审查："这份输出是否无遗漏地解决了用户的原始需求？"
- **工具与事实验证：** 涉及 API 调用、计算逻辑或数据查询时，优先使用终端工具/测试脚本验证结果，严禁"假想运行"。

---

## 2. Information Architecture Closure（信息架构闭环）

确保网站在内容组织和导航路径上形成逻辑闭环，用户与爬虫永不"迷路"。

### 2.1 语义化 HTML5 结构
- 必须使用 HTML5 语义元素构建内容层级：`<main>` / `<article>` / `<section>` / `<header>` / `<footer>` / `<nav>` / `<aside>`。
- **严禁纯 div 支撑：** 禁止使用 `<div>` 包裹核心内容区域，除非无合适语义标签。
- **标题层级：** `<h1>` → `<h2>` → `<h3>` 必须连续且具备强描述性，单页仅允许一个 `<h1>`。
- 当语义标签不足以表达交互含义时，补充 `aria-label` 或 `aria-describedby`，确保残障用户可理解。
- **[修正] 交互样式：** 优先使用 CSS `:hover` / `:focus-visible` 实现悬停和焦点样式，避免在 `.astro` 组件中使用内联 `onmouseover` / `onmouseout` 事件处理器（不利于无障碍和客户端 JS 预算）。

### 2.2 内容关联与导航闭环
- **面包屑导航：** 除首页外，每个内容页/文章页必须包含 `BreadcrumbList` 结构的导航。
- **回溯路径：** 页脚或页面底部必须提供明确的"返回上级"或"回到首页"路径。
- **相关性推荐：** 推荐内容必须基于语义主题（如 Tag / Category 匹配），而非随机抽选。

### 2.3 自包含内容块
- 每个 `<section>` 或 `<article>` 应具备独立可读性，包含完整上下文。
- 关键概念或常见疑问区，优先使用明确的 Q&A 模块组织。

---

## 3. Machine Understanding Closure（机器理解闭环）

确保搜索引擎、AI 爬虫（如 Perplexity, GPTBot）与 LLM 能准确解析、索引和引用。

### 3.1 JSON-LD 结构化数据（强制）
在 `<head>` 中注入基于 Schema.org 的结构化数据：

| 页面类型 | 必需 Schema |
| :--- | :--- |
| **首页** | `WebSite` + `Organization` / `Person` |
| **普通页面** | `WebPage` |
| **文章/博客** | `BlogPosting` 或 `Article`（须含 `headline`, `author`, `datePublished`） |
| **列表/分类** | `CollectionPage` + `BreadcrumbList` |
| **产品/服务** | `Product` / `Service` |

**[修正] Astro 实现（基于现有代码库）：**
- **标准方案：** 使用 `src/lib/schema.ts` 中的 `buildPageGraph()` 函数生成完整的 `@graph` 组合。
  - 该方案已自动处理：Organization（`#boze-org`）、WebSite（`#boze-website`）、WebPage、BreadcrumbList、Article、Service、Product、CollectionPage、ItemList。
  - 页面类型由 `detectPageType()` 自动检测（基于 URL 模式和 `explicitPageType` prop）。
  - 在 `BaseLayout.astro` 的 `<head>` 中通过 `<script type="application/ld+json" set:html={ldJson} />` 注入。
- **备选方案（schema.ts 未覆盖的场景）：** 直接在页面级 `<script type="application/ld+json">` 手写补充。
- **标准约束：** 必须包含 Schema 类型的基础必填属性，`@context` 统一为 `https://schema.org`。

### 3.2 Meta 标签完备性
**[修正] 适用范围说明：** 以下要求适用于所有**可公开访问的 HTML 页面**。重定向页面或无索引需求的隐藏页面可豁免。

每个此类页面必须包含：
- 唯一且描述性的 `<title>` 和 `<meta name="description">`
- Open Graph 标签（`og:title`, `og:description`, `og:image`, `og:url`, `og:type`）
- Twitter Card 标签（`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`）
- 规范 URL：`<link rel="canonical" href="...">`
- **[优化] 搜索引擎引导：** 建议添加 `<meta name="robots" content="index, follow">`（可在页面级覆盖为 `noindex`）
- **[优化] Twitter Card 默认类型：** 必须设置 `<meta name="twitter:card" content="summary_large_image">`

### 3.3 语义化内部链接
- 锚文本必须明确描述目标内容（例如：使用"查看 Astro 性能优化指南"，而非"点击这里"）。
- 外部/不可信链接统一增加 `rel="nofollow noopener noreferrer"`。
- **[新增] 外部链接分类策略：**
  - 用户生成内容（UGC）中的链接 → `rel="ugc nofollow noopener noreferrer"`
  - 赞助/广告链接 → `rel="sponsored nofollow noopener noreferrer"`
  - 正常外部引用 → `rel="noopener noreferrer"`
- **[新增] 社交链接：** Footer 中的社交链接（LinkedIn 等）必须加 `rel="noopener noreferrer"`

---

## 4. Astro-Specific Implementation Standards

### 4.1 组件设计与水合策略
- **0-JS 默认：** `.astro` 组件默认在服务端渲染，不向客户端发送多余 JavaScript。
- **Islands 架构：** 仅在需要交互时，显式使用最轻量的 `client:*` 指令（优先考虑 `client:visible` 或 `client:idle`）。
- **[优化] 性能预算：** 单页客户端 JavaScript 总大小原则上不超过 **100KB**（gzip 后），超出需主动说明理由并寻求优化方案。本项目已遵循 0-JS 默认原则（仅 1 个 React 交互组件），应保持。
- **组件规范：** 命名采用 `PascalCase`，坚持单一职责原则。
- **标签闭环：** 所有 HTML 标签必须正确闭合。

### 4.2 Content Collections（Astro v5+）
- **[修正] 配置文件路径：** 统一使用 `src/content/config.ts`（而非 `src/content.config.ts`）定义内容集合。Astro v5 支持两种路径，本项目标准为前者。
- 必须通过 `zod`（`astro:content` 导出）对 frontmatter 进行类型校验。
- 必须运行 `npx astro sync` 确保 TypeScript 类型强绑定。
- **[新增] 知识图谱集合：** 项目中已有的 `systems`, `capabilities`, `semantic-*`, `product-entities` 等 data 类型集合，也应遵循 Zod 校验，并保持与 `src/data/` 中静态数据的一致性。

### 4.3 布局与模板
- 使用 `<BaseLayout>` 包裹所有页面，确保 Meta、JSON-LD、Header/Footer 统一管理。
- 善用 `<slot />` 与具名 Slot 进行内容注入。

---

## 5. Cline Workflow Integration

### 5.1 Memory Bank（强制执行）
Cline 在根目录维护 `memory-bank/` 文件夹：
- `projectbrief.md` — 核心需求与目标
- `productContext.md` — 业务背景与问题定义
- `activeContext.md` — 当前工作焦点（频繁更新）
- `systemPatterns.md` — 架构决策与设计模式
- `techContext.md` — 技术栈约束与依赖
- `progress.md` — 进度与 TODO

**[优化] 执行规则（已具体化）：**
1. 任务开始时，首先读取全部 Memory Bank 文件。
2. 在以下节点**必须**更新 `activeContext.md`：
   - 一个完整的任务/子任务完成时
   - 用户明确要求修改方案时
   - 遇到阻塞问题并解决时
   - 上下文轮次超过 10 轮时（批次更新）
   - 更新内容应包含：当前进度、已做出的决策、下一步计划
3. 当用户要求 "update memory bank" 时，进行全量检查并同步最新状态。

### 5.2 代码质量与配置
- **TypeScript 优先：** 拒绝使用 `any`，所有组件 Props 需声明 `interface Props`。
  - **[新增] 已有 any 逐步清理：** 代码库中少量 `any`（如 `NAV_LABEL_MAP` 中的 `walk(items: any[])`、React 组件的 `as any`）应逐步改为具体类型。
  - `.astro/content.d.ts` 中由 Astro 自动生成的 `any` 类型属框架行为，无需手动修改。
- **无硬编码：** 站点全局配置（如名称、域名、社交链接）统一抽离至 `src/config/site.ts` 或 `src/config/seo.ts`。

### 5.3 上下文窗口管理
- 当上下文占用明显升高时，主动提醒用户进行 `/clear` 或总结。

---

## 6. Validation Checklist（交付前自检）

每次完成代码编写或内容生成后，Cline **必须**在回复末尾按以下格式附带自检结果：

```
## ✅ 语义闭环自检清单

- [x] 语义化 HTML5 标签（<main>, <article>, <section> 等）
- [x] 标题层级连续（<h1> → <h2> → <h3>），无断层
- [x] 注入了合规的 JSON-LD 结构化数据（通过 schema.ts buildPageGraph）
- [x] 完整的 Meta 标签（Title, Description, OG, Twitter[含 card 类型], Canonical）
- [x] 非首页配置了面包屑导航与回溯链接
- [x] 内部链接锚文本具备描述性
- [x] 外部链接添加了安全 rel 属性（noopener noreferrer 等）
- [x] Astro 组件未滥用 client:* 水合指令（JS 总量 ≤ 100KB）
- [x] TypeScript 类型检查通过，无硬编码 / 无新增 any
- [x] 可访问性标注（必要时补充 aria-*，避免内联事件处理器）
- [x] Memory Bank（activeContext.md 等）已同步更新（更新于 [时间]）
- [x] RTL 兼容性（若涉及阿拉伯语页面）
```

**[优化] 说明：** 若有某项不适用（例如重定向页面无需面包屑），请在该项后标注 `[N/A]` 并简述理由。

---

## 附录 A：与 .clinerules 的衔接

**[新增] 本文件与 `.clinerules/` 的关系：**
- `SEMANTIC_CLOSURE.md` 是语义闭环的完整规范文档，适用于所有代码输出。
- `.clinerules/` 中的规则是 Cline 的工作环境约束，二者应互补而不冲突。
- **建议引用方式：** 在 `.clinerules/` 首行加入：
  ```
  At the start of every session, read and strictly adhere to SEMANTIC_CLOSURE.md.
  ```
- **[修正] 冲突解决：** 如 `.clinerules` 中存在与本规范矛盾的条目（例如"禁止规划状态" vs "必须反问澄清+列出拆解计划"），以本规范为准进行更新。

---

## 附录 B：与实际代码库的偏差记录

**[新增] 以下条目为审计发现的实际代码现状，供参考：**

| 维度 | 当前实现 | 说明 |
| :--- | :--- | :--- |
| JSON-LD 方案 | `src/lib/schema.ts` — 自定义 `buildPageGraph()` | 优于第三方插件，已全面覆盖 |
| 内容集合配置 | `src/content/config.ts`（非 `content.config.ts`） | Astro v5 两种路径皆可 |
| 交互组件 | 仅 CADUpload.tsx 为 React，无 `client:*` 指令 | 符合 0-JS 默认要求 |
| 面包屑 | 服务页手动 `<nav>` + BaseLayout 自动 JSON-LD | 双层保障 |
| `aria-*` 标注 | Header/Footer 已使用，部分组件欠缺 | 逐步完善 |
| 内联事件 | ServicesOverview 等使用了 `onmouseover`/`onmouseout` | 建议迁移至 CSS |
