import {DisplaySection} from '@components/SectionList/interfaces'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {ICreateSectionResponse} from '@controllers/sections.controller'
import {Checkbox} from '@ui/checkbox'
import {cn} from '@ui/utils'
import {
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Pencil,
  Trash2,
} from 'lucide-react'
import React, {memo, useCallback} from 'react'
import {useParams} from 'react-router'
import SectionSkeleton from './SectionSkeleton'
import {getSectionHierarchy} from './utils'

interface IRenderSection {
  sections: DisplaySection[] | null
  level: number
  openSections: number[]
  toggleSection: (id: number) => void
  selectedSections: number[]
  sectionData: ICreateSectionResponse[] | undefined

  applySectionFilter: (
    id: number,
    subSections: DisplaySection[] | undefined,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void
  addSubsectionClicked: (sectionId: number | null) => void
  editSubsectionClicked: (sectionId: number) => void
  deleteSubsectionClicked: (sectionId: number) => void
}

const RenderSections = memo(
  ({
    sections,
    level = 0,
    openSections,
    toggleSection,
    selectedSections,
    applySectionFilter,
    addSubsectionClicked,
    editSubsectionClicked,
    deleteSubsectionClicked,
    sectionData,
  }: IRenderSection) => {
    sections = sections
      ? sections.sort((a, b) => a.sectionName.localeCompare(b.sectionName))
      : null

    const runId = useParams().runId ? Number(useParams().runId) : 0

    const renderSubSections = useCallback(
      (section: DisplaySection) => {
        if (
          openSections.includes(section.sectionId) &&
          section.subSections?.length > 0
        ) {
          return (
            <div className="pl-3">
              <RenderSections
                sections={section.subSections}
                level={level + 1}
                openSections={openSections}
                toggleSection={toggleSection}
                selectedSections={selectedSections}
                applySectionFilter={applySectionFilter}
                addSubsectionClicked={addSubsectionClicked}
                editSubsectionClicked={editSubsectionClicked}
                deleteSubsectionClicked={deleteSubsectionClicked}
                sectionData={sectionData}
              />
            </div>
          )
        }
        return null
      },
      [
        level,
        openSections,
        toggleSection,
        selectedSections,
        applySectionFilter,
        addSubsectionClicked,
        editSubsectionClicked,
        deleteSubsectionClicked,
      ],
    )

    return (
      <ul className="relative font-poppins" key={`${level}`}>
        {sections !== null ? (
          sections.map((section, index) => (
            <li key={section.sectionId} className="relative py-1">
              <div className="flex flex-row items-center cursor-pointer">
                <div onClick={() => toggleSection(section.sectionId)}>
                  {openSections.includes(section.sectionId) &&
                  section.subSections?.length > 0 ? (
                    <ChevronDown size={14} stroke="grey" />
                  ) : !openSections.includes(section.sectionId) &&
                    section.subSections?.length > 0 ? (
                    <ChevronRight size={14} stroke="grey" />
                  ) : (
                    <div className="w-[14px]" />
                  )}
                </div>
                {level > 0 && (
                  <>
                    <div
                      className={`absolute border-l border-gray-400 h-full top-0 left-[-6px] overflow-hidden ${
                        index === sections?.length - 1 ? 'h-1/2' : ''
                      }`}
                    />
                    <div
                      className={cn(
                        'absolute left-[-6px] border-t-[1px] border-gray-400 w-3',
                        section.subSections?.length > 0 ? '' : 'w-6',
                      )}
                    />
                  </>
                )}
                <div className="relative group flex flex-row items-center gap-1">
                  <div
                    className={cn(
                      `flex items-center border border-transparent hover:bg-blue-200 rounded-md px-2`,
                      selectedSections.includes(section.sectionId)
                        ? 'bg-blue-300 hover:bg-blue-300'
                        : '',
                    )}>
                    <Checkbox
                      style={{
                        borderRadius: 3,
                      }}
                      checkIconClassName="h-3 w-3 align-middle flex items-center mr-2 cursor-pointer pr-0.5"
                      className="h-3 w-3 align-middle flex items-center mr-2 cursor-pointer"
                      checked={selectedSections.includes(section.sectionId)}
                      onClick={(e) =>
                        applySectionFilter(
                          section.sectionId,
                          section.subSections,
                          e,
                        )
                      }
                    />
                    <Tooltip
                      anchor={
                        <div
                          onClick={() => toggleSection(section.sectionId)}
                          className="flex flex-row items-center gap-1">
                          <span className="text-xs truncate">
                            {section.sectionName}
                          </span>
                        </div>
                      }
                      content={
                        <div className="text-sm">
                          {getSectionHierarchy({
                            sectionId: section.sectionId,
                            sectionsData: sectionData,
                          })}
                        </div>
                      }
                    />
                  </div>
                  {!runId && (
                    <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Tooltip
                        anchor={
                          <CirclePlus
                            size={14}
                            color="green"
                            onClick={() =>
                              addSubsectionClicked(section.sectionId)
                            }
                          />
                        }
                        content={<div className="text-sm">Add Sub-Section</div>}
                      />
                      <Tooltip
                        anchor={
                          <Pencil
                            size={14}
                            color="orange"
                            onClick={() =>
                              editSubsectionClicked(section.sectionId)
                            }
                          />
                        }
                        content={<div className="text-sm">Edit Section</div>}
                      />
                      <Tooltip
                        anchor={
                          <Trash2
                            size={14}
                            color="red"
                            onClick={() =>
                              deleteSubsectionClicked(section.sectionId)
                            }
                          />
                        }
                        content={<div className="text-sm">Delete Section</div>}
                      />
                    </div>
                  )}
                </div>
              </div>
              {renderSubSections(section)}
            </li>
          ))
        ) : (
          <SectionSkeleton />
        )}
      </ul>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.sections === nextProps.sections &&
      prevProps.openSections === nextProps.openSections &&
      prevProps.selectedSections === nextProps.selectedSections
    )
  },
)

export default RenderSections
