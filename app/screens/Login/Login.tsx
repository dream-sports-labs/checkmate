import {useSubmit} from '@remix-run/react'
import {cn} from '@ui/utils'
import {APP_NAME} from '~/constants'
import {GoogleAuthButton} from '~/screens/Login/GoogleAuthButton'
import {useHomePageDots} from '~/screens/Login/useDots'
import {AuthenticatorRoutes} from '~/services/auth/interfaces'

export const Login = () => {
  const {dots, mousePosition} = useHomePageDots({rows: 20, cols: 30})

  const submit = useSubmit()
  const login = () => {
    submit(null, {
      method: 'POST',
      action: AuthenticatorRoutes.LOGIN,
    })
  }

  return (
    <div
      className={
        'flex absolute flex-row justify-center items-center h-full -mx-20'
      }>
      <div className="relative w-screen bg-[#000000] h-full">
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(24, 60, 81), transparent)`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full space-y-4 text-center">
          <h1 className="text-5xl font-extrabold text-white">
            Welcome to {APP_NAME}
          </h1>
          <p className="text-lg text-gray-300">
            More than just a Test Management tool
          </p>
          <div className="pt-4">
            <GoogleAuthButton onClick={login} />
          </div>
        </div>
        {dots.map((dot) => (
          <div
            key={dot.id}
            className={cn(`absolute h-0.5 bg-gray-700 rounded-full`)}
            style={{
              top: `${dot.y}px`,
              left: `${dot.x}px`,
              transform: `rotate(${dot.angle}deg)`,
              width: `${dot.dotWidth}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
