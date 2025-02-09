import {Skeleton} from '@ui/skeleton'
import {memo} from 'react'

const SectionSkeleton = memo(() => {
  const placeholderItems = Array.from({length: 7})

  return (
    <ul className="relative font-poppins">
      {placeholderItems.map((_, index) => (
        <li key={index} className="relative py-2 flex flex-row">
          <Skeleton className="ml-4 w-3 h-2.5 rounded mr-2" />
          <Skeleton className="w-24 rounded"></Skeleton>
        </li>
      ))}
    </ul>
  )
})

export default SectionSkeleton
