with open('src/data/titanium-standards.ts','r',encoding='utf-8') as f:
    c = f.read()
data_start = c.find('export const STANDARD_DATA')
i = c.find('"astm-b348"', data_start)
next_entry = c.find('"astm-b265"', data_start)
section = c[i:next_entry]
last300 = section[-300:]
print('Has whyChooseUsKey:', 'whyChooseUsKey' in last300)
print('Last 300:', repr(last300))
