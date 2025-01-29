import {safeJsonParse} from '@route/utils/utils'

export const isChecked = ({
  searchParams,
  filterName,
  filterId,
}: {
  searchParams: URLSearchParams
  filterName: 'squadIds' | 'labelIds' | 'platformIds' | 'statusArray'
  filterId: number | string
}): boolean => {
  let isChecked: boolean = false

  if (
    searchParams.has(filterName) &&
    (filterName === 'squadIds' ||
      filterName === 'labelIds' ||
      filterName === 'platformIds' ||
      filterName === 'statusArray')
  ) {
    const filter = searchParams.get(filterName)
    const filterArray = safeJsonParse(filter)
    isChecked = filterArray?.includes(filterId) ?? false
  }

  return isChecked
}

export const downloadReport = async ({
  fetchUrl,
  fileName,
  setDownloading,
}: {
  fetchUrl: string
  fileName: string | undefined
  setDownloading: (downloading: boolean) => void
}) => {
  setDownloading(true)

  try {
    const response = await fetch(fetchUrl)

    if (!response.ok) {
      throw new Error('Failed to download CSV')
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${fileName ? fileName : 'report'}.csv`)
    document.body.appendChild(link)
    link.click()

    // Clean up
    link.remove()
    URL.revokeObjectURL(url)
    setDownloading(false)
  } catch (error) {
    console.error('Error downloading CSV:', error)
    setDownloading(false)
  }
}
