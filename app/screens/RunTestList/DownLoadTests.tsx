import {Tooltip} from '@components/Tooltip/Tooltip'
import {cn} from '@ui/utils'
import {Download} from 'lucide-react'
import {throttle} from '../TestList/utils'

interface IDownLoadTests {
  tooltipText: string
  style?: {
    size: number
    strokeWidth: number
  }
  fetchUrl: string
  fileName?: string
  className?: string
}
export const DownLoadTests = ({
  style,
  tooltipText,
  fetchUrl,
  fileName,
  className,
}: IDownLoadTests) => {
  const downloadReport = async () => {
    const downloadCSV = async () => {
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
      } catch (error) {
        console.error('Error downloading CSV:', error)
      }
    }

    downloadCSV()
  }

  const debouncedDownloadTestsExecution: any = throttle(downloadReport, 5000)

  return (
    <Tooltip
      anchor={
        <Download
          size={style?.size}
          strokeWidth={style?.strokeWidth}
          onClick={debouncedDownloadTestsExecution}
          className={cn('hover:cursor-pointer', className)}
        />
      }
      content={tooltipText}
    />
  )
}
