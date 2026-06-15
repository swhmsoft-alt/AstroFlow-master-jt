---
interface Service {
  title: string;
  description: string;
  href: string;
  iconPath: string;
}

const services: Service[] = [
  {
    title: "Titanium CNC Machining",
    description: "High-precision 3-axis, 4-axis and 5-axis CNC milling and turning for complex titanium components with tolerances down to 鈥?.005mm. AS9100 & ISO 9001 certified processes.",
    href: "/services#cnc-machining",
    iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  },
  {
    title: "Titanium Additive Manufacturing",
    description: "Advanced metal 3D printing (DMLS/SLM) for rapid prototyping and low-volume production of complex titanium geometries with minimal material waste.",
    href: "/services#3d-printing",
    iconPath: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
  },
  {
    title: "Titanium Fabrication",
    description: "Comprehensive sheet metal fabrication including laser cutting, precision welding (TIG/MIG), and assembly for custom titanium structures and enclosures.",
    href: "/services#laser-cutting",
    iconPath: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
  },
  {
    title: "Forming & Heavy Manufacturing",
    description: "Hot and cold forming, forging, extrusion, and stamping for heavy titanium components. Capabilities include pressure die casting and metal forging for large-scale production.",
    href: "/services#metal-forging",
    iconPath: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
  },
  {
    title: "Titanium Surface Treatment",
    description: "Complete surface finishing solutions including anodizing, passivation, bead blasting, and coatings to enhance corrosion resistance, wear properties, and aesthetics.",
    href: "/services#surface-finishing",
    iconPath: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
  },
  {
    title: "Branded & Custom Packaging",
    description: "Custom-designed packaging solutions for branded titanium products, including protective cases, display packaging, and bulk shipping containers tailored to your specifications.",
    href: "/services#packaging",
    iconPath: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
  }
];
---

<section class="relative py-24 overflow-hidden" style="background-color: var(--theme-bg);">
  <!-- Subtle grid pattern -->
  <div class="absolute inset-0 opacity-[0.03]">
    <div class="absolute inset-0" style="background-image: linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px); background-size: 60px 60px;"></div>
  </div>

  <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center px-4 py-2 mb-4 text-sm font-semibold rounded-full border" style="background-color: color-mix(in srgb, var(--theme-primary) 10%, transparent); border-color: var(--theme-primary); color: var(--theme-primary);">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        End-to-End Titanium Processing
      </div>
      <h2 class="text-4xl md:text-5xl font-bold mb-6" style="color: var(--theme-text);">
        Complete <span class="gradient-text-accent">Manufacturing Services</span>
      </h2>
      <p class="text-xl max-w-3xl mx-auto leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 60%, transparent);">
        From raw titanium stock to finished precision components 闂?one integrated workflow, one trusted partner.
      </p>
    </div>

    <!-- Services Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <a
          href={service.href}
          class="group relative rounded-xl p-8 transition-all duration-300"
          style="background-color: var(--theme-surface); border: 1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent);"
          onmouseover="this.style.borderColor='var(--theme-primary)'; this.style.boxShadow='0 0 30px color-mix(in srgb, var(--theme-primary) 10%, transparent)'"
          onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 12%, transparent)'; this.style.boxShadow='none'"
        >
          <!-- Icon -->
          <div
            class="w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
            style="background: linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 15%, transparent), color-mix(in srgb, var(--theme-primary) 5%, transparent));"
          >
            <svg class="w-7 h-7" fill="none" style="stroke: var(--theme-primary);" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={service.iconPath} />
            </svg>
          </div>

          <!-- Content -->
          <h3 class="text-xl font-semibold mb-3 group-hover:transition-colors" style="color: var(--theme-text);" onmouseover="this.style.color='var(--theme-primary)'" onmouseout="this.style.color='var(--theme-text)'">
            {service.title}
          </h3>
          <p class="text-sm leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 45%, transparent);">
            {service.description}
          </p>

          <!-- Arrow indicator -->
          <div class="mt-6 flex items-center text-sm font-semibold transition-all" style="color: color-mix(in srgb, var(--theme-text) 45%, transparent);">
            <span>Learn more</span>
            <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>

          <!-- Corner accent on hover -->
          <div class="absolute top-0 right-0 w-0 h-0 transition-all duration-300" style="border-style: solid; border-width: 0 0 0 0; border-color: transparent var(--theme-primary) transparent transparent; opacity: 0;" onmouseover="this.style.borderWidth='40px 40px 0 0'; this.style.opacity='1'" onmouseout="this.style.borderWidth='0 0 0 0'; this.style.opacity='0'"></div>
        </a>
      ))}
    </div>

    <!-- Bottom CTA -->
    <div class="text-center mt-12">
      <a
        href="/services"
        class="inline-flex items-center px-6 py-3 text-base font-semibold rounded-lg shadow-lg transition-all border"
        style="border-color: color-mix(in srgb, var(--theme-primary) 12%, transparent); color: color-mix(in srgb, var(--theme-text) 60%, transparent);"
        onmouseover="this.style.borderColor='var(--theme-primary)'; this.style.color='var(--theme-primary)'"
        onmouseout="this.style.borderColor='color-mix(in srgb, var(--theme-primary) 12%, transparent)'; this.style.color='color-mix(in srgb, var(--theme-text) 60%, transparent)'"
      >
        View All Services
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</section>
