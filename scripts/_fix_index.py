with open('src/pages/[lang]/index.astro','r',encoding='utf-8') as f:
    content = f.read()

# 1. Update the import line to include useTOrNull
old_import = "from '../../i18n/utils';"
new_import = "from '../../i18n/utils';"

# Add useTOrNull to the import if not already there
if 'useTOrNull' not in content:
    old_import_line = "import { getLangFromUrl, useTranslations } from '../../i18n/utils';"
    new_import_line = "import { getLangFromUrl, useTranslations, useTOrNull } from '../../i18n/utils';"
    content = content.replace(old_import_line, new_import_line)

# 2. Replace the whole lang/currentLang/tH1 block
old_block = """const { lang } = Astro.params;
const currentLang = getLangFromUrl(Astro.url);
const t = useTranslations(currentLang);

// tH1 helper: returns translated value if found, null otherwise (t() returns key as fallback)
const tH1 = (key: string) => {
  const val = t(key);
  return val && val !== key ? val : null;
};"""

new_block = """const currentLang = getLangFromUrl(Astro.url);
const t = useTranslations(currentLang);
const tOrNull = useTOrNull(currentLang);"""

content = content.replace(old_block, new_block)

# 3. Fix the homeH1 - remove dead 'en' branch, fix fallback chain
old_h1 = """const homeH1 = currentLang === 'en'
  ? (heroEntry?.h1 || pageData.title || 'Durchgängige Titan-Fertigungskette')
  : (tH1('hero.home.h1') || heroEntry?.h1 || pageData.title || 'Durchgängige Titan-Fertigungskette');"""

new_h1 = """const homeH1 = tOrNull('hero.home.h1')
  || heroEntry?.h1
  || pageData.title
  || 'Durchgängige Titan-Fertigungskette';"""

content = content.replace(old_h1, new_h1)

# 4. Fix homeBadge - remove dead 'en' branch
old_badge = """const homeBadge = currentLang === 'en'
  ? (heroEntry?.badge || pageData.badge || '')
  : (tH1('hero.home.badge') || heroEntry?.badge || pageData.badge || '');"""

new_badge = """const homeBadge = tOrNull('hero.home.badge')
  || heroEntry?.badge
  || pageData.badge
  || '';"""

content = content.replace(old_badge, new_badge)

# 5. Fix homeDescription - remove dead 'en' branch
old_desc = """const homeDescription = currentLang === 'en'
  ? (heroEntry?.subtitle || pageData.description || '')
  : (tH1('hero.home.subtitle') || heroEntry?.subtitle || pageData.description || '');"""

new_desc = """const homeDescription = tOrNull('hero.home.subtitle')
  || heroEntry?.subtitle
  || pageData.description
  || '';"""

content = content.replace(old_desc, new_desc)

with open('src/pages/[lang]/index.astro','w',encoding='utf-8') as f:
    f.write(content)

print('SUCCESS: index.astro cleaned up')
print()
# Verify
for term in ['const { lang }', 'tH1 =', "currentLang === 'en'"]:
    if term in content:
        print(f'WARNING: "{term}" still present')
    else:
        print(f'OK: "{term}" removed')
