interface EmptyStateProps {
  title: string
  message?: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  actionOnClick,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 font-medium mb-2">{title}</p>
      {message && <p className="text-sm text-gray-400 mb-4">{message}</p>}
      {actionLabel && (
        <>
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-block text-primary hover:text-primary-dark font-medium"
            >
              {actionLabel} →
            </a>
          ) : actionOnClick ? (
            <button
              onClick={actionOnClick}
              className="text-primary hover:text-primary-dark font-medium"
            >
              {actionLabel} →
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}





