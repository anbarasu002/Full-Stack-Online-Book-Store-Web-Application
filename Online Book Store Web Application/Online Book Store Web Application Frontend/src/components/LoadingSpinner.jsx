export default function LoadingSpinner({ inline = false, label }) {
  if (inline) {
    return <span className="spinner spinner-inline" role="status" aria-label={label || 'Loading'} />
  }
  return (
    <div role="status" aria-label={label || 'Loading'}>
      <div className="spinner" />
    </div>
  )
}
