import {Tooltip} from '@components/Tooltip/Tooltip'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useParams} from '@remix-run/react'
import {Separator} from '@ui/separator'
import {Upload} from 'lucide-react'
import {useSearchParams} from 'react-router-dom'
import {API} from '~/routes/utilities/api'
import {DownLoadTests} from '../RunTestList/DownLoadTests'

export const UploadDownloadButton = ({projectName}: {projectName: string}) => {
  const projectId = useParams().projectId ? Number(useParams().projectId) : 0
  const navigate = useCustomNavigate()
  const [searchParams, _] = useSearchParams()

  return (
    <div className="flex flex-row border border-input bg-background shadow-sm rounded-md	w-20	h-8 justify-between ml-4 mr-2 px-2">
      <Tooltip
        anchor={
          <Upload
            strokeWidth={1.5}
            size={20}
            className={'self-center cursor-pointer'}
            onClick={(e) =>
              navigate(`/project/${projectId}/uploadTests`, {}, e)
            }
          />
        }
        content={'Upload Test'}
      />

      <Separator orientation="vertical" className="my-2 h-5" />

      <DownLoadTests
        style={{size: 20, strokeWidth: 1.5}}
        className={'self-center cursor-pointer'}
        tooltipText={'Download Tests'}
        fetchUrl={`/${API.DownloadTests}?projectId=${projectId}&${searchParams}`}
        fileName={`${projectName}-project`}
      />
    </div>
  )
}
