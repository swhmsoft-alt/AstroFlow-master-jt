import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    badge: z.string().optional(),
    title: z.string(),
    highlight: z.string().optional(),
    description: z.string(),
    primaryCta: z.string().optional(),
    primaryCtaLink: z.string().optional(),
    secondaryCta: z.string().optional(),
    secondaryCtaLink: z.string().optional(),
    heroMediaType: z.enum(['image', 'video']).default('image'),
    heroVideoUrl: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    stats: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ).optional(),
  }),
});

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    gallery: z.array(
      z.object({
        image: z.string(),
        alt: z.string().default('Product image'),
      })
    ),
    specs: z.array(
      z.object({
        param: z.string(),
        value: z.string(),
      })
    ),
    btnText: z.string().default('Request Quote'),
    btnLink: z.string().default('/rfq'),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    pubDate: z.date().optional(),
    updatedDate: z.date().optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('BOZE CNC Ti'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  pages: pagesCollection,
  products: productsCollection,
  blog: blogCollection,
};