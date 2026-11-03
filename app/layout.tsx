import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, Footer, StickyBar, JsonLd } from '../components/Common';
import Motion from '../components/Motion';
import { businessJsonLd, ogImages } from '../lib/jsonld';
import { SITE_URL, BRAND } from '../lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND} | 미세방충망·촘촘망·현관방충망 시공`, template: '%s' },
  description: '방충망 실측·시공·교체. 일반망·촘촘망·미세망 차이와 고르는 법, 현관 방충망·롤방충망 설치, 모헤어·망 교체까지.',
  robots: { index: true, follow: true },
  alternates: { types: { 'application/rss+xml': `${SITE_URL}/rss.xml` } },
  openGraph: { type: 'website', siteName: BRAND, locale: 'ko_KR', images: ogImages('home', BRAND) },
  twitter: { card: 'summary_large_image', images: ogImages('home', BRAND) },
};
export const viewport: Viewport = { themeColor: '#0f4a3c', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" /></head>
      <body>
        <JsonLd data={businessJsonLd()} />
        <Header />
        {children}
        <Footer />
        <StickyBar />
        <Motion />
      </body>
    </html>
  );
}
