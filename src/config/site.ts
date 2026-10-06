// Site configuration
import { isRouteAvailableInLang } from './route-availability.mjs';

export const SITE = {
  title: 'Boze Titanium Manufacturing Center',
  description: 'Boze Titanium Manufacturing Center, operated by Baoji Boze Metal Products Co., Ltd., provides precision titanium manufacturing services including CNC machining, additive manufacturing, fabrication and finishing under AS9100D and ISO 13485 quality systems.',
  url: 'https://cnc.bozemetal.com',
  author: 'Boze Titanium Manufacturing Center',
} as const;

export interface NavItem {
  name: string;
  href: string;
  children?: { heading: string; items: { name: string; href: string }[] }[];
}

/**
 * Filter a nav-item tree by route availability for the given locale.
 * Items (or sub-items) whose href is not available in `lang` are dropped.
 * Empty columns/children are also removed to keep the nav tidy.
 */
function filterNavByLang(items: NavItem[], lang: string): NavItem[] {
  return items
    .map((item) => {
      if (!item.children) {
        return isRouteAvailableInLang(item.href, lang) ? item : null;
      }
      const filteredChildren = item.children
        .map((col) => ({
          ...col,
          items: col.items.filter((c) => isRouteAvailableInLang(c.href, lang)),
        }))
        .filter((col) => col.items.length > 0);
      if (filteredChildren.length === 0) return null;
      // Drop the parent if its own href is unavailable AND it has no surviving children — rare
      if (!isRouteAvailableInLang(item.href, lang)) {
        return { ...item, children: filteredChildren };
      }
      return { ...item, children: filteredChildren };
    })
    .filter((x): x is NavItem => x !== null);
}

export const NAVIGATION: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Services',
    href: '/services/',
    children: [
      {
        heading: 'CNC Machining',
        items: [
          { name: 'Titanium CNC Machining Services', href: '/titanium-cnc-machining-services/' },
          { name: '3/5-Axis CNC Machining', href: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/' },
          { name: 'CNC Milling & Turning', href: '/titanium-cnc-machining-services/cnc-milling-turning/' },
          { name: 'Wire EDM Machining', href: '/titanium-cnc-machining-services/wire-edm-machining/' },
          { name: 'Custom Industrial Components', href: '/titanium-cnc-machining-services/custom-industrial-components/' },
        ],
      },
      {
        heading: 'Additive',
        items: [
          { name: 'Titanium Additive Manufacturing', href: '/titanium-additive-manufacturing/' },
          { name: '3D Printing (SLM / DMLS)', href: '/titanium-additive-manufacturing/3d-printing-slm/' },
          { name: 'Rapid Prototyping', href: '/titanium-additive-manufacturing/rapid-prototyping/' },
          { name: 'Low-Volume Production', href: '/titanium-additive-manufacturing/low-volume-production/' },
        ],
      },
      {
        heading: 'Fabrication',
        items: [
          { name: 'Titanium Fabrication Services', href: '/titanium-fabrication-services/' },
          { name: 'Laser Cutting (Sheet & Tube)', href: '/titanium-fabrication-services/laser-cutting/' },
          { name: 'Waterjet Cutting', href: '/titanium-fabrication-services/waterjet-cutting/' },
          { name: 'Titanium Welding & Assembly', href: '/titanium-fabrication-services/titanium-welding-assembly/' },
        ],
      },
      {
        heading: 'Forming & Heavy',
        items: [
          { name: 'Titanium Forming & Heavy Manufacturing', href: '/titanium-forming-heavy-manufacturing/' },
          { name: 'Titanium Forging', href: '/titanium-forming-heavy-manufacturing/titanium-forging/' },
          { name: 'Titanium Extrusion', href: '/titanium-forming-heavy-manufacturing/titanium-extrusion/' },
          { name: 'Raw Material Preparation & Sizing', href: '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/' },
        ],
      },
      {
        heading: 'Surface Treatment',
        items: [
          { name: 'Titanium Surface Treatment', href: '/titanium-surface-treatment/' },
          { name: 'Anodizing', href: '/titanium-surface-treatment/anodizing/' },
          { name: 'Chemical Passivation', href: '/titanium-surface-treatment/chemical-passivation/' },
          { name: 'Polishing & Sandblasting', href: '/titanium-surface-treatment/polishing-sandblasting/' },
        ],
      },
      {
        heading: 'Value-Added',
        items: [
          { name: 'Branded & Custom Packaging', href: '/branded-custom-packaging-services/' },
          { name: 'Laser Marking & Custom Logo', href: '/laser-marking-custom-logo/' },
        ],
      },
    ],
  },
  {
    name: 'Materials',
    href: '/materials/',
    children: [
      {
        heading: 'Titanium Grades',
        items: [
          { name: 'Grade 5 Titanium (Ti-6Al-4V)', href: '/materials/grade-5/' },
          { name: 'Grade 23 Titanium (Ti-6Al-4V ELI)', href: '/materials/grade-23/' },
          { name: 'Grade 2 Titanium', href: '/materials/grade-2/' },
          { name: 'Grade 1 Titanium', href: '/materials/grade-1/' },
          { name: 'Grade 3 Titanium', href: '/materials/grade-3/' },
          { name: 'Grade 4 Titanium', href: '/materials/grade-4/' },
          { name: 'ELI Grade 4 Titanium', href: '/materials/grade-4-eli/' },
          { name: 'Grade 6 Titanium (Ti-5Al-2.5Sn)', href: '/materials/grade-6/' },
          { name: 'Grade 9 Titanium (Ti-3Al-2.5V)', href: '/materials/grade-9/' },
          { name: 'Grade 19 Beta Titanium', href: '/materials/grade-19/' },
          { name: 'Grade 21 Beta Alloy', href: '/materials/grade-21/' },
          { name: 'Grade 6242 Aerospace Ti', href: '/materials/grade-6242/' },
          { name: 'Ti-5-5-5-3 High Strength', href: '/materials/ti-5553/' },
          { name: 'Ti-6211 Marine Grade (Ti-6Al-2Nb-1Ta-0.8Mo)', href: '/materials/ti-6211/' },
          { name: 'Titanium Alloy Comparison', href: '/materials/#comparison' },
        ],
      },
      {
        heading: 'Titanium Standards',
        items: [
          { name: 'ASTM B348', href: '/materials/astm-b348/' },
          { name: 'ASTM B265', href: '/materials/astm-b265/' },
          { name: 'ASTM B381', href: '/materials/astm-b381/' },
          { name: 'ASTM B338', href: '/materials/astm-b338/' },
          { name: 'ASTM B861', href: '/materials/astm-b861/' },
          { name: 'ASTM F67', href: '/materials/astm-f67/' },
          { name: 'ASTM F136', href: '/materials/astm-f136/' },
          { name: 'ASTM F86', href: '/materials/astm-f86/' },
          { name: 'ISO 5832-3', href: '/materials/iso-5832-3/' },
          { name: 'ISO 5832-11', href: '/materials/iso-5832-11/' },
        ],
      },
      {
        heading: 'AMS, MIL & Additive',
        items: [
          { name: 'AMS 4911', href: '/materials/ams-4911/' },
          { name: 'AMS 4928', href: '/materials/ams-4928/' },
          { name: 'AMS 4943', href: '/materials/ams-4943/' },
          { name: 'AMS 4944', href: '/materials/ams-4944/' },
          { name: 'AMS 2488', href: '/materials/ams-2488/' },
          { name: 'MIL-T-9047', href: '/materials/mil-t-9047/' },
          { name: 'ASTM F2924', href: '/materials/astm-f2924/' },
          { name: 'ASTM F3001', href: '/materials/astm-f3001/' },
        ],
      },
    ],
  },
  {
    name: 'Capabilities',
    href: '/capabilities/',
    children: [
      {
        heading: 'Our Capabilities',
        items: [
          { name: 'Manufacturing Capabilities', href: '/capabilities/manufacturing/' },
          { name: 'Engineering Support', href: '/capabilities/engineering/' },
          { name: 'Production Capacity', href: '/capabilities/capacity/' },
          { name: 'Quality Assurance', href: '/capabilities/quality/' },
          { name: 'Inspection & Testing', href: '/capabilities/inspection/' },
          { name: 'Material Traceability', href: '/capabilities/traceability/' },
          { name: 'Certifications', href: '/capabilities/certifications/' },
          { name: 'Equipment Inventory', href: '/equipment/' },
          { name: 'Compliance & Certifications', href: '/capabilities/compliance/' },
          { name: 'Supplier Evaluation', href: '/capabilities/supplier-evaluation/' },
        ],
      },
      {
        heading: 'Delivery & Logistics',
        items: [
          { name: 'Lead Time Guide', href: '/capabilities/lead-time/' },
          { name: 'Logistics & Shipping', href: '/capabilities/logistics/' },
          { name: 'ECO Iteration & DFM', href: '/capabilities/eco-iteration/' },
        ],
      },
    ],
  },
  {
    name: 'Industries',
    // 2026-09-17 dead-link audit — trailing slash to match canonical page URL.
    href: '/industries/',
    children: [
      {
        heading: 'Industries Served',
        items: [
          { name: 'Aerospace', href: '/industries/aerospace/' },
          { name: 'Medical', href: '/industries/medical/' },
          { name: 'UAV & Drones', href: '/industries/uav-drones/' },
          { name: 'AI Infrastructure & Optical Comms', href: '/industries/ai-infrastructure/' },
          { name: 'Marine', href: '/industries/marine/' },
          { name: 'Semiconductor', href: '/industries/semiconductor/' },
          { name: 'Energy', href: '/industries/energy/' },
          { name: 'Chemical', href: '/industries/chemical/' },
          { name: 'Industrial Equipment', href: '/industries/industrial-equipment/' },
        ],
      },
    ],
  },
  {
    name: 'Resources',
    href: '/resources/',
    children: [
      {
        heading: 'Resource Hub',
        items: [
          { name: 'Titanium Knowledge Base', href: '/resources/titanium-knowledge-base/' },
          { name: 'Titanium Grades Guide', href: '/resources/titanium-grades-guide/' },
          { name: 'Design & Engineering Guides', href: '/resources/design-engineering-guide/' },
          { name: 'Manufacturing Insights', href: '/resources/manufacturing-insights/' },
          { name: 'Industry Applications', href: '/resources/industry-applications/' },
          { name: 'Case Studies', href: '/case-studies/' },
          { name: 'FAQs', href: '/resources/faq/' },
          { name: 'Engineering Tools', href: '/tools/' },
          { name: 'Downloads', href: '/resources/downloads/' },
          // 2026-10-06 — trailing slash audit (Phase A). All hrefs normalized
          // to match Astro's trailingSlash: 'always' canonical URLs.
          // 2026-10-06 — /products/ moved out of Resources into the new
          // Solutions dropdown promoted at top level (see getNavigation).
          { name: 'Blog', href: '/blog/' },
        ],
      },
    ],
  },
];

/**
 * Return the navigation structure for the given locale.
 *
 * Only English (the default locale) promotes "Solutions" — a top-level dropdown
 * that aggregates the four B2B procurement hubs (Custom Parts, the /products
 * Solutions hub, Standard Parts, Mill Products).  The dropdown is inserted
 * immediately after Home, giving the English order:
 *
 *     Home → Solutions (dropdown) → Services → Materials → ...
 *
 * All other locales keep the shared NAVIGATION structure unchanged because the
 * localized product-hub pages are not built yet.
 *
 * Note: 'en' is the project DEFAULT_LANG (see src/i18n/ui.ts). We intentionally
 * compare against the literal instead of importing i18n/ui here, so the React
 * MobileMenu island does not pull the full translation dictionaries into the
 * client bundle.
 */
export function getNavigation(lang: string): NavItem[] {
  // Non-English locales: filter out nav items pointing to English-only paths.
  // This is the "0-link entry" rule: a URL not translated to the current
  // locale must not appear in the nav, hreflang alternate, or any internal
  // link — otherwise the crawler discovers it and 404s. (See
  // src/config/route-availability.mjs for the denylist.)
  if (lang !== 'en') return filterNavByLang(NAVIGATION, lang);

  // Solutions — the abbreviated English nav label. The dropdown aggregates the
  // four product hubs (Custom Parts, the /products/ Solutions hub, Standard
  // Parts, Mill Products). All hrefs end with `/` per the trailing-slash
  // mandate (.clinerules/工作区 Rules.txt §7).
  const solutionsItem: NavItem = {
    name: 'Solutions',
    href: '/products/',
    children: [
      {
        heading: 'Solutions',
        items: [
          { name: 'Custom Titanium Parts', href: '/parts/' },
          { name: 'Titanium Solutions', href: '/products/' },
          { name: 'Titanium Standard Parts', href: '/standard-parts/' },
          { name: 'Titanium Mill Products', href: '/mill-products/' },
        ],
      },
    ],
  };
  const englishNav: NavItem[] = [];
  let solutionsInserted = false;

  for (const item of NAVIGATION) {
    englishNav.push(item);
    // Insert the Solutions dropdown immediately after Home, giving the English
    // order: Home → Solutions → Services → Materials → Capabilities → ...
    if (item.href === '/' && !solutionsInserted) {
      englishNav.push(solutionsItem);
      solutionsInserted = true;
    }
  }

  // Safety net: keep Solutions even if Home were ever removed from NAVIGATION.
  if (!solutionsInserted) {
    englishNav.push(solutionsItem);
  }
  return englishNav;
}

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/baoji-boze-metal-products-co-ltd-25a0923aa',
  facebook: 'https://www.facebook.com/titaniummachinedparts/',
  instagram: 'https://www.instagram.com/boze.metal.products.company/',
  youtube: 'https://www.youtube.com/@boze-666',
} as const;
