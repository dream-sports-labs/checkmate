import {API} from '~/routes/utilities/api'
import {TestStatusData} from '@api/testStatus'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher, useLoaderData, useParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {cn} from '@ui/utils'
import {useEffect, useState} from 'react'
import {AddResultDialog} from '../RunTestList/AddResultDialog'
import {InputLabels} from '../TestList/InputLabels'
import {LinkContent, OptionContent, TextContent} from './Contents'
import {TestStatusHistroyDialog} from './TestStatusHistroyDialog'
import {shortDate2} from '~/utils/getDate'
import {Tooltip} from '@components/Tooltip/Tooltip'

export default function TestDetailsPage({
  pageType,
}: {
  pageType: 'testDetail' | 'runTestDetail'
}) {
  const resp = useLoaderData<{data: any}>()
  const projectId = Number(useParams().projectId)
  const testId = Number(useParams().testId)
  const runId = Number(useParams().runId)

  const testStatusFetcher = useFetcher<any>()
  const testStatusHistoryFetcher = useFetcher<any>()

  const data = resp?.data
  const [testStatus, setTestStatus] = useState<TestStatusData>()
  const [testStatusHistory, setTestStatusHistory] = useState()

  const navigate = useCustomNavigate()

  useEffect(() => {
    pageType === 'runTestDetail'
      ? testStatusFetcher.load(
          `/${API.GetRunTestStatus}?projectId=${projectId}&runId=${runId}&testId=${testId}`,
        )
      : null

    testStatusHistoryFetcher.load(
      pageType === 'testDetail'
        ? `/${API.GetTestStatusHistory}?testId=${testId}`
        : `/${API.GetTestStatusHistoryInRun}?runId=${runId}&testId=${testId}`,
    )
  }, [projectId, testId, runId])

  useEffect(() => {
    if (testStatusFetcher.data) {
      setTestStatus(testStatusFetcher.data)
    }
  }, [testStatusFetcher.data])

  useEffect(() => {
    if (testStatusHistoryFetcher && testStatusHistoryFetcher.data) {
      setTestStatusHistory(testStatusHistoryFetcher.data)
    }
  }, [testStatusHistoryFetcher.data])

  const handleGoBack = () => {
    navigate(-1)
  }

  const editTestClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    navigate(
      `/project/${projectId}/tests/editTest/${testId}`,
      {
        state: {source: 'testDetail'},
      },
      e,
    )
  }

  const infoTextStyle = {
    fontSize: 14,
    color: 'rgb(31 41 55)',
    paddingTop: 2,
  }

  return (
    <div className={cn('flex', 'flex-col', 'h-full', '')}>
      <InputsSpacing />
      <div className="flex flex-row flex-wrap gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
        <div className="flex flex-row gap-16">
          <div className="w-full items-center">
            <InputLabels labelName={'Id'} />
            <div style={infoTextStyle}>{data?.testId}</div>
          </div>
        </div>
        <div className="w-full items-center">
          <InputLabels labelName={'Title'} />
          <div style={infoTextStyle}>{data?.title}</div>
        </div>
        {data?.description && (
          <div className="w-full items-center">
            <InputLabels labelName={'Description'} />
            <div style={infoTextStyle}>{data?.description}</div>
          </div>
        )}
        <div className="w-full items-center">
          <InputLabels labelName={'Section'} />
          <div style={infoTextStyle}>{data?.sectionHierarchy}</div>
        </div>
        <div className="flex flex-row gap-12">
          {data?.createdBy && (
            <div className="w-full items-center text-nowrap">
              <InputLabels labelName={'Created By'} />
              <Tooltip
                anchor={<div style={infoTextStyle}>{data?.createdBy}</div>}
                content={shortDate2(data?.createdOn)}
              />
            </div>
          )}
          {data?.updatedBy && (
            <div className="w-full items-center text-nowrap">
              <InputLabels labelName={'Updated By'} />
              <Tooltip
                anchor={<div style={infoTextStyle}>{data?.updatedBy}</div>}
                content={shortDate2(data?.updatedOn)}
              />
            </div>
          )}
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
          data={data?.automationStatus}
          heading="Automation Status"
        />
        <OptionContent data={data?.type} heading="Type" />
        <OptionContent data={data?.platform} heading="Plaform" />
        <OptionContent data={data?.testCoveredBy} heading="Test Covered By" />
        <LinkContent heading="Jira Ticket" data={data?.jiraTicket} />
        <OptionContent data={data?.defects} heading="Defects" />
        <OptionContent data={data?.automationId} heading="Automation Id" />
      </div>
      <InputsSpacing />
      <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-md max-h-fit">
        <TextContent data={data?.preConditions} heading={'Preconditions'} />
        <TextContent data={data?.steps} heading={'Steps'} />
        <TextContent data={data?.expectedResult} heading={'Expected Result'} />
        <TextContent
          data={data?.additionalGroups}
          heading={'Additional Groups'}
        />
      </div>
      <div className="py-8 flex items-center justify-start gap-4 text-sm w-full max-h-28">
        {pageType === 'runTestDetail' ? (
          testStatus?.data?.[0].runStatus === 'Active' ? (
            <AddResultDialog
              getSelectedRows={() => {
                return [{testId: testId}]
              }}
              runId={runId}
              variant="detailPageUpdate"
              currStatus={testStatus?.data?.[0]?.status}
            />
          ) : null
        ) : (
          <Button onClick={editTestClicked}>Edit Test</Button>
        )}
        {testStatusHistory && (
          <TestStatusHistroyDialog
            data={testStatusHistory}
            pageType={pageType}
          />
        )}
        <Button
          asChild
          className="border-2"
          variant={'outline'}
          onClick={handleGoBack}
          style={{cursor: 'pointer'}}>
          <span>Cancel</span>
        </Button>
      </div>
    </div>
  )
}
