export default function StarRating({ rating = 0, size = 14 }) {
  const rounded = Math.round(rating * 2) / 2
  const stars = [1, 2, 3, 4, 5]

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }} aria-label={`Rated ${rating} out of 5`}>
      {stars.map((s) => {
        const fill = rounded >= s ? 1 : rounded >= s - 0.5 ? 0.5 : 0
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
            <defs>
              <linearGradient id={`star-${s}-${rating}`}>
                <stop offset={`${fill * 100}%`} stopColor="#C9A227" />
                <stop offset={`${fill * 100}%`} stopColor="#E4DAC0" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-${s}-${rating})`}
              d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.77l-5.21 2.75 1-5.8-4.21-4.1 5.82-.85z"
            />
          </svg>
        )
      })}
      <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-soft)', marginLeft: 2 }}>{rating.toFixed(1)}</span>
    </span>
  )
}
