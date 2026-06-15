# Headless CMS 集成指南（Sanity 示例）

目标：为非开发者提供一个可管理图片与元数据的界面，并在网站中安全加载 CMS 提供的图片。

推荐：使用 Sanity（易于定义 schema、支持图像裁剪、可生成可公开访问的 URL），亦可选择 Strapi、Contentful、Netlify CMS 等。

如果想要免费方案：
- `Netlify CMS` 是一个开源 Git-backed CMS，适合把内容和图片直接托管在项目仓库中。
- `Strapi` / `Directus` 提供自托管免费版本，可在自己的服务器上运行。

快速步骤（Sanity）：

1. 在本地或 Sanity Cloud 创建项目

```bash
npx create-sanity@latest
# 选择：Blog schema（minimal），或自定义
```

2. 添加图片 schema（示例见 cms/sanity/schemas/image.js）

3. 配置 `dataset` 与 `projectId`，并在 Sanity Studio 中登录，创建 `image` 文档，填写 `alt`、`caption` 等字段并上传图片。

4. 将 Sanity 的公开图片 URL 用作网站 `Image` 组件的 `src`：
- 如果使用 `Image.astro`，外部 URL 会以普通 `<img>` 渲染（参见 `src/components/ui/Image.astro`）。

5. 自动化：在 Sanity 中设置 webhook，指向你的网站构建 webhook（例如 Vercel/Netlify 支持），这样在 CMS 更新图片时会触发站点重建。若使用 CDN，请使用版本化或 CDN 清缓存 API。

6. 可选：在构建时从 Sanity 拉取元数据并生成本地 JSON（在 `src/data/`），以便于静态渲染与 SEO。

示例 Sanity 架构与客户端示例在仓库：
- `cms/sanity/schemas/image.js`（示例 schema）
- `src/utils/sanityClient.js`（示例客户端用法）

注意事项：
- 优先上传高质量原始文件到 CMS，再由 CDN/服务生成衍生图以供前端使用（WebP/AVIF、不同尺寸）。
- 依赖外部 URL 时要确保使用 HTTPS 和正确的缓存策略。

本项目当前已集成 Netlify CMS 作为免费 Git-backed CMS 方案，详见 `docs/NETLIFY_CMS.md`。
