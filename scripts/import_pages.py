"""region_kw_prj/pages/<이름>.json(사용자 파일 위에서부터 N개) → data/site-pages.json

  python -I scripts/import_pages.py 방충망

- 표기만 다른 쌍(청주/청주시, 상당/상당구 …)은 variantOf 로 대표 페이지 표시
- 오픈 묶음(wave 1~4): 시·구 먼저, 그다음 동·읍면 — 파일 순서대로 4등분 (OPEN_WAVE 로 누적 오픈)
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name = sys.argv[1]
pages = json.load(open(os.path.join(ROOT, '..', 'region_kw_prj', 'pages', f'{name}.json'), encoding='utf-8'))['pages']
norm = lambda n: re.sub(r'(구|시|군)$', '', n.split(' ')[-1])
main = {}
for p in pages:
    grp = 1 if p['level'] in ('시', '구') else 2
    key = (p['city'], p['word'], norm(p['region']), grp)
    if key in main:
        p['variantOf'] = main[key]
    else:
        main[key] = p['slug']
order = sorted(pages, key=lambda p: 0 if p['level'] in ('시', '구') else 1)  # 안정 정렬: 파일 순서 유지
for i, p in enumerate(order):
    p['wave'] = 1 + i * 4 // len(order)
assert len({p['slug'] for p in pages}) == len(pages)
json.dump({'pages': pages}, open(os.path.join(ROOT, 'data', 'site-pages.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
sys.stdout.reconfigure(encoding='utf-8')
print(name, 'pages', len(pages), 'variants', sum(1 for p in pages if 'variantOf' in p), 'waves', [sum(1 for p in pages if p['wave'] == w) for w in range(1, 5)])
