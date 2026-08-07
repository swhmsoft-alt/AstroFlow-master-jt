// Replaced: form-based B2B inquiry → CTA redirect to bozemetal.com/contact
// 2026-07-29: Removed full inquiry form per request, replaced with styled CTA link

export default function InquiryForm({ productTitle, productSku }: { productTitle: string; productSku: string }) {
  return (
    <section className="py-10 lg:py-12 text-center" style={{ background: 'var(--theme-bg)' }} id="inquiry-section">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="p-8 rounded-xl border"
          style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}
        >
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--theme-text)' }}>Custom Titanium Part</h3>
          <p className="text-sm mb-6" style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}>
            Ready to manufacture {productTitle} (SKU: {productSku})? Contact our engineering team for a custom solution.
          </p>
          <a
            href="https://www.bozemetal.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-sm font-bold rounded-xl transition-all"
            style={{ background: 'var(--theme-primary)', color: 'var(--theme-text)' }}
          >
            Custom Titanium Part
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
