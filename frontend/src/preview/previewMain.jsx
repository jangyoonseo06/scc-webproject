import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import "../App.css";
import "../styles/ui-refresh.css";
import "./preview.css";
import { ToastProvider } from "../components/status/Toast";
import PreviewApp from "./PreviewApp";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <PreviewApp />
    </ToastProvider>
  </StrictMode>
);
