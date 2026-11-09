import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Heart,
  LockKeyhole,
  Mail,
  PenLine,
  Save,
  Send,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";

import "./FeaturePages.css";

const SAMPLE_DIARIES = [
  {
    id: 1,
    author: "지민",
    title: "오늘은 유난히 하늘이 예뻤어",
    date: "2026. 11. 02",
    mood: "몽글몽글",
    text:
      "수업이 끝나고 집에 오는 길에 하늘이 정말 예뻤어. 별일 없는 하루였는데도 괜히 기분이 좋아지는 날이 있잖아.",
    tone: "sunset",
  },
  {
    id: 2,
    author: "서연",
    title: "작은 꽃을 발견한 날",
    date: "2026. 11. 02",
    mood: "포근해",
    text:
      "오늘은 길가에서 조그만 꽃을 봤어. 바쁘게 지나가다가 잠깐 멈춰서 보니까 생각보다 예쁘더라.",
    tone: "flower",
  },
  {
    id: 3,
    author: "민호",
    title: "조금 지쳤지만 괜찮아",
    date: "2026. 11. 02",
    mood: "차분해",
    text:
      "해야 할 일이 많아서 정신없는 하루였는데, 그래도 하나씩 끝내고 나니까 마음이 조금 편해졌어.",
    tone: "beige",
  },
];

const MY_DIARIES = [
  ...SAMPLE_DIARIES,
  {
    id: 4,
    author: "나",
    title: "오늘의 작은 용기",
    date: "2026. 10. 31",
    mood: "뿌듯해",
    text:
      "미루고 있던 일을 하나 끝냈다. 작은 일이지만 생각보다 기분이 좋았다.",
    tone: "blue",
  },
  {
    id: 5,
    author: "나",
    title: "새로운 계절에게",
    date: "2026. 10. 29",
    mood: "설레",
    text:
      "공기가 달라진 게 느껴졌다. 올해 남은 시간도 천천히 잘 보내고 싶다.",
    tone: "sky",
  },
];

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

export function YesterdayPage({
  onBack,
  onReadDiary,
  onWriteDiary,
}) {
  return (
    <main className="feature-page">
      <PageIntro
        eyebrow="어제의 우리"
        title={
          <>
            어제의{" "}
            <span className="rose-word">
              우리
            </span>
          </>
        }
        description="어제 친구들이 남긴 일기가 도착했어요. 지금, 그 마음을 열어보세요."
        onBack={onBack}
        right={
          <div className="stacked-paper-art">
            <PaperPhoto
              tone="sunset"
              small
            />
            <PaperPhoto
              tone="flower"
              small
            />
          </div>
        }
      />

      <section className="yesterday-grid">
        {SAMPLE_DIARIES.map(
          (diary) => (
            <article
              className="diary-preview-card"
              key={diary.id}
            >
              <div className="diary-preview-top">
                <PaperPhoto
                  tone={diary.tone}
                  small
                />

                <div>
                  <span>
                    {diary.author}
                  </span>

                  <small>
                    {diary.date}
                  </small>
                </div>
              </div>

              <h3>
                {diary.title}
              </h3>

              <p>
                {diary.text}
              </p>

              <button
                onClick={() =>
                  onReadDiary(diary)
                }
              >
                읽기
                <ArrowRight size={16} />
              </button>
            </article>
          )
        )}
      </section>

      <section className="tomorrow-lock-card">
        <div>
          <LockKeyhole size={24} />

          <div>
            <strong>
              오늘 쓴 일기는 내일 공개돼요
            </strong>

            <p>
              지금 쓴 마음은 하루 뒤
              친구들에게 전달됩니다.
            </p>
          </div>
        </div>

        <button
          onClick={onWriteDiary}
        >
          오늘의 일기 쓰기
        </button>
      </section>
    </main>
  );
}

export function DiaryWritePage({
  room,
  onBack,
  onGoMyDiaries,
}) {
  const moods = [
    "행복해",
    "몽글몽글",
    "설레요",
    "차분해",
    "피곤해",
  ];

  const [mood, setMood] =
    useState("몽글몽글");

  const [content, setContent] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [saved, setSaved] =
    useState(false);

  const submitDiary = () => {
    if (!content.trim()) {
      alert(
        "오늘의 일기를 먼저 작성해주세요."
      );
      return;
    }

    setSaved(true);
  };

  return (
    <main className="feature-page">
      <PageIntro
        eyebrow="하루 시차 교환일기"
        title={
          <>
            교환일기{" "}
            <span className="rose-word">
              쓰기
            </span>
          </>
        }
        description="오늘의 마음을 기록하고, 내일 친구에게 공유해요."
        onBack={onBack}
        right={
          <div className="paper-note-art">
            오늘의 이야기가
            <br />
            내일의 너에게 닿기를 ♡
          </div>
        }
      />

      <section className="write-room-strip">
        <PaperPhoto
          tone="sunset"
          small
        />

        <div>
          <strong>
            {room?.name ||
              "우당탕탕 우리셋"}
          </strong>

          <span>
            친구들과 함께 쓰는 교환일기
          </span>
        </div>
      </section>

      <section className="diary-write-card">
        <div className="write-date-row">
          <Calendar size={20} />

          <div>
            <span>
              오늘의 날짜
            </span>

            <strong>
              2026년 11월 3일
            </strong>
          </div>
        </div>

        <div className="write-section">
          <div className="write-section-title">
            <Heart size={18} />
            오늘의 감정은 어땠나요?
          </div>

          <div className="mood-row">
            {moods.map(
              (item) => (
                <button
                  key={item}
                  className={
                    mood === item
                      ? "mood-chip active"
                      : "mood-chip"
                  }
                  onClick={() =>
                    setMood(item)
                  }
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        <label className="write-section">
          <span className="write-section-title">
            <PenLine size={18} />
            오늘의 일기
          </span>

          <textarea
            rows={8}
            maxLength={1000}
            placeholder="오늘 하루는 어땠나요? 지금의 마음을 자유롭게 적어보세요."
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
          />

          <small>
            {content.length} / 1000
          </small>
        </label>

        <label className="write-section">
          <span className="write-section-title">
            <CircleHelp size={18} />
            친구에게 질문 한 줄
          </span>

          <input
            maxLength={200}
            placeholder="예) 요즘 가장 행복한 순간은 언제야?"
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
          />

          <small>
            {question.length} / 200
          </small>
        </label>

        {saved && (
          <div className="write-success">
            <Check size={18} />
            오늘의 일기가 저장되었어요.
            내일 친구들에게 공개돼요.
          </div>
        )}

        <div className="write-actions">
          <button
            className="soft-button"
            onClick={() =>
              setSaved(true)
            }
          >
            <Save size={17} />
            임시저장
          </button>

          <button
            className="feature-primary"
            onClick={submitDiary}
          >
            작성완료
            <ArrowRight size={17} />
          </button>
        </div>

        <button
          className="inline-history-button"
          onClick={onGoMyDiaries}
        >
          내가 쓴 일기 보기
        </button>
      </section>
    </main>
  );
}

export function MyDiariesPage({
  onBack,
  onReadDiary,
  onWrite,
}) {
  const [filter, setFilter] =
    useState("전체");

  return (
    <main className="feature-page">
      <PageIntro
        eyebrow="나의 기록"
        title={
          <>
            내가 쓴{" "}
            <span className="rose-word">
              일기
            </span>
          </>
        }
        description="지금까지 작성한 교환일기를 확인하고 다시 열어볼 수 있어요."
        onBack={onBack}
        right={
          <div className="notebook-art">
            <BookOpen size={48} />
          </div>
        }
      />

      <section className="diary-filter-bar">
        {[
          "전체",
          "공개됨",
          "내일 공개",
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter(item)
            }
          >
            {item}
          </button>
        ))}

        <button
          className="feature-primary small"
          onClick={onWrite}
        >
          새 일기 쓰기
        </button>
      </section>

      <section className="my-diary-grid">
        {MY_DIARIES.map(
          (diary, index) => (
            <article
              className="my-diary-card"
              key={diary.id}
            >
              <PaperPhoto
                tone={diary.tone}
              />

              <div className="my-diary-card-copy">
                <div className="my-diary-date">
                  <Calendar size={14} />

                  {diary.date}

                  <span
                    className={
                      index === 0
                        ? "status-wait"
                        : "status-open"
                    }
                  >
                    {index === 0
                      ? "내일 공개"
                      : "공개됨"}
                  </span>
                </div>

                <h3>
                  {diary.title}
                </h3>

                <p>
                  {diary.text}
                </p>

                <button
                  onClick={() =>
                    onReadDiary(
                      diary
                    )
                  }
                >
                  보기
                  <ArrowRight
                    size={15}
                  />
                </button>
              </div>
            </article>
          )
        )}
      </section>
    </main>
  );
}

export function TmiWritePage({
  room,
  onBack,
  onStartGuess,
}) {
  const [text, setText] =
    useState("");

  const [sent, setSent] =
    useState(false);

  const submitTmi = () => {
    if (!text.trim()) {
      alert(
        "TMI를 작성해주세요."
      );
      return;
    }

    setSent(true);
  };

  return (
    <main className="feature-page">
      <PageIntro
        eyebrow="익명 TMI"
        title={
          <>
            오늘의{" "}
            <span className="rose-word">
              TMI
            </span>{" "}
            작성
          </>
        }
        description="지금 떠오르는 소소한 이야기를 익명으로 적어보세요."
        onBack={onBack}
        right={
          <div className="paper-note-art tmi">
            오늘의 이야기는
            <br />
            누가 썼을까요?
          </div>
        }
      />

      <section className="write-room-strip">
        <PaperPhoto
          tone="sunset"
          small
        />

        <div>
          <strong>
            {room?.name ||
              "우당탕탕 우리셋"}
          </strong>

          <span>
            오늘의 익명 TMI를 준비하고
            있어요.
          </span>
        </div>
      </section>

      <section className="tmi-write-card">
        <div className="tmi-lock-notice">
          <LockKeyhole size={20} />

          <div>
            <strong>
              작성한 TMI는 익명으로
              공개돼요.
            </strong>

            <span>
              친구들은 작성자를 추리하게
              됩니다.
            </span>
          </div>
        </div>

        <textarea
          rows={7}
          maxLength={500}
          placeholder="지금 떠오르는 TMI를 자유롭게 적어보세요."
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
        />

        <small>
          {text.length} / 500
        </small>

        {sent && (
          <div className="write-success">
            <Check size={18} />
            TMI가 등록되었어요.
          </div>
        )}

        <button
          className="feature-primary wide"
          onClick={submitTmi}
        >
          TMI 보내기
          <Send size={17} />
        </button>

        <button
          className="inline-history-button"
          onClick={onStartGuess}
        >
          TMI 추리 화면 미리보기
        </button>
      </section>
    </main>
  );
}

export function TmiGuessPage({
  room,
  onBack,
  onShowResult,
}) {
  const candidates = [
    "지민",
    "서연",
    "민호",
    "수빈",
  ];

  const [
    selected,
    setSelected,
  ] = useState("");

  return (
    <main className="feature-page tmi-guess-page">
      <PageIntro
        eyebrow={
          room?.name ||
          "우당탕탕 우리셋"
        }
        title={
          <>
            이 TMI는{" "}
            <span className="rose-word">
              누구의 이야기
            </span>
            일까요?
          </>
        }
        description="친구의 이야기를 읽고 작성자를 맞혀보세요."
        onBack={onBack}
      />

      <section className="guess-paper">
        <span className="guess-tape"></span>

        <div className="guess-stamp">
          ?
        </div>

        <p>
          오늘 아침 알람을 세 번이나
          껐는데
          <br />
          결국 지각은 안 했다!
          <br />
          그리고 점심에 디저트를 두 개
          먹었다.
        </p>
      </section>

      <div className="guess-progress">
        1 / 4
      </div>

      <section className="candidate-grid">
        {candidates.map(
          (name, index) => (
            <button
              key={name}
              className={
                selected === name
                  ? "candidate-card active"
                  : "candidate-card"
              }
              onClick={() =>
                setSelected(name)
              }
            >
              <div
                className={`candidate-avatar candidate-${
                  index + 1
                }`}
              >
                {name.charAt(0)}
              </div>

              <strong>
                {name}
              </strong>
            </button>
          )
        )}
      </section>

      <button
        className="feature-primary guess-submit"
        disabled={!selected}
        onClick={onShowResult}
      >
        제출하기
        <ArrowRight size={17} />
      </button>
    </main>
  );
}

export function TmiResultPage({
  onBack,
  onAgain,
}) {
  return (
    <main className="feature-page">
      <PageIntro
        eyebrow="익명 TMI"
        title={
          <>
            <span className="rose-word">
              TMI
            </span>{" "}
            결과
          </>
        }
        description="친구들이 쓴 익명 TMI, 누가 쓴 이야기였을까요?"
        onBack={onBack}
        right={
          <div className="result-sparkle">
            <Sparkles size={54} />
          </div>
        }
      />

      <section className="result-top-grid">
        <article className="result-answer-card">
          <span>
            이 TMI의 작성자는
          </span>

          <div className="result-author">
            <PaperPhoto
              tone="sunset"
              small
            />

            <div>
              <h2>
                우당탕탕 우리셋의
                지민이었습니다!
              </h2>

              <p>
                친구들이 얼마나 잘
                맞혔는지 확인해보세요.
              </p>
            </div>
          </div>

          <blockquote>
            “오늘 아침 알람을 세 번이나
            껐는데 결국 지각은 안 했다!”
          </blockquote>
        </article>

        <article className="result-rate-card">
          <h3>
            친구별 정답률
          </h3>

          {[
            ["혜원", 75],
            ["민호", 50],
            ["서연", 25],
          ].map(
            (
              [name, score],
              index
            ) => (
              <div
                className="rate-row"
                key={name}
              >
                <span
                  className={`rate-avatar rate-${
                    index + 1
                  }`}
                >
                  {name.charAt(0)}
                </span>

                <strong>
                  {name}
                </strong>

                <div className="rate-track">
                  <span
                    style={{
                      width: `${score}%`,
                    }}
                  ></span>
                </div>

                <small>
                  {score}%
                </small>
              </div>
            )
          )}
        </article>
      </section>

      <section className="result-bottom-grid">
        <article className="result-mini-card rose">
          <Trophy size={22} />

          <div>
            <span>
              정답을 맞힌 친구
            </span>

            <strong>2명</strong>
          </div>
        </article>

        <article className="result-mini-card blue">
          <Clock3 size={22} />

          <div>
            <span>
              가장 빠른 정답
            </span>

            <strong>
              혜원
            </strong>
          </div>
        </article>
      </section>

      <div className="result-actions">
        <button
          className="soft-button"
          onClick={onBack}
        >
          이전
        </button>

        <button
          className="feature-primary"
          onClick={onAgain}
        >
          다른 TMI 보기
          <ArrowRight size={17} />
        </button>
      </div>
    </main>
  );
}

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
          <PaperPhoto
            tone={diary.tone}
            small
          />

          <div>
            <span>
              {diary.author}의 교환일기
            </span>

            <h2>
              {diary.title}
            </h2>

            <small>
              {diary.date}
            </small>
          </div>
        </div>

        <div className="diary-modal-paper">
          <span className="diary-modal-tape"></span>

          <p>
            {diary.text}
          </p>

          <div className="diary-modal-sign">
            오늘의 마음 · {diary.mood}
          </div>
        </div>

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