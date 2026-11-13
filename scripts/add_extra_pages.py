"""오픈 뒤 추가 키워드 페이지(wave 5·6·7) → data/site-pages.json 뒤에 붙이고 keywords/미세방충망_추가키워드.xlsx 작성

  python -I scripts/add_extra_pages.py

다시 돌려도 같은 결과(기존 wave 5 이상 페이지를 지우고 다시 붙인다). 기존 페이지(wave 1~4)는 건드리지 않는다.
import_pages.py 를 다시 돌렸다면 그 뒤에 이 스크립트도 다시 돌린다.

고른 기준: 사용자 키워드 파일(region_kw_prj/keywords/방충망_지역키워드.xlsx, 5,103행) 중 처음 2,000개 다음 행을
파일 순서(= 우선순위) 그대로 위에서부터 1,500개. 이미 있는 슬러그와 표기만 다른 쌍(variantOf 가 될 행)은 건너뛴다
— 새 페이지는 모두 사이트맵에 들어가는 대표 페이지. 앞 500 wave 5, 다음 500 wave 6, 나머지 wave 7 (data/drip.json extra).
"""
import json, os, re, sys
from collections import Counter
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, 'data', 'site-pages.json')
SRC = os.path.join(ROOT, '..', 'region_kw_prj', 'keywords', '방충망_지역키워드.xlsx')
XLSX = os.path.join(ROOT, 'keywords', '미세방충망_추가키워드.xlsx')
DOMAIN = 'https://방충망시공.kr'
N, PER = 1500, 500
drip = json.load(open(os.path.join(ROOT, 'data', 'drip.json'), encoding='utf-8'))
DATES = {x['wave']: x['date'] for x in drip['extra']}

data = json.load(open(PAGES, encoding='utf-8'))
pages = [p for p in data['pages'] if p['wave'] <= 4]
have = {p['slug'] for p in pages}
norm = lambda n: re.sub(r'(구|시|군)$', '', n.split(' ')[-1])  # import_pages.py 와 같은 표기 변형 키
grp = lambda level: 1 if level in ('시', '구') else 2
keys = {(p['city'], p['word'], norm(p['region']), grp(p['level'])) for p in pages}
cities = {c['kw'] for c in json.load(open(os.path.join(ROOT, 'data', 'city-facts.json'), encoding='utf-8'))['cities']}

rows = list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))[1:]
new = []
for rank, kw, _, word, region, level, city, sido, *_ in rows:
    slug = kw.replace(' ', '-')
    key = (city, word, norm(region), grp(level))
    if slug in have or key in keys or city not in cities:
        continue
    have.add(slug); keys.add(key)
    new.append(dict(rank=rank, kw=kw, slug=slug, word=word, region=region, level=level, city=city, sido=sido))
    if len(new) == N:
        break
for i, p in enumerate(new):
    p['wave'] = 5 + i // PER
data['pages'] = pages + new
json.dump(data, open(PAGES, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

wb = Workbook()
ws = wb.active
ws.title = '키워드'
ws.append(['순번', '키워드', 'URL', '우선순위', '오픈 묶음', '오픈일'])
for i, p in enumerate(new, 1):
    ws.append([i, p['kw'], f'{DOMAIN}/{p["slug"]}/', p['rank'], p['wave'], DATES[p['wave']]])
for c in ws[1]: c.font = Font(bold=True)
for i, w in enumerate([7, 28, 52, 9, 9, 12], 1): ws.column_dimensions[get_column_letter(i)].width = w
ws.freeze_panes = 'A2'
ws.auto_filter.ref = ws.dimensions
os.makedirs(os.path.dirname(XLSX), exist_ok=True)
wb.save(XLSX)

sys.stdout.reconfigure(encoding='utf-8')
print('추가', len(new), Counter(p['wave'] for p in new))
print(Counter((p['level'], p['word']) for p in new))
print('xlsx', XLSX)
