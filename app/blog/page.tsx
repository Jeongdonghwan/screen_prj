import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { breadcrumbJsonLd, itemListJsonLd, ogImages } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd } from '../../components/Common';
import { BRAND } from '../../lib/site';

const TITLE = `방충망 궁금한 것들 | ${BRAND}`;
const DESC = '일반망·촘촘망·미세망 차이, 현관·롤방충망 고르는 법, 모헤어와 망 교체 시점, 찢어진 망 보수와 실측 방법까지 방충망을 바꾸기 전에 알아둘 것을 질문별로 정리합니다.';
export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', title: TITLE, description: DESC, url: '/blog/', images: ogImages('blog', '방충망 궁금한 것들') },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ogImages('blog', '방충망 궁금한 것들') },
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }]),
        itemListJsonLd(posts.map((p) => ({ kw: p.title, slug: p.slug, path: postEncodedPath(p) }))),
      ]} />
      <section className="page-head"><div className="wrap">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span>블로그</nav>
        <h1 className="page-title">방충망 궁금한 것들</h1>
        <p className="prose-p">망 종류, 교체 시점, 실측과 보수처럼 상담 때 자주 듣는 질문에 답합니다. 동네별 안내는 <Link href="/area/">지역 페이지</Link>에 있습니다.</p>
      </div></section>
      <div className="wrap area-body">
        <h2 className="area-h">최근 글</h2>
        {posts.length ? (
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p.slug} data-reveal>
                <Link href={postPath(p)}><time dateTime={p.publishedAt}>{p.publishedAt}</time><strong>{p.title}</strong><span>{p.description}</span></Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="prose-p">첫 글을 준비하고 있습니다. 궁금한 점은 전화나 문자로 물어보세요. <Link href="/" className="more">메인으로 <IconArrow /></Link></p>
        )}
        <h2 className="area-h post-cta-h">창 사진으로 먼저 물어보기</h2>
        <p className="prose-p">창 테두리가 보이게 찍은 사진과 대략적인 크기를 보내주시면 맞는 망과 방법을 안내합니다.</p>
        <Actions />
      </div>
    </main>
  );
}
