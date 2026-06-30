import json

# Load current en.json
with open('src/i18n/translations/en.json', encoding='utf-8') as f:
    en = json.load(f)

# Keys that were deleted in the latest commit but Header.astro still needs them
# (extracted from the git diff output)
missing_keys = {
    "nav.services.3_5AxisCncMachining": "3/5-Axis CNC Machining",
    "nav.services.3dPrintingSlm": "3D Printing (SLM / DMLS)",
    "nav.services.additive": "Additive",
    "nav.services.anodizing": "Anodizing",
    "nav.services.brandedCustomPackaging": "Branded & Custom Packaging",
    "nav.services.chemicalPassivation": "Chemical Passivation",
    "nav.services.cncMillingTurning": "CNC Milling & Turning",
    "nav.services.customIndustrialComponents": "Custom Industrial Components",
    "nav.services.fabrication": "Fabrication",
    "nav.services.formingHeavy": "Forming & Heavy",
    "nav.services.laserCutting": "Laser Cutting (Sheet & Tube)",
    "nav.services.laserMarkingCustomLogo": "Laser Marking & Custom Logo",
    "nav.services.lowVolumeProduction": "Low-Volume Production",
    "nav.services.polishingSandblasting": "Polishing & Sandblasting",
    "nav.services.rapidPrototyping": "Rapid Prototyping",
    "nav.services.rawMaterialPreparation": "Raw Material Preparation & Sizing",
    "nav.services.surfaceTreatment": "Surface Treatment",
    "nav.services.titaniumAdditiveManufacturing": "Titanium Additive Manufacturing",
    "nav.services.titaniumCncMachiningServices": "Titanium CNC Machining Services",
    "nav.services.titaniumFabricationServices": "Titanium Fabrication Services",
    "nav.services.titaniumForging": "Titanium Forging",
    "nav.services.titaniumFormingHeavyManufacturing": "Titanium Forming & Heavy Manufacturing",
    "nav.services.waterjetCutting": "Waterjet Cutting",
    "nav.services.wireEdmMachining": "Wire EDM Machining",
}

added = 0
for key, val in missing_keys.items():
    if key not in en:
        en[key] = val
        added += 1
        print(f"  ADDED: {key} = {val}")
    else:
        print(f"  EXISTS: {key} = {en[key]}")

print(f"\nTotal added: {added} keys")
print(f"Total nav.services.* keys in en.json: {len([k for k in en if k.startswith('nav.services.')])}")

# Write back
with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

print("en.json updated successfully!")