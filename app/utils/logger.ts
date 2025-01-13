export enum LogType {
  EXCEPTION,
  ERROR,
  WARN,
  INFO,
  DEBUG,
  SQL_ERROR,
}

export const logger = ({
  type,
  tag = '',
  message,
}: {
  type: LogType
  tag?: String
  message: string
}) => {
  console.log(
    `[${new Date(Date.now()).toLocaleString()}] [${
      LogType[type]
    }]:::: ${tag}, [${message}]`,
  )
}
