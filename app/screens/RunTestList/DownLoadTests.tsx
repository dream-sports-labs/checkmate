import {Tooltip} from '@components/Tooltip/Tooltip'
import {cn} from '@ui/utils'
import {Download, LoaderCircle} from 'lucide-react'
import {throttle} from '../TestList/utils'
import {useState} from 'react'
import {downloadReport} from './utils'

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
  const [downloading, setDownloading] = useState<boolean>(false)

  const debouncedDownloadTestsExecution = throttle(
    () => downloadReport({fetchUrl, fileName, setDownloading}),
    5000,
  )

  return (
    <Tooltip
      anchor={
        !downloading ? (
          <Download
            size={style?.size}
            strokeWidth={style?.strokeWidth}
            onClick={debouncedDownloadTestsExecution}
            className={cn('hover:cursor-pointer', className)}
          />
        ) : (
          <LoaderCircle
            size={style?.size}
            strokeWidth={style?.strokeWidth}
            className={'animate-spin'}
          />
        )
      }
      content={tooltipText}
    />
  )
}
