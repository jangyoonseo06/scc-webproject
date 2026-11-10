// 오늘의 TMI 작성 — POST /tmi
// onSubmit(payload) 의 payload 는 TmiRequest 모양: { content, isFake }
// isFake 는 명세상 필수지만 시안에 선택 UI 가 없어서 항상 false 로 보낸다.
import { useState } from "react";
import { ArrowRight, LockKeyhole, Users } from "lucide-react";
import heroArt from "../assets/design/tmi-write-hero.png";
import { FieldError, RoomInfoCard, ViewHero } from "./ViewParts";
import "./views.css";

// api-docs/tmi.yaml 제한값
const CONTENT_MAX = 1000;

export default function TmiWriteView({ roomName, members = [], submitting = false, onSubmit }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!content.trim()) {
      setError("TMI 내용을 입력해주세요.");
      return;
    }
    setError("");
    onSubmit?.({ content: content.trim(), isFake: false });
  };

  return (
    <main className="vw-page">
      <ViewHero
        title={
          <>
            오늘의 <span className="vw-rose">TMI</span> 작성
          </>
        }
        art={heroArt}
        artClassName="tmi-write"
      >
        <p>
          지금 떠오르는 소소한 이야기, 고민, 생각, 아무거나 좋아요.
          <br />
          익명으로 작성해서 친구들에게 보내보세요.
        </p>
        <RoomInfoCard roomName={roomName} members={members} className="vw-room-card-hero" />
      </ViewHero>

      <section className="vw-sheet">
        <div className="vw-notice">
          <span className="vw-notice-icon">
            <LockKeyhole size={20} />
          </span>
          <div>
            <strong>작성한 TMI는 익명으로 친구들에게 전달돼요.</strong>
            <span>누가 작성했는지는 바로 공개되지 않아요.</span>
          </div>
        </div>

        <div className="vw-field">
          <textarea
            className="tall"
            rows={6}
            maxLength={CONTENT_MAX}
            placeholder="지금 떠오르는 TMI를 자유롭게 적어보세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-invalid={Boolean(error)}
          />
          <small className="vw-count">
            {content.length} / {CONTENT_MAX}
          </small>
          <FieldError message={error} />
        </div>

        <button className="vw-btn primary vw-tmi-send" disabled={submitting} onClick={submit}>
          TMI 보내기
          <ArrowRight size={20} />
        </button>

        <p className="vw-tmi-hint">
          <Users size={20} />
          보낸 TMI는 친구들이 읽고, 나중에 누가 썼는지 맞춰볼 거예요!
        </p>
      </section>
    </main>
  );
}
