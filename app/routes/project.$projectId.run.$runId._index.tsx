import {SectionList} from '@components/SectionList/SectionList'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@ui/resizable'
import RunTestList from '~/screens/RunTestList/RunTestList'
import {loader as testRunsDataApi} from './api/v1/runTestsList'

export const loader = testRunsDataApi

export default function RunsTestList() {
  return (
    <div className={'flex flex-row h-full mr-[-80px] -ml-12'}>
      <ResizablePanelGroup direction={'horizontal'}>
        <ResizablePanel order={1} className={'mr-4'} defaultSize={80}>
          <RunTestList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          order={2}
          maxSize={20}
          minSize={4}
          collapsedSize={4}
          defaultSize={20}
          collapsible={true}
          style={{overflow: 'hidden'}}>
          <SectionList />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
