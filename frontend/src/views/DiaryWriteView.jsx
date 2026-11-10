// 교환일기 쓰기 — POST /diaries
// onSubmit(payload) 의 payload 는 DiaryRequest 모양:
//   { content, questionToFriend, date, emotion, isTemporary }
import { useState } from "react";
import { ArrowRight, Calendar, Info, MessageCircleMore, PencilLine } from "lucide-react";
import heroArt from "../assets/design/diary-write-hero.png";
import { EMOTIONS } from "./emotions";
import { EmotionFace, FieldError, RoomInfoCard, ViewHero } from "./ViewParts";
import { formatLong, todayISO } from "./format";
import "./views.css";

// api-docs/diary.yaml 제한값
const CONTENT_MAX = 2000;
const QUESTION_MAX = 100;

export default function DiaryWriteView({
  roomName,
  members = [],
  date = todayISO(),
  initialDiary,
  submitting = false,
  onSubmit,
}) {
  const [emotion, setEmotion] = useState(initialDiary?.emotion ?? "CALM");
  const [content, setContent] = useState(initialDiary?.content ?? "");
  const [questionToFriend, setQuestionToFriend] = useState(initialDiary?.questionToFriend ?? "");
  const [errors, setErrors] = useState({});

  const submit = (isTemporary) => {
    const next = {};
    if (!content.trim()) next.content = "오늘의 일기를 입력해주세요.";
    if (!questionToFriend.trim()) next.questionToFriend = "친구에게 질문 한 줄을 입력해주세요.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit?.({
      content: content.trim(),
      questionToFriend: questionToFriend.trim(),
      date,
      emotion,
      isTemporary,
    });
  };

  return (
    <main className="vw-page">
      <ViewHero
        title={
          <>
            교환일기 <span className="vw-rose">쓰기</span>
          </>
        }
        art={heroArt}
        artClassName="diary-write"
        className="slim"
      >
        <p>오늘의 마음을 기록하고, 내일 친구에게 공유해요.</p>
      </ViewHero>

      <section className="vw-sheet">
        <RoomInfoCard roomName={roomName} members={members} className="vw-room-card-pink" />

        <div className="vw-date-card">
          <span className="vw-date-icon">
            <Calendar size={24} />
          </span>
          <div>
            <small>오늘의 날짜</small>
            <strong>{formatLong(date)}</strong>
          </div>
        </div>

        <div className="vw-form-row">
          <div className="vw-form-label">
            <PencilLine size={20} />
            오늘의 감정은 어땠나요?
          </div>

          <div className="vw-emotion-picker" role="radiogroup" aria-label="오늘의 감정">
            {EMOTIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="radio"
                aria-checked={emotion === item.key}
                className={emotion === item.key ? "active" : ""}
                onClick={() => setEmotion(item.key)}
              >
                <EmotionFace emotion={item.key} size={34} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <label className="vw-form-row">
          <span className="vw-form-label">
            <PencilLine size={20} />
            오늘의 일기
          </span>

          <span className="vw-field">
            <textarea
              rows={6}
              maxLength={CONTENT_MAX}
              placeholder={"오늘 하루는 어땠나요?\n지금의 마음을 자유롭게 적어보세요."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-invalid={Boolean(errors.content)}
            />
            <small className="vw-count">
              {content.length} / {CONTENT_MAX}
            </small>
            <FieldError message={errors.content} />
          </span>
        </label>

        <label className="vw-form-row">
          <span className="vw-form-label">
            <MessageCircleMore size={20} />
            <span>
              친구에게 질문 한 줄
              <small>친구에게 궁금한 것이 있나요?</small>
            </span>
          </span>

          <span className="vw-field">
            <span className="vw-input">
              <input
                maxLength={QUESTION_MAX}
                placeholder="예) 요즘 가장 즐거운 순간은 언제야?"
                value={questionToFriend}
                onChange={(e) => setQuestionToFriend(e.target.value)}
                aria-invalid={Boolean(errors.questionToFriend)}
              />
              <small>
                {questionToFriend.length} / {QUESTION_MAX}
              </small>
            </span>
            <FieldError message={errors.questionToFriend} />
          </span>
        </label>

        <footer className="vw-write-footer">
          <p>
            <Info size={20} />
            오늘 작성한 일기는 내일 친구들에게 공개돼요. 조금만 기다려주세요!
          </p>

          <div className="vw-write-actions">
            <button className="vw-btn soft" disabled={submitting} onClick={() => submit(true)}>
              임시저장
            </button>
            <button className="vw-btn primary" disabled={submitting} onClick={() => submit(false)}>
              작성완료
              <ArrowRight size={20} />
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
