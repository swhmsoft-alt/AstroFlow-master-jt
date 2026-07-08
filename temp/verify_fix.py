import os

base = 'dist/ja/materials/astm-b348/index.html'
if not os.path.exists(base):
    print('File not found')
else:
    size = os.path.getsize(base)
    with open(base, 'r', encoding='utf-8', errors='ignore') as f:
        f.seek(size // 3)
        chunk = f.read(100000)
    
    # Check for issues
    if 'whyChooseUs.undefined' in chunk:
        print('❌ BUG: whyChooseUs.undefined found!')
    else:
        print('✅ No undefined key in content')
    
    # Check for Japanese Why Choose Us
    for marker in ['BOZE CNC', 'BOZE CNC Ti', '冶金', '専門知識', 'この規格']:
        if marker in chunk:
            idx = chunk.find(marker)
            print(f'  Found "{marker}" at offset {idx}: {chunk[max(0,idx-10):idx+80]}')
            if marker == 'この規格':
                break
