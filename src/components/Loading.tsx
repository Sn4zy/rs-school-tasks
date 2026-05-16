interface Props {
  label?: string
}

export default function Loading({ label = 'Loading…' }: Props) {
  return (
    <div className="loading-panel" role="status" aria-live="polite">
      <div className="loading-spinner" aria-label="Loading" />
      <span>{label}</span>
    </div>
  )
}
