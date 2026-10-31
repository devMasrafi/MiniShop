const MetricCard = ({
  mainData,
  headings,
  text,
  icon,
  value,
  variant = 'secondary',
}) => {
  const isPrimary = variant === 'primary'

  return (
    <article
      className={`w-full rounded-2xl border p-5 sm:p-6 ${
        isPrimary
          ? 'border-ascent bg-ascent text-white'
          : 'border-border bg-surface text-inc'
      }`}
    >
      <div className="flex items-center gap-3 pb-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            isPrimary ? 'bg-white/15 text-white' : 'bg-ascent/10 text-ascent'
          }`}
        >
          {icon}
        </span>

        <p
          className={`font-medium ${
            isPrimary ? 'text-white/85' : 'text-muted'
          }`}
        >
          {headings ?? 'Untitled metric'}
        </p>
      </div>

      <div className="flex min-w-0 items-baseline gap-2">
        {value != null && value !== '' && (
          <span
            className={`text-xl font-medium ${
              isPrimary ? 'text-white/80' : 'text-muted'
            }`}
          >
            {value}
          </span>
        )}

        <h2
          className={`min-w-0 truncate font-semibold tracking-tight ${
            isPrimary ? 'text-4xl sm:text-5xl' : 'text-3xl'
          }`}
        >
          {mainData ?? '—'}
        </h2>
      </div>

      <p
        className={`mt-3 text-sm ${isPrimary ? 'text-white/75' : 'text-muted'}`}
      >
        {text ?? ''}
      </p>
    </article>
  )
}

export default MetricCard
