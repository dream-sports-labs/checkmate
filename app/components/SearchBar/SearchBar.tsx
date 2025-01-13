import {ChangeEventHandler, useEffect, useRef, useState} from 'react'
import {CrossCircledIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons'
import {Input} from '~/ui/input'
import {cn} from '~/ui/utils'

type SearchBarProps = {
  handlechange: (value: string) => void
  placeholdertext?: string
  searchstring?: string
}

export const SearchBar = (props: SearchBarProps) => {
  const input = useRef<HTMLInputElement>(null)
  const [searchstring, setSearchString] = useState(props.searchstring ?? '')
  const [lastSearchString, setLastSearchString] = useState(
    props.searchstring ?? '',
  )

  const listener = (event: KeyboardEvent) => {
    if (event.code === 'Enter' && searchstring !== lastSearchString) {
      setLastSearchString(searchstring)
      props.handlechange(searchstring)
    }
  }

  const activateSearchListener = (event: KeyboardEvent) => {
    if (event.code === 'Slash' && input.current) {
      event.preventDefault()
      input.current.focus()
    }
  }

  useEffect(() => {
    document.addEventListener('keypress', activateSearchListener)

    return () =>
      document.removeEventListener('keypress', activateSearchListener)
  }, [])

  useEffect(() => {
    const searchBar = document.getElementById('search-bar')
    if (searchBar) searchBar.addEventListener('keypress', listener)

    return () => {
      searchBar?.removeEventListener('keypress', listener)
    }
  }, [searchstring, lastSearchString])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(() => e.target.value)
  }

  const resetSearch = () => {
    input.current ? (input.current.value = '') : ''
    lastSearchString !== '' && props.handlechange('')
    setSearchString('')
    setLastSearchString('')
  }

  return (
    <div
      className="flex items-center rounded-3xl w-full relative"
      id={'search-bar'}>
      <MagnifyingGlassIcon className="h-4 w-4 shrink-0 opacity-50 absolute left-4" />
      <Input
        type="text"
        ref={input}
        className={cn(
          'h-8 border-zinc-200 rounded-3xl shadow-none file:font-medium pl-9',
        )}
        placeholder={props.placeholdertext || 'Search...'}
        onChange={handleChange}
        value={searchstring}
      />
      {searchstring?.length > 0 && (
        <CrossCircledIcon
          className={'absolute right-4 cursor-pointer size-5'}
          onClick={resetSearch}
        />
      )}
      {searchstring?.length === 0 && (
        <kbd className=" absolute right-4 bg-gray-200 border-b-2 border-slate-500 rounded text-xs px-[8px] py-[2px] text-gray-500">
          /
        </kbd>
      )}
    </div>
  )
}
