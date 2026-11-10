// 내가 쓴 일기
// ⚠️ 내 일기 "목록" API 는 아직 명세에 없음. 일기 하나의 모양은 GET /diaries/{diaryId} 응답 기준:
//   { diaryId, date, content, questionToFriend, emotion, authorName }
// 공개 상태는 명세에 필드가 없어서 날짜로 계산한다 (오늘 쓴 일기 = 내일 공개).
// 수정: PUT /diaries/{diaryId}   삭제: DELETE /diaries/{diaryId}
import { useState } from "react";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import heroArt from "../assets/design/my-diaries-hero.png";
import { EmptyState } from "../components/status/StatusViews";
import { ViewHero } from "./ViewParts";
import { formatDot, todayISO } from "./format";
import "./views.css";

const TABS = [
  { key: "all", label: "전체" },
  { key: "open", label: "공개됨" },
  { key: "wait", label: "내일 공개" },
];

function statusOf(diary, today) {
  return diary.date >= today
    ? { key: "wait", label: "내일 공개" }
    : { key: "open", label: "공개됨" };
}

export default function MyDiariesView({ diaries = [], today = todayISO(), onRead, onEdit, onDelete }) {
  const [tab, setTab] = useState("all");

  const rows = diaries.map((diary) => ({ diary, status: statusOf(diary, today) }));
  const counts = {
    all: rows.length,
    open: rows.filter((r) => r.status.key === "open").length,
    wait: rows.filter((r) => r.status.key === "wait").length,
  };
  const visible = tab === "all" ? rows : rows.filter((r) => r.status.key === tab);

  return (
    <main className="vw-page">
      <ViewHero
        title={
          <>
            내가 쓴 <span className="vw-rose">일기</span>
          </>
        }
        art={heroArt}
        artClassName="my-diaries"
        className="slim"
      >
        <p>지금까지 작성한 교환일기를 확인하고, 수정하거나 삭제할 수 있어요.</p>
      </ViewHero>

      <div className="vw-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={tab === item.key}
            className={tab === item.key ? "active" : ""}
            onClick={() => setTab(item.key)}
          >
            {item.label} ({counts[item.key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState title="아직 작성한 일기가 없어요" description="오늘의 마음을 기록해보세요." />
      ) : (
        <section className="vw-my-diary-grid">
          {visible.map(({ diary, status }) => (
            <article className="vw-my-diary-card" key={diary.diaryId}>
              <div className="vw-my-diary-meta">
                {formatDot(diary.date)}
                <span className={`vw-status ${status.key}`}>{status.label}</span>
              </div>

              <p>{diary.content}</p>

              <div className="vw-my-diary-actions">
                <button className="vw-chip rose" onClick={() => onRead?.(diary)}>
                  <Eye size={16} />
                  보기
                </button>
                <button className="vw-chip" onClick={() => onEdit?.(diary)}>
                  <PencilLine size={16} />
                  수정
                </button>
                <button className="vw-chip" onClick={() => onDelete?.(diary)}>
                  <Trash2 size={16} />
                  삭제
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
