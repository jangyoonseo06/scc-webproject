// UI 미리보기 전용 설정 (원래 vite.config.js 는 그대로)
//   실행: npx vite --config vite.preview.config.js
//   → 브라우저에서 /app-preview.html 이 열림
//
// App.jsx 가 불러오는 "./FeaturePages" 만 미리보기용 연결 파일로 바꿔서,
// 실제 앱 흐름(로그인 → 메인 → 상단 메뉴 이동) 안에서 새 일기·TMI 화면을 볼 수 있게 한다.
// App.jsx / FeaturePages.jsx 코드는 수정하지 않는다.
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const appFile = path.join(root, "src", "App.jsx");
const adapterFile = path.join(root, "src", "preview", "FeaturePagesPreview.jsx");

function swapFeaturePages() {
  return {
    name: "ui-preview-swap-feature-pages",
    enforce: "pre",
    resolveId(source, importer) {
      if (
        (source === "./FeaturePages" || source === "./FeaturePages.jsx") &&
        importer &&
        path.normalize(importer.split("?")[0]) === path.normalize(appFile)
      ) {
        return adapterFile;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [swapFeaturePages(), react()],
  server: {
    open: "/app-preview.html",
  },
});
