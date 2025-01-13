import {useNavigate} from '@remix-run/react'
import {NavigateOptions} from 'react-router'

export function useCustomNavigate() {
  const navigate = useNavigate()

  const customNavigate = (
    to: string | number, // Can be a URL string or a number for relative navigation
    options?: NavigateOptions,
    event?:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    if (typeof to === 'string') {
      if (event?.metaKey || event?.ctrlKey) {
        window.open(to, '_blank')
      } else {
        navigate(to, options)
      }
    } else if (typeof to === 'number') {
      navigate(to)
    }
  }

  return customNavigate
}
