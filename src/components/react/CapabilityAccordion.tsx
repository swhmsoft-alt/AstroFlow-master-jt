import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

interface Capability {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface Props {
  capabilities: Capability[];
}

export default function CapabilityAccordion({ capabilities }: Props) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-4">
      {capabilities.map((capability, index) => (
        <Accordion.Item
          key={index}
          value={`item-${index}`}
          className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          style={{ border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)', backgroundColor: 'var(--theme-surface)' }}
        >
          <Accordion.Header>
            <Accordion.Trigger className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors group"
              style={{ backgroundColor: 'var(--theme-surface)' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-primary) 8%, var(--theme-surface))'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface)'}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))' }}
                >
                  <div
                    className="w-6 h-6"
                    style={{ color: 'var(--theme-text)' }}
                    dangerouslySetInnerHTML={{ __html: capability.icon.replace('w-12 h-12', 'w-6 h-6').replace('currentColor', 'var(--theme-text)') }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
                    {capability.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}>
                    {capability.description}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-6 py-5"
            style={{ borderTop: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)', backgroundColor: 'color-mix(in srgb, var(--theme-surface) 80%, var(--theme-bg))' }}
          >
            <ul className="space-y-3">
              {capability.features.map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span style={{ color: 'var(--theme-text)' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
