import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES, pagePath } from '../../lib/data';
import { BRAND } from '../../lib/site';
import { itemListJsonLd, ogImages } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `지역별 방충망 안내 | ${BRAND}`;
const DESC = '대전·세종·충청·전북·경기 지역별 방충망·미세방충망·현관방충망 안내 모음입니다. 동네마다 창 크기와 망 종류, 실측·시공·교체 방법을 정리했고 전화 한 통으로 실측 일정을 잡을 수 있습니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/area/' },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/area/', images: ogImages('area', '지역별 방충망 안내') },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('area', '지역별 방충망 안내') },
};

export default function AreaIndex() {
  const pages = OPEN_PAGES.filter((p) => !p.variantOf);
  const cities = Array.from(new Set(pages.map((p) => p.city)));
  return (
    <main><JsonLd data={itemListJsonLd(pages)} />
      <section className="page-head"><div className="wrap">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>지역</nav>
        <h1 className="page-title">지역별 방충망 안내</h1>
        <p className="prose-p">시·군과 동네를 고르면 그 지역 창에 맞는 망 종류, 교체 시점, 실측·시공 순서 안내로 이어집니다.</p>
      </div></section>
      <div className="wrap area-body">
      {cities.map((c) => (
        <section key={c} className="area-block" data-reveal>
          <h2 className="area-h">{c}</h2>
          <ul className="area-list">{pages.filter((p) => p.city === c).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}</ul>
        </section>
      ))}
      </div>
    </main>
  );
}
