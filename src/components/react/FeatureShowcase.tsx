import { motion } from 'motion/react';
import { Warehouse, Truck, Package, BarChart3, Shield, Headphones } from 'lucide-react';

import warehouseImg from '@assets/photo-1553413077-190dd305871c.jpg';
import truckImg from '@assets/photo-1601584115197-04ecc0da31d7.jpg';
import packageImg from '@assets/photo-1581091226825-a6a2a5aee158.jpg';
import barChart3Img from '@assets/photo-1551288049-bebda4e38f71.jpg';
import shieldImg from '@assets/photo-1563013544-824ae1b704d3.jpg';
import headphonesImg from '@assets/photo-1486312338219-ce68d2c6f44d.jpg';

const features = [
  {
    icon: Warehouse,
    title: 'Aerospace & Aviation',
    description: 'AS9100D certified titanium CNC machining for aerospace structural components, engine parts, and landing gear assemblies.',
    image: warehouseImg,
  },
  {
    icon: Truck,
    title: 'AI Infrastructure & Optical Comms',
    description: 'Precision-machined titanium components for AI data center hardware, optical transceiver housings, and 5G infrastructure.',
    image: truckImg,
  },
  {
    icon: Package,
    title: 'Medical Devices & Implants',
    description: 'Grade 23 titanium CNC turning and milling for surgical instruments, orthopedic implants, and diagnostic equipment housings.',
    image: packageImg,
  },
  {
    icon: BarChart3,
    title: 'Automotive & Racing Performance',
    description: 'High-performance titanium parts for motorsport, exhaust systems, suspension components, and EV drivetrain assemblies.',
    image: barChart3Img,
  },
  {
    icon: Shield,
    title: 'Petrochemical & Oil & Gas',
    description: 'Corrosion-resistant titanium fittings, flanges, and valve components for offshore drilling and chemical processing plants.',
    image: shieldImg,
  },
  {
    icon: Headphones,
    title: 'Additive Manufacturing (3D Printing)',
    description: 'Hybrid manufacturing combining CNC precision machining with metal 3D printing for complex geometries and rapid prototyping.',
    image: headphonesImg,
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
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <motion.img
                src={feature.image.src}
                alt={feature.title}
                className="w-full h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--theme-bg) 95%, transparent) 0%, color-mix(in srgb, var(--theme-bg) 50%, transparent) 100%)', opacity: 0.8 }} />
              
              {/* Icon overlay */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                className="absolute top-4 right-4 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 80%, black))' }}
              >
                <feature.icon className="w-6 h-6" style={{ color: 'var(--theme-text)' }} />
              </motion.div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6" style={{ color: 'var(--theme-text)' }}>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 65%, transparent)', opacity: 0.9 }}>{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
