// 날짜 표시 도우미 (API 날짜 형식: "YYYY-MM-DD")
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function parse(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d, day: WEEKDAYS[new Date(y, m - 1, d).getDay()] };
}

// 오늘 날짜를 API 형식으로
export function todayISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "3월 28일 (목)"
export function formatShort(iso) {
  const { m, d, day } = parse(iso);
  return `${m}월 ${d}일 (${day})`;
}

// "2024년 5월 20일 (월)"
export function formatLong(iso) {
  const { y } = parse(iso);
  return `${y}년 ${formatShort(iso)}`;
}

// "2024. 04. 27 (토)"
export function formatDot(iso) {
  const [y, m, d] = iso.split("-");
  return `${y}. ${m}. ${d} (${parse(iso).day})`;
}
