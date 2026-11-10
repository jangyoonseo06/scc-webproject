// api-docs/diary.yaml 의 emotion enum: [HAPPY, CALM, NORMAL, UPSET, TIRED, EXCITED]
// 서버에는 key 를 보내고, 화면에는 label 을 보여준다.
import happy from "../assets/design/emotion-happy.png";
import calm from "../assets/design/emotion-calm.png";
import normal from "../assets/design/emotion-normal.png";
import upset from "../assets/design/emotion-upset.png";
import tired from "../assets/design/emotion-tired.png";
import excited from "../assets/design/emotion-excited.png";

export const EMOTIONS = [
  { key: "HAPPY", label: "행복해요", face: happy, badge: "rose", icon: "sun" },
  { key: "CALM", label: "평온해요", face: calm, badge: "blue", icon: "cloud" },
  { key: "NORMAL", label: "보통이에요", face: normal, badge: "beige", icon: "cloud-sun" },
  { key: "UPSET", label: "속상해요", face: upset, badge: "blue", icon: "cloud-rain" },
  { key: "TIRED", label: "피곤해요", face: tired, badge: "lavender", icon: "moon" },
  { key: "EXCITED", label: "설레요", face: excited, badge: "rose", icon: "sparkles" },
];

const EMOTION_MAP = Object.fromEntries(EMOTIONS.map((e) => [e.key, e]));

export function getEmotion(key) {
  return EMOTION_MAP[key] ?? EMOTION_MAP.NORMAL;
}
