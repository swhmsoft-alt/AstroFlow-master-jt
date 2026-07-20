import { useState, type FormEvent } from 'react';

interface Props {
  productTitle: string;
  productSku: string;
}

export default function InquiryForm({ productTitle, productSku }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (res.ok) {
        setSubmitted(true);
        setError('');
      } else {
        setError('Submission failed. Please email us directly.');
      }
    } catch {
      setError('Network error. Please try again or email us.');
    }
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-xl border text-center" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'color-mix(in srgb, #10b981 15%, transparent)' }}>
          <svg className="w-6 h-6" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Inquiry Received</h3>
        <p className="text-sm mt-2" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>
          Our engineering team will respond within 24 hours with a tailored quotation for {productTitle}.
        </p>
      </div>
    );
  }

  return (
    <section className="py-10 lg:py-12" style={{ background: 'var(--theme-bg)' }} id="inquiry-section">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--theme-text)' }}>Request Enterprise Pricing</h3>
        <p className="text-sm mb-6" style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}>
          Fill out the form below and our team will respond within 24 hours with a tailored quotation for <strong style={{ color: 'var(--theme-text)' }}>{productTitle}</strong> (SKU: {productSku}).
        </p>

        <form
          name="b2b-inquiry"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="space-y-4"
          style={{ color: 'var(--theme-text)' }}
        >
          <input type="hidden" name="form-name" value="b2b-inquiry" />
          <input type="hidden" name="product" value={productTitle} />
          <input type="hidden" name="sku" value={productSku} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                Full Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" name="name" required className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', color: 'var(--theme-text)' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                Company Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" name="company" required className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', color: 'var(--theme-text)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="email" name="email" required className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', color: 'var(--theme-text)' }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                Phone
              </label>
              <input type="tel" name="phone" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', color: 'var(--theme-text)' }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
              Estimated Annual Volume <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select name="volume" required className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', color: 'var(--theme-text)' }}>
              <option value="">Select range...</option>
              <option value="1-100">1–100 units (Prototype)</option>
              <option value="101-1000">101–1,000 units (Low Volume)</option>
              <option value="1001-10000">1,001–10,000 units (Mid Volume)</option>
              <option value="10001+">10,001+ units (High Volume)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
              Application / Industry
            </label>
            <input type="text" name="application" placeholder="e.g., Consumer Electronics / Medical / Aerospace" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', color: 'var(--theme-text)' }} />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
              Additional Requirements
            </label>
            <textarea name="message" rows={4} placeholder="Surface finish, certification needs, delivery timeline, etc." className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ background: 'var(--theme-surface)', borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', color: 'var(--theme-text)' }} />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 text-sm font-bold rounded-xl transition-all"
            style={{ background: 'var(--theme-primary)', color: 'var(--theme-text)' }}
          >
            Submit Inquiry for {productTitle}
          </button>

          <p className="text-xs text-center" style={{ color: 'color-mix(in srgb, var(--theme-text) 35%, transparent)' }}>
            By submitting you agree to our Privacy Policy. Your data is never shared with third parties.
          </p>
        </form>
      </div>
    </section>
  );
}
