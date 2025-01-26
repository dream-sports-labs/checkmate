import {Loader} from '@components/Loader/Loader'
import {
  DropdownMenuCheckboxes,
  IDropdownMenuCheckboxes,
} from '@components/TestsFilter/DropdownMenuCheckboxes'
import {Lables} from '~/screens/CreateRun/RunFilter'
import {setUpdatedFilterList} from '@components/TestsFilter/utils'
import {useFetcher, useParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {Input} from '@ui/input'
import {Label} from '@ui/label'
import {useToast} from '@ui/use-toast'
import Papa from 'papaparse'
import {ChangeEvent, useEffect, useState} from 'react'
import {LARGE_PAGE_SIZE as PAGE_SIZE} from '~/routes/utilities/constants'
import {ConstantStrings, MandatoryColumns} from '../../constants'

import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {ORG_ID} from '~/routes/utilities/constants'
import {transformObject} from '../utils'
import {ImportTestInfoBox} from './UploadTestsInfoBox'
import {UploadDataTable} from './UploadDataTable'
import {API} from '@route/utils/api'

export default function UploadTests() {
  const [data, setData] = useState([])

  const orgId = ORG_ID

  const labelsFetcher = useFetcher<{data: Lables[]}>()
  const submitTestHandler = useFetcher<any>()
  const [selectLabelsList, setSelectLabelsList] = useState<
    IDropdownMenuCheckboxes[]
  >([])

  const navigation = useCustomNavigate()

  const projectId = Number(useParams().projectId)

  useEffect(() => {
    labelsFetcher.load(`/${API.GetLabels}?projectId=${projectId}`)
  }, [])

  const {toast} = useToast()

  useEffect(() => {
    if (labelsFetcher.data?.data && selectLabelsList.length === 0) {
      const labels = labelsFetcher.data?.data
      setSelectLabelsList(
        labels.map((label) => {
          return {
            name: label.labelName || 'None',
            id: label.labelId || 0,
            selected: false,
          }
        }),
      )
    }
  }, [labelsFetcher.data?.data])

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files?.[0]) {
      return
    }

    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function ({data}: {data: any[]}) {
        // Checking if the file has any data
        if (data.length === 0) {
          toast({
            variant: 'destructive',
            description: 'No data found in the file',
          })
          return
        }

        //Checking if the file has all the required columns
        const headers = Object.keys(data[0])
        const hasAllMandatoryColumns = MandatoryColumns.every((col) => {
          if (headers.includes(col)) return true
          else {
            toast({
              variant: 'destructive',
              description: `Column ${col} is missing`,
            })
            return false
          }
        })

        if (!hasAllMandatoryColumns) return

        data = data.map((row, index) => ({...row, index: index + 1}))
        setData(data as any)
      },
    })
  }

  const handleCheckboxChange = ({
    filterName,
    value,
  }: {
    filterName: string
    value: string
    property?: string
  }) => {
    if (filterName === 'labels') {
      setUpdatedFilterList(value, selectLabelsList, setSelectLabelsList)
    }
  }

  const submitTest = () => {
    const selectedLabelIds = selectLabelsList
      .filter((label) => label.selected)
      .map((label) => label.id)

    const tests = data.map((tests) => {
      return transformObject(tests)
    })

    const ids = tests.filter((item) => item?.testId)
    if (ids.length != 0 && ids.length != tests.length) {
      toast({
        variant: 'destructive',
        description: `Some rows contain IDs and some does not`,
      })
      return
    }
    submitTestHandler.submit(
      {
        labelIds: selectedLabelIds,
        projectId: projectId,
        tests: tests,
        orgId: orgId ? orgId : 1,
      },
      {
        method: 'POST',
        action: `/${API.AddTestBulk}`,
        encType: 'application/json',
      },
    )
  }

  useEffect(() => {
    if (submitTestHandler.data) {
      const data = submitTestHandler.data

      if (data.error) {
        toast({
          variant: 'destructive',
          description: data?.error ?? 'Something went wrong',
        })
      } else if (data.data) {
        navigation(`/project/${projectId}/tests?page=1&pageSize=${PAGE_SIZE}`, {
          replace: true,
          state: {data: data?.data},
        })
      }
    }
  }, [submitTestHandler.state])

  return (
    <div className="flex flex-col pt-8 min-w-96 h-full">
      <div className="flex flex-col mb-4">
        <Label htmlFor="file">Upload CSV File: </Label>
        <div className="flex flex-row items-center">
          <Input
            className="mt-2 max-w-80"
            type="file"
            accept=".csv"
            onChange={changeHandler}
          />
          <ImportTestInfoBox />
        </div>
        <span className="text-xs mt-1 ml-2 text-slate-500">
          {`*${ConstantStrings.CsvValidColumnsMessage}`}
        </span>
      </div>
      {data.length ? (
        <>
          <div className="flex  min-w-fit mb-4 gap-2">
            <span className="self-center text-nowrap font-semibold">{`Total number of test cases:`}</span>
            <span className="self-center text-nowrap text-blue-700 font-bold">{` ${data.length}`}</span>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="labels" className="text-right font-semibold">
                Labels
              </Label>
              <DropdownMenuCheckboxes
                filterName="labels"
                list={selectLabelsList}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
            <Button onClick={submitTest} className="flexe ml-auto mr-12">
              Submit Tests
            </Button>
          </div>
          <div className="flex-grow overflow-auto max-h-full">
            <UploadDataTable data={data} />
          </div>
        </>
      ) : null}
      {submitTestHandler.state !== 'idle' && <Loader />}
    </div>
  )
}
