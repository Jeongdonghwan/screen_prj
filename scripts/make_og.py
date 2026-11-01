"""OG 카드 생성: public/og/<slug>.jpg + home.jpg + area.jpg (1200x630, JPEG 80).
   python -I scripts/make_og.py           # 없는 것만 생성
   python -I scripts/make_og.py --force   # 전부 다시
배경 = 참고 사진(data/photo_credits.json 의 hero 사진, 슬러그 해시로 고정 — lib/photos.ts heroPhoto 와 같은 사진) 어둡게.
네이버는 og 이미지를 가운데 정사각형으로 잘라 보여 주므로 글자는 가운데 630px(285~915) 안쪽에 둔다.
브랜드·전화는 lib/site.ts 에서 읽는다."""
import json, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/og'
W, H = 1200, 630
SAFE_L, SAFE_W = 300, 600
INK, ACCENT, SOFT = (22, 25, 28), (15, 124, 122), (159, 224, 220)  # globals.css --ink / --green / --mint
LABEL = 'WINDOW SCREEN'
BOLD, REG = 'C:/Windows/Fonts/malgunbd.ttf', 'C:/Windows/Fonts/malgun.ttf'

site = (ROOT / 'lib/site.ts').read_text(encoding='utf-8')
BRAND = re.search(r"BRAND = '([^']+)'", site).group(1)
PHONE = re.search(r"phone: '([^']+)'", site).group(1)
PHOTOS = json.loads((ROOT / 'data/photo_credits.json').read_text(encoding='utf-8'))['photos']
HERO = [p['file'] for p in PHOTOS if p['hero']]  # lib/photos.ts HERO_PHOTOS 와 같은 순서


def fnv(s):  # lib/data.ts hash 와 같은 FNV-1a (UTF-16 단위, 한글은 BMP라 ord 와 같음)
    h = 2166136261
    for ch in s:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return h


_fonts, _bases = {}, {}
def font(bold, size):
    k = (bold, size)
    if k not in _fonts:
        _fonts[k] = ImageFont.truetype(BOLD if bold else REG, size)
    return _fonts[k]


def base(file):
    if file not in _bases:
        im = Image.open(ROOT / 'public/img' / file).convert('RGB')
        s = max(W / im.width, H / im.height)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        l, t = (im.width - W) // 2, (im.height - H) // 2
        im = ImageEnhance.Brightness(im.crop((l, t, l + W, t + H))).enhance(0.5)
        _bases[file] = Image.blend(im, Image.new('RGB', (W, H), INK), 0.45)
    return _bases[file]


def fit(d, title):
    """| 로 줄 지정 가능. 아니면 공백 기준 줄바꿈, 3줄 이내로 들어가는 가장 큰 크기."""
    for size in range(84, 39, -4):
        f = font(True, size)
        if '|' in title:
            lines = title.split('|')
        else:
            lines, cur = [], ''
            for w in title.split():
                t = (cur + ' ' + w).strip()
                if d.textlength(t, font=f) <= SAFE_W: cur = t
                else: lines.append(cur); cur = w
            lines.append(cur)
        if len(lines) <= 3 and all(d.textlength(x, font=f) <= SAFE_W for x in lines):
            return lines, size
    return lines, 40


def card(key, title, photo):
    im = base(photo).copy()
    d = ImageDraw.Draw(im)
    lines, size = fit(d, title)
    y = 300 - len(lines) * size * 0.6
    d.rectangle((SAFE_L, y - 70, SAFE_L + 56, y - 63), fill=ACCENT)
    d.text((SAFE_L, y - 52), LABEL, font=font(False, 22), fill=SOFT)
    for ln in lines:
        d.text((SAFE_L - 3, y), ln, font=font(True, size), fill='white'); y += size * 1.22
    d.line((SAFE_L, 512, SAFE_L + SAFE_W, 512), fill=(90, 98, 104), width=1)
    d.text((SAFE_L, 528), BRAND, font=font(True, 30), fill='white')
    d.text((SAFE_L + font(True, 30).getlength(BRAND) + 22, 531), PHONE, font=font(False, 28), fill=SOFT)
    im.save(OUT / f'{key}.jpg', 'JPEG', quality=80, optimize=True, progressive=True)


if __name__ == '__main__':
    assert fnv('a') == 0xE40C292C  # FNV-1a 기준값
    force = '--force' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    pages = json.loads((ROOT / 'data/site-pages.json').read_text(encoding='utf-8'))['pages']
    jobs = [('home', '바람은 들이고,|벌레는 창 밖에', 'mesh-insect.jpg'),  # lib/photos.ts HOME_HERO
            ('area', '지역별 방충망 안내', HERO[fnv('area') % len(HERO)])]
    jobs += [(p['slug'], p['kw'], HERO[fnv(p['slug']) % len(HERO)]) for p in pages if not p.get('variantOf')]  # 변형 페이지는 대표 이미지
    jobs = [j for j in jobs if force or not (OUT / f'{j[0]}.jpg').exists()]
    for i, j in enumerate(jobs, 1):
        card(*j)
        if i % 300 == 0: print(i, '/', len(jobs))
    print('생성', len(jobs), '->', OUT)
