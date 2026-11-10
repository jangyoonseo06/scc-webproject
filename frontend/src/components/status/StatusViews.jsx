/*
 * 공통 상태 화면
 *
 * 사용 예)
 *   import { LoadingState, EmptyState, ErrorState, AsyncContent } from "./components/status/StatusViews";
 *
 *   <LoadingState message="일기를 불러오고 있어요" />
 *   <EmptyState title="아직 일기가 없어요" description="오늘의 마음을 기록해보세요." actionLabel="일기 쓰기" onAction={goWrite} />
 *   <ErrorState message={error.message} onRetry={refetch} />
 *
 *   // 한 번에 처리
 *   <AsyncContent status={status} error={error} isEmpty={list.length === 0} onRetry={refetch}
 *                 emptyTitle="어제 도착한 일기가 없어요">
 *     {...실제 화면...}
 *   </AsyncContent>
 *   // status: "loading" | "error" | "success"
 */
import { AlertCircle, Inbox, RotateCw } from "lucide-react";
import "./status.css";

export function LoadingState({ message = "불러오는 중이에요", compact = false }) {
  return (
    <div className={`st-box ${compact ? "compact" : ""}`} role="status" aria-live="polite">
      <span className="st-spinner" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <p className="st-desc">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "아직 내용이 없어요",
  description,
  actionLabel,
  onAction,
  icon,
  compact = false,
}) {
  return (
    <div className={`st-box ${compact ? "compact" : ""}`}>
      <span className="st-icon empty" aria-hidden="true">
        {icon ?? <Inbox size={30} />}
      </span>
      <h3 className="st-title">{title}</h3>
      {description && <p className="st-desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="st-btn primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function RetryButton({ onClick, loading = false, label = "다시 시도" }) {
  return (
    <button className="st-btn soft" onClick={onClick} disabled={loading}>
      <RotateCw size={17} className={loading ? "st-rotating" : ""} />
      {loading ? "다시 불러오는 중" : label}
    </button>
  );
}

export function ErrorState({
  title = "문제가 생겼어요",
  message = "잠시 후 다시 시도해주세요.",
  onRetry,
  retrying = false,
  compact = false,
}) {
  return (
    <div className={`st-box ${compact ? "compact" : ""}`} role="alert">
      <span className="st-icon error" aria-hidden="true">
        <AlertCircle size={30} />
      </span>
      <h3 className="st-title">{title}</h3>
      <p className="st-desc">{message}</p>
      {onRetry && <RetryButton onClick={onRetry} loading={retrying} />}
    </div>
  );
}

export function AsyncContent({
  status,
  error,
  isEmpty = false,
  onRetry,
  loadingMessage,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  children,
}) {
  if (status === "loading") return <LoadingState message={loadingMessage} />;

  if (status === "error") {
    return <ErrorState message={error?.message || undefined} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return children;
}
