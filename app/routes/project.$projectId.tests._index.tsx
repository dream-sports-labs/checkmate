import {Loader} from '@components/Loader/Loader'
import {SectionList} from '@components/SectionList/SectionList'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@ui/resizable'
import {useNavigation} from 'react-router'
import TestListPage from '~/screens/TestList/TestListPage'
import {loader as testsApiLoader} from './api/v1/tests'

export const loader = testsApiLoader

export default function TestsList() {
  const {state} = useNavigation()
  return (
    <div className={'flex flex-row h-full mr-[-80px] -ml-12'}>
      <ResizablePanelGroup direction={'horizontal'}>
        <ResizablePanel order={1} className={'mr-4'} defaultSize={80}>
          <TestListPage />
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
      {state !== 'idle' ? <Loader /> : null}
    </div>
  )
}
