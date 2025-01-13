import {SectionList} from '@components/SectionList/SectionList'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@ui/resizable'
import {Tests} from '~/screens/RunTestList/interfaces'
import RunTestList from '~/screens/RunTestList/RunTestList'
import {loader as testRunsDataApi} from './api/v1/runTestsList'

export interface RunTestListResponseType {
  data: {
    testsList: Tests[]
    totalCount: number
    error: any
    status: number
  }
}

export const loader = testRunsDataApi

export default function RunsTestList() {
  return (
    <div className={'flex flex-row h-full mr-[-80px] -ml-12'}>
      <ResizablePanelGroup direction={'horizontal'}>
        <ResizablePanel className={'mr-4'} defaultSize={80}>
          <RunTestList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          minSize={20}
          collapsedSize={4}
          maxSize={25}
          defaultSize={20}
          collapsible={true}>
          <SectionList />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
