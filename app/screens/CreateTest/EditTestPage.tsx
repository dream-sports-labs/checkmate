import {TestDetailsResponse} from '@api/testDetails'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {IGetAllSectionsResponse} from '@controllers/sections.controller'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher, useParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {toast} from '@ui/use-toast'
import {cn} from '@ui/utils'
import {useCallback, useEffect, useState} from 'react'
import {API} from '~/routes/utilities/api'
import {
  ORG_ID,
  LARGE_PAGE_SIZE as PAGE_SIZE,
} from '~/routes/utilities/constants'
import {
  AutomationStatus,
  Lables,
  Platforms,
  Priority,
  TestCoveredBy,
  Type,
} from '~/screens/CreateRun/CreateRunFilter'
import {Squad} from '~/screens/RunTestList/interfaces'
import {
  OptionsInputComponent,
  ShortTextInputComponent,
  TextInputComponent,
} from './EditTestComponents'
import {AddTestLabels, labelToFormFieldMapping, TestFormData} from './interface'
import {
  isMandatory,
  sectionListPlaceholder,
  squadListPlaceholder,
} from './utils'
import {getSectionHierarchy} from '@components/SectionList/utils'

export default function EditTestPage({
  source,
}: {
  source: 'testDetail' | 'testList' | 'addTest'
}) {
  const projectId = Number(useParams().projectId)
  const testId = Number(useParams().testId)
  const squadsFetcher = useFetcher<{data: Squad[]}>()
  const labelsFetcher = useFetcher<{data: Lables[]}>()
  const sectionFetcher = useFetcher<{data: IGetAllSectionsResponse[]}>()
  const priorityFetcher = useFetcher<{data: Priority[]}>()
  const automationStatusFetcher = useFetcher<{data: AutomationStatus[]}>()
  const typeFetcher = useFetcher<{data: Type[]}>()
  const platformFetcher = useFetcher<{data: Platforms[]}>()
  const testCoveredByFetcher = useFetcher<{data: TestCoveredBy[]}>()
  const testDetailsFetcher = useFetcher<{data: TestDetailsResponse}>()
  const [isAddAndNext, setIsAddAndNext] = useState(false)
  const orgId = ORG_ID
  const navigate = useCustomNavigate()

  useEffect(() => {
    squadsFetcher.load(`/${API.GetSquads}?projectId=${projectId}`)
    labelsFetcher.load(`/${API.GetLabels}?projectId=${projectId}`)
    sectionFetcher.load(`/${API.GetSections}?projectId=${projectId}`)
  }, [projectId])

  useEffect(() => {
    priorityFetcher.load(`/${API.GetPriority}?orgId=${orgId}`)
    automationStatusFetcher.load(`/${API.GetAutomationStatus}?orgId=${orgId}`)
    typeFetcher.load(`/${API.GetType}?orgId=${orgId}`)
    platformFetcher.load(`/${API.GetPlatforms}?orgId=${orgId}`)
    testCoveredByFetcher.load(`/${API.GetTestCoveredBy}?orgId=${orgId}`)
  }, [orgId])

  const testUpdationFetcher = useFetcher<any>()
  const addTestFetcher = useFetcher<any>()

  useEffect(() => {
    if (source !== 'addTest') {
      testDetailsFetcher.load(
        `/${API.GetTestDetails}?projectId=${projectId}&testId=${testId}`,
      )
    }
  }, [projectId, testId])

  const [formData, setFormData] = useState<TestFormData>({
    title: '',
    sectionId: 0,
    priorityId: 3,
    automationStatusId: 3,
    labelIds: [],
    platformId: 1,
    testCoveredById: 1,
  })

  useEffect(() => {
    if (testDetailsFetcher.data) {
      const sectionId = formData.sectionId
        ? formData.sectionId
        : sectionFetcher.data?.data?.find((section) => {
            return (
              section.sectionName === testDetailsFetcher.data?.data.section &&
              section.sectionId === testDetailsFetcher.data?.data.sectionId &&
              section.parentId ===
                testDetailsFetcher.data?.data.sectionParentId &&
              section.projectId === projectId
            )
          })?.sectionId || 0

      const squadId = formData.squadId
        ? formData.squadId
        : squadsFetcher.data?.data?.find((squad) => {
            return squad.squadName === testDetailsFetcher.data?.data.squad
          })?.squadId ?? null

      const priorityId = formData.priorityId
        ? formData.priorityId
        : priorityFetcher.data?.data?.find(
            (priority) =>
              priority.priorityName === testDetailsFetcher.data?.data.priority,
          )?.priorityId ?? 0

      const automationStatusId = formData.automationStatusId
        ? formData.automationStatusId
        : automationStatusFetcher.data?.data?.find(
            (automationStatus) =>
              automationStatus.automationStatusName ===
              testDetailsFetcher.data?.data.automationStatus,
          )?.automationStatusId || null

      const platformId = formData.platformId
        ? formData.platformId
        : platformFetcher.data?.data?.find(
            (platform) =>
              platform.platformName === testDetailsFetcher.data?.data.platform,
          )?.platformId ?? 0

      const testCoveredById = formData.testCoveredById
        ? formData.testCoveredById
        : testCoveredByFetcher.data?.data?.find(
            (testCoveredBy) =>
              testCoveredBy.testCoveredByName ===
              testDetailsFetcher.data?.data.testCoveredBy,
          )?.testCoveredById ?? null

      const labelNameArray =
        testDetailsFetcher.data?.data.labelNames?.split(',')

      const labelIdArray = formData.labelIds
        ? formData.labelIds
        : labelsFetcher.data?.data
        ? labelsFetcher.data.data
            .filter((label) => labelNameArray?.includes(label.labelName))
            .map((label) => label.labelId)
        : []

      const typeId = formData.typeId
        ? formData.typeId
        : typeFetcher.data?.data?.find(
            (type) => type.typeName === testDetailsFetcher.data?.data.type,
          )?.typeId ?? null

      setFormData({
        title: formData.title
          ? formData.title
          : testDetailsFetcher.data?.data?.title ?? '',
        preConditions: formData.preConditions
          ? formData.preConditions
          : testDetailsFetcher.data?.data?.preConditions ?? null,
        steps: formData.steps
          ? formData.steps
          : testDetailsFetcher.data?.data?.steps ?? null,
        expectedResult: formData.expectedResult
          ? formData.expectedResult
          : testDetailsFetcher.data?.data?.expectedResult ?? null,
        jiraTicket: formData.jiraTicket
          ? formData.jiraTicket
          : testDetailsFetcher.data?.data?.jiraTicket ?? null,
        defects: formData.defects
          ? formData.defects
          : testDetailsFetcher.data?.data?.defects ?? null,
        additionalGroups: formData.additionalGroups
          ? formData.additionalGroups
          : testDetailsFetcher.data?.data?.additionalGroups ?? null,
        automationId: formData.automationId
          ? formData.automationId
          : testDetailsFetcher.data?.data?.automationId ?? null,
        description: formData.description
          ? formData.description
          : testDetailsFetcher.data?.data?.description ?? null,
        sectionId,
        squadId,
        priorityId,
        automationStatusId,
        typeId,
        platformId,
        testCoveredById,
        labelIds: labelIdArray,
      })
    }
  }, [
    labelsFetcher.data,
    testCoveredByFetcher.data,
    platformFetcher.data,
    typeFetcher.data,
    automationStatusFetcher.data,
    priorityFetcher.data,
    squadsFetcher.data,
    testDetailsFetcher.data,
    sectionFetcher.data,
  ])

  const handleChange = useCallback(
    (e: any) => {
      const formField = labelToFormFieldMapping[e.target.id as AddTestLabels]
      if (formField) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [formField]: e.target.value,
        }))
      }
    },
    [setFormData],
  )

  const handleEditSubmit = useCallback(() => {
    testUpdationFetcher.submit(
      {...formData, projectId, testId},
      {
        method: 'put',
        action: `/${API.EditTest}`,
        encType: 'application/json',
      },
    )
  }, [formData, projectId, testId])

  const handleAddSubmit = useCallback(
    (addAndNext = false) => {
      addTestFetcher.submit(
        {...formData, projectId},
        {
          method: 'post',
          action: `/${API.AddTest}`,
          encType: 'application/json',
        },
      )
      setIsAddAndNext(addAndNext)
    },
    [formData, projectId],
  )

  useEffect(() => {
    if (addTestFetcher.data) {
      const data = addTestFetcher.data

      if (data.error) {
        toast({
          variant: 'destructive',
          description: data?.error ?? 'Something went wrong',
        })
      } else if (data.data) {
        if (isAddAndNext) {
          toast({
            variant: 'success',
            description: 'Testcase added, please add new one.',
          })

          setFormData((prevFormData) => ({
            ...prevFormData,
            title: '',
            labelIds: [],
            jiraTicket: '',
            defects: '',
            preConditions: '',
            steps: '',
            expectedResult: '',
          }))
        } else {
          navigate(`/project/${projectId}/tests?page=1&pageSize=${PAGE_SIZE}`, {
            replace: true,
            state: {data: data?.data ?? {}, isCreateTestPage: true},
          })
        }
      }
    }
  }, [addTestFetcher.state])

  useEffect(() => {
    if (testUpdationFetcher.data) {
      const data = testUpdationFetcher.data

      if (data.error) {
        toast({
          variant: 'destructive',
          description: data?.error ?? 'Something went wrong',
        })
      } else {
        if (source === 'testList')
          navigate(`/project/${projectId}/tests?page=1&pageSize=${PAGE_SIZE}`, {
            replace: true,
            state: {data: data?.data ?? {}, isEditTestPage: true},
          })
        else {
          navigate(`/project/${projectId}/tests/${testId}`, {
            replace: true,
            state: {data: data?.data ?? {}, isEditTestPage: true},
          })
        }
      }
    }
  }, [testUpdationFetcher.state])

  const handleGoBack = useCallback(() => {
    navigate(-1)
  }, [])

  return (
    <div className={cn('flex', 'flex-col', 'max-h-full')}>
      <InputsSpacing />
      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <ShortTextInputComponent
          labelName={AddTestLabels.Title}
          value={formData.title}
          onChange={handleChange}
          id={AddTestLabels.Title}
          isMandatory={isMandatory(AddTestLabels.Title)}
        />
        <InputsSpacing />
        <ShortTextInputComponent
          labelName={AddTestLabels.Description}
          id={AddTestLabels.Description}
          value={formData?.description ?? ''}
          onChange={handleChange}
        />
      </div>
      <InputsSpacing />
      <div className="flex flex-row flex-wrap gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
        {sectionFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.Section}
            isMandatory={isMandatory('Section')}
            placeholder={sectionListPlaceholder({
              sectionId: formData.sectionId,
              sectionData: sectionFetcher.data,
              newProperty: formData.new_section,
            })}
            key={AddTestLabels.Section}
            list={
              sectionFetcher.data?.data
                ? sectionFetcher.data?.data.map((section) => {
                    return {
                      id: section.sectionId,
                      property: section.sectionName,
                      name: getSectionHierarchy({
                        sectionId: section.sectionId,
                        sectionsData: sectionFetcher.data?.data,
                      }),
                    }
                  })
                : []
            }
            handleCheckboxChange={(param) => {
              setFormData({
                ...formData,
                sectionId: param.id,
                new_section: undefined,
              })
            }}
            createNewPropertyClicked={(section: string) => {
              setFormData({...formData, sectionId: 0, new_section: section})
            }}
            createNewToolTipString={`Select to create new section, use ' > ' for nested section`}
            addingNewValue={formData.new_section}
          />
        )}

        {squadsFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.Squad}
            placeholder={squadListPlaceholder({
              squadId: formData.squadId,
              squadData: squadsFetcher.data,
              newProperty: formData.new_squad,
            })}
            key={AddTestLabels.Squad}
            list={squadsFetcher.data?.data?.map((squad) => {
              return {
                id: squad.squadId,
                name: squad.squadName,
              }
            })}
            handleCheckboxChange={(param) => {
              setFormData({
                ...formData,
                squadId: param.id,
                new_squad: undefined,
              })
            }}
            createNewPropertyClicked={(squad: string) => {
              setFormData({...formData, squadId: 0, new_squad: squad})
            }}
            addingNewValue={formData.new_squad}
          />
        )}

        {labelsFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.Labels}
            key={AddTestLabels.Labels}
            placeholder={
              formData?.labelIds && formData?.labelIds?.length > 0
                ? labelsFetcher.data?.data
                    ?.filter((label) =>
                      formData.labelIds?.includes(label.labelId),
                    )
                    .map((label) => label.labelName)
                    .join(', ') ?? 'None'
                : 'None'
            }
            list={labelsFetcher.data?.data?.map((labels) => {
              return {
                id: labels.labelId,
                name: labels.labelName,
              }
            })}
            handleCheckboxChange={(param) => {
              setFormData((prevData) => {
                const isSelected = prevData?.labelIds?.includes(param.id)
                const updatedLabelIds = isSelected
                  ? prevData?.labelIds?.filter((id) => id !== param.id)
                  : [...prevData?.labelIds, param.id]
                return {...prevData, labelIds: updatedLabelIds}
              })
            }}
          />
        )}

        {priorityFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.Priority}
            isMandatory={isMandatory(AddTestLabels.Priority)}
            placeholder={
              formData.priorityId
                ? priorityFetcher.data?.data?.find(
                    (priority) => priority.priorityId === formData.priorityId,
                  )?.priorityName ?? 'None'
                : 'None'
            }
            key={AddTestLabels.Priority}
            list={priorityFetcher.data?.data?.map((priority) => {
              return {
                id: priority.priorityId,
                name: priority.priorityName,
              }
            })}
            handleCheckboxChange={(param) => {
              setFormData({...formData, priorityId: param.id})
            }}
          />
        )}

        {automationStatusFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.AutomationStatus}
            isMandatory={isMandatory(AddTestLabels.AutomationStatus)}
            key={AddTestLabels.AutomationStatus}
            placeholder={
              formData.automationStatusId
                ? automationStatusFetcher.data?.data?.find(
                    (item) =>
                      item.automationStatusId === formData.automationStatusId,
                  )?.automationStatusName ?? 'None'
                : 'None'
            }
            list={automationStatusFetcher.data?.data?.map(
              (automationStatus) => {
                return {
                  id: automationStatus.automationStatusId,
                  name: automationStatus.automationStatusName,
                }
              },
            )}
            handleCheckboxChange={(param) => {
              setFormData({...formData, automationStatusId: param.id})
            }}
          />
        )}

        {typeFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.Type}
            isMandatory={isMandatory('Type')}
            key={AddTestLabels.Type}
            placeholder={
              formData.typeId
                ? typeFetcher.data?.data?.find(
                    (item) => item.typeId === formData.typeId,
                  )?.typeName ?? 'None'
                : 'None'
            }
            list={typeFetcher.data?.data?.map((type) => ({
              id: type.typeId,
              name: type.typeName || 'Unknown Type',
            }))}
            handleCheckboxChange={(selectedOption) => {
              setFormData({...formData, typeId: selectedOption.id})
            }}
          />
        )}

        {platformFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.Platform}
            isMandatory={isMandatory('Platform')}
            key={AddTestLabels.Platform}
            placeholder={
              formData.platformId
                ? platformFetcher.data?.data?.find(
                    (item) => item.platformId === formData.platformId,
                  )?.platformName ?? 'None'
                : 'None'
            }
            list={platformFetcher.data?.data?.map((platform) => ({
              id: platform.platformId,
              name: platform.platformName || 'Unknown Platform',
            }))}
            handleCheckboxChange={(selectedOption) => {
              setFormData({...formData, platformId: selectedOption.id})
            }}
          />
        )}

        {testCoveredByFetcher.data?.data && (
          <OptionsInputComponent
            labelName={AddTestLabels.TestCoveredBy}
            isMandatory={isMandatory(AddTestLabels.TestCoveredBy)}
            key={AddTestLabels.TestCoveredBy}
            placeholder={
              formData.testCoveredById
                ? testCoveredByFetcher.data?.data?.find(
                    (item) => item.testCoveredById === formData.testCoveredById,
                  )?.testCoveredByName ?? 'None'
                : 'None'
            }
            list={testCoveredByFetcher.data?.data?.map((testCoveredBy) => ({
              id: testCoveredBy.testCoveredById,
              name:
                testCoveredBy.testCoveredByName || 'Unknown Test Covered By',
            }))}
            handleCheckboxChange={(selectedOption) => {
              setFormData({...formData, testCoveredById: selectedOption.id})
            }}
          />
        )}

        <div className="flex flex-wrap w-full items-center gap-2">
          <ShortTextInputComponent
            labelName={AddTestLabels.JiraTicket}
            id={AddTestLabels.JiraTicket}
            value={formData?.jiraTicket ?? ''}
            onChange={handleChange}
          />
          <ShortTextInputComponent
            labelName={AddTestLabels.Defects}
            id={AddTestLabels.Defects}
            value={formData?.defects ?? ''}
            onChange={handleChange}
          />
          <ShortTextInputComponent
            labelName={AddTestLabels.AutomationId}
            id={AddTestLabels.AutomationId}
            value={formData?.automationId ?? ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <InputsSpacing />
      <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-md h-screen">
        <TextInputComponent
          onChange={handleChange}
          id={AddTestLabels.Preconditions}
          labelName={AddTestLabels.Preconditions}
          value={formData?.preConditions ?? ''}
        />
        <TextInputComponent
          onChange={handleChange}
          id={AddTestLabels.Steps}
          labelName={AddTestLabels.Steps}
          value={formData?.steps ?? ''}
          isMandatory={isMandatory('Steps')}
        />
        <TextInputComponent
          onChange={handleChange}
          id={AddTestLabels.ExpectedResult}
          labelName={AddTestLabels.ExpectedResult}
          value={formData?.expectedResult ?? ''}
          isMandatory={isMandatory('Expected Result')}
        />
        <TextInputComponent
          onChange={handleChange}
          id={AddTestLabels.AdditionalGroups}
          labelName={AddTestLabels.AdditionalGroups}
          value={formData?.additionalGroups ?? ''}
        />
      </div>
      <InputsSpacing className="pt-8" />
      <div className="flex h-5 pb-8 items-center space-x-4 text-sm">
        {source === 'addTest' ? (
          <>
            <Button onClick={() => handleAddSubmit(false)}>
              Add Test Case
            </Button>
            <Button onClick={() => handleAddSubmit(true)}>Add & Next</Button>
          </>
        ) : (
          <Button onClick={() => handleEditSubmit()}>Update Test</Button>
        )}
        <Button
          asChild
          variant={'outline'}
          style={{cursor: 'pointer'}}
          onClick={handleGoBack}>
          <span>Cancel</span>
        </Button>
      </div>
    </div>
  )
}
