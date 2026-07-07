with open('src/data/titanium-grades.ts','r',encoding='utf-8') as f:
    content = f.read()

data_start = content.find('export const GRADE_DATA')
g2 = content.find('"grade-2"', data_start)
g3 = content.find('"grade-3"', data_start)
print(f'Grade 2 at {g2}, Grade 3 at {g3}')
print('Last 300 chars:')
print(repr(content[g2:g3][-300:]))

# Find the pattern to insert after
insert_marker = content[g2:g3].rfind(']\n    }\n  },\n')
if insert_marker == -1:
    print('ERROR: Could not find insert point')
else:
    absolute_pos = g2 + insert_marker + len(']\n    }')
    print(f'Insert at absolute position {absolute_pos}')
    before = content[:absolute_pos]
    after = content[absolute_pos:]
    
    new_fields = ''',
    faqs: [
      { question: "What is Grade 2 titanium and why is it the most widely used commercially pure grade?", answer: "Grade 2 is the most commonly specified commercially pure titanium grade, offering an optimal balance of strength, ductility, corrosion resistance, and weldability. It is the default choice for industrial applications requiring excellent seawater corrosion resistance, good formability, and moderate strength." },
      { question: "Can you machine Grade 2 titanium into custom industrial components?", answer: "Yes. We machine Grade 2 CP-Titanium on our 5-axis CNC centers and precision turning machines. Grade 2 offers good machinability for a titanium alloy. We achieve tolerances up to ±0.005 mm with excellent surface finishes for chemical processing, marine, and industrial components." },
      { question: "What documentation do you provide with Grade 2 titanium parts?", answer: "Every order includes EN 10204 Type 3.1 Material Test Reports (MTRs) documenting chemical composition and mechanical properties per ASTM B265. CMM dimensional inspection reports and NDT (ultrasonic/penetrant) testing are available upon request." }
    ],
    whyChooseUs: "BOZE CNC Ti is a trusted manufacturer of Grade 2 commercially pure titanium components for the chemical processing, marine, oil & gas, and architectural industries. Our facility processes certified CP-Ti stock through 5-axis CNC milling, precision turning, and custom fabrication. Every component is backed by full material traceability, MTR documentation, and CMM inspection. Our engineering team provides 24-hour DFM review and competitive quoting for industrial and marine applications."'''
    
    new_content = before + new_fields + after
    with open('src/data/titanium-grades.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Grade 2: AIO fields added')
