with open('src/i18n/utils.ts','r',encoding='utf-8') as f:
    content = f.read()

# Remove the stray duplicate doc comment (between useTOrNull close and localizePath)
# Find the empty line after the first useTOrNull function, then the duplicate doc comment
stray_start = content.find('\n/**\n * Like useTranslations, but returns null', content.find('export function useTOrNull') + 15)
stray_end = content.find('\n */\n\nexport function localizePath', stray_start)

if stray_start > 0 and stray_end > 0:
    # Remove from the stray doc comment start through its closing */
    # The stray_end includes the newline before export function localizePath
    content = content[:stray_start] + content[stray_end:]
    with open('src/i18n/utils.ts','w',encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: stray doc comment removed')
else:
    print(f'stray_start={stray_start}, stray_end={stray_end}')
    print('Could not find exact boundaries, trying alternative')
    # Try alternative
    if stray_start > 0:
        localize_idx = content.find('export function localizePath', stray_start)
        content = content[:stray_start] + '\n' + content[localize_idx:]
        with open('src/i18n/utils.ts','w',encoding='utf-8') as f:
            f.write(content)
        print('SUCCESS: alternative cleanup done')
