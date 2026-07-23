import * as Tabs from '@radix-ui/react-tabs';
import { 
  ShoppingCart, 
  Heart, 
  Car, 
  Laptop, 
  Package, 
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface UseCase {
  industry: string;
  iconName: string;
  image?: string | { src: string; [key: string]: any };
  challenge: string;
  solution: string;
  results: string[];
}

interface Props {
  useCases: UseCase[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingCart,
  Heart,
  Car,
  Laptop,
  Package,
  UtensilsCrossed,
};

export default function UseCaseTabs({ useCases }: Props) {
  // Get unique industries
  const industries = Array.from(new Set(useCases.map((uc) => uc.industry)));

  return (
    <Tabs.Root defaultValue={industries[0]} className="w-full">
      <Tabs.List className="flex flex-wrap gap-2 mb-8 pb-2"
        style={{ borderBottom: '2px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
      >
        {industries.map((industry) => {
          const useCase = useCases.find((uc) => uc.industry === industry);
          const IconComponent = useCase ? iconMap[useCase.iconName] : null;
          
          return (
            <Tabs.Trigger
              key={industry}
              value={industry}
              className="group px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all duration-200"
              style={{
                color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)',
                borderBottom: '2px solid transparent',
              }}
              onMouseOver={(e) => {
                if (!e.currentTarget.getAttribute('data-state')?.includes('active')) {
                  e.currentTarget.style.color = 'var(--theme-primary)';
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--theme-primary) 50%, transparent)';
                }
              }}
              onMouseOut={(e) => {
                if (!e.currentTarget.getAttribute('data-state')?.includes('active')) {
                  e.currentTarget.style.color = 'color-mix(in srgb, var(--theme-text) 65%, transparent)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              {IconComponent && (
                <IconComponent className="w-4 h-4" />
              )}
              {industry}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      <style>{`
        .use-case-tab-trigger[data-state="active"] {
          color: var(--theme-primary) !important;
          border-bottom-color: var(--theme-primary) !important;
        }
      `}</style>

      {industries.map((industry) => {
        const useCase = useCases.find((uc) => uc.industry === industry);
        if (!useCase) return null;

        const IconComponent = iconMap[useCase.iconName];

        return (
          <Tabs.Content 
            key={industry} 
            value={industry} 
            className="space-y-6 animate-fadeIn"
          >
            <div className="rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Image Section */}
                <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden">
                  {useCase.image && (
                  <img
                    src={typeof useCase.image === 'string' ? useCase.image : useCase.image.src}
                    alt={useCase.industry}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onerror="this.style.display='none'"
                  />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--theme-bg) 80%, transparent), color-mix(in srgb, var(--theme-bg) 40%, transparent))' }}></div>
                  <div className="absolute top-6 left-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--theme-surface) 95%, transparent)', backdropFilter: 'blur(4px)' }}
                    >
                      {IconComponent && (
                        <IconComponent className="w-8 h-8" style={{ color: 'var(--theme-primary)' }} />
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6" style={{ color: 'var(--theme-text)' }}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      {useCase.industry}
                    </h2>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-7 p-8 lg:p-10">
                  <div className="space-y-6">
                    {/* Challenge */}
                    <div className="rounded-r-lg p-5" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', borderLeft: '4px solid var(--theme-primary)' }}>
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                        <div>
                          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
                            Challenge
                          </h3>
                          <p style={{ color: 'var(--theme-text)' }}>
                            {useCase.challenge}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Solution */}
                    <div className="rounded-r-lg p-5" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', borderLeft: '4px solid var(--theme-primary)' }}>
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                        <div>
                          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
                            Solution
                          </h3>
                          <p style={{ color: 'var(--theme-text)' }}>
                            {useCase.solution}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
                        <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                        Results
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {useCase.results.map((result, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 rounded-lg p-4"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)' }}
                          >
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                            <span className="text-sm leading-relaxed" style={{ color: 'var(--theme-text)' }}>
                              {result}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
