// 어제의 우리 — GET /rooms/{roomId}/diaries/yesterday
// props.diaries = 응답 data.diaries  [{ diaryId, date, content, emotion, authorName }]
// onReadDiary(diary) → 일기 상세(GET /diaries/{diaryId})로 이동할 때 사용
import { ArrowRight } from "lucide-react";
import heroArt from "../assets/design/yesterday-hero.png";
import lockCards from "../assets/design/lock-cards.png";
import paperSprig from "../assets/design/paper-sprig.png";
import { EmptyState } from "../components/status/StatusViews";
import { EmotionBadge, ViewHero } from "./ViewParts";
import { formatShort } from "./format";
import "./views.css";

export default function YesterdayView({ diaries = [], onReadDiary }) {
  return (
    <main className="vw-page">
      <ViewHero
        title={
          <>
            어제의 <span className="vw-rose">우리</span>
          </>
        }
        art={heroArt}
        artClassName="yesterday"
      >
        <p>
          어제, 친구들이 남긴 일기가 도착했어요.
          <br />
          지금, 그 마음을 열어보세요.
        </p>
        <p className="vw-hero-note">오늘 쓴 일기는 내일 공개돼요.</p>
      </ViewHero>

      {diaries.length === 0 ? (
        <EmptyState
          title="어제 도착한 일기가 없어요"
          description="오늘 쓴 일기는 내일 친구들에게 전달돼요."
        />
      ) : (
        <section className="vw-yesterday-grid">
          {diaries.map((diary, index) => (
            <article className="vw-yesterday-card" key={diary.diaryId}>
              <header>
                <div>
                  <strong>{diary.authorName}</strong>
                  <small>{formatShort(diary.date)}</small>
                </div>
                <EmotionBadge emotion={diary.emotion} />
              </header>

              <div className="vw-lined-paper">
                <span className="vw-tape" />
                <p>{diary.content}</p>
                <img className="vw-paper-sprig" src={paperSprig} alt="" aria-hidden="true" />
              </div>

              <button
                className={index === 0 ? "vw-btn primary block" : "vw-btn soft block"}
                onClick={() => onReadDiary?.(diary)}
              >
                읽기
                <ArrowRight size={18} />
              </button>
            </article>
          ))}
        </section>
      )}

      <section className="vw-tomorrow-banner">
        <img src={lockCards} alt="" aria-hidden="true" />
        <div>
          <strong>오늘 쓴 일기는 내일 공개돼요</strong>
          <p>지금 쓴 나의 이야기도, 내일 친구들에게 전달돼요.</p>
        </div>
      </section>
    </main>
  );
}
