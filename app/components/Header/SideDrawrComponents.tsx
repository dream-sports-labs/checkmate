import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {SMALL_PAGE_SIZE} from '@route/utils/constants'
import {Button} from '@ui/button'

export const FooterComponent = ({
  setSideDrawerOpen,
  href,
  text,
}: {
  setSideDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  href: string
  text: string
}) => {
  return (
    <a
      onClick={() => setSideDrawerOpen(false)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:text-pale-blue font-semibold hover:underline">
      {text}
    </a>
  )
}

export const ContentComponent = ({
  setSideDrawerOpen,
  navigateTo,
  text,
}: {
  setSideDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  navigateTo: string
  text: string
}) => {
  const navigate = useCustomNavigate()
  return (
    <Button
      onClick={(e) => {
        setSideDrawerOpen(false)
        navigate(navigateTo, {}, e)
      }}
      size={'lg'}
      className="font-semibold p-0 "
      variant={'link'}>
      <text>{text}</text>
    </Button>
  )
}
