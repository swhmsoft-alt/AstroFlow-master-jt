with open('src/i18n/utils.ts','r',encoding='utf-8') as f:
    content = f.read()

# Count occurrences
count = content.count('export function useTOrNull')
print(f'Found {count} occurrences of useTOrNull')

# Find the second occurrence and remove it
# The duplicate starts after the first useTOrNull function ends and before localizePath
first_end = content.find('export function useTOrNull', content.find('export function useTOrNull') + 5)
if first_end > 0:
    # Find where the second one ends (before localizePath)
    localize_start = content.find('export function localizePath')
    duplicate_text = content[first_end:localize_start].strip()
    if duplicate_text.startswith('export function useTOrNull'):
        # Remove the duplicate
        content = content[:first_end] + '\n' + content[localize_start:]
        with open('src/i18n/utils.ts','w',encoding='utf-8') as f:
            f.write(content)
        print('SUCCESS: duplicate removed')
    else:
        print(f'Unexpected text: {duplicate_text[:80]}...')
else:
    print('Only one occurrence found, no action needed')
