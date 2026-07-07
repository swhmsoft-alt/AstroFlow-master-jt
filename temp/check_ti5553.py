with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    c = f.read()
d = c.find('export const GRADE_DATA')
t = c.find('"ti-5553"', d)
s = c[t:t+500]
print(f'ti-5553 found at pos {t}')
print(f'has faqs: {"faqs:" in s}')
# Check end
t_end = c.find('};', t)
print(f'Last 100: {repr(c[t_end-100:t_end+3])}')
