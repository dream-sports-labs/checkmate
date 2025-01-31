import {vitePlugin as remix} from '@remix-run/dev'
import {installGlobals} from '@remix-run/node'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import {API, API_RESOLUTION_PATHS, CLOSED_API} from './app/routes/utilities/api'

installGlobals()
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    remix({
      routes(defineRoutes) {
        return defineRoutes((route) => {
          Object.keys(API).forEach((key) => {
            const apiPath = API[key as keyof typeof API]
            const routePath =
              API_RESOLUTION_PATHS[apiPath as keyof typeof API_RESOLUTION_PATHS]
            if (
              apiPath &&
              routePath &&
              !CLOSED_API[key as keyof typeof CLOSED_API]
            ) {
              route(apiPath, routePath)
            }
          })
        })
      },
    }),
    tsconfigPaths(),
    ,
  ],
  esbuild: {
    target: 'es2022',
  },
  build: {
    target: 'es2022',
  },
  server: {
    port: 1200,
  },
})
