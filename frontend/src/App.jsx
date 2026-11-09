import { useState } from "react";
import {
  Mail,
  Settings,
  Users,
  Calendar,
  Copy,
  BookOpen,
  CircleHelp,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Send,
  Check,
} from "lucide-react";

import "./App.css";
import { LoginPage, SignupPage } from "./AuthPages";
import {
  MyRoomsPage,
  YesterdayPage,
  DiaryWritePage,
  MyDiariesPage,
  TmiWritePage,
  TmiGuessPage,
  TmiResultPage,
  DiaryReadModal,
} from "./FeaturePages";

const CURRENT_USER = {
  id: 100,
  name: "혜원",
};

const MOCK_ROOM = {
  id: 1,
  name: "우당탕탕 우리셋",
  inviteCode: "KX7B9Q",
  createdAt: "2026년 10월 5일",
  members: [
    { id: 1, name: "지민" },
    { id: 2, name: "서연" },
    { id: 3, name: "민호" },
  ],
};

function makeInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

function App() {
  const [page, setPage] = useState("login");

  // 기존 방 기능은 그대로 유지
  const [room, setRoom] = useState(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");

  const [copied, setCopied] = useState(false);

  // 새로 추가된 일기 읽기 모달 상태
  const [selectedDiary, setSelectedDiary] = useState(null);

  const handleCreateRoom = () => {
    const trimmedName = roomName.trim();

    if (!trimmedName) {
      setCreateError("방 이름을 입력해주세요.");
      return;
    }

    if (trimmedName.length > 20) {
      setCreateError("방 이름은 최대 20자까지 입력할 수 있어요.");
      return;
    }

    const newRoom = {
      id: Date.now(),
      name: trimmedName,
      inviteCode: makeInviteCode(),
      createdAt: "2026년 10월 5일",
      members: [CURRENT_USER],
    };

    setRoom(newRoom);
    setCreateModalOpen(false);
    setRoomName("");
    setCreateError("");
  };

  const handleJoinRoom = () => {
    const normalizedCode = joinCode.trim().toUpperCase();

    if (!normalizedCode) {
      setJoinError("초대 코드를 입력해주세요.");
      return;
    }

    if (normalizedCode.length !== 6) {
      setJoinError("초대 코드는 6자리입니다.");
      return;
    }

    // 백엔드 연결 전 테스트용 정상 코드
    if (normalizedCode !== MOCK_ROOM.inviteCode) {
      setJoinError("존재하지 않는 초대 코드입니다. 다시 확인해주세요.");
      return;
    }

    if (room?.inviteCode === normalizedCode) {
      setJoinError("이미 참여한 방입니다.");
      return;
    }

    const joinedRoom = {
      ...MOCK_ROOM,
      members: [...MOCK_ROOM.members, CURRENT_USER],
    };

    setRoom(joinedRoom);
    setJoinModalOpen(false);
    setJoinCode("");
    setJoinError("");
  };

  const handleCopyCode = async () => {
    if (!room) return;

    try {
      await navigator.clipboard.writeText(room.inviteCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("초대 코드 복사에 실패했습니다.");
    }
  };

  if (page === "login") {
    return (
      <LoginPage
        onLogin={() => setPage("main")}
        onSignup={() => setPage("signup")}
      />
    );
  }

  if (page === "signup") {
    return (
      <SignupPage
        onSignupComplete={() => setPage("login")}
        onLogin={() => setPage("login")}
      />
    );
  }

  const diaryPages = ["yesterday", "diary-write", "my-diaries"];
  const tmiPages = ["tmi-write", "tmi-guess", "tmi-result"];

  return (
    <div className="app">
      <Header
        page={page}
        diaryActive={diaryPages.includes(page)}
        tmiActive={tmiPages.includes(page)}
        onMain={() => setPage("main")}
        onRoom={() => setPage("rooms")}
        onDiary={() => setPage("my-diaries")}
        onTmi={() => setPage("tmi-write")}
      />

      {page === "main" && (
        <MainPage
          room={room}
          onCreateRoom={() => setCreateModalOpen(true)}
          onJoinRoom={() => setJoinModalOpen(true)}
          onRoomOpen={() => setPage("room")}
          onCopyCode={handleCopyCode}
          onGoRooms={() => setPage("rooms")}
          onDiaryWrite={() => setPage("diary-write")}
          onTmiWrite={() => setPage("tmi-write")}
          onYesterday={() => setPage("yesterday")}
        />
      )}

      {page === "rooms" && (
        <MyRoomsPage
          room={room}
          onOpenRoom={() => setPage("room")}
          onCreateRoom={() => setCreateModalOpen(true)}
          onJoinRoom={() => setJoinModalOpen(true)}
          onCopyCode={handleCopyCode}
        />
      )}

      {page === "room" && room && (
        <RoomPage
          room={room}
          onBack={() => setPage("rooms")}
          onCopyCode={handleCopyCode}
          onDiary={() => setPage("diary-write")}
          onTmi={() => setPage("tmi-write")}
        />
      )}

      {page === "room" && !room && (
        <MyRoomsPage
          room={room}
          onOpenRoom={() => setPage("room")}
          onCreateRoom={() => setCreateModalOpen(true)}
          onJoinRoom={() => setJoinModalOpen(true)}
          onCopyCode={handleCopyCode}
        />
      )}

      {page === "yesterday" && (
        <YesterdayPage
          onBack={() => setPage("main")}
          onReadDiary={(diary) => setSelectedDiary(diary)}
          onWriteDiary={() => setPage("diary-write")}
        />
      )}

      {page === "diary-write" && (
        <DiaryWritePage
          room={room}
          onBack={() => setPage("main")}
          onGoMyDiaries={() => setPage("my-diaries")}
        />
      )}

      {page === "my-diaries" && (
        <MyDiariesPage
          onBack={() => setPage("main")}
          onReadDiary={(diary) => setSelectedDiary(diary)}
          onWrite={() => setPage("diary-write")}
        />
      )}

      {page === "tmi-write" && (
        <TmiWritePage
          room={room}
          onBack={() => setPage("main")}
          onStartGuess={() => setPage("tmi-guess")}
        />
      )}

      {page === "tmi-guess" && (
        <TmiGuessPage
          room={room}
          onBack={() => setPage("tmi-write")}
          onShowResult={() => setPage("tmi-result")}
        />
      )}

      {page === "tmi-result" && (
        <TmiResultPage
          onBack={() => setPage("tmi-guess")}
          onAgain={() => setPage("tmi-guess")}
        />
      )}

      {createModalOpen && (
        <CreateRoomModal
          roomName={roomName}
          setRoomName={setRoomName}
          error={createError}
          onClose={() => {
            setCreateModalOpen(false);
            setCreateError("");
            setRoomName("");
          }}
          onSubmit={handleCreateRoom}
        />
      )}

      {joinModalOpen && (
        <JoinRoomModal
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          error={joinError}
          onClose={() => {
            setJoinModalOpen(false);
            setJoinError("");
            setJoinCode("");
          }}
          onSubmit={handleJoinRoom}
        />
      )}

      {selectedDiary && (
        <DiaryReadModal
          diary={selectedDiary}
          onClose={() => setSelectedDiary(null)}
        />
      )}

      {copied && (
        <div className="toast">
          <span className="toast-check">
            <Check size={16} />
          </span>

          초대 코드가 복사되었습니다.
        </div>
      )}
    </div>
  );
}

function Header({
  page,
  diaryActive,
  tmiActive,
  onMain,
  onRoom,
  onDiary,
  onTmi,
}) {
  const roomActive = page === "rooms" || page === "room";

  return (
    <header className="header">
      <div className="header-inner">
        <button className="logo" onClick={onMain}>
          <span className="logo-icon">
            <Mail size={29} strokeWidth={2} />
          </span>

          <span>교환함</span>
        </button>

        <nav className="nav">
          <button
            className={page === "main" ? "nav-item active" : "nav-item"}
            onClick={onMain}
          >
            메인
          </button>

          <button
            className={roomActive ? "nav-item active" : "nav-item"}
            onClick={onRoom}
          >
            내 방
          </button>

          <button
            className={diaryActive ? "nav-item active" : "nav-item"}
            onClick={onDiary}
          >
            일기
          </button>

          <button
            className={tmiActive ? "nav-item active" : "nav-item"}
            onClick={onTmi}
          >
            TMI
          </button>
        </nav>
      </div>
    </header>
  );
}

function MainPage({
  room,
  onCreateRoom,
  onJoinRoom,
  onRoomOpen,
  onCopyCode,
  onGoRooms,
  onDiaryWrite,
  onTmiWrite,
  onYesterday,
}) {
  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <h1>
            오늘의 마음을 적어
            <br />
            내일의 친구에게, <span>교환함</span>
          </h1>

          <p>
            친구들과 하나의 방을 만들어
            <br />
            오늘의 일기를 쓰고, 내일의 서로에게 열어보세요.
            <br />
            익명으로 진행되는 TMI로, 더 깊이 알아가는 특별한 공간이에요.
          </p>

          <button className="primary-button" onClick={onGoRooms}>
            지금, 우리만의 방에서 시작하기
            <ArrowRight
              size={19}
              style={{ marginLeft: "8px", verticalAlign: "middle" }}
            />
          </button>
        </div>

        <div className="hero-art">
          <div className="paper paper-back"></div>
          <div className="paper paper-middle"></div>

          <div className="envelope">
            <div className="letter">
              오늘의 이야기가
              <br />
              내일의 너에게 닿기를
              <br />
              <small>— 교환함에서 ♡</small>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="room-section">
          <div className="section-title-row">
            <h2>내 방</h2>

            <button className="text-link-button" onClick={onGoRooms}>
              더보기 <ArrowRight size={15} />
            </button>
          </div>

          {!room ? (
            <EmptyRoomCard
              onCreateRoom={onCreateRoom}
              onJoinRoom={onJoinRoom}
            />
          ) : (
            <RoomCard
              room={room}
              onOpen={onRoomOpen}
              onCopyCode={onCopyCode}
            />
          )}
        </div>

        <FeatureCard
          type="diary"
          title="오늘의 교환일기 쓰기"
          description={
            <>
              지금의 마음을 기록해보세요.
              <br />
              내일, 친구들에게 공개돼요.
            </>
          }
          onClick={onDiaryWrite}
        />

        <FeatureCard
          type="tmi"
          title="오늘의 TMI 작성하기"
          description={
            <>
              익명으로 작성하는 TMI!
              <br />
              친구들이 누구인지 맞혀보세요.
            </>
          }
          onClick={onTmiWrite}
        />
      </section>

      <section className="bottom-grid">
        <div className="bottom-card yesterday">
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <Mail size={22} color="#cf6f7d" />
              어제의 우리
            </h3>

            <strong>어제 쓴 교환일기가 도착했어요!</strong>

            <p>친구들이 남긴 어제의 이야기를 지금 열어보세요.</p>
          </div>

          <button onClick={onYesterday}>
            어제의 일기 보기
            <ArrowRight
              size={17}
              style={{ marginLeft: "7px", verticalAlign: "middle" }}
            />
          </button>
        </div>

        <div className="bottom-card tomorrow">
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <Calendar size={22} color="#6498BE" />
              오늘 쓴 일기는 내일 도착해요
            </h3>

            <p>
              지금 작성하는 교환일기는
              <br />
              내일 친구들에게 공개돼요.
              <br />
              조금만 기다려주세요!
            </p>
          </div>

          <div className="note-paper">
            오늘의 이야기가
            <br />
            내일의 설렘이 될 거예요.
            <br />♡
          </div>
        </div>
      </section>
    </main>
  );
}

function EmptyRoomCard({ onCreateRoom, onJoinRoom }) {
  return (
    <div className="empty-room-card">
      <div className="empty-envelope">
        <Mail size={34} />
      </div>

      <h3>아직 참여한 방이 없어요.</h3>

      <p>
        친구와 새로운 방을 만들거나
        <br />
        초대 코드로 참여해보세요.
      </p>

      <div className="empty-room-buttons">
        <button className="primary-button" onClick={onCreateRoom}>
          <Plus
            size={18}
            style={{ marginRight: "6px", verticalAlign: "middle" }}
          />
          방 만들기
        </button>

        <button className="outline-button" onClick={onJoinRoom}>
          초대 코드로 참여하기
        </button>
      </div>
    </div>
  );
}

function RoomCard({ room, onOpen, onCopyCode }) {
  return (
    <div className="room-card">
      <button className="room-main" onClick={onOpen}>
        <div className="room-cover"></div>

        <div className="room-info">
          <div className="room-name-row">
            <h3>{room.name}</h3>

            <span className="settings-icon">
              <Settings size={19} />
            </span>
          </div>

          <div className="member-preview">
            {room.members.slice(0, 3).map((member, index) => (
              <span key={member.id} className={`avatar avatar-${index + 1}`}>
                {member.name.charAt(0)}
              </span>
            ))}
          </div>

          <p>{room.members.length}명의 멤버와 함께하고 있어요.</p>
        </div>
      </button>

      <div className="invite-code-row">
        <span className="invite-label">초대 코드</span>

        <strong>{room.inviteCode}</strong>

        <button
          className="copy-button"
          onClick={(event) => {
            event.stopPropagation();
            onCopyCode();
          }}
          aria-label="초대 코드 복사"
        >
          <Copy size={20} />
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ type, title, description, onClick }) {
  return (
    <div className={`feature-card ${type}`}>
      <div className="feature-illustration">
        {type === "diary" ? (
          <div className="notebook">
            <BookOpen size={44} strokeWidth={1.8} />
          </div>
        ) : (
          <div className="question-card">
            <CircleHelp size={52} strokeWidth={2} />
          </div>
        )}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>

      <button className="round-arrow" onClick={onClick}>
        <ArrowRight size={25} />
      </button>
    </div>
  );
}

function RoomPage({ room, onBack, onCopyCode, onDiary, onTmi }) {
  return (
    <main className="room-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft
          size={18}
          style={{ marginRight: "7px", verticalAlign: "middle" }}
        />
        내 방으로 돌아가기
      </button>

      <section className="room-hero">
        <div className="room-hero-text">
          <div className="room-title-row">
            <h1>{room.name}</h1>

            <button
              className="room-settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Settings size={18} />
              방 설정
            </button>
          </div>

          <p className="room-description">
            서로의 일상을 기록하고, 가끔은 웃기고 가끔은 진지한
            <br />
            이야기를 주고받는 우리만의 작은 교환함이에요.
          </p>

          <div className="room-meta">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Users size={19} />
              {room.members.length}명
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Calendar size={19} />
              {room.createdAt}에 만들어졌어요.
            </span>
          </div>

          <div className="room-code-large">
            <span>초대 코드</span>

            <strong>{room.inviteCode}</strong>

            <button onClick={onCopyCode} aria-label="초대 코드 복사">
              <Copy size={21} />
            </button>
          </div>
        </div>

        <div className="room-hero-art">
          <div className="large-envelope">
            <div className="room-letter">
              좋은 너희와
              <br />
              오늘도, 내일도
              <br />
              — {room.name} ♡
            </div>
          </div>
        </div>
      </section>

      <section className="room-content-grid">
        <div className="member-list-card">
          <h2>방 멤버 ({room.members.length}명)</h2>

          <div className="members">
            {room.members.map((member, index) => (
              <div className="member-item" key={member.id}>
                <div className={`member-avatar avatar-${(index % 3) + 1}`}>
                  {member.name.charAt(0)}
                </div>

                <strong>{member.name}</strong>

                <span
                  className={`status-dot status-${(index % 3) + 1}`}
                ></span>
              </div>
            ))}
          </div>
        </div>

        <FeatureCard
          type="diary"
          title="하루 시차 교환일기"
          description={
            <>
              지금의 마음을 기록하면
              <br />
              내일, 친구에게 도착해요.
              <br />
              서로의 일상을 하나씩 열어보세요.
            </>
          }
          onClick={onDiary}
        />

        <FeatureCard
          type="tmi"
          title="익명 TMI 추리"
          description={
            <>
              익명으로 작성하는 TMI!
              <br />
              누가 썼는지 맞혀보며
              <br />
              서로를 더 알아가요.
            </>
          }
          onClick={onTmi}
        />
      </section>
    </main>
  );
}

function CreateRoomModal({
  roomName,
  setRoomName,
  error,
  onClose,
  onSubmit,
}) {
  return (
    <Modal onClose={onClose}>
      <div className="modal-illustration">
        <Mail size={38} />
      </div>

      <h2>새로운 방 만들기</h2>

      <p className="modal-description">
        친구들과 사용할 방의 이름을 정해주세요.
      </p>

      <label className="form-label">
        <span>
          방 이름
          <small>{roomName.length} / 20</small>
        </span>

        <input
          value={roomName}
          maxLength={20}
          placeholder="예: 우당탕탕 우리셋"
          onChange={(event) => setRoomName(event.target.value)}
        />
      </label>

      {error && <p className="error-message">● {error}</p>}

      <div className="modal-buttons">
        <button className="cancel-button" onClick={onClose}>
          취소
        </button>

        <button className="modal-primary" onClick={onSubmit}>
          방 만들기
        </button>
      </div>
    </Modal>
  );
}

function JoinRoomModal({
  joinCode,
  setJoinCode,
  error,
  onClose,
  onSubmit,
}) {
  return (
    <Modal onClose={onClose}>
      <div className="modal-illustration">
        <Send size={38} />
      </div>

      <h2>초대 코드로 참여하기</h2>

      <p className="modal-description">
        친구에게 받은 초대 코드를 입력해주세요.
      </p>

      <label className="form-label">
        <span>초대 코드</span>

        <input
          className={error ? "input-error" : ""}
          value={joinCode}
          maxLength={6}
          placeholder="예: KX7B9Q"
          onChange={(event) => {
            setJoinCode(event.target.value.toUpperCase());
          }}
        />
      </label>

      {error && <p className="error-message">● {error}</p>}

      <p className="input-guide">테스트용 정상 코드: KX7B9Q</p>

      <div className="modal-buttons">
        <button className="cancel-button" onClick={onClose}>
          취소
        </button>

        <button className="modal-primary" onClick={onSubmit}>
          참여하기
        </button>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="닫기"
        >
          <X size={25} />
        </button>

        {children}
      </div>
    </div>
  );
}

export default App;