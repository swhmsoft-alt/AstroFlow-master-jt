import json, time
from deep_translator import GoogleTranslator

B='src/i18n/translations'
with open(f'{B}/en.json','r',encoding='utf-8') as f: en=json.load(f)
with open(f'{B}/de.json','r',encoding='utf-8') as f: de=json.load(f)

# Find untranslated cap keys (still English)
todo=[]
for k,v in en.items():
    if k.startswith('cap.') and k in de and de[k]==v and len(v)>3:
        todo.append((k,v))

print(f'DE: {len(todo)} to translate')

t=GoogleTranslator(source='en',target='de')
for i,(key,text) in enumerate(todo):
    try:
        de[key]=t.translate(text[:4500])
        if (i+1)%10==0: print(f'  {i+1}/{len(todo)}')
        time.sleep(0.2)
    except Exception as e:
        print(f'  [{i+1}] ERR: {str(e)[:60]}')
        time.sleep(2)

with open(f'{B}/de.json','w',encoding='utf-8') as f:
    json.dump(de,f,ensure_ascii=False,indent=2)
print('DE done!')
