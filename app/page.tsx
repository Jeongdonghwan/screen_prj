import type { Metadata } from 'next';
import Link from 'next/link';
import { cityHubs, pagePath } from '../lib/data';
import { getPosts, postPath } from '../lib/blog';
import { BRAND, CONTACT } from '../lib/site';

export const metadata: Metadata = { alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } }, openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', url: '/', images: ogImages('home', BRAND) } };
import { faqJsonLd, itemListJsonLd, ogImages } from '../lib/jsonld';
import { Actions, FixedLinks, HeroFrame, IconArrow, Img, JsonLd, MeshCompare, PhotoFig, PhotoRail, SectionHead } from '../components/Common';
import { HOME_HERO, MESH_PHOTO, ROOM_PHOTO, railPhotos } from '../lib/photos';

const STEPS = [
  { t: '사진 상담', d: '창 사진과 대략적인 크기를 보내주세요.' },
  { t: '실측', d: '창틀 폭·높이와 레일 모양을 잽니다.' },
  { t: '망·틀 선택', d: '일반망·촘촘망·미세망과 소재를 고릅니다.' },
  { t: '시공', d: '틀을 맞추고 모헤어까지 새로 끼웁니다.' },
  { t: '점검', d: '여닫아 보며 틈과 레일 걸림을 확인합니다.' },
];
// 창 자리별 안내 — 사진은 참고 이미지
const SPOTS = [
  { room: '거실 큰 창', t: '거실 큰 창', d: '폭이 넓어 망이 처지기 쉽습니다. 틀 보강과 모헤어 상태를 같이 봅니다.' },
  { room: '현관', t: '현관 · 미닫이 문', d: '여닫는 횟수가 많아 롤방충망이나 자바라형을 씁니다.' },
  { room: '베란다', t: '베란다 바깥 창', d: '바깥 창과 안쪽 창 중 어디에 달지부터 정합니다.' },
];
const FAQ = [
  { q: '벌레가 어디로 들어오나요?', a: '찢어진 망보다 틀과 창 사이 틈, 닳은 모헤어로 들어오는 경우가 많습니다.' },
  { q: '미세방충망이면 미세먼지가 안 들어오나요?', a: '저감을 내세운 제품이 있지만 완전히 막는 것은 아닙니다. 통풍도 줄어드니 환기와 함께 생각하세요.' },
  { q: '망만 바꿀 수 있나요?', a: '틀이 멀쩡하면 망만 바꿉니다. 틀이 휘었거나 바퀴가 망가졌으면 틀째 바꾸는 것이 낫습니다.' },
  { q: '상담은 어떻게 하나요?', a: `전화 ${CONTACT.phone} 또는 문자 ${CONTACT.sms}로 창 사진을 보내주세요.` },
];

export default function Home() {
  const hubs = cityHubs();
  const posts = getPosts().slice(0, 6);
  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(hubs.flatMap((h) => h.pages).slice(0, 30))]} />
      <section className="hero hero-home">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="hero-title"><span><i>바람은 들이고,</i></span><span><i>벌레는 창 밖에</i></span></h1>
            <p className="hero-lead">일반망·촘촘망·미세망 중 창마다 맞는 망을 고르고, 벌레가 들어오는 틈까지 막습니다. 방충망 실측·시공·교체.</p>
            <Actions />
          </div>
          <HeroFrame p={HOME_HERO} alt={`${HOME_HERO.scene} — 방충망 시공 참고 이미지`} />
        </div>
        <div className="wrap">
          <dl className="hero-specs">
            <div><dt>망 종류</dt><dd>일반 · 촘촘 · 미세</dd></div>
            <div><dt>형태</dt><dd>창문 · 롤 · 현관</dd></div>
            <div><dt>서비스</dt><dd>실측 · 시공 · 교체</dd></div>
          </dl>
        </div>
      </section>
      <FixedLinks />

      <section className="sec gray" id="mesh">
        <div className="wrap">
          <SectionHead title="망 촘촘함 비교" sub="촘촘할수록 작은 벌레를 막고, 바람과 빛은 덜 들어옵니다." />
          <PhotoFig p={MESH_PHOTO} alt={`${MESH_PHOTO.scene} — 촘촘망 방충망 참고 이미지`} cls="wide" />
          <MeshCompare on={['normal', 'dense', 'fine']} />
        </div>
      </section>

      <section className="sec" id="rooms">
        <div className="wrap">
          <SectionHead title="창 자리마다 다른 망" sub="같은 집이라도 거실·현관·베란다는 쓰는 망과 틀이 다릅니다." />
          <div className="spots">
            {SPOTS.map((x) => {
              const ph = ROOM_PHOTO[x.room];
              return (
                <figure key={x.t} className="spot" data-reveal>
                  <div className="spot-ph"><Img p={ph} alt={`${ph.scene} — ${x.t} 방충망 참고 이미지`} /></div>
                  <figcaption><h3>{x.t}</h3><p>{x.d}</p></figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec forest" id="process">
        <div className="wrap">
          <SectionHead title="상담부터 점검까지" />
          <ol className="timeline reveal-group">{STEPS.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>
        </div>
      </section>

      <section className="sec cta-sec">
        <div className="wrap">
          <div className="cta-box" data-reveal><p>창 사진과 <em>대략적인 크기</em>만 보내주세요.</p><Actions /></div>
        </div>
      </section>

      <section className="sec gray" id="photos">
        <div className="wrap">
          <SectionHead title="창가 사진으로 보기" sub="방충망 참고 이미지 — 업체 시공 사진이 아닌 무료 사진입니다." />
          <PhotoRail id="rail-home" photos={railPhotos('home', 10)} kw="방충망" />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title="지역별 안내" sub="대전·세종·충청·전북·경기 시·군을 고르면 동네별 방충망 안내로 이어집니다." />
          <div className="regions">
            {hubs.map((h) => (
              <div key={h.sido} className="region-col" data-reveal>
                <h3>{h.sido}</h3>
                <ul>{h.pages.map((p) => <li key={p.slug}><Link href={pagePath(p)}><span>{p.region}</span><IconArrow /></Link></li>)}</ul>
              </div>
            ))}
          </div>
          <p data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="sec line-top" id="blog">
          <div className="wrap">
            <SectionHead title="방충망 궁금한 것들" sub="망 종류, 교체 시점, 실측처럼 상담 때 자주 듣는 질문에 답한 글입니다." />
            <ul className="home-posts reveal-group">
              {posts.map((p) => <li key={p.slug}><Link href={postPath(p)}><time dateTime={p.publishedAt}>{p.publishedAt}</time><strong>{p.title}</strong></Link></li>)}
            </ul>
            <p data-reveal><Link href="/blog/" className="more">전체 글 보기 <IconArrow /></Link></p>
          </div>
        </section>
      )}

      <section className="sec gray">
        <div className="wrap">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>창 사진부터 보내주세요</h2>
          <p>샷시 종류와 창 크기를 보고 맞는 망과 시공 방법을 안내합니다.</p>
          <Actions dark />
          <FixedLinks compact />
        </div>
      </section>
    </main>
  );
}
