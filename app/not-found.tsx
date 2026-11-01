import Link from 'next/link';
import { Actions } from '../components/Common';
export default function NotFound() {
  return (<main><div className="wrap page-head"><h1 className="page-title">페이지를 찾을 수 없습니다</h1><p className="prose-p"><Link href="/area/">지역 목록</Link>에서 찾아보시거나 바로 접수하세요.</p><Actions /></div></main>);
}
