// 미리보기 전용 연결 파일 (vite.preview.config.js 에서만 사용)
// App.jsx 가 넘겨주는 props 를 새 화면(views/)에 연결한다.
// 예시 데이터는 넣지 않는다 → API 를 연결하기 전에는 빈 화면(EmptyState)이 보인다.
// 방 이름·멤버는 App.jsx 의 room 상태를 그대로 쓴다.
import {
  DiaryWriteView,
  MyDiariesView,
  TmiGuessView,
  TmiResultView,
  TmiWriteView,
  YesterdayView,
} from "../views";

// 바꾸지 않는 화면은 원래 것을 그대로 쓴다
export { MyRoomsPage, DiaryReadModal } from "../FeaturePages.jsx";

// App.jsx 의 멤버 { id, name } → API 모양 { userId, name }
function toMembers(room) {
  return (room?.members ?? []).map((m) => ({ userId: m.userId ?? m.id, name: m.name }));
}

export function YesterdayPage() {
  return <YesterdayView diaries={[]} />;
}

export function DiaryWritePage({ room }) {
  return <DiaryWriteView roomName={room?.name} members={toMembers(room)} />;
}

export function MyDiariesPage() {
  return <MyDiariesView diaries={[]} />;
}

export function TmiWritePage({ room }) {
  return <TmiWriteView roomName={room?.name} members={toMembers(room)} />;
}

export function TmiGuessPage({ room }) {
  return <TmiGuessView roomName={room?.name} tmis={[]} members={toMembers(room)} />;
}

export function TmiResultPage({ onBack, onAgain }) {
  return <TmiResultView result={null} onBack={onBack} onNext={onAgain} />;
}
