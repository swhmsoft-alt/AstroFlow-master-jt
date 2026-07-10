"""Fix slug routing in catch-all route for English URLs without lang prefix"""
import os

fp = r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\pages\[lang]\[...slug].astro'

with open(fp, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add effectiveSlug after isInvalidLang declaration
old = 'const isInvalidLang = !isSupportedLang(lang);'
new = old + '\n\n// Normalize slug for English URLs without language prefix\n// Prevents first path segment from being eaten as lang\nconst effectiveSlug = (isInvalidLang && lang && slug) ? `${lang}/${slug}` : (slug || \'\');'
content = content.replace(old, new)

# 2. Replace slug === with effectiveSlug === for rendering blocks
content = content.replace("slug === '", "effectiveSlug === '")

# 3. Fix the remaining original heroEntry line (change to use effectiveSlug for consistency)
# Actually keep the configSlug approach but use effectiveSlug
content = content.replace(
    'const configSlug = (isInvalidLang && lang && slug) ? `${lang}/${slug}` : (slug || \'\');\nconst heroEntry = HERO_CONFIG[`/${configSlug}` as keyof typeof HERO_CONFIG] || undefined;',
    'const heroEntry = HERO_CONFIG[`/${effectiveSlug}` as keyof typeof HERO_CONFIG] || undefined;'
)

# 4. Fix subMeta resolution
content = content.replace(
    'const subKey = getSubPageKey(slug);\n  if (subKey && subPageMeta[subKey]) subMeta = subPageMeta[subKey];',
    'const subKey = getSubPageKey(effectiveSlug);\n  if (subKey && subPageMeta[subKey]) subMeta = subPageMeta[subKey];'
)

# 5. Fix heroKey
content = content.replace('const heroKey = slug ?', 'const heroKey = effectiveSlug ?')

# 6. Fix pageMetaKeys lookup
content = content.replace(
    'const metaKeys = slug ? pageMetaKeys[slug]',
    'const metaKeys = effectiveSlug ? pageMetaKeys[effectiveSlug]'
)

# 7. Fix isServiceSubPage checks
for old_svc, new_svc in [
    ("slug?.includes('titanium-additive", "effectiveSlug?.includes('titanium-additive"),
    ("slug?.includes('titanium-cnc-machining", "effectiveSlug?.includes('titanium-cnc-machining"),
    ("slug?.includes('titanium-fabrication", "effectiveSlug?.includes('titanium-fabrication"),
    ("slug?.includes('titanium-forming", "effectiveSlug?.includes('titanium-forming"),
    ("slug?.includes('titanium-surface", "effectiveSlug?.includes('titanium-surface"),
    ("slug === 'branded-custom-packaging-services'", "effectiveSlug === 'branded-custom-packaging-services'"),
    ("slug === 'laser-marking-custom-logo'", "effectiveSlug === 'laser-marking-custom-logo'"),
]:
    content = content.replace(old_svc, new_svc)

# 8. Fix slug?.startsWith in equipment child pages and materials
content = content.replace("slug?.startsWith('equipment/')", "effectiveSlug?.startsWith('equipment/')")
content = content.replace("slug?.startsWith('materials/grade-')", "effectiveSlug?.startsWith('materials/grade-')")
content = content.replace("slug?.startsWith('materials/ti-')", "effectiveSlug?.startsWith('materials/ti-')")
content = content.replace("slug?.startsWith('materials/astm-')", "effectiveSlug?.startsWith('materials/astm-')")
content = content.replace("slug?.startsWith('materials/ams-')", "effectiveSlug?.startsWith('materials/ams-')")
content = content.replace("slug?.startsWith('materials/iso-')", "effectiveSlug?.startsWith('materials/iso-')")
content = content.replace("slug?.startsWith('materials/mil-')", "effectiveSlug?.startsWith('materials/mil-')")

# 9. Fix heroEntry cleanup - remove configSlug if it was already removed in step 3
# Just ensure there's no leftover reference

with open(fp, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done! effectiveSlug has been applied throughout the file')
