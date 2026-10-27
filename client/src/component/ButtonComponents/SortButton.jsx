import { FaArrowsUpDown, FaArrowUpLong, FaArrowDownLong } from 'react-icons/fa6'

const SortButton = ({ field, children, handleSort, sortBy, sortDirection }) => {
  const isActive = sortBy === field

  const indicator = isActive ? (
    sortDirection === 'asc' ? (
      <FaArrowUpLong />
    ) : (
      <FaArrowDownLong />
    )
  ) : (
    <FaArrowsUpDown />
  )

  return (
    <button
      type="button"
      onClick={() => handleSort(field)}
      aria-label={`Sort by ${children}`}
      aria-sort={
        isActive
          ? sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      className="hover:text-foreground inline-flex items-center gap-1 font-semibold whitespace-nowrap"
    >
      {children}
      <span aria-hidden="true">{indicator}</span>
    </button>
  )
}

export default SortButton
