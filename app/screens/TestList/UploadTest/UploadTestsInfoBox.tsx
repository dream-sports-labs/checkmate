import {HoverCard, HoverCardContent, HoverCardTrigger} from '@ui/hover-card'
import {Info} from 'lucide-react'

export const ImportTestInfoBox = () => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Info size={20} className="self-center align-middle ml-2" />
      </HoverCardTrigger>
      <HoverCardContent className="min-w-80 text-sm">
        <div className="flex flex-row">
          <h6 className="scroll-m-20 font-semibold tracking-tight">
            Must Have Columns in CSV
          </h6>
        </div>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          <li>Title, character length must be greater then 5</li>
          <li>Section and Section Hierarchy</li>
        </ul>
        <div className="flex flex-row mt-4 ">
          <h6 className="scroll-m-20 font-semibold tracking-tight">
            Columns data considered while storing
          </h6>
        </div>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          <li>ID, must me less then 30lac</li>
          <li>Squad</li>
          <li>Priority</li>
          <li>Platform</li>
          <li>Test Covered By</li>
          <li>Preconditions</li>
          <li>Expected Result</li>
          <li>Description</li>
          <li>Additional Groups</li>
          <li>Automation Id</li>
        </ul>
        <div className="text-xs flex flex-col mt-2 text-red-600">
          <span>*Make sure either all contain ID or none contains it</span>
          <span>*Section, Squad not present will be added.</span>
          <span>
            *Default value for Priority[Medium], Platform[All Platform] will be
            set.
          </span>
        </div>
        <a
          style={{color: 'rgb(37 99 235)', marginTop: '10px'}}
          href={
            'https://checkmate.dreamsportslabs.com/guides/tests/bulk-addition'
          }
          target="_blank"
          rel="noopener noreferrer">
          Detailed Documentation
        </a>
      </HoverCardContent>
    </HoverCard>
  )
}
