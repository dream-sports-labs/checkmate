import {useEffect, useState} from 'react'

export const useHomePageDots = ({rows, cols}: {rows: number; cols: number}) => {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0})
  const [dots, setDots] = useState(() => {
    const dotsArray = []
    const spacingX = 1800 / cols
    const spacingY = 1000 / rows

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dotsArray.push({
          id: y * cols + x,
          x: spacingX * x + spacingX / 2,
          y: spacingY * y + spacingY / 2,
          dotWidth: 2,
          angle: 0,
        })
      }
    }
    return dotsArray
  })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const {clientX, clientY} = event
      setMousePosition({x: clientX, y: clientY})

      setDots(
        dots.map((dot) => {
          const dx = clientX - dot.x
          const dy = clientY - dot.y
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI
          const dotWidth = Math.max(
            2,
            +(((Math.abs(dx) + Math.abs(dy)) / 2800) * 30).toFixed(2),
          )

          return {
            ...dot,
            dotWidth,
            angle,
          }
        }),
      )
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return {mousePosition, dots}
}
