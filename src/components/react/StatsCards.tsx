import { CheckCircle2, TrendingDown, Users, Package } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  iconName: string;
}

interface Props {
  stats: Stat[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle2,
  TrendingDown,
  Users,
  Package,
};

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.iconName];
        
        return (
          <div
            key={index}
            className="rounded-xl shadow-lg p-6 text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
            style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)', animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))' }}
            >
              {IconComponent && (
                <IconComponent className="w-8 h-8" style={{ color: 'var(--theme-text)' }} />
              )}
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2"
              style={{ background: 'linear-gradient(to right, var(--theme-primary), var(--theme-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {stat.value}
            </div>
            <div className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}>{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
