enum EnvArgs {
  GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID',
  GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET',
}

type TEnv = Record<EnvArgs, string>

const initialValue: TEnv = {
  [EnvArgs.GOOGLE_CLIENT_ID]: '',
  [EnvArgs.GOOGLE_CLIENT_SECRET]: '',
}

const makeConfig = (): TEnv => {
  let initial = ''
  if (process.env.DEPLOYMENT === 'production') {
    initial = 'VAULT_SERVICE_'
  }

  return Object.keys(EnvArgs).reduce((prev, curr) => {
    return {...prev, [curr]: process.env[`${initial}${curr}`] ?? ''}
  }, initialValue)
}

export const env: TEnv = makeConfig()
