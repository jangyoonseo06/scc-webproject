// 앱 전체 미리보기 (개발용)
// 백엔드 없이 로그인 화면을 넘어가도록 /auth/login, /auth/signup 요청에만 가짜 응답을 준다.
// App.jsx / AuthPages.jsx 는 수정하지 않는다.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "../App.jsx";
import "../styles/ui-refresh.css";

const realFetch = window.fetch.bind(window);

window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  if (url.endsWith("/auth/login")) {
    return json({
      success: true,
      message: "로그인 성공 (미리보기)",
      data: { accessToken: "preview-token", refreshToken: "preview-refresh" },
    });
  }

  if (url.endsWith("/auth/signup")) {
    return json({ success: true, message: "회원가입 성공 (미리보기)", data: null }, 201);
  }

  return realFetch(input, init);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
