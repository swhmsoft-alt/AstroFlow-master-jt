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
    btnLink: z.string().default('https://www.bozemetal.com/contact'),
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

const blogTranslationsCollection = defineCollection({
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
    lang: z.string(),
    originalSlug: z.string(),
  }),
});

const productTranslationsCollection = defineCollection({
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
    btnLink: z.string().default('https://www.bozemetal.com/contact'),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    pubDate: z.date().optional(),
    updatedDate: z.date().optional(),
    lang: z.string(),
    originalSlug: z.string(),
  }),
});

/* ── Manufacturing Knowledge Graph Collections ── */

const systemsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    emoji: z.string(),
    industry: z.string(),
    description: z.string(),
    designPrinciples: z.array(z.string()).optional(),
    engineeringTrends: z.array(z.string()).optional(),
    comparisonNotes: z.string().optional(),
    productEntities: z.array(z.string()).optional(),
    relatedCapabilities: z.array(z.string()).optional(),
    relatedMaterials: z.array(z.string()).optional(),
    relatedStandards: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const productEntitiesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    aliases: z.array(z.string()).optional(),
    industry: z.string(),
    system: z.string(),
    category: z.string(),
    function: z.string(),
    material: z.string(),
    alloyReason: z.string(),
    process: z.array(z.string()),
    surfaceTreatment: z.array(z.string()).optional(),
    inspection: z.array(z.string()).optional(),
    commonFailures: z.array(z.string()).optional(),
    designConsiderations: z.array(z.string()).optional(),
    standards: z.array(z.string()).optional(),
    typicalRfqRequirements: z.array(z.string()).optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    relatedProducts: z.array(z.string()).optional(),
    relatedCapabilities: z.array(z.string()).optional(),
    relatedMaterials: z.array(z.string()).optional(),
    relatedIndustries: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    order: z.number().default(0),
    pubDate: z.string().optional(),
    // Rich Blueprint Fields (optional)
    sku: z.string().optional(),
    titanium_grade: z.string().optional(),
    titanium_type: z.string().optional(),
    uns_number: z.string().optional(),
    werkstoff_number: z.string().optional(),
    density: z.string().optional(),
    tensile_strength: z.string().optional(),
    yield_strength: z.string().optional(),
    elongation: z.string().optional(),
    hardness: z.string().optional(),
    modulus: z.string().optional(),
    thermal_conductivity: z.string().optional(),
    max_service_temp: z.string().optional(),
    surface_finish: z.string().optional(),
    manufacturing_process: z.string().optional(),
    weight_reduction: z.string().optional(),
    ndt_methods: z.string().optional(),
    compliance: z.array(z.string()).optional(),
  }),
});

const materialsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    aliases: z.array(z.string()).optional(),
    category: z.string(),
    density: z.string().optional(),
    tensileStrength: z.string().optional(),
    yieldStrength: z.string().optional(),
    elongation: z.string().optional(),
    hardness: z.string().optional(),
    modulus: z.string().optional(),
    description: z.string(),
    applications: z.array(z.string()).optional(),
    standards: z.array(z.string()).optional(),
    relatedCapabilities: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const capabilitiesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    aliases: z.array(z.string()).optional(),
    category: z.string(),
    description: z.string(),
    tolerance: z.string().optional(),
    maxSize: z.string().optional(),
    surfaceFinish: z.string().optional(),
    materials: z.array(z.string()).optional(),
    industries: z.array(z.string()).optional(),
    relatedInspection: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const standardsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    aliases: z.array(z.string()).optional(),
    organization: z.string(),
    category: z.string(),
    description: z.string(),
    scope: z.string().optional(),
    relatedMaterials: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const industriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    aliases: z.array(z.string()).optional(),
    description: z.string(),
    systems: z.array(z.string()).optional(),
    applications: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const productSpecsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    sku: z.string(),
    category: z.string(),
    system: z.string().optional(),
    industry: z.string(),
    titanium_grade: z.string(),
    titanium_type: z.string().optional(),
    uns_number: z.string().optional(),
    werkstoff_number: z.string().optional(),
    density: z.string().optional(),
    tensile_strength: z.string().optional(),
    yield_strength: z.string().optional(),
    elongation: z.string().optional(),
    hardness: z.string().optional(),
    modulus: z.string().optional(),
    thermal_conductivity: z.string().optional(),
    max_service_temp: z.string().optional(),
    function: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    standards: z.array(z.string()).optional(),
    compliance: z.array(z.string()).optional(),
    surface_finish: z.string().optional(),
    manufacturing_process: z.string().optional(),
    weight_reduction: z.string().optional(),
    ndt_methods: z.string().optional(),
    pubDate: z.string().optional(),
    supply_availability: z.string().optional(),
    // ── B2B Procurement & Semantic Fields ──
    moq: z.number().default(1),
    sampleLeadTime: z.string().default('3-5 Business Days'),
    bulkLeadTime: z.string().default('15-25 Business Days (Batch Dependent)'),
    incoterms: z.string().default('EXW / FOB Shenzhen'),
    upstream: z.array(z.string()).default([]),
    downstream: z.array(z.string()).default([]),
    faqs: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
  products: productsCollection,
  blog: blogCollection,
  'blog-translations': blogTranslationsCollection,
  'product-translations': productTranslationsCollection,
  systems: systemsCollection,
  'product-entities': productEntitiesCollection,
  materials: materialsCollection,
  capabilities: capabilitiesCollection,
  standards: standardsCollection,
  industries: industriesCollection,
  'product-specs': productSpecsCollection,
};
