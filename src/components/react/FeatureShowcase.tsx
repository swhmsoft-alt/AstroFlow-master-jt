import { motion } from 'motion/react';
import { Warehouse, Truck, Package, BarChart3, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Warehouse,
    title: 'Aerospace & Aviation',
    description: 'AS9100D certified titanium CNC machining for aerospace structural components, engine parts, and landing gear assemblies.',
  },
  {
    icon: Truck,
    title: 'AI Infrastructure & Optical Comms',
    description: 'Precision-machined titanium components for AI data center hardware, optical transceiver housings, and 5G infrastructure.',
  },
  {
    icon: Package,
    title: 'Medical Devices & Implants',
    description: 'Grade 23 titanium CNC turning and milling for surgical instruments, orthopedic implants, and diagnostic equipment housings.',
  },
  {
    icon: BarChart3,
    title: 'Automotive & Racing Performance',
    description: 'High-performance titanium parts for motorsport, exhaust systems, suspension components, and EV drivetrain assemblies.',
  },
  {
    icon: Shield,
    title: 'Petrochemical & Oil & Gas',
    description: 'Corrosion-resistant titanium fittings, flanges, and valve components for offshore drilling and chemical processing plants.',
  },
  {
    icon: Headphones,
    title: 'Additive Manufacturing (3D Printing)',
    description: 'Hybrid manufacturing combining CNC precision machining with metal 3D printing for complex geometries and rapid prototyping.',
  },
];

export default function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group cursor-pointer"
        >
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300" style={{ border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            {/* Icon overlay */}
            <div className="relative h-64 flex items-center justify-center overflow-hidden" style={{ background: 'color-mix(in srgb, var(--theme-primary) 5%, var(--theme-bg))' }}>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 80%, black))' }}
              >
                <feature.icon className="w-8 h-8" style={{ color: 'var(--theme-text)' }} />
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6" style={{ color: 'var(--theme-text)' }}>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)' }}>{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
