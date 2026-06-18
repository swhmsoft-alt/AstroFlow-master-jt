// Site configuration
export const SITE = {
  title: 'BOZE CNC Ti',
  description: 'Leading provider of optimized Titanium CNC Machining and manufacturing solutions with state-of-the-art facilities and industry expertise.',
  url: 'https://cnc.bozemetal.com',
  author: 'BOZE CNC Ti',
} as const;

export interface NavItem {
  name: string;
  href: string;
  children?: { heading: string; items: { name: string; href: string }[] }[];
}

export const NAVIGATION: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Services',
    href: '/services',
    children: [
      {
        heading: 'CNC Machining',
        items: [
          { name: 'Titanium CNC Machining Services', href: '/titanium-cnc-machining-services' },
          { name: '3/5-Axis CNC Machining', href: '/titanium-cnc-machining-services/3-5-axis-cnc-machining' },
          { name: 'CNC Milling & Turning', href: '/titanium-cnc-machining-services/cnc-milling-turning' },
          { name: 'Wire EDM Machining', href: '/titanium-cnc-machining-services/wire-edm-machining' },
          { name: 'Custom Industrial Components', href: '/titanium-cnc-machining-services/custom-industrial-components' },
        ],
      },
      {
        heading: 'Additive',
        items: [
          { name: 'Titanium Additive Manufacturing', href: '/titanium-additive-manufacturing' },
          { name: '3D Printing (SLM / DMLS)', href: '/titanium-additive-manufacturing/3d-printing-slm' },
          { name: 'Rapid Prototyping', href: '/titanium-additive-manufacturing/rapid-prototyping' },
          { name: 'Low-Volume Production', href: '/titanium-additive-manufacturing/low-volume-production' },
        ],
      },
      {
        heading: 'Fabrication',
        items: [
          { name: 'Titanium Fabrication Services', href: '/titanium-fabrication-services' },
          { name: 'Laser Cutting (Sheet & Tube)', href: '/titanium-fabrication-services/laser-cutting' },
          { name: 'Waterjet Cutting', href: '/titanium-fabrication-services/waterjet-cutting' },
          { name: 'Titanium Welding & Assembly', href: '/titanium-fabrication-services/titanium-welding-assembly' },
        ],
      },
      {
        heading: 'Forming & Heavy',
        items: [
          { name: 'Titanium Forming & Heavy Manufacturing', href: '/titanium-forming-heavy-manufacturing' },
          { name: 'Titanium Forging', href: '/titanium-forming-heavy-manufacturing/titanium-forging' },
          { name: 'Titanium Extrusion', href: '/titanium-forming-heavy-manufacturing/titanium-extrusion' },
          { name: 'Raw Material Preparation & Sizing', href: '/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing' },
        ],
      },
      {
        heading: 'Surface Treatment',
        items: [
          { name: 'Titanium Surface Treatment', href: '/titanium-surface-treatment' },
          { name: 'Anodizing', href: '/titanium-surface-treatment/anodizing' },
          { name: 'Chemical Passivation', href: '/titanium-surface-treatment/chemical-passivation' },
          { name: 'Polishing & Sandblasting', href: '/titanium-surface-treatment/polishing-sandblasting' },
        ],
      },
      {
        heading: 'Value-Added',
        items: [
          { name: 'Branded & Custom Packaging', href: '/branded-custom-packaging-services' },
          { name: 'Laser Marking & Custom Logo', href: '/laser-marking-custom-logo' },
        ],
      },
    ],
  },
  {
    name: 'Materials',
    href: '/materials',
    children: [
      {
        heading: 'Titanium Grades',
        items: [
          { name: 'Grade 5 Titanium (Ti-6Al-4V)', href: '/materials#grade-5' },
          { name: 'Grade 23 Titanium (Ti-6Al-4V ELI)', href: '/materials#grade-23' },
          { name: 'Grade 2 Titanium', href: '/materials#grade-2' },
          { name: 'Grade 1 Titanium', href: '/materials#grade-1' },
          { name: 'Grade 4 Titanium', href: '/materials#grade-4' },
          { name: 'Grade 9 Titanium', href: '/materials#grade-9' },
          { name: 'Grade 12 Titanium', href: '/materials#grade-12' },
          { name: 'Titanium Alloy Comparison', href: '/materials#comparison' },
        ],
      },
    ],
  },
  {
    name: 'Capabilities',
    href: '/capabilities',
    children: [
      {
        heading: 'Our Capabilities',
        items: [
          { name: 'Manufacturing Capabilities', href: '/capabilities#manufacturing' },
          { name: 'Engineering Support', href: '/capabilities#engineering' },
          { name: 'Production Capacity', href: '/capabilities#capacity' },
          { name: 'Quality Assurance', href: '/capabilities#quality' },
          { name: 'Inspection & Testing', href: '/capabilities#inspection' },
          { name: 'Material Traceability', href: '/capabilities#traceability' },
          { name: 'Certifications', href: '/capabilities#certifications' },
        ],
      },
    ],
  },
  {
    name: 'Industries',
    href: '/industries',
    children: [
      {
        heading: 'Industries Served',
        items: [
          { name: 'Aerospace', href: '/industries#aerospace' },
          { name: 'Medical', href: '/industries#medical' },
          { name: 'UAV & Drones', href: '/industries#uav-drones' },
          { name: 'AI Infrastructure & Optical Comms', href: '/industries#ai-infrastructure' },
          { name: 'Marine', href: '/industries#marine' },
          { name: 'Semiconductor', href: '/industries#semiconductor' },
          { name: 'Energy', href: '/industries#energy' },
          { name: 'Industrial Equipment', href: '/industries#industrial-equipment' },
        ],
      },
    ],
  },
  {
    name: 'Resources',
    href: '/resources',
    children: [
      {
        heading: 'Resource Hub',
        items: [
          { name: 'Titanium Knowledge Base', href: '/resources#knowledge-base' },
          { name: 'Titanium Grades Guide', href: '/resources#grades-guide' },
          { name: 'Design & Engineering Guides', href: '/resources#design-guides' },
          { name: 'Manufacturing Insights', href: '/resources#insights' },
          { name: 'Industry Applications', href: '/resources#applications' },
          { name: 'Case Studies', href: '/resources#case-studies' },
          { name: 'FAQs', href: '/resources#faqs' },
          { name: 'Downloads', href: '/resources#downloads' },
          { name: 'Blog', href: '/blog' },
        ],
      },
    ],
  },
  { name: 'Products', href: '/products' },
];

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/yourcompany',
  twitter: 'https://twitter.com/yourcompany',
  facebook: 'https://facebook.com/yourcompany',
} as const;
