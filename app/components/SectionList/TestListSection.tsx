import {SectionList} from '@components/SectionList/SectionList'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@ui/resizable'
import TestListPage from '~/screens/TestList/TestListPage'

export const TestListSection = () => {
  return (
    <ResizablePanelGroup direction={'horizontal'}>
      <ResizablePanel className={'mr-4'} defaultSize={80}>
        <TestListPage />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        minSize={15}
        collapsedSize={4}
        maxSize={25}
        defaultSize={20}
        collapsible={true}>
        <SectionList />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
