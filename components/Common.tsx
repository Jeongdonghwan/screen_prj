// 방충망 공통 UI — 각진 버튼, 선 아이콘, 왼쪽 정렬 섹션 머리(번호 없음), 창틀 액자 히어로 사진, 망 촘촘함 비교.
import Link from 'next/link';
import { BRAND, BRAND_EN, CONTACT, BUSINESS, LINKS, tel, smsHref } from '../lib/site';
import { MESH } from '../lib/compose';
import type { Photo } from '../lib/photos';
import credits from '../data/photo_credits.json';
// CC BY·BY-SA 사진 출처 표기 (라이선스 조건)
const CREDITS = (credits.photos as { file: string; source: string; page: string; author: string; license: string }[]).filter((c) => c.source === 'Wikimedia Commons' && !/public domain/i.test(c.license));

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}</>
);
const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconExt = () => <Svg d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" size={15} />;

export const Actions = ({ dark }: { dark?: boolean }) => (
  <div className={`actions ${dark ? 'on-dark' : ''}`}>
    <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
    <a className="btn-text" href={smsHref}><IconMsg /><span>문자 상담 {CONTACT.sms}</span><IconArrow /></a>
    {CONTACT.kakao && <a className="btn-text" href={CONTACT.kakao} target="_blank" rel="noopener"><span>카카오톡</span><IconArrow /></a>}
  </div>
);

export const FixedLinks = ({ compact }: { compact?: boolean }) =>
  LINKS.length ? (
    <div className={`official ${compact ? 'compact' : ''}`}>
      <span className="official-label">바로가기</span>
      {LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener"><b>{l.label}</b><span>{l.sub}</span><IconExt /></a>)}
    </div>
  ) : null;

export const SectionHead = ({ title, sub }: { title: React.ReactNode; sub?: string }) => (
  <header className="sh" data-reveal><h2>{title}</h2>{sub && <p>{sub}</p>}</header>
);

// 망 촘촘함 비교 — 격자 간격을 실제로 다르게 그린다
export const MeshCompare = ({ on = [] as string[], text = {} as Record<string, string> }) => (
  <div className="mesh reveal-group">
    {MESH.map((m) => (
      <figure key={m.key} className={on.includes(m.key) ? 'on' : ''}>
        <div className="mesh-swatch" style={{ ['--gap' as any]: `${m.gap}px` }} aria-hidden="true" />
        <figcaption><strong>{m.name}</strong><span>{text[m.key] || m.d}</span></figcaption>
      </figure>
    ))}
    <p className="mesh-axis"><span>바람·빛 잘 통함</span><span>작은 벌레까지 막음</span></p>
  </div>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo"><b>{BRAND}</b><small>{BRAND_EN}</small></Link>
      <nav className="nav">
        <Link href="/#mesh">망 종류</Link>
        <Link href="/area/">지역</Link>
        <a href={tel} className="nav-call"><IconPhone />{CONTACT.phone}</a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>방충망 실측·시공·교체. 일반망·촘촘망·미세망·롤방충망·현관방충망.</p>
        {LINKS.length > 0 && <p className="foot-links">{LINKS.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label}</a>)}</p>}
      </div>
      <ul className="foot-info">
        <li><span>대표전화</span>{CONTACT.phone}</li>
        <li><span>문자</span>{CONTACT.sms}</li>
        {BUSINESS.name && <li><span>상호</span>{BUSINESS.name}</li>}
        {BUSINESS.ceo && <li><span>대표</span>{BUSINESS.ceo}</li>}
        {BUSINESS.bizNumber && <li><span>사업자</span>{BUSINESS.bizNumber}</li>}
        {BUSINESS.address && <li><span>주소</span>{BUSINESS.address}</li>}
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND}
      <p className="foot-credit">참고 사진: Unsplash · Wikimedia Commons{' '}
        {CREDITS.map((c, i) => <span key={c.file}>{i ? ' · ' : '('}<a href={c.page} target="_blank" rel="noopener nofollow">{c.author}</a>, {c.license}{i === CREDITS.length - 1 ? ')' : ''}</span>)}
      </p>
    </div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />전화 상담</a>
    <a href={smsHref} className="sb-sms"><IconMsg />문자</a>
  </div>
);

// 참고 사진 — 작은 화면은 800px, 큰 화면은 1600px 파일
export const Img = ({ p, alt, sizes = '(max-width: 760px) 100vw, 50vw', eager }: { p: Photo; alt: string; sizes?: string; eager?: boolean }) => (
  <img src={`/img/sm/${p.file}`} srcSet={`/img/sm/${p.file} 800w, /img/${p.file} 1600w`} sizes={sizes} width={p.w} height={p.h} alt={alt}
    loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchPriority: 'high' as const } : {})} />
);

// 히어로 오른쪽 사진 — 창틀 액자 + 반쯤 닫힌 방충망 격자(CSS). 참고 이미지임을 캡션에 밝힌다.
export const HeroFrame = ({ p, alt }: { p: Photo; alt: string }) => (
  <figure className="hero-frame">
    <div className="hero-frame-in"><Img p={p} alt={alt} sizes="(max-width: 900px) 100vw, 46vw" eager /><span className="hero-screen" aria-hidden="true" /></div>
    <figcaption><b>참고 이미지</b>{p.label}</figcaption>
  </figure>
);

// 사진 옆에 붙는 작은 설명 — 참고 이미지임을 밝힌다
export const PhotoFig = ({ p, alt, cls = '' }: { p: Photo; alt: string; cls?: string }) => (
  <figure className={`ph mask ${cls}`} data-reveal><Img p={p} alt={alt} /><figcaption><b>참고 이미지</b>{p.label}</figcaption></figure>
);

// 가로 사진 레일 (← → 버튼은 Motion의 data-scroll)
export const PhotoRail = ({ id, photos, kw }: { id: string; photos: Photo[]; kw: string }) => (
  <>
    <div className="rail-nav" data-reveal>
      <button type="button" data-scroll="-1" data-target={id} aria-label="이전 사진"><IconArrow /></button>
      <button type="button" data-scroll="1" data-target={id} aria-label="다음 사진"><IconArrow /></button>
    </div>
    <div className="rail" id={id}>
      {photos.map((p) => (
        <figure key={p.file}><div className="rail-ph"><Img p={p} alt={`${p.scene} — ${kw} 참고 이미지`} sizes="300px" /></div><figcaption>{p.label}</figcaption></figure>
      ))}
    </div>
  </>
);
