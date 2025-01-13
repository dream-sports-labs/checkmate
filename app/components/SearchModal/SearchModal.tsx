import {useEffect, useState} from 'react'
import {Dialog, DialogContent} from '~/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/ui/command'

export const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        // setIsOpen(true)
      } else if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <Dialog open={isOpen}>
      <DialogContent className={'h-[600px] w-[500px] border-none p-0'}>
        <Command
          className={'bg-[#1E293B] text-background border-gray-600 border'}>
          <CommandInput placeholder="Search app" className={'h-16'} />
          <CommandList className={'text-background'}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions" className={'text-background'}>
              <CommandItem>Runs</CommandItem>
              <CommandItem>Projects</CommandItem>
              <CommandItem>Org</CommandItem>

              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
