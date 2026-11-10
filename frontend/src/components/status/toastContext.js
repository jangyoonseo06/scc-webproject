import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

/*
 * 사용 예)
 *   const toast = useToast();
 *   toast.success("일기를 보냈어요");
 *   toast.error("저장하지 못했어요. 다시 시도해주세요.");
 *   toast.info("초대 코드가 복사되었어요");
 *
 * ToastProvider 안에서만 쓸 수 있다.
 */
export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast 는 <ToastProvider> 안에서 사용해야 해요.");
  }
  return toast;
}
