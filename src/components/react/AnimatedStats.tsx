import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  { value: '120', label: 'Advanced CNC Machining Centers', suffix: '+' },
  { value: 'AS9100D', label: 'Aerospace-Grade Certified', suffix: '' },
  { value: '< 48', label: 'Technical DFM & RFQ Response', suffix: 'h' },
  { value: '5,000+', label: 'Monthly Titanium Output', suffix: ' pcs' },
];

export default function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
            className="text-4xl lg:text-5xl font-bold mb-2"
            style={{ color: 'var(--theme-text)' }}
          >
            {stat.value}{stat.suffix}
          </motion.div>
          <div className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
