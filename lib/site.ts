// 사이트 설정 — 연락처·고정 링크·사업자 정보. TODO 표시는 업체 정보를 받으면 채운다.

export const SITE_URL = process.env.SITE_URL || 'https://xn--ob0bt8vnwbbul7qo.kr'; // 방충망시공.kr (퓨니코드)
export const BRAND = '방충망 시공'; // TODO: 상호
export const BRAND_EN = 'WINDOW SCREEN';

export const CONTACT = {
  phone: '010-5566-4204',
  sms: '010-5566-4204',
  kakao: '',
  hours: '', // TODO: 상담 시간 (비우면 표시 안 함)
};

// 페이지마다 고정으로 넣을 외부 링크. 비어 있으면 띠를 숨긴다.
export const LINKS: { label: string; sub: string; url: string }[] = []; // 없음(사용자 확인)

export const BUSINESS = { name: '', ceo: '', bizNumber: '', address: '' }; // 사업자 정보 없음(사용자 확인)

export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 4); // 누적 오픈 묶음 1~4 (scripts/import_pages.py 가 시·구 먼저 4등분)
export const MERGE_VARIANTS = true;

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.sms.replace(/[^0-9]/g, '')}`;
