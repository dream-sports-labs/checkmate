import {SectionList} from '@components/SectionList/SectionList'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@ui/resizable'
import RunTestList from '~/screens/RunTestList/RunTestList'

export const RunListSection = () => {
  return (
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
  )
}
