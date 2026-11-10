import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Mail,
  Users,
  X,
} from "lucide-react";

import "./FeaturePages.css";
import {
  DiaryWriteView,
  MyDiariesView,
  TmiGuessView,
  TmiResultView,
  TmiWriteView,
  YesterdayView,
} from "./views";
import { getEmotion } from "./views/emotions";

function PaperPhoto({ tone = "sunset", small = false }) {
  return (
    <div
      className={`feature-photo feature-photo-${tone} ${
        small ? "small" : ""
      }`}
    />
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
  onBack,
  right,
}) {
  return (
    <section className="feature-page-intro">
      <div>
        {onBack && (
          <button
            className="feature-back"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            돌아가기
          </button>
        )}

        {eyebrow && (
          <span className="feature-eyebrow">
            {eyebrow}
          </span>
        )}

        <h1>{title}</h1>

        {description && <p>{description}</p>}
      </div>

      {right && (
        <div className="feature-intro-art">
          {right}
        </div>
      )}
    </section>
  );
}

export function MyRoomsPage({
  room,
  onOpenRoom,
  onCreateRoom,
  onJoinRoom,
  onCopyCode,
}) {
  return (
    <main className="feature-page">
      <PageIntro
        eyebrow="내 방"
        title="우리만의 교환함"
        description="친구들과 함께 쓰고 있는 방을 한곳에서 확인해보세요."
        right={
          <div className="mini-envelope-scene">
            <Mail size={46} />
            <span>
              오늘의 이야기를 모아두는 곳
            </span>
          </div>
        }
      />

      <section className="rooms-toolbar">
        <div>
          <strong>참여 중인 방</strong>
          <span>
            {room ? "1개" : "0개"}
          </span>
        </div>

        <div className="rooms-toolbar-actions">
          <button
            className="soft-button"
            onClick={onJoinRoom}
          >
            초대 코드로 참여
          </button>

          <button
            className="feature-primary"
            onClick={onCreateRoom}
          >
            새 방 만들기
          </button>
        </div>
      </section>

      {!room ? (
        <section className="rooms-empty-card">
          <div className="rooms-empty-icon">
            <Mail size={38} />
          </div>

          <h2>
            아직 참여한 방이 없어요.
          </h2>

          <p>
            친구와 새로운 방을 만들거나
            초대 코드로 참여해보세요.
          </p>

          <div>
            <button
              className="feature-primary"
              onClick={onCreateRoom}
            >
              방 만들기
            </button>

            <button
              className="soft-button"
              onClick={onJoinRoom}
            >
              초대 코드 입력
            </button>
          </div>
        </section>
      ) : (
        <section className="rooms-list-grid">
          <article className="rooms-list-card">
            <button
              className="rooms-card-main"
              onClick={onOpenRoom}
            >
              <PaperPhoto tone="sunset" />

              <div className="rooms-card-copy">
                <span className="feature-pill">
                  진행 중
                </span>

                <h2>{room.name}</h2>

                <p>
                  서로의 일기와 TMI를
                  교환하고 있어요.
                </p>

                <div className="rooms-card-meta">
                  <span>
                    <Users size={16} />
                    {room.members.length}명
                  </span>

                  <span>
                    <Calendar size={16} />
                    {room.createdAt}
                  </span>
                </div>
              </div>

              <ChevronRight size={24} />
            </button>

            <div className="rooms-code-row">
              <span>초대 코드</span>

              <strong>
                {room.inviteCode}
              </strong>

              <button
                onClick={onCopyCode}
                aria-label="초대 코드 복사"
              >
                <Copy size={18} />
              </button>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* 일기 · TMI 화면 (시안 기준)                                          */
/* 화면 모양은 views/ 에 있고, 여기서는 App.jsx 가 넘겨주는 props 를     */
/* 연결한다. 데이터는 API 를 연결하면 채워진다 (그 전에는 빈 화면).       */
/* ------------------------------------------------------------------ */

// App.jsx 의 멤버 { id, name } → API 모양 { userId, name }
function toMembers(room) {
  return (room?.members ?? []).map((member) => ({
    userId: member.userId ?? member.id,
    name: member.name,
  }));
}

// 어제의 우리 — GET /rooms/{roomId}/diaries/yesterday → data.diaries
export function YesterdayPage({ onReadDiary, diaries = [] }) {
  return <YesterdayView diaries={diaries} onReadDiary={onReadDiary} />;
}

// 교환일기 쓰기 — POST /diaries (onSubmit 으로 DiaryRequest 모양이 넘어온다)
export function DiaryWritePage({ room, onSubmit, submitting }) {
  return (
    <DiaryWriteView
      roomName={room?.name}
      members={toMembers(room)}
      onSubmit={onSubmit}
      submitting={submitting}
    />
  );
}

// 내가 쓴 일기 — 목록 API 는 명세에 아직 없음
export function MyDiariesPage({ onReadDiary, onWrite, onDelete, diaries = [] }) {
  return (
    <MyDiariesView
      diaries={diaries}
      onRead={onReadDiary}
      onEdit={onWrite}
      onDelete={onDelete}
    />
  );
}

// TMI 작성 — POST /tmi (onSubmit 으로 { content, isFake: false } 가 넘어온다)
export function TmiWritePage({ room, onSubmit, submitting }) {
  return (
    <TmiWriteView
      roomName={room?.name}
      members={toMembers(room)}
      onSubmit={onSubmit}
      submitting={submitting}
    />
  );
}

// TMI 추리 — GET /rooms/{roomId}/tmi, POST /tmi/{tmiId}/guess
export function TmiGuessPage({ room, onShowResult, tmis = [], myUserId, onSubmit }) {
  return (
    <TmiGuessView
      roomName={room?.name}
      tmis={tmis}
      members={toMembers(room)}
      myUserId={myUserId}
      onSubmit={(body) => {
        onSubmit?.(body);
        onShowResult?.();
      }}
    />
  );
}

// TMI 결과 — POST /tmi/{tmiId}/guess 응답 data
export function TmiResultPage({ room, onBack, onAgain, result = null, tmiContent }) {
  return (
    <TmiResultView
      result={result}
      tmiContent={tmiContent}
      members={toMembers(room)}
      onBack={onBack}
      onNext={onAgain}
    />
  );
}

// 일기 읽기 모달 — GET /diaries/{diaryId} 응답 data
//   { diaryId, date, content, questionToFriend, emotion, authorName }
export function DiaryReadModal({
  diary,
  onClose,
}) {
  return (
    <div
      className="diary-modal-overlay"
      onClick={onClose}
    >
      <article
        className="diary-read-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          className="diary-modal-close"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <div className="diary-modal-header">
          <div>
            <span>
              {diary.authorName}의 교환일기
            </span>

            <small>
              {diary.date}
            </small>
          </div>
        </div>

        <div className="diary-modal-paper">
          <span className="diary-modal-tape"></span>

          <p>
            {diary.content}
          </p>

          <div className="diary-modal-sign">
            오늘의 마음 · {getEmotion(diary.emotion).label}
          </div>
        </div>

        {diary.questionToFriend && (
          <p className="diary-modal-question">
            {diary.authorName}의 질문 · {diary.questionToFriend}
          </p>
        )}

        <button
          className="feature-primary wide"
          onClick={onClose}
        >
          잘 읽었어요
          <Check size={17} />
        </button>
      </article>
    </div>
  );
}
