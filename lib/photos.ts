// 참고 사진(Unsplash·Wikimedia Commons, 무료 라이선스) — 방충망이 실제로 보이는 사진만 (2026-10-28 무관한 실내·창가 사진 제거) — 출처는 data/photo_credits.json. 업체 시공 사진이 아니므로 "시공 사례"라고 쓰지 않는다.
import credits from '../data/photo_credits.json';
import { hash } from './data';

export interface Photo { file: string; scene: string; label: string; w: number; h: number; hero: boolean }
const ALL = credits.photos as Photo[];
const by = (name: string) => ALL.find((p) => p.file === `${name}.jpg`)!;

// 히어로 배경 후보 — scripts/make_og.py 가 같은 순서·같은 해시로 og 배경을 고른다
export const HERO_PHOTOS = ALL.filter((p) => p.hero);
export const heroPhoto = (slug: string) => HERO_PHOTOS[hash(slug) % HERO_PHOTOS.length];
export const HOME_HERO = by('mesh-insect');

export const ROOM_PHOTO: Record<string, Photo> = {
  '거실 큰 창': by('cm-green'), '방 창': by('windows-screens'), '주방·다용도실': by('mesh-insect'), '현관': by('cm-door'), '베란다': by('cm-snow'),
};
export const CAUSE_PHOTO: Record<string, Photo> = {
  '틀과 창 사이 틈': by('mesh-frame'), '닳은 모헤어': by('screen-old'), '찢어지거나 늘어난 망': by('screen-torn'),
  '레일에서 빠지는 방충망': by('mesh-drops'), '방충망 위치가 바뀐 경우': by('screen-lights'),
};
export const MESH_CLOSE = ['mesh-dark', 'mesh-drops', 'mesh-rain'].map(by);
export const MESH_PHOTO = by('mesh-frame');

// 사진 레일 — 슬러그마다 시작 위치를 돌려 같은 순서가 반복되지 않게
const RAIL = ['cm-green', 'mesh-insect', 'cm-sunset', 'screen-butterfly', 'cm-door', 'mesh-rain', 'cm-moth', 'screen-lights', 'cm-snow', 'mosquito', 'windows-screens', 'cm-bug-sky', 'mesh-dark', 'screen-torn'].map(by);
export const railPhotos = (seed: string, n = 8) => { const k = hash(seed) % RAIL.length; return [...RAIL.slice(k), ...RAIL.slice(0, k)].slice(0, n); };
