// 미리보기 전용 가짜 데이터 — 모양은 api-docs/*.yaml 응답 data 와 같다.
import { todayISO } from "../views/format";

const today = todayISO();
const daysAgo = (n) => todayISO(new Date(Date.now() - n * 86400000));

// GET /auth/me → data
export const ME = { userId: 100, email: "me@example.com", name: "혜원" };

// GET /rooms/{roomId}/members → data.members
export const MEMBERS = [
  { userId: 1, name: "지민" },
  { userId: 2, name: "서연" },
  { userId: 3, name: "민호" },
  { userId: 4, name: "수빈" },
  { userId: 100, name: "혜원" },
];

export const ROOM_NAME = "우당탕탕 우리셋";

// GET /rooms/{roomId}/diaries/yesterday → data.diaries
export const YESTERDAY_DIARIES = [
  {
    diaryId: 1001,
    date: daysAgo(1),
    content:
      "오늘은 학교 끝나고 오랜만에 셋이서 카페에 갔다. 바쁜 와중에도 이렇게 시간 내서 만날 수 있다는 게 참 좋다. 역시 좋은 친구들이 있다는 건 든든한 일이야.",
    emotion: "HAPPY",
    authorName: "지민",
  },
  {
    diaryId: 1002,
    date: daysAgo(1),
    content:
      "오랜만에 혼자만의 시간을 가졌다. 좋아하는 음악을 들으며 책도 읽고, 산책도 했다. 바쁘게 흘러가는 일상 속에서 잠시 멈춰 숨을 고를 수 있었던 소중한 하루였다.",
    emotion: "CALM",
    authorName: "서연",
  },
  {
    diaryId: 1003,
    date: daysAgo(1),
    content:
      "오늘은 생각보다 정신없는 하루였다. 해야 할 일이 많아서 계속 움직였더니 저녁이 되니 정말 지쳤다. 그래도 하루를 잘 버텨낸 나에게 수고했다고 말해주고 싶다.",
    emotion: "TIRED",
    authorName: "민호",
  },
];

// 내가 쓴 일기 (목록 API 미정 — GET /diaries/{diaryId} 응답 모양으로 가정)
export const MY_DIARIES = [
  {
    diaryId: 2006,
    date: today,
    content: "오늘은 평범한 하루였지만, 내일은 왠지 좋은 일이 생길 것 같은 기분이 든다...",
    questionToFriend: "요즘 가장 기다려지는 일은 뭐야?",
    emotion: "EXCITED",
    authorName: "혜원",
  },
  {
    diaryId: 2005,
    date: daysAgo(1),
    content: "오늘은 날씨가 정말 좋았다. 창문을 열었더니 봄바람이 살랑살랑 들어와서 기분이 좋아졌다...",
    questionToFriend: "오늘 하늘 봤어?",
    emotion: "HAPPY",
    authorName: "혜원",
  },
  {
    diaryId: 2004,
    date: daysAgo(2),
    content: "바쁜 하루였지만, 친구들과 나눈 짧은 대화가 참 따뜻했다. 이런 순간들이 모여서...",
    questionToFriend: "요즘 제일 웃겼던 일은?",
    emotion: "CALM",
    authorName: "혜원",
  },
  {
    diaryId: 2003,
    date: daysAgo(3),
    content: "오랜만에 책을 펼쳤다. 한동안 미뤄왔던 책인데 역시 읽길 잘했다. 마음이 차분해지는 느낌...",
    questionToFriend: "요즘 읽는 책 있어?",
    emotion: "NORMAL",
    authorName: "혜원",
  },
  {
    diaryId: 2002,
    date: daysAgo(4),
    content: "발표 준비가 생각처럼 잘 안 돼서 조금 속상했다. 그래도 내일은 더 잘할 수 있겠지.",
    questionToFriend: "너는 긴장될 때 어떻게 해?",
    emotion: "UPSET",
    authorName: "혜원",
  },
];

// GET /rooms/{roomId}/tmi → data.tmis
export const TMIS = [
  {
    tmiId: 3001,
    content: "사실 나는 혼자 카페 가서 아무도 모르게 케이크 하나 다 먹는 게 제일 행복해요.. ㅎㅎ",
    isMine: false,
    hasGuessed: false,
  },
  { tmiId: 3002, content: "오늘 아침 알람을 세 번이나 껐는데 결국 지각은 안 했다!", isMine: false, hasGuessed: false },
  { tmiId: 3003, content: "요즘 자기 전에 고양이 영상 30분씩 보는 게 루틴이 됐어.", isMine: true, hasGuessed: false },
  { tmiId: 3004, content: "초등학생 때 피아노 대회에서 상 받은 적 있다.", isMine: false, hasGuessed: false },
  { tmiId: 3005, content: "편의점 신상 과자는 무조건 먹어봐야 직성이 풀려.", isMine: false, hasGuessed: false },
];

// POST /tmi/{tmiId}/guess → data
export const GUESS_RESULT = { isCorrect: true, actualAuthorName: "지민", accumulatedScore: 70 };

