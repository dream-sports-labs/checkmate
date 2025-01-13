import {RunDetails} from '@api/runData'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {LockKeyhole, LockKeyholeOpen} from 'lucide-react'

interface IRunPageTitle {
  runData: null | RunDetails
}
export const RunPageTitle = ({runData}: IRunPageTitle) => {
  return (
    <>
      <span className="flex text-2xl center ">{runData?.runId}.</span>
      <span className="flex text-2xl center ml-1">{runData?.runName}</span>

      {runData?.status === 'Active' ? (
        <Tooltip
          anchor={
            <LockKeyholeOpen color="#17B169" size={24} className="ml-1" />
          }
          content={'Active'}
        />
      ) : (
        <Tooltip
          anchor={<LockKeyhole color="#BA0021" size={24} className="ml-1" />}
          content={'Locked'}
        />
      )}
    </>
  )
}
