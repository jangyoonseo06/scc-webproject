// TMI 추리
//   tmis    = GET /rooms/{roomId}/tmi 의 data.tmis       [{ tmiId, content, isMine, hasGuessed }]
//   members = GET /rooms/{roomId}/members 의 data.members [{ userId, name }]
//   myUserId = GET /auth/me 의 data.userId (후보에서 나를 뺄 때 사용)
// onSubmit({ tmiId, guessedUserId }) → POST /tmi/{tmiId}/guess  body: { guessedUserId }
import { useState } from "react";
import { ArrowRight, Users } from "lucide-react";
import letterArt from "../assets/design/tmi-letter.png";
import { EmptyState } from "../components/status/StatusViews";
import "./views.css";

export default function TmiGuessView({
  roomName,
  tmis = [],
  members = [],
  myUserId,
  currentIndex = 0,
  submitting = false,
  onSubmit,
}) {
  // 내 TMI(isMine) 와 이미 투표한 TMI(hasGuessed) 는 추리할 수 없다
  const queue = tmis.filter((tmi) => !tmi.isMine && !tmi.hasGuessed);
  const candidates = members.filter((member) => member.userId !== myUserId);
  const current = queue[currentIndex];

  const [guessedUserId, setGuessedUserId] = useState(null);

  return (
    <main className="vw-page vw-guess">
      <div className="vw-guess-head">
        <span className="vw-room-chip">
          <Users size={18} />
          {roomName}
        </span>
        <h1>
          이 TMI는 <span className="vw-rose">누구의 이야기</span>일까요?
        </h1>
      </div>

      {!current ? (
        <EmptyState
          title="지금 맞힐 수 있는 TMI가 없어요"
          description="친구들이 새 TMI를 보내면 여기에서 맞혀볼 수 있어요."
        />
      ) : (
        <>
          <section className="vw-guess-letter">
            <img src={letterArt} alt="" aria-hidden="true" />
            <p>{current.content}</p>
          </section>

          <div className="vw-guess-progress">
            <b>{currentIndex + 1}</b> / {queue.length}
          </div>

          <section className="vw-candidates" role="radiogroup" aria-label="작성자 선택">
            {candidates.map((member, index) => {
              const active = guessedUserId === member.userId;
              return (
                <button
                  key={member.userId}
                  role="radio"
                  aria-checked={active}
                  className={`vw-candidate tone-${index % 4} ${active ? "active" : ""}`}
                  onClick={() => setGuessedUserId(member.userId)}
                >
                  <strong>{member.name}</strong>
                </button>
              );
            })}
          </section>

          <button
            className="vw-btn primary vw-guess-submit"
            disabled={guessedUserId == null || submitting}
            onClick={() => onSubmit?.({ tmiId: current.tmiId, guessedUserId })}
          >
            제출하기
            <ArrowRight size={20} />
          </button>
        </>
      )}
    </main>
  );
}
