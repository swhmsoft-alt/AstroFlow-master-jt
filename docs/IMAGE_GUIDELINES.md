# 图片命名与元数据规范

目的：统一图片命名、版本管理与元数据格式，便于自动化替换、CDN 缓存失效与非开发者管理。

1. 命名规范
- 基本格式：{scope}-{entityId}_v{version}.{ext}
  - 示例：`product-123_v1.jpg`、`hero-landing_v2.webp`
  - `scope`：表示用途或模块（例如 product、hero、thumbnail、og）
  - `entityId`：可选的对象 ID（产品、页面 slug 等）
  - `version`：整数，替换图片时递增（用于强制缓存失效）

2. 元数据字段（JSON 示例）

{
  "id": "product-123",
  "filename": "product-123_v2.webp",
  "version": 2,
  "alt": "High-precision titanium flange",
  "caption": "Titanium flange for aerospace assembly",
  "credit": "Photo by ACME Studio",
  "width": 2070,
  "height": 1380,
  "format": "webp",
  "license": "© BOZE CNC",
  "tags": ["titanium","aerospace","CNC"],
  "createdAt": "2026-05-16T08:00:00Z"
}

3. 版本与缓存策略
- 推荐使用文件名版本（`_v{n}`），替换图像时上传新文件并更新引用或 metadata 中的 `filename` 字段。
- 如果使用 CDN（Cloudflare/Cloudinary），也可调用清缓存 API，但文件名版本更简单可靠。

4. 支持格式与优先级
- 原始 master 文件（高分辨率）上载至对象存储或私有仓库。
- 公开使用时提供 WebP/AVIF 优先，回退 JPEG/PNG。构建或 CDN 可生成衍生尺寸。

5. 在代码中引用
- 前端组件应通过 `id` 或 `filename` 查找元数据并渲染统一的 `Image` 组件（例如 `src/components/ui/Image.astro`）。

6. 非开发者替换流程
- 使用 Headless CMS（Sanity/Strapi）或一个简单的管理 UI 存储并更新 metadata；替换时上传新文件并更新 `version` 与 `filename`。

7. CI/自动化
- 可编写脚本：上传原始图像 → 生成衍生图（不同宽度/格式）→ 更新 metadata JSON → 可选触发构建或调用 CDN 清缓存。

8. 示范脚本（思路）
- `upload-image.sh image.jpg product-123`：上传、生成 webp、返回 filename 与 URL。

---
建议把此文档作为团队规范，并在替换图片时严格遵循，以简化缓存与替换流程。
