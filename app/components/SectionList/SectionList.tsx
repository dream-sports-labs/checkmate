import {DisplaySection} from '@components/SectionList/interfaces'
import {
  buildSectionHierarchy,
  getChildSections,
  getInitialOpenSections,
  getInitialSelectedSections,
  getSectionHierarchy,
  getSectionsWithTheirParents,
} from '@components/SectionList/utils'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {IGetAllSectionsResponse} from '@controllers/sections.controller'
import {useFetcher, useParams, useSearchParams} from '@remix-run/react'
import {CirclePlus, ListRestart} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import {API} from '~/routes/utilities/api'
import {AddSectionDialog} from './AddSectionDialog'
import {EditSectionDialog} from './EditSectionDialog'
import RenderSections from './RenderSections'
import {SectionInfoBox} from './SectionInfoBox'

export const SectionList = () => {
  const [searchParams, setSearchParams] = useSearchParams([])
  const [sectionsData, setSectionsData] = useState<DisplaySection[]>([])
  const [addSectionDialog, setAddSectionDialog] = useState<boolean>(false)
  const [editSectionDialog, setEditSectionDialog] = useState<boolean>(false)

  const [sectionId, setSectionId] = useState<number | null>(null)
  const sectionFetcher = useFetcher<{
    data: IGetAllSectionsResponse[]
  }>()
  const runSectionFetcher = useFetcher<{
    data: IGetAllSectionsResponse[]
  }>()
  const projectId = useParams().projectId ? Number(useParams().projectId) : 0
  const runId = useParams().runId ? Number(useParams().runId) : 0

  useEffect(() => {
    sectionFetcher.load(`/${API.GetSections}?projectId=${projectId}`)
    if (runId)
      runSectionFetcher.load(
        `/${API.GetSections}?projectId=${projectId}&runId=${runId}`,
      )
  }, [])

  useEffect(() => {
    if (runId && runSectionFetcher.data?.data && sectionFetcher.data?.data) {
      const x = getSectionsWithTheirParents({
        allSections: sectionFetcher.data?.data,
        runSections: runSectionFetcher.data?.data,
      })

      setSectionsData(buildSectionHierarchy({sectionsData: x}))
    } else if (!runId && sectionFetcher.data?.data) {
      setSectionsData(
        buildSectionHierarchy({sectionsData: sectionFetcher.data?.data}),
      )
    }
  }, [sectionFetcher.data, runSectionFetcher.data])

  const initialSelectedSections = getInitialSelectedSections(searchParams)
  const initialOpenSections = getInitialOpenSections(initialSelectedSections)
  const [selectedSections, setSelectedSections] = useState(
    initialSelectedSections,
  )

  const [openSections, setOpenSections] = useState(initialOpenSections)

  const toggleSection = (id: number) => {
    if (openSections.includes(id)) {
      setOpenSections(openSections.filter((sectionId) => sectionId !== id))
    } else {
      setOpenSections([...openSections, id])
    }
  }

  const applySectionFilter = (
    id: number,
    sections: DisplaySection[] | undefined,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const selectionType = e.metaKey ? 'add' : 'replace'
    const childSections = getChildSections(id, sections)

    if (selectedSections.includes(id)) {
      const updatedSections = selectedSections.filter(
        (sectionId: number) =>
          sectionId !== id && !childSections.includes(sectionId),
      )
      setSelectedSections(updatedSections)
      return
    }

    if (selectionType === 'replace') {
      setSelectedSections([...Array.from(childSections)])
      return
    }

    if (selectionType === 'add') {
      setSelectedSections([...selectedSections, ...Array.from(childSections)])
      return
    }
  }

  useEffect(() => {
    if (selectedSections.length === 0) {
      if (searchParams.has('sectionIds'))
        setSearchParams(
          (prev) => {
            prev.delete('sectionIds')
            prev.set('page', (1).toString())
            return prev
          },
          {replace: true},
        )
    } else {
      if (
        !searchParams.has('sectionIds') ||
        searchParams.get('sectionIds') !== JSON.stringify(selectedSections)
      )
        setSearchParams(
          (prev) => {
            prev.set('sectionIds', JSON.stringify(selectedSections))
            prev.set('page', (1).toString())
            return prev
          },
          {replace: true},
        )
    }
  }, [selectedSections])

  const resetSelections = () => {
    setSelectedSections([])
    setSearchParams(
      (prev) => {
        prev.delete('sectionIds')
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )
  }

  const addSubsectionClicked = (sectionId: number | null) => {
    setSectionId(sectionId)
    setAddSectionDialog(true)
  }

  const editSubsectionClicked = (sectionId: number) => {
    setSectionId(sectionId)
    setEditSectionDialog(true)
  }

  const reloadSections = () => {
    sectionFetcher.load(`/${API.GetSections}?projectId=${projectId}`)
  }

  return (
    <div className="flex flex-col flex-grow ml-4 h-full overflow-y-scroll bg-slate-200 p-4 pb-12 flex-nowrap">
      <div>
        <h2 className="font-semibold flex flex-row mb-2 text-nowrap">
          Section List
          <SectionInfoBox />
          {selectedSections?.length > 0 ? (
            <Tooltip
              anchor={
                <ListRestart
                  color="#ff3c00"
                  onClick={resetSelections}
                  className={'ml-4 text-blue-600 hover:cursor-pointer'}
                />
              }
              content={'Reset sections'}
            />
          ) : null}
        </h2>
        <RenderSections
          addSubsectionClicked={addSubsectionClicked}
          applySectionFilter={applySectionFilter}
          level={0}
          openSections={openSections}
          sections={sectionsData}
          selectedSections={selectedSections}
          toggleSection={toggleSection}
          sectionData={sectionFetcher?.data?.data}
          editSubsectionClicked={editSubsectionClicked}
        />
        {!runId && (
          <button
            onClick={() => {
              addSubsectionClicked(null)
            }}
            className="flex text-sm flex-row items-center gap-2 truncate ml-2 mt-2">
            <CirclePlus color="green" size={16} />
            <span>{`Add Section`}</span>
          </button>
        )}
      </div>
      <AddSectionDialog
        sectionHierarchy={getSectionHierarchy({
          sectionId: sectionId ? sectionId : 0,
          sectionsData: sectionFetcher?.data?.data,
        })}
        state={addSectionDialog}
        setState={setAddSectionDialog}
        reloadSections={reloadSections}
        parentId={sectionId}
      />
      {sectionId && sectionFetcher?.data?.data && (
        <EditSectionDialog
          state={editSectionDialog}
          setState={setEditSectionDialog}
          sectionId={sectionId}
          sectionData={sectionFetcher?.data?.data}
          reloadSections={reloadSections}
        />
      )}
    </div>
  )
}
