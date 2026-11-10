// 백엔드 없이 새 화면을 확인하는 미리보기 (개발용, 배포 빌드에는 포함되지 않음)
// 실행: npm run dev → http://localhost:5173/preview.html
import { useState } from "react";
import { Mail } from "lucide-react";
import {
  DiaryWriteView,
  MyDiariesView,
  TmiGuessView,
  TmiResultView,
  TmiWriteView,
  YesterdayView,
} from "../views";
import { EmptyState, ErrorState, LoadingState } from "../components/status/StatusViews";
import { useToast } from "../components/status/toastContext";
import * as mock from "./mockData";

const SCREENS = [
  { key: "yesterday", label: "어제의 우리", nav: "main" },
  { key: "diary-write", label: "일기 쓰기", nav: "diary" },
  { key: "my-diaries", label: "내가 쓴 일기", nav: "diary" },
  { key: "tmi-write", label: "TMI 작성", nav: "tmi" },
  { key: "tmi-guess", label: "TMI 추리", nav: "tmi" },
  { key: "tmi-result", label: "TMI 결과", nav: "tmi" },
  { key: "status", label: "상태 UI", nav: "" },
];

function readScreen() {
  const key = new URLSearchParams(window.location.search).get("s");
  return SCREENS.some((s) => s.key === key) ? key : "yesterday";
}

// App.jsx 의 Header 와 같은 마크업 (모양 확인용)
function PreviewHeader({ nav }) {
  const items = [
    ["main", "메인"],
    ["room", "내 방"],
    ["diary", "일기"],
    ["tmi", "TMI"],
  ];
  return (
    <header className="header">
      <div className="header-inner">
        <span className="logo">
          <span className="logo-icon">
            <Mail size={29} strokeWidth={2} />
          </span>
          <span>교환함</span>
        </span>
        <nav className="nav">
          {items.map(([key, label]) => (
            <span key={key} className={nav === key ? "nav-item active" : "nav-item"}>
              {label}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}

function StatusDemo() {
  const toast = useToast();
  return (
    <main className="vw-page" style={{ paddingTop: 30 }}>
      <h2>로딩</h2>
      <LoadingState message="일기를 불러오고 있어요" />
      <h2>빈 데이터</h2>
      <EmptyState
        title="아직 작성한 일기가 없어요"
        description="오늘의 마음을 기록해보세요."
        actionLabel="일기 쓰기"
        onAction={() => toast.info("일기 쓰기로 이동")}
      />
      <h2>오류 + 다시 시도</h2>
      <ErrorState
        message="서버와 연결하지 못했어요. 잠시 후 다시 시도해주세요."
        onRetry={() => toast.info("다시 불러오는 중...")}
      />
      <h2>토스트</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="vw-btn soft" onClick={() => toast.success("일기를 보냈어요")}>
          성공
        </button>
        <button className="vw-btn soft" onClick={() => toast.error("저장하지 못했어요. 다시 시도해주세요.")}>
          오류
        </button>
        <button className="vw-btn soft" onClick={() => toast.info("초대 코드가 복사되었어요")}>
          안내
        </button>
      </div>
    </main>
  );
}

export default function PreviewApp() {
  const toast = useToast();
  const [screen, setScreenState] = useState(readScreen);
  const [guessIndex, setGuessIndex] = useState(0);
  const readDiary = (diary) => toast.info(`GET /diaries/${diary.diaryId}`);

  const setScreen = (key) => {
    setScreenState(key);
    window.history.replaceState(null, "", `?s=${key}`);
    window.scrollTo(0, 0);
  };

  const current = SCREENS.find((s) => s.key === screen);
  const guessable = mock.TMIS.filter((t) => !t.isMine && !t.hasGuessed);

  return (
    <div className="app">
      <PreviewHeader nav={current.nav} />

      {screen === "yesterday" && (
        <YesterdayView diaries={mock.YESTERDAY_DIARIES} onReadDiary={readDiary} />
      )}

      {screen === "diary-write" && (
        <DiaryWriteView
          roomName={mock.ROOM_NAME}
          members={mock.MEMBERS}
          onSubmit={(payload) => {
            console.info("[POST /diaries]", payload);
            toast.success(payload.isTemporary ? "임시저장했어요" : "오늘의 일기를 보냈어요");
          }}
        />
      )}

      {screen === "my-diaries" && (
        <MyDiariesView
          diaries={mock.MY_DIARIES}
          onRead={readDiary}
          onEdit={() => setScreen("diary-write")}
          onDelete={(diary) => toast.info(`DELETE /diaries/${diary.diaryId}`)}
        />
      )}

      {screen === "tmi-write" && (
        <TmiWriteView
          roomName={mock.ROOM_NAME}
          members={mock.MEMBERS}
          onSubmit={(payload) => {
            console.info("[POST /tmi]", payload);
            toast.success("TMI를 익명으로 보냈어요");
          }}
        />
      )}

      {screen === "tmi-guess" && (
        <TmiGuessView
          key={guessIndex}
          roomName={mock.ROOM_NAME}
          tmis={mock.TMIS}
          members={mock.MEMBERS}
          myUserId={mock.ME.userId}
          currentIndex={guessIndex}
          onSubmit={(body) => {
            console.info(`[POST /tmi/${body.tmiId}/guess]`, { guessedUserId: body.guessedUserId });
            setScreen("tmi-result");
          }}
        />
      )}

      {screen === "tmi-result" && (
        <TmiResultView
          tmiContent={guessable[guessIndex]?.content}
          result={mock.GUESS_RESULT}
          members={mock.MEMBERS}
          onBack={() => setScreen("tmi-guess")}
          onNext={() => {
            setGuessIndex((i) => (i + 1) % guessable.length);
            setScreen("tmi-guess");
          }}
        />
      )}

      {screen === "status" && <StatusDemo />}

      <nav className="pv-switcher" aria-label="미리보기 화면 선택">
        {SCREENS.map((s) => (
          <button
            key={s.key}
            className={s.key === screen ? "active" : ""}
            onClick={() => setScreen(s.key)}
          >
            {s.label}
          </button>
        ))}
        <a href="/app-preview.html">앱 전체</a>
      </nav>
    </div>
  );
}
