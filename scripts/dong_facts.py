"""동·읍면 페이지의 위치 사실 → data/dong-facts.json (행정동 경계 2026-10 기준, 지어낸 값 없음)

  python -I scripts/dong_facts.py

원본: region_kw_prj/data/hjd_20261001.geojson (행정동 경계). 페이지 지역(동·읍면)마다
- adm: 속한 행정동 이름 (법정동 키워드가 합쳐진 행정동에 들어가면 그 이름, 예: 명암동 → 용담·명암·산성동)
- sgg: 시군구 (예: 청주시 상당구)
- near: 경계를 맞댄 행정동 (꼭짓점을 공유하는 이웃, 최대 4곳)
페이지 데이터(site-pages.json)를 바꾸면 다시 돌린다.
"""
import json, os, re, sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEO = os.path.join(ROOT, '..', 'region_kw_prj', 'data', 'hjd_20261001.geojson')
cities = {c['kw']: c['name'] for c in json.load(open(os.path.join(ROOT, 'data', 'city-facts.json'), encoding='utf-8'))['cities']}
pages = json.load(open(os.path.join(ROOT, 'data', 'site-pages.json'), encoding='utf-8'))['pages']
feats = json.load(open(GEO, encoding='utf-8'))['features']


def verts(g):
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    return {(round(x, 5), round(y, 5)) for poly in polys for ring in poly for x, y in ring}


F = []
for f in feats:
    p = f['properties']
    F.append(dict(adm=p['adm_nm'].split(' ')[-1], sido=p['sidonm'], sgg=p['sggnm'], v=verts(f['geometry'])))
owner = defaultdict(set)
for i, f in enumerate(F):
    for v in f['v']:
        owner[v].add(i)


def parts(adm):  # '용담·명암·산성동' → {'용담동','명암동','산성동'}; '진천읍' → {'진천읍'}
    suf = adm[-1]
    return {x if x.endswith(suf) else x + suf for x in adm.split('·')} | {adm, adm.replace('·', '')}


def find(city, dong):
    name = cities[city]
    cand = [i for i, f in enumerate(F) if f['sido'] == name or f['sgg'].startswith(name)]
    key = dong.replace('·', '')
    hit = [i for i in cand if F[i]['adm'] == dong or F[i]['adm'].replace('·', '') == key]
    if not hit:
        hit = [i for i in cand if dong in parts(F[i]['adm'])]
    if not hit:  # 가양동 → 가양1동·가양2동
        num = re.compile(re.escape(dong[:-1]) + r'\d+' + dong[-1] + '$')
        hit = [i for i in cand if num.match(F[i]['adm'])]
    return hit if hit and len({F[i]['sgg'] for i in hit}) == 1 and (len(hit) == 1 or not F[hit[0]]['adm'].endswith(dong)) else None


out, miss = {}, []
for p in pages:
    if p['level'] not in ('동', '읍면'):
        continue
    dong = p['region'].split(' ')[-1]
    k = f"{p['city']}|{dong}"
    if k in out or k in miss:
        continue
    hit = find(p['city'], dong)
    if hit is None:
        miss.append(k); continue
    f = F[hit[0]]
    vs = set().union(*(F[i]['v'] for i in hit))
    nb = sorted({j for v in vs for j in owner[v]} - set(hit), key=lambda j: -len(vs & F[j]['v']))
    near = [F[j]['adm'] for j in nb if F[j]['sido'] == f['sido']][:4]
    sgg = re.sub(r'(시|군)(\S+구)$', r'\1 \2', f['sgg'])  # 천안시동남구 → 천안시 동남구
    out[k] = {'adm': '·'.join(F[i]['adm'] for i in hit), 'sgg': sgg if f['sido'] != f['sgg'] else '', 'near': near}

json.dump({'_note': '행정동 경계(hjd_20261001) 기준 소속 시군구·행정동·경계를 맞댄 행정동. scripts/dong_facts.py', 'dongs': out},
          open(os.path.join(ROOT, 'data', 'dong-facts.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
sys.stdout.reconfigure(encoding='utf-8')
print('동·읍면', len(out), '못 찾음', len(miss), miss[:20])
