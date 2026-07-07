with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    c = f.read()

d = c.find('export const GRADE_DATA')
t = c.find('"ti-5553"', d)
print(f'ti-5553 at pos {t}')

# Check if it has the proper fields
section = c[t:t+3000]
has_faqs = 'faqs:' in section
has_why = 'whyChooseUs:' in section
print(f'has faqs: {has_faqs}, has whyChooseUs: {has_why}')

# Find alternativeTo
alt = c.find('alternativeTo', t)
if alt >= 0:
    items = c.find('items: [', alt)
    items_close = c.find(']', items)
    print(f'alternativeTo items close at pos {items_close}')
    after = c[items_close:items_close+100]
    print(f'After items close: {repr(after)}')
    
    if not has_faqs:
        # Find the closing of alternativeTo section
        closing = c.find('}', items_close)
        print(f'Closing brace after items: {repr(c[closing:closing+50])}')
        
        # Insert after items close
        before = c[:items_close+1]
        after_text = c[items_close+1:]
        
        insert = ''',
    faqs: [
      { question: "What is Ti-5553 high-strength beta titanium?", answer: "Ti-5Al-5V-5Mo-3Cr is a metastable beta titanium alloy offering excellent through-hardenability in thick sections up to 150 mm with strengths up to 1,310 MPa." },
      { question: "What aerospace applications use Ti-5553?", answer: "Ti-5553 is used for large landing gear forgings, airframe structural components, and helicopter rotor components in next-generation aircraft." },
      { question: "What processing for Ti-5553?", answer: "We offer precision forging, 5-axis CNC machining, and vacuum heat treatment per AMS 2750F Class 2 with full traceability." }
    ],
    whyChooseUs: "BOZE CNC Ti is a precision manufacturer of Ti-5553 high-strength beta titanium components for aerospace landing gear and structural applications, with AS9100D certification and NADCAP NDT."'''
        
        c = before + insert + after_text
        print('ti-5553: AIO fields added')
    else:
        print('ti-5553: already has fields')
else:
    print('ti-5553: no alternativeTo section')
    # Find what's at the end
    print(repr(c[t:t+100]))

with open('src/data/titanium-grades.ts', 'w', encoding='utf-8') as f:
    f.write(c)
