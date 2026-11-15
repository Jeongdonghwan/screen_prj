// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { OPEN_PAGES } from '../../lib/data';
import { BRAND, BUSINESS, CONTACT, LINKS, UPDATED, tel, smsHref } from '../../lib/site';
import { breadcrumbJsonLd, businessJsonLd, ogImages } from '../../lib/jsonld';
import { JsonLd } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = '방충망 실측·시공·교체를 하는 곳입니다. 하는 일, 다니는 지역, 연락 방법을 사실대로 정리했습니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC, alternates: { canonical: '/about/' },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/about/', images: ogImages('home', BRAND) },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('home', BRAND) },
};

export default function About() {
  const pages = OPEN_PAGES.filter((p) => !p.variantOf);
  const words = Array.from(new Set(pages.map((p) => p.word)));
  const cities = Array.from(new Set(pages.map((p) => p.city)));
  return (
    <main><JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <section className="page-head"><div className="wrap">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>소개</nav>
        <h1 className="page-title">{BUSINESS.name || BRAND} 소개</h1>
        <p className="prose-p">{BUSINESS.name || BRAND}은 집과 상가 창문·현관의 방충망을 실측하고 시공·교체합니다.</p>
      </div></section>
      <div className="wrap area-body">
        <section className="area-block">
          <h2 className="area-h">하는 일</h2>
          <p className="prose-p">{words.join(', ')} 작업을 합니다. 창 크기를 재고, 망 종류를 정한 뒤 시공합니다.</p>
        </section>
        <section className="area-block">
          <h2 className="area-h">다니는 지역</h2>
          <p className="prose-p">{cities.join(', ')} 지역을 다닙니다. 동네별 안내는 <Link href="/area/">지역별 안내</Link>에 있습니다.</p>
        </section>
        <section className="area-block">
          <h2 className="area-h">연락 방법</h2>
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a>, 문자 <a href={smsHref}>{CONTACT.sms}</a>{CONTACT.hours && ` (${CONTACT.hours})`}로 받습니다.</p>
          {BUSINESS.address && <p className="prose-p">주소는 {BUSINESS.address}입니다.</p>}
          {BUSINESS.ceo && <p className="prose-p">대표는 {BUSINESS.ceo}입니다.</p>}
          {BUSINESS.bizNumber && <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
          {LINKS.length > 0 && <p className="prose-p">{LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</p>}
        </section>
        <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
      </div>
    </main>
  );
}
