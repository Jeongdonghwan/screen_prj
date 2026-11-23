import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OPEN_PAGES, getPage, pagePath, pageEncodedPath, canonicalPath, related } from '../../lib/data';
import { compose } from '../../lib/compose';
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd, ogImages, serviceJsonLd } from '../../lib/jsonld';
import { Actions, FixedLinks, HeroFrame, IconArrow, JsonLd } from '../../components/Common';
import { heroPhoto } from '../../lib/photos';

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
  const r = c.ray;
  const rel = related(p);
  const path = pageEncodedPath(p);
  const hero = heroPhoto(p.variantOf || p.slug); // og 썸네일과 같은 사진
  const alt = (scene: string) => `${scene} — ${p.kw} 참고 이미지`;
  const dn = p.region.split(' ').slice(-1)[0];
  // 관련 링크 3묶음 — 본문 내부링크 합계 10~15개 (경로 2 + 아래 최대 12)
  const groups = [
    { h: `${p.region} 다른 안내`, items: rel.samePlace.slice(0, 4) },
    rel.nearDong.length ? { h: `${dn} 이웃 동네`, items: rel.nearDong.slice(0, 4) } : { h: `${c.city.name} ${p.word}`, items: rel.sameCity.slice(0, 4) },
    rel.nearDong.length ? { h: `${c.city.name} ${p.word}`, items: rel.sameCity.slice(0, 4) } : { h: `가까운 도시 ${p.word}`, items: rel.otherCities.slice(0, 4) },
  ].filter((g) => g.items.length);

  return (
    <main data-topic={p.word}>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: p.kw, path }]),
        serviceJsonLd({ name: p.kw, description: c.description, path, area: c.area }),
        faqJsonLd(c.faq),
        itemListJsonLd(groups.flatMap((g) => g.items)),
      ]} />

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span>{p.kw}</nav>
            <p className="hero-cat">{r.cat}</p>
            <h1 className="hero-title"><span>{p.kw}</span>{' '}<span className="hero-sub">{r.h1sub}</span></h1>
            <p className="hero-lead">{c.lead}</p>
            <Actions />
          </div>
          <HeroFrame p={hero} alt={alt(hero.scene)} />
        </div>
      </section>
      <FixedLinks />

      <div className="wrap ray-grid">
        <div className="ray-main">
          <section className="ray-sum" data-reveal>
            <h2>{p.kw} 핵심 요약</h2>
            <p>{r.summary}</p>
            <dl>{[...c.region.dl, ['망 종류', '일반망 · 촘촘망 · 미세망'] as [string, string]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </section>
          <article className="ray-article">
            {r.sections.map((x, i) => (
              <section key={i}>
                <h2><span>{String(i + 1).padStart(2, '0')}</span>{x.h}</h2>
                <p>{x.p}</p>
              </section>
            ))}
          </article>
          <section className="ray-faq" id="faq">
            <h2>{p.kw} 자주 묻는 질문</h2>
            <div className="faq">{c.faq.map((f) => <details key={f.q}><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
          </section>
        </div>
        <aside className="ray-side">
          <h3>바로 확인</h3>
          <dl>{[c.specs[0], c.specs[2]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <Actions />
        </aside>
      </div>

      <section className="sec ray-rel">
        <div className="wrap related">
          {groups.map((g) => <div key={g.h}><h3>{g.h}</h3><ul>{g.items.map((x) => <li key={x.slug}><Link href={pagePath(x)}>{x.kw}<IconArrow /></Link></li>)}</ul></div>)}
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
