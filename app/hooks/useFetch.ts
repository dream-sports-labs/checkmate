import {useCallback, useState} from 'react'

export type FetchMethods = 'get' | 'post' | 'put' | 'patch'

type FetcherFunctionBase = {
  cancel(): void
  controller: AbortController
}

type FetcherFunction<TBody> = FetcherFunctionBase & TBody extends never
  ? () => void
  : (body: TBody) => void

export function useFetch<TData, TBody = never>(
  url: string,
  method: FetchMethods = 'get',
) {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetcher = useCallback(
    function fetcher(this: FetcherFunctionBase, body: TBody) {
      setLoading(true)

      const parsedBody = body ? JSON.stringify(body) : null
      const newUrl = new URL(`${location.origin}${url}`)

      newUrl.searchParams.set('index', 'true')

      const headers = new Headers()
      headers.append('Content-Type', 'application/json')
      headers.append('Access-Control-Allow-Origin', location.origin)

      fetch(newUrl, {
        signal: this.controller.signal,
        method: method || 'get',
        body: parsedBody,
        headers,
      })
        .then(async (res) => {
          const result = await res.json()
          setData(result)
        })
        .catch((e) => {
          setError(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }.bind({
      controller: new AbortController(),
      cancel() {
        this.controller.abort()
      },
    }),
    [url, method],
  ) as unknown as FetcherFunction<TBody>

  return [fetcher, {loading, data, error}] as const
}
