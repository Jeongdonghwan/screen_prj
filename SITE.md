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

## h1 수식어·레이 구조 적용(2026-11-24)
키워드 페이지(`app/[slug]/page.tsx`, 조합 `lib/compose.ts` 의 `ray`·description)를 레이 모범 구조로: 분류 줄 → h1(`키워드` + `.hero-sub` 수식어, 주제별 2벌 + 대표 동네 1벌 해시 선택) → 설명 → "{키워드} 핵심 요약"(결론 + 사실 4칸) → 번호 절 6개(한 문단, 4개 h2 에 키워드 전체) → "{키워드} 자주 묻는 질문" → 관련 링크 3묶음(최대 12개). 망 비교 그림·사진 레일은 뺌(히어로 사진만). description 45~80자(키워드 — 관련 키워드 + 이웃 동네 + 전화). 주소·title·canonical 그대로. 점검 `python -I scripts/ray_check.py out`.
측정(열린 5,500쪽, OPEN_WAVE=11): h1 중복 0 · 키워드 든 h2 6개 이상/쪽 · 본문(main) 평균 2,117자 · 절 문단 평균 197자 · 같은 단어 페이지 같은 문장 평균 최고 28%(쌍 최대 57%) · description 55~80자 중복 0 · 조사 오류 0.
title: 키워드 페이지 title 을 "키워드 수식어 | 상호"로 변경(2026-11-24) — 앞부분은 h1 과 같은 글자, 앞부분 40자·전체 60자 이하(넘으면 짧은 수식어 벌), og·twitter·rss 같은 값, og:site_name 상호. 빌드 없는 점검 `node scripts/title_check.js <OPEN_WAVE>` (중복 0 · h1 불일치 0).
title 40자(2026-11-24): 네이버 권장에 맞춰 title 전체 40자 이하 — "키워드 수식어 | 상호"가 40자를 넘으면 상호를 뺀다(상호는 og:site_name). 점검 기준도 40자.
