export class SqlError extends Error {
  constructor(message: string, options: {cause?: string} = {}) {
    super(message)
    this.name = 'SqlError'
    if (options.cause) {
      this.cause = options.cause
    }
  }
}
