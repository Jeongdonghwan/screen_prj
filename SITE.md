# 방충망 시공 (방충망시공.kr)

Next.js 정적 export 키워드 페이지 사이트. 데이터: `data/site-pages.json`(페이지), `data/city-facts.json`(시 사실), `data/dong-facts.json`(동·읍면 위치 사실), 조합기 `lib/compose.ts`.

## 순차 오픈 (data/drip.json → scripts/drip/drip_status.py → OPEN_WAVE)

| 묶음 | 날짜 | 누적 페이지 |
|---|---|---|
| 1~4 | 11/3·11/5·11/7·11/9 | 2,000 (scripts/import_pages.py) |
| 5 | 11/15 | 2,500 (추가 키워드 앞 500) |
| 6 | 11/17 | 3,000 (추가 키워드 다음 500) |
| 7 | 11/19 | 3,500 (추가 키워드 뒤 500) |

**추가 키워드 1,500개 (2026-11-13, wave 5·6·7)** — `python -I scripts/add_extra_pages.py` 가 사용자 키워드 파일(`region_kw_prj/keywords/방충망_지역키워드.xlsx`)에서 아직 페이지가 아닌 행을 파일 순서대로 1,500개 골라 site-pages.json 뒤에 붙이고 `keywords/미세방충망_추가키워드.xlsx` 를 만든다. 이미 있는 슬러그·표기만 다른 쌍은 건너뛴다(새 페이지는 모두 대표 페이지). 날짜는 drip.json 의 `extra`.
그다음 `python -I scripts/dong_facts.py` 로 동·읍면 위치 사실(행정동 경계 2026-10: 소속 시군구, 행정동, 경계를 맞댄 행정동)을 다시 만든다. import_pages.py 를 다시 돌리면 이 두 스크립트도 다시 돌린다.

```bash
python scripts/drip/drip_status.py data/drip.json 2026-11-15   # WAVE=5
OPEN_WAVE=7 SITE_URL=https://xn--ob0bt8vnwbbul7qo.kr npx next build
```
