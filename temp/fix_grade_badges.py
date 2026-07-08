import re

# Fix badge texts in all Grade component files
fixes = {
    'GradeEntityDefinition.astro': [
        ('Entity Definition', '{t("materials.grade.badges.entityDefinition")}'),
        ('Classification', '{t("materials.grade.badges.classification")}'),
        ('UNS Number', '{t("materials.grade.badges.uns")}'),
        ('Common Names', '{t("materials.grade.badges.commonNames")}'),
        ('Key Characteristics', '{t("materials.grade.badges.keyCharacteristics")}'),
    ],
    'GradeStandards.astro': [
        ('Applicable Standards', '{t("materials.grade.badges.applicableStandards")}'),
    ],
    'GradeProperties.astro': [
        ('Material Properties', '{t("materials.grade.badges.materialProperties")}'),
    ],
    'GradeProcessability.astro': [
        ('Processing Methods', '{t("materials.grade.badges.processingMethods")}'),
    ],
    'GradeDownstreamProducts.astro': [
        ('Typical Products', '{t("materials.grade.badges.typicalProducts")}'),
    ],
    'GradeIndustryApplications.astro': [
        ('Industries', '{t("materials.grade.badges.industries")}'),
    ],
    'GradeAlternativeMaterials.astro': [
        ('Alternative Materials', '{t("materials.grade.badges.alternativeMaterials")}'),
    ],
}

base = 'src/components/materials'
count = 0
for fname, replacements in fixes.items():
    fp = f'{base}/{fname}'
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    for old, new in replacements:
        if old in c:
            c = c.replace(old, new, 1)
            count += 1
            print(f'{fname}: {old} -> OK')
        else:
            print(f'{fname}: {old} -> NOT FOUND')
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)
print(f'\nTotal: {count} replacements')
