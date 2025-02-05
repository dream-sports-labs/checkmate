import {API} from '~/routes/utilities/api'
import {CustomDrawer} from '@components/CustomDrawer'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {Button} from '@ui/button'
import {Skeleton} from '@ui/skeleton'
import {useEffect, useState} from 'react'
import {useFetcher} from 'react-router-dom'
import {LinkContent, OptionContent, TextContent} from '../TestDetail/Contents'
import {InputLabels} from './InputLabels'
import {AddResultDialog} from '../RunTestList/AddResultDialog'
import {TestStatusType} from '@controllers/types'
import {StatusEntry} from '@api/testStatusHistory'
import {TestStatusHistroyDialog} from '../TestDetail/TestStatusHistroyDialog'

export interface TestDetailAPI {
  additionalGroups?: string
  automationId?: string
  automationStatus?: string
  defects?: string
  description?: string
  expectedResult: string
  jiraTicket?: string
  labelNames?: string
  platform: string
  preConditions?: string
  priority: string
  section: string
  sectionHierarchy?: string
  squad?: string
  steps: string
  testCoveredBy?: string
  title: string
  type?: string
  automationStatusName?: string
  testId: number
}

export const TestDetailDrawer = ({
  isOpen,
  onClose,
  props,
  pageType,
  runActive = false,
}: {
  isOpen: boolean
  onClose: () => void
  props: {projectId: number; testId: number; runId?: number}
  pageType: 'testDetail' | 'runTestDetail'
  runActive?: boolean
}) => {
  const testDetailFetcher = useFetcher<{data: TestDetailAPI}>()
  const [data, setData] = useState<TestDetailAPI | null>(null)
  const infoTextStyle = {
    fontSize: 14,
    color: 'rgb(31 41 55)',
    paddingTop: 2,
  }
  const testStatusHistoryFetcher = useFetcher<any>()
  const [testStatusHistory, setTestStatusHistory] = useState<{
    data: StatusEntry[]
  }>()

  const testDetailClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (pageType === 'runTestDetail')
      navigate(
        `/project/${props.projectId}/run/${props.runId}/test/${props.testId}`,
        {},
        e,
      )
    else navigate(`/project/${props.projectId}/tests/${props.testId}`, {}, e)
  }

  useEffect(() => {
    if (isOpen) {
      testDetailFetcher.load(
        `/${API.GetTestDetails}?projectId=${props.projectId}&testId=${props.testId}`,
      )
      if (pageType === 'runTestDetail')
        testStatusHistoryFetcher.load(
          `/${API.GetTestStatusHistoryInRun}?runId=${props.runId}&testId=${props.testId}`,
        )
    }
  }, [isOpen])

  useEffect(() => {
    if (testDetailFetcher.data?.data) setData(testDetailFetcher.data?.data)
  }, [testDetailFetcher.data])

  useEffect(() => {
    if (testStatusHistoryFetcher && testStatusHistoryFetcher.data) {
      setTestStatusHistory(testStatusHistoryFetcher.data)
    }
  }, [testStatusHistoryFetcher.data])

  const navigate = useCustomNavigate()
  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose}>
      {data ? (
        <div
          style={{
            fontSize: 14,
            padding: 4,
            marginTop: 16,
            backgroundColor: 'rgb(241 245 249)',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <InputLabels className="ml-2" labelName={data?.title} />
          <InputsSpacing />
          <div className="flex flex-row flex-wrap gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
            {data?.description && (
              <div className="w-full items-center">
                <InputLabels labelName={'Description'} />
                <div style={infoTextStyle}>{data?.description}</div>
              </div>
            )}
            <div className="w-full items-center">
              <InputLabels labelName={'Test Id'} />
              <div style={infoTextStyle}>{data?.testId}</div>
              <InputsSpacing />

              <InputLabels labelName={'Section'} />
              <div style={infoTextStyle}>{data?.sectionHierarchy}</div>
            </div>
          </div>
          <InputsSpacing />
          <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
            <OptionContent data={data?.squad} heading="Squad" />
            <OptionContent
              data={data?.labelNames?.split(',')?.join(', ')}
              heading="Labels"
            />
            <OptionContent data={data?.priority} heading="Priority" />
            <OptionContent
              data={data?.automationStatusName}
              heading="Automation Status"
            />
            <OptionContent data={data?.type} heading="Type" />
            <OptionContent data={data?.platform} heading="Plaform" />
            <OptionContent
              data={data?.testCoveredBy}
              heading="Test Covered By"
            />
            <LinkContent heading="Jira Ticket" data={data?.jiraTicket} />
            <OptionContent data={data?.defects} heading="Defects" />
            <OptionContent data={data?.automationId} heading="Automation Id" />
          </div>
          <InputsSpacing />
          <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-md max-h-fit">
            <TextContent data={data?.preConditions} heading={'Preconditions'} />
            <TextContent data={data?.steps} heading={'Steps'} />
            <TextContent
              data={data?.expectedResult}
              heading={'Expected Result'}
            />
            <TextContent
              data={data?.additionalGroups}
              heading={'Additional Groups'}
            />
          </div>
          <InputsSpacing />
          <div className="py-2 flex items-center justify-end gap-4 text-sm w-full border-cyan-900 max-h-28">
            {pageType === 'runTestDetail' && runActive && testStatusHistory && (
              <AddResultDialog
                getSelectedRows={() => {
                  return [{testId: props.testId}]
                }}
                runId={props?.runId ?? 0}
                variant="detailPageUpdate"
                currStatus={
                  (testStatusHistory?.data?.[0]?.status as TestStatusType) ??
                  (TestStatusType.Untested as TestStatusType)
                }
              />
            )}
            {testStatusHistory && (
              <TestStatusHistroyDialog
                data={testStatusHistory}
                pageType={pageType}
              />
            )}
            <Button onClick={testDetailClicked}>Test Details</Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            fontSize: 14,
            padding: 4,
            marginTop: 16,
            backgroundColor: 'rgb(241 245 249)',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-8 w-1/4 self-end" />
        </div>
      )}
    </CustomDrawer>
  )
}
