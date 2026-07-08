with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const STANDARD_DATA')
i = c.find('"astm-b348"', d)
closing = c.find('"astm-b265"', d)
section = c[i:closing]

# Find whyChooseUs: and check if whyChooseUsKey is before it
why = section.find('whyChooseUs:')
before = section[max(0,why-30):why]
print(f'Before whyChooseUs: {repr(before)}')

if 'whyChooseUsKey' not in before:
    # Insert whyChooseUsKey before whyChooseUs
    abs_pos = i + why
    before_txt = c[:abs_pos]
    after_txt = c[abs_pos:]
    c = before_txt + '  whyChooseUsKey: "astm",\n    ' + after_txt
    print('Inserted whyChooseUsKey for astm-b348!')
    with open('src/data/titanium-standards.ts','w',encoding='utf-8') as f:
        f.write(c)
else:
    print('Already has whyChooseUsKey')
