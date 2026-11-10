// TMI 결과
//   result     = POST /tmi/{tmiId}/guess 응답 data  { isCorrect, actualAuthorName, accumulatedScore }
//   tmiContent = 방금 추리한 TMI 내용 (GET /rooms/{roomId}/tmi 의 content)
//   members    = GET /rooms/{roomId}/members 의 data.members (인원수 표시)
// ※ 시안의 "친구별 정답률", "맞힌/못 맞힌 친구"는 명세에 없어서 넣지 않았다.
import { ArrowLeft, ArrowRight } from "lucide-react";
import heroArt from "../assets/design/tmi-result-hero.png";
import { ViewHero } from "./ViewParts";
import "./views.css";

export default function TmiResultView({ tmiContent, result, members = [], onBack, onNext }) {
  return (
    <main className="vw-page">
      <ViewHero
        title={
          <>
            <span className="vw-rose">TMI</span> 결과
          </>
        }
        art={heroArt}
        artClassName="tmi-result"
      >
        <p>
          친구들이 쓴 익명의 TMI,
          <br />
          누가 쓴 이야기였을까요?
          <br />
          지금 바로 결과를 확인해 보세요!
        </p>
      </ViewHero>

      <article className="vw-result-answer">
        <span className="vw-result-chip">이 TMI의 작성자는</span>

        <div className="vw-result-author">
          <h2>
            <span className="vw-rose">{result?.actualAuthorName}</span> 님이었습니다!
          </h2>
          <p>{members.length}명의 멤버와 함께하고 있어요.</p>
        </div>

        <blockquote className="vw-result-quote">{tmiContent}</blockquote>
      </article>

      <div className="vw-result-actions">
        <button className="vw-btn outline" onClick={onBack}>
          <ArrowLeft size={20} />
          이전
        </button>
        <button className="vw-btn primary" onClick={onNext}>
          다른 결과 보기
          <ArrowRight size={20} />
        </button>
      </div>
    </main>
  );
}
