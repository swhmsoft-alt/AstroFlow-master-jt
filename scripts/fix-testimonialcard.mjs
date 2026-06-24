import fs from 'fs';

const filePath = 'src/components/ui/TestimonialCard.astro';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix line 6: remove t() from type annotation
content = content.replace(
  "variant?: t('ui.testimonialcard.default') | 'home';",
  "variant?: 'default' | 'home';"
);

// Fix line 9: remove t() from default value
content = content.replace(
  "const { testimonial, variant = t('ui.testimonialcard.default_2') } = Astro.props;",
  "const { testimonial, variant = 'default' } = Astro.props;"
);

// Fix the cardClasses assignment
content = content.replace(
  ": t('ui.testimonialcard.cardtitanium_p8_transitionall_duration300_flex');",
  ": 'card-titanium p-8 transition-all duration-300 flex flex-col h-full';"
);

// Fix the quoteClasses assignment
content = content.replace(
  ": t('ui.testimonialcard.mb6_leadingrelaxed_flex1');",
  ": 'mb-6 leading-relaxed flex-1';"
);

// Fix nameClasses
content = content.replace(
  "const nameClasses = t('ui.testimonialcard.fontsemibold');",
  "const nameClasses = 'font-semibold';"
);

// Fix roleClasses
content = content.replace(
  "const roleClasses = t('ui.testimonialcard.textsm');",
  "const roleClasses = 'text-sm';"
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('TestimonialCard.astro fixed successfully');