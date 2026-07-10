import json, time
from deep_translator import GoogleTranslator
B=r'C:\Users\Administrator\Desktop\AstroFlow-master-jt\src\i18n\translations'
with open(f'{B}/en.json','r',encoding='utf-8') as f: en=json.load(f)
n={k:v for k,v in en.items() if k.startswith(('cap.mfg','cap.eng','cap.cap','cap.qual','cap.insp','cap.trc','cap.cert'))}
with open(f'{B}/ja.json','r',encoding='utf-8') as f: ja=json.load(f)
t=[(k,v) for k,v in n.items() if k in ja and ja[k]==v and len(v)>3]
print(f'JA: {len(t)} remaining')
tr=GoogleTranslator(source='en',target='ja')
for i,(k,v) in enumerate(t):
    if len(v)>4500: continue
    try: ja[k]=tr.translate(v[:2000]); time.sleep(0.3)
    except: time.sleep(2)
    if (i+1)%50==0: 
        with open(f'{B}/ja.json','w',encoding='utf-8') as f: json.dump(ja,f,ensure_ascii=False,indent=2)
        print(f'  {i+1}/{len(t)}')
with open(f'{B}/ja.json','w',encoding='utf-8') as f: json.dump(ja,f,ensure_ascii=False,indent=2)
print('JA DONE')
