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
      className={`w-full rounded-xl border px-6 py-5 ${
        isPrimary
          ? 'border-border bg-ascent text-white sm:px-8 sm:py-7'
          : 'border-inc/20 bg-surface text-inc'
      }`}
    >
      <div className="flex items-center gap-3 pb-4">
        <span className={`text-xl ${isPrimary ? 'text-white' : 'text-ascent'}`}>
          {icon}
        </span>

        <p
          className={`font-medium capitalize ${
            isPrimary ? 'text-emerald-100' : 'text-gray-600'
          }`}
        >
          {headings ?? 'Untitled metric'}
        </p>
      </div>

      <div className="flex items-baseline gap-2">
        {value != null && value !== '' && (
          <span
            className={`text-xl font-medium ${
              isPrimary ? 'text-emerald-100' : 'text-gray-700'
            }`}
          >
            {value}
          </span>
        )}

        <h2
          className={`font-semibold tracking-tight ${
            isPrimary ? 'text-4xl sm:text-5xl' : 'text-3xl'
          }`}
        >
          {mainData ?? '—'}
        </h2>
      </div>

      <p
        className={`mt-3 text-sm ${
          isPrimary ? 'text-white/80' : 'text-gray-500'
        }`}
      >
        {text ?? ''}
      </p>
    </article>
  )
}

export default MetricCard
