# Netlify CMS 集成说明

本项目已集成 Netlify CMS，作为一个免费的 Git-backed 内容管理界面。它适合没有付费第三方 CMS 的场景，并且可以直接在 Netlify 或本地开发环境中使用。

## 目录结构

- `public/admin/index.html` - Netlify CMS 管理界面入口
- `public/admin/config.yml` - CMS 配置
- `src/content/pages/home.md` - 首页 Hero 区内容示例
- `public/uploads/` - Netlify CMS 上传图片的目标目录
- `netlify.toml` - Netlify 部署配置与 `/admin` 重定向

## 本地运行

1. 启动 Astro 开发服务器：

```bash
npm install
npm run dev
```

2. 打开管理界面：

```
http://localhost:3000/admin/
```

3. 使用 `local_backend: true` 在本地保存更改。

## 编辑内容

当前已配置一个 `Homepage > Hero Section` 页面，关联文件为：

- `src/content/pages/home.md`

该文件包含：

- hero banner 文案
- CTA 文案与链接
- hero 图片路径
- 统计数据

## 图片上传

CMS 上传的图片会存储到 `public/uploads/`，并通过 `/uploads/...` 访问。

## 推进建议

如果你想继续扩展 Netlify CMS：

- 为 `use-cases`、`rfq`、`facilities` 等页面添加更多 `file` collection
- 添加 `blog` 或 `news` collection
- 将图像字段的 `widget: image` 与 `public/uploads/` 结合使用
- 在部署到 Netlify 时启用 `git-gateway` 或 Netlify Identity

## 注意

这套集成适合 Git-based 内容流程。如果你希望未来再迁移到更高级的付费 CMS，例如 Sanity，只需要替换 `public/admin` 和内容读取逻辑。
