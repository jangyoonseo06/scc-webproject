/*
 * 토스트 알림
 *
 * 1) 앱 바깥을 한 번 감싸기
 *      <ToastProvider><App /></ToastProvider>
 * 2) 어디서든
 *      import { useToast } from "./components/status/toastContext";
 *      const toast = useToast();
 *      toast.success("저장했어요");
 */
import { useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, Info, X } from "lucide-react";
import { ToastContext } from "./toastContext";
import "./status.css";

const ICONS = {
  success: Check,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children, duration = 2600 }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, message) => {
      const id = ++idRef.current;
      setToasts((list) => [...list.slice(-2), { id, type, message }]);
      window.setTimeout(() => remove(id), duration);
    },
    [duration, remove]
  );

  const api = useMemo(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      info: (message) => show("info", message),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="st-toast-stack" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] ?? Info;
          return (
            <div key={toast.id} className={`st-toast ${toast.type}`} role="status">
              <span className="st-toast-icon">
                <Icon size={16} />
              </span>
              <span className="st-toast-text">{toast.message}</span>
              <button onClick={() => remove(toast.id)} aria-label="알림 닫기">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
