import { Package, Truck, Users, Globe } from 'lucide-react';

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}

const stats: Stat[] = [
  { icon: Package, title: 'Total Square Footage', value: '2.25M+' },
  { icon: Truck, title: 'Delivery Vehicles', value: '200+' },
  { icon: Users, title: 'Trained Staff', value: '1,000+' },
  { icon: Globe, title: 'Geographic Reach', value: 'Global' }
];

export default function FacilityStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="rounded-xl shadow-lg p-6 text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
            style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)', animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))' }}
            >
              <IconComponent className="w-8 h-8" style={{ color: 'var(--theme-text)' }} />
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-2"
              style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {stat.value}
            </div>
            <div className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}>{stat.title}</div>
          </div>
        );
      })}
    </div>
  );
}
