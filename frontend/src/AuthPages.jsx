import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  X,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function LoginPage({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 비밀번호 찾기 모달
  const [forgotPasswordOpen, setForgotPasswordOpen] =
    useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "로그인에 실패했습니다."
        );
        return;
      }

      localStorage.setItem(
        "accessToken",
        result.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        result.data.refreshToken
      );

      onLogin();
    } catch (error) {
      console.error(
        "로그인 요청 오류:",
        error
      );

      setError(
        "서버에 연결할 수 없습니다."
      );
    }
  };

  return (
    <div className="auth-page">
      <AuthHeader />

      <main className="auth-container">
        <section className="auth-visual">
          <div className="auth-copy">
            <h1>
              오늘의 마음을 적어
              <br />
              내일의 친구에게,{" "}
              <span>교환함</span>
            </h1>

            <p>
              오늘의 일기를 쓰고,
              <br />
              내일의 서로에게 열어보세요.
            </p>
          </div>

          <AuthEnvelope />
        </section>

        <section className="auth-card">
          <h2>로그인</h2>

          <p className="auth-card-description">
            교환함에서 오늘의 마음을 적고,
            <br />
            내일의 친구에게 열어보세요.
          </p>

          <label className="auth-label">
            이메일

            <div className="auth-input-wrap">
              <Mail size={20} />

              <input
                type="email"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </label>

          <label className="auth-label">
            비밀번호

            <div className="auth-input-wrap">
              <Lock size={20} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="auth-eye"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            className="auth-primary-button"
            onClick={handleLogin}
          >
            로그인
          </button>

          <div className="auth-links">
            <button onClick={onSignup}>
              회원가입
            </button>

            <span></span>

            <button
              type="button"
              onClick={() =>
                setForgotPasswordOpen(true)
              }
            >
              비밀번호 찾기
            </button>
          </div>
        </section>
      </main>

      {forgotPasswordOpen && (
        <ForgotPasswordModal
          onClose={() =>
            setForgotPasswordOpen(false)
          }
        />
      )}
    </div>
  );
}

export function SignupPage({
  onSignupComplete,
  onLogin,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [
    passwordCheck,
    setPasswordCheck,
  ] = useState("");
  const [agree, setAgree] =
    useState(false);
  const [error, setError] =
    useState("");

  const handleSignup = () => {
    if (!name.trim()) {
      setError(
        "이름을 입력해주세요."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "이메일을 입력해주세요."
      );
      return;
    }

    if (!password) {
      setError(
        "비밀번호를 입력해주세요."
      );
      return;
    }

    if (
      password !== passwordCheck
    ) {
      setError(
        "비밀번호가 일치하지 않습니다."
      );
      return;
    }

    if (!agree) {
      setError(
        "이용약관 및 개인정보처리방침에 동의해주세요."
      );
      return;
    }

    setError("");

    // 회원가입 API는 아직 연결하지 않음
    onSignupComplete();
  };

  return (
    <div className="auth-page">
      <AuthHeader />

      <main className="auth-container">
        <section className="auth-visual signup-visual">
          <div className="auth-copy">
            <h1>
              함께 쓰는 오늘이,
              <br />
              내일의 누군가에게 전해져요.
              <br />
              <span>교환함</span>에서
            </h1>

            <p>
              친구들과 하나의 방을 만들어
              <br />
              오늘의 일기를 쓰고,
              서로의 이야기를
              주고받아보세요.
              <br />
              익명 TMI로 서로를 더 알아가는
              특별한 공간이에요.
            </p>
          </div>

          <AuthEnvelope />
        </section>

        <section className="auth-card signup-card">
          <h2>회원가입</h2>

          <p className="auth-card-description">
            지금, 나만의 방을 만들고
            <br />
            친구들과 이야기를 교환해보세요.
          </p>

          <label className="auth-label">
            이름

            <div className="auth-input-wrap">
              <User size={20} />

              <input
                type="text"
                placeholder="이름을 입력해주세요."
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>
          </label>

          <label className="auth-label">
            이메일

            <div className="auth-input-wrap">
              <Mail size={20} />

              <input
                type="email"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </label>

          <label className="auth-label">
            비밀번호

            <div className="auth-input-wrap">
              <Lock size={20} />

              <input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>
          </label>

          <label className="auth-label">
            비밀번호 확인

            <div className="auth-input-wrap">
              <Lock size={20} />

              <input
                type="password"
                placeholder="비밀번호를 한 번 더 입력해주세요."
                value={passwordCheck}
                onChange={(e) =>
                  setPasswordCheck(
                    e.target.value
                  )
                }
              />
            </div>
          </label>

          <label className="auth-agree">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) =>
                setAgree(e.target.checked)
              }
            />

            <span>
              이용약관 및 개인정보처리방침에
              동의합니다.
            </span>
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            className="auth-primary-button"
            onClick={handleSignup}
          >
            회원가입
            <ArrowRight size={18} />
          </button>

          <div className="auth-login-link">
            이미 계정이 있나요?
            <button onClick={onLogin}>
              로그인
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function ForgotPasswordModal({
  onClose,
}) {
  const [email, setEmail] =
    useState("");
  const [error, setError] =
    useState("");
  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = () => {
    if (!email.trim()) {
      setError(
        "이메일을 입력해주세요."
      );
      return;
    }

    if (
      !email.includes("@")
    ) {
      setError(
        "올바른 이메일 형식을 입력해주세요."
      );
      return;
    }

    setError("");
    setSubmitted(true);

    /*
      비밀번호 찾기 API가 추가되면
      이 위치에서 fetch 요청 연결

      예시:
      fetch(`${API_BASE_URL}/auth/password/reset`, ...)
    */
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "rgba(35, 31, 30, 0.48)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(440px, 100%)",
          padding: "38px",
          position: "relative",
          borderRadius: "18px",
          border:
            "1px solid rgba(231, 226, 222, 0.8)",
          background:
            "rgba(255, 255, 255, 0.98)",
          boxShadow:
            "0 22px 60px rgba(79, 56, 50, 0.18)",
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          style={{
            width: "36px",
            height: "36px",
            position: "absolute",
            right: "18px",
            top: "18px",
            display: "grid",
            placeItems: "center",
            border: 0,
            borderRadius: "50%",
            background: "#f8f5f3",
            color: "#77716e",
          }}
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div
              style={{
                width: "58px",
                height: "58px",
                marginBottom: "18px",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                color: "#cf6f7d",
                background: "#f8e5e7",
              }}
            >
              <Lock size={26} />
            </div>

            <h2
              style={{
                margin:
                  "0 0 10px",
                fontSize: "28px",
                color: "#242424",
              }}
            >
              비밀번호 찾기
            </h2>

            <p
              style={{
                margin:
                  "0 0 28px",
                color: "#77716e",
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              가입한 이메일을 입력해주세요.
              <br />
              비밀번호 재설정 안내를 보내드릴게요.
            </p>

            <label className="auth-label">
              이메일

              <div className="auth-input-wrap">
                <Mail size={20} />

                <input
                  type="email"
                  placeholder="가입한 이메일을 입력해주세요."
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />
              </div>
            </label>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <button
              className="auth-primary-button"
              onClick={handleSubmit}
            >
              재설정 안내 받기
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                width: "58px",
                height: "58px",
                marginBottom: "18px",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                color: "#cf6f7d",
                background: "#f8e5e7",
              }}
            >
              <Mail size={26} />
            </div>

            <h2
              style={{
                margin:
                  "0 0 10px",
                fontSize: "28px",
                color: "#242424",
              }}
            >
              이메일을 확인해주세요.
            </h2>

            <p
              style={{
                margin:
                  "0 0 28px",
                color: "#77716e",
                lineHeight: 1.7,
                fontSize: "14px",
              }}
            >
              <strong>
                {email}
              </strong>
              <br />
              비밀번호 재설정 안내를 요청했습니다.
              <br />
              현재는 프론트 화면만 구현된 상태입니다.
            </p>

            <button
              className="auth-primary-button"
              onClick={onClose}
            >
              로그인으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AuthHeader() {
  return (
    <header className="auth-header">
      <div className="auth-header-inner">
        <div className="auth-logo">
          <Mail size={28} />
          <strong>교환함</strong>
        </div>

        <nav className="auth-nav">
          <span>메인</span>
          <span>내 방</span>
          <span>일기</span>
          <span>TMI</span>
        </nav>
      </div>
    </header>
  );
}

function AuthEnvelope() {
  return (
    <div className="auth-envelope-art">
      <div className="auth-paper auth-paper-one"></div>
      <div className="auth-paper auth-paper-two"></div>

      <div className="auth-envelope">
        <div className="auth-letter">
          오늘의 이야기가
          <br />
          내일의 너에게 닿기를
          <br />
          <small>
            — 교환함에서 ♡
          </small>
        </div>
      </div>

      <div className="auth-photo auth-photo-sky"></div>
      <div className="auth-photo auth-photo-flower"></div>
    </div>
  );
}