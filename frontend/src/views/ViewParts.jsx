// 여러 화면에서 같이 쓰는 작은 조각들
import { Cloud, CloudRain, CloudSun, Moon, Sparkles, Sun } from "lucide-react";
import { getEmotion } from "./emotions";

const BADGE_ICONS = {
  sun: Sun,
  cloud: Cloud,
  "cloud-sun": CloudSun,
  "cloud-rain": CloudRain,
  moon: Moon,
  sparkles: Sparkles,
};

// 페이지 상단 (제목 + 설명 + 오른쪽 그림)
export function ViewHero({ title, children, art, artClassName = "", className = "" }) {
  return (
    <section className={`vw-hero ${className}`}>
      <div className="vw-hero-copy">
        <h1>{title}</h1>
        {children}
      </div>

      {art && (
        <div className={`vw-hero-art ${artClassName}`} aria-hidden="true">
          <img src={art} alt="" />
        </div>
      )}
    </section>
  );
}

// 감정 얼굴 (시안 이미지)
export function EmotionFace({ emotion, size = 34 }) {
  const { face } = getEmotion(emotion);
  return (
    <img
      className="vw-emotion-face"
      src={face}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}

// 감정 배지 (어제의 우리 카드 오른쪽 위)
export function EmotionBadge({ emotion }) {
  const { label, badge, icon } = getEmotion(emotion);
  const Icon = BADGE_ICONS[icon] ?? Sun;

  return (
    <span className={`vw-emotion-badge ${badge}`}>
      <Icon size={15} strokeWidth={2.4} />
      {label}
    </span>
  );
}

// 방 정보 카드 (방 이름 + 인원수)
// members = GET /rooms/{roomId}/members 의 data.members
export function RoomInfoCard({ roomName, members = [], className = "" }) {
  if (!roomName) return null;

  return (
    <div className={`vw-room-card ${className}`}>
      <strong>{roomName}</strong>
      <span>{members.length}명의 멤버와 함께하고 있어요.</span>
    </div>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="vw-field-error" role="alert">
      {message}
    </p>
  );
}
