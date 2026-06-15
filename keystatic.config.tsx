import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/**',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        pubDate: fields.date({ label: 'Publish Date' }),
        author: fields.text({ label: 'Author', defaultValue: 'BOZE CNC Ti' }),
        category: fields.text({ label: 'Category' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value || 'Tag',
        }),
        coverImage: fields.image({ label: 'Cover Image', directory: 'public/uploads/blog/' }),
        coverImageAlt: fields.text({ label: 'Cover Image Alt Text' }),
        featured: fields.checkbox({ label: 'Featured Post', defaultValue: false }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/uploads/blog/',
              publicPath: '/uploads/blog/',
            },
          },
        }),
      },
    }),
    products: collection({
      label: 'Products',
      slugField: 'title',
      path: 'src/content/products/**',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Product Name' } }),
        category: fields.text({ label: 'Category' }),
        description: fields.text({ label: 'Description', multiline: true }),
        gallery: fields.array(
          fields.object({
            image: fields.image({ label: 'Image', directory: 'public/uploads/products/' }),
            alt: fields.text({ label: 'Alt Text', defaultValue: 'Product image' }),
          }),
          { label: 'Gallery Images', itemLabel: (props) => props.fields.alt.value || 'Image' }
        ),
        specs: fields.array(
          fields.object({
            param: fields.text({ label: 'Parameter' }),
            value: fields.text({ label: 'Value' }),
          }),
          { label: 'Specifications', itemLabel: (props) => props.fields.param.value || 'Spec' }
        ),
        btnText: fields.text({ label: 'Button Text', defaultValue: 'Request Quote' }),
        btnLink: fields.text({ label: 'Button Link', defaultValue: '/rfq' }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        order: fields.number({ label: 'Display Order', defaultValue: 0 }),
        pubDate: fields.date({ label: 'Publish Date' }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/uploads/products/',
              publicPath: '/uploads/products/',
            },
          },
        }),
      },
    }),
  },
});