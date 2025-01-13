import * as fs from 'node:fs'

import {createServer} from 'http'

import {createRequestHandler} from '@remix-run/express'
import {installGlobals} from '@remix-run/node'
import chalk from 'chalk'
import express from 'express'
import morgan from 'morgan'

const isProd = process.env.NODE_ENV === 'production'

const start = Date.now()

let viteVersion
let remixVersion
if (process.env.NODE_ENV !== 'production') {
  // get the vite version from the vite package.json
  viteVersion = JSON.parse(
    fs.readFileSync('node_modules/vite/package.json'),
  ).version
  remixVersion = JSON.parse(
    fs.readFileSync('node_modules/@remix-run/dev/package.json'),
  ).version
}

installGlobals()

let vite = isProd
  ? undefined
  : await import('vite').then(({createServer}) =>
      createServer({
        server: {
          middlewareMode: true,
        },
      }),
    )

const app = express()

const httpServer = createServer(app)

if (vite) {
  app.use(vite.middlewares)
} else {
  app.use(morgan('tiny'))
  app.use(
    '/assets',
    express.static('build/client/assets', {immutable: true, maxAge: '1y'}),
  )
}
app.use(express.static('build/client', {maxAge: '1h'}))

app.get('/healthcheck', (_, res) => {
  console.log('Health check succeeded', Date.now())
  res.statusCode = 200
  res.sendStatus(200)
})

const port = parseInt(process.env.PORT || '', 10) || 3000

httpServer.listen(port, async () => {
  if (!isProd) {
    console.log(
      chalk.greenBright.bold('VITE'),
      chalk.green(`v${viteVersion}`),
      chalk.blueBright.bold('Remix'),
      chalk.blue(`v${remixVersion}`),
      chalk.dim('ready in'),
    )
  }

  console.log(
    '  ',
    chalk.greenBright.bold('➜'),
    chalk.bold('Local:'),
    chalk.cyan(`http://localhost:${port}`),
  )

  if (process.env.SKIP_REMIX !== 'true') {
    console.log(
      '  ',
      chalk.greenBright.bold('➜'),
      chalk.bold('Checkmate:'),
      chalk.green('Enabled'),
    )

    try {
      if (vite) {
        app.all(
          '*',
          createRequestHandler({
            build: () => vite.ssrLoadModule('virtual:remix/server-build'),
          }),
        )
        console.log(
          '  ',
          chalk.dim('Server ready in'),
          chalk.dim.bold(`${Date.now() - start}ms`),
        )
        console.log()
      } else {
        import('./build/server/index.js')
          .then((build) => {
            app.all(
              '*',
              createRequestHandler({
                build,
              }),
            )

            console.log(
              '  ',
              chalk.dim('Server ready in'),
              chalk.dim.bold(`${Date.now() - start}ms`),
            )
            console.log()
          })
          .catch((e) => {
            throw e
          })
      }
    } catch (e) {
      process.exit(1)
    }
  } else {
    console.log(
      '  ',
      chalk.greenBright.bold('➜'),
      chalk.bold('Checkmate:'),
      chalk.red('Disabled'),
    )
  }
})
