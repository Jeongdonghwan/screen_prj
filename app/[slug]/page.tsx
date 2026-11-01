import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, getPage, pagePath, pageEncodedPath, canonicalPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, ogImages, serviceJsonLd } from '../../lib/jsonld';
import { Actions, FixedLinks, HeroFrame, IconArrow, JsonLd, MeshCompare, PhotoFig, PhotoRail, SectionHead } from '../../components/Common';
import { CAUSE_PHOTO, MESH_CLOSE, MESH_PHOTO, ROOM_PHOTO, heroPhoto, railPhotos } from '../../lib/photos';
import { hash } from '../../lib/data';

export const dynamicParams = false;
export function generateStaticParams() { return OPEN_PAGES.map((p) => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(params.slug);
  if (!p) return {};
  const c = compose(p);
  const url = canonicalPath(p);
  const images = ogImages(p.variantOf || p.slug, p.kw);
  return { title: c.title, description: c.description, alternates: { canonical: url }, openGraph: { title: c.title, description: c.description, url, images }, twitter: { card: 'summary_large_image', title: c.title, description: c.description, images } };
}

export default function KeywordPage({ params }: { params: { slug: string } }) {
  const p = getPage(params.slug);
  if (!p) notFound();
  const c = compose(p);
  const rel = related(p);
  const path = pageEncodedPath(p);
  const hero = heroPhoto(p.variantOf || p.slug); // og 썸네일과 같은 사진
  const roomPh = ROOM_PHOTO[c.rooms[0].room];
  const causePh = CAUSE_PHOTO[c.causes[0].t];
  const matPh = MESH_CLOSE[hash(p.slug) % MESH_CLOSE.length];
  const alt = (scene: string) => `${scene} — ${p.kw} 참고 이미지`;

  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: c.area }),
        faqJsonLd(c.faq),
        itemListJsonLd([...rel.samePlace, ...rel.sameCity, ...rel.otherCities]),
      ]} />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span>{p.kw}</nav>
            <h1 className="hero-title"><span><i>{p.kw}</i></span></h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions />
          </div>
          <HeroFrame p={hero} alt={alt(hero.scene)} />
        </div>
        <div className="wrap">
          <dl className="hero-specs">{c.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </section>
      <FixedLinks />

      <section className="sec">
        <div className="wrap">
          <div className="prose" data-reveal>{c.intro.map((t, i) => <p key={i} className={i === 0 ? 'first' : ''}>{t}</p>)}</div>
        </div>
      </section>

      <section className="sec gray" id="mesh">
        <div className="wrap">
          <SectionHead title={c.meshHeading} sub="격자 간격을 실제 촘촘함 순서대로 그렸습니다. 이 페이지와 관련된 망이 표시됩니다." />
          <PhotoFig p={MESH_PHOTO} alt={alt(MESH_PHOTO.scene)} cls="wide" />
          <MeshCompare on={c.meshOn} text={c.meshText} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title={c.region.heading} />
          <div className="cols">
            <p className="region-body" data-reveal>{c.region.body}</p>
            <dl className="info" data-reveal>{c.region.dl.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
        </div>
      </section>

      <section className="sec line-top">
        <div className="wrap">
          <SectionHead title={c.roomsHeading} />
          <div className="split">
            <PhotoFig p={roomPh} alt={alt(roomPh.scene)} />
            <ol className="rooms reveal-group">{c.rooms.map((r) => <li key={r.room}><h3>{r.room}</h3><p>{r.text}</p></li>)}</ol>
          </div>
        </div>
      </section>

      <section className="sec gray">
        <div className="wrap">
          <SectionHead title={c.causesHeading} />
          <div className="split rev">
            <PhotoFig p={causePh} alt={alt(causePh.scene)} />
            <ol className="rooms one reveal-group">{c.causes.map((r) => <li key={r.t}><h3>{r.t}</h3><p>{r.d}</p></li>)}</ol>
          </div>
        </div>
      </section>

      <section className="sec cta-sec">
        <div className="wrap">
          <div className="cta-box" data-reveal><p>창 사진과 <em>대략적인 크기</em>만 보내주세요.</p><Actions /></div>
        </div>
      </section>

      <section className="sec forest">
        <div className="wrap">
          <SectionHead title="상담부터 점검까지" />
          <ol className="timeline reveal-group">{c.steps.map((st) => <li key={st.t}><strong>{st.t}</strong><p>{st.d}</p></li>)}</ol>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <SectionHead title="이럴 때 바꿀 때입니다" />
          <div className="lists" data-reveal>
            <div><h3>교체 신호</h3><ul className="check">{c.signs.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h3>자주 놓치는 점</h3><ul className="warn">{c.pitfalls.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="sec gray">
        <div className="wrap">
          <SectionHead title="망 소재" />
          <div className="split">
            <PhotoFig p={matPh} alt={alt(matPh.scene)} />
            <dl className="types one reveal-group">{c.materials.map((x) => <div key={x.name}><dt>{x.name}</dt><dd>{x.d}</dd></div>)}</dl>
          </div>
        </div>
      </section>

      <section className="sec" id="photos">
        <div className="wrap">
          <SectionHead title="창가 사진으로 보기" sub={`${p.kw} 참고 이미지 — 업체 시공 사진이 아닌 무료 사진입니다.`} />
          <PhotoRail id="rail" photos={railPhotos(p.slug)} kw={p.kw} />
        </div>
      </section>

      <section className="sec gray" id="faq">
        <div className="wrap">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{c.faq.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap related">
          {rel.samePlace.length > 0 && <div><h3>{p.region} 다른 안내</h3><ul>{rel.samePlace.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.sameCity.length > 0 && <div><h3>{c.city.name} {p.word}</h3><ul>{rel.sameCity.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
          {rel.otherCities.length > 0 && <div><h3>가까운 도시 {p.word}</h3><ul>{rel.otherCities.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>}
        </div>
      </section>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>{c.closing.heading}</h2>
          <p>{c.closing.text}</p>
          <Actions dark />
          <FixedLinks compact />
        </div>
      </section>
    </main>
  );
}
