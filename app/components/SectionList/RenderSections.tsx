import {DisplaySection} from '@components/SectionList/interfaces'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {Checkbox} from '@ui/checkbox'
import {cn} from '@ui/utils'
import {ChevronDown, ChevronRight, CirclePlus, Pencil} from 'lucide-react'
import React, {memo, useCallback} from 'react'
import {useParams} from 'react-router'

const RenderSections = memo(
  ({
    sections,
    level = 0,
    parentSectionHeirarchy,
    openSections,
    toggleSection,
    selectedSections,
    applySectionFilter,
    addSubsectionClicked,
  }: {
    sections: DisplaySection[]
    level: number
    parentSectionHeirarchy: string | null
    openSections: number[]
    toggleSection: (id: number) => void
    selectedSections: number[]
    applySectionFilter: (
      id: number,
      subSections: DisplaySection[] | undefined,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void
    addSubsectionClicked: (sectionHierarchy: string) => void
  }) => {
    sections = sections.sort((a, b) => a.name.localeCompare(b.name))
    const runId = useParams().runId ? Number(useParams().runId) : 0

    const renderSubSections = useCallback(
      (section: DisplaySection, parentHierarchy: string | null) => {
        if (
          openSections.includes(section.id) &&
          section.subSections?.length > 0
        ) {
          return (
            <div className="pl-3">
              <RenderSections
                sections={section.subSections}
                level={level + 1}
                parentSectionHeirarchy={parentHierarchy}
                openSections={openSections}
                toggleSection={toggleSection}
                selectedSections={selectedSections}
                applySectionFilter={applySectionFilter}
                addSubsectionClicked={addSubsectionClicked}
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
      ],
    )

    return (
      <ul className="relative font-poppins" key={`${level}`}>
        {sections.map((section, index) => (
          <li key={section.id} className="relative py-1">
            <div className="flex flex-row items-center cursor-pointer">
              <div onClick={() => toggleSection(section.id)}>
                {openSections.includes(section.id) &&
                section.subSections?.length > 0 ? (
                  <ChevronDown size={14} stroke="grey" />
                ) : !openSections.includes(section.id) &&
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
                    `flex items-center border border-transparent hover:bg-blue-200 rounded-lg px-2`,
                    selectedSections.includes(section.id)
                      ? 'bg-blue-300 hover:bg-blue-300'
                      : '',
                  )}>
                  <Checkbox
                    checkIconClassName="h-3 w-3 align-middle flex items-center mr-2 cursor-pointer pr-0.5"
                    className="h-3 w-3 align-middle flex items-center mr-2 cursor-pointer"
                    checked={selectedSections.includes(section.id)}
                    onClick={(e) =>
                      applySectionFilter(section.id, section.subSections, e)
                    }
                  />
                  <Tooltip
                    anchor={
                      <div
                        onClick={() => toggleSection(section.id)}
                        className="flex flex-row items-center gap-1">
                        <span className="text-xs truncate">{section.name}</span>
                      </div>
                    }
                    content={
                      <div className="text-sm">{`${
                        parentSectionHeirarchy
                          ? parentSectionHeirarchy + ' > '
                          : ''
                      }${section.name}`}</div>
                    }
                  />
                </div>
                {!runId && (
                  <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-1/2 left-full transform -translate-y-1/2 ml-2">
                    <button
                      onClick={() =>
                        addSubsectionClicked(
                          parentSectionHeirarchy
                            ? `${parentSectionHeirarchy} > ${section.name}`
                            : section.name,
                        )
                      }
                      className="flex text-sm flex-row items-center gap-2">
                      <Tooltip
                        anchor={<CirclePlus color="green" size={16} />}
                        content="Add SubSection"
                      />
                    </button>
                    {false && (
                      <button
                        onClick={() => {}}
                        className="flex text-sm flex-row items-center gap-2">
                        <Tooltip
                          anchor={<Pencil size={14} stroke="grey" />}
                          content="Edit Section"
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            {renderSubSections(
              section,
              parentSectionHeirarchy
                ? `${parentSectionHeirarchy} > ${section.name}`
                : section.name,
            )}
          </li>
        ))}
      </ul>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.sections === nextProps.sections &&
      prevProps.openSections === nextProps.openSections &&
      prevProps.selectedSections === nextProps.selectedSections &&
      prevProps.parentSectionHeirarchy === nextProps.parentSectionHeirarchy
    )
  },
)

export default RenderSections
