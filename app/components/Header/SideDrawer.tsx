import {useLocation, useParams} from '@remix-run/react'
import {LARGE_PAGE_SIZE, ORG_ID, SMALL_PAGE_SIZE} from '@route/utils/constants'
import {useState} from 'react'
import {APP_NAME} from '~/constants'
import {Separator} from '~/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/ui/sheet'
import logo from '../../assets/logo.png'
import {ContentComponent, FooterComponent} from './SideDrawrComponents'

export const SideDrawer = () => {
  const orgId = ORG_ID
  const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false)
  const {projectId} = useParams()
  const location = useLocation()
  const containsRun = location.pathname.includes('run')
  const containsRuns = location.pathname.includes('runs')

  return (
    <Sheet open={sideDrawerOpen} onOpenChange={setSideDrawerOpen} key="left">
      <SheetTrigger onClick={() => setSideDrawerOpen(true)}>
        <img
          className="flex items-center space-x-4 cursor-pointer my-2"
          src={logo}
          alt={''}
          style={{height: 32, width: 'auto'}}
        />
      </SheetTrigger>
      <div className="flex mr-auto ml-4 text-3xl text-gray-900 tracking-wide">
        {APP_NAME}
      </div>
      <SheetContent side="left" className="w-[100px] sm:w-[300px] pl-8 pt-12">
        <SheetHeader>
          <SheetTitle className="font-bold">Content</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col justify-between h-16 mt-8">
          <div className="items-center">
            <ContentComponent
              setSideDrawerOpen={setSideDrawerOpen}
              text="Projects"
              navigateTo={`/projects?orgId=${orgId}&page=1&pageSize=${SMALL_PAGE_SIZE}`}
            />

            {projectId && (
              <div className="flex flex-col items-start">
                {!containsRuns && (
                  <ContentComponent
                    setSideDrawerOpen={setSideDrawerOpen}
                    text="Runs List"
                    navigateTo={`/project/${projectId}/runs?page=1&pageSize=${SMALL_PAGE_SIZE}&status=Active`}
                  />
                )}
                {containsRun && (
                  <ContentComponent
                    setSideDrawerOpen={setSideDrawerOpen}
                    text="Tests"
                    navigateTo={`/project/${projectId}/tests?page=1&pageSize=${LARGE_PAGE_SIZE}`}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="h-3/4 flex flex-col">
          <div className="flex flex-col gap-2 mt-auto">
            <FooterComponent
              href="https://checkmate.dreamsportslabs.com"
              setSideDrawerOpen={setSideDrawerOpen}
              text="Documentation"
            />
            <FooterComponent
              href="https://discord.gg/W67bA8j8"
              setSideDrawerOpen={setSideDrawerOpen}
              text="Ask Question"
            />
            <FooterComponent
              href="https://github.com/dream-sports-labs/checkmate/issues"
              setSideDrawerOpen={setSideDrawerOpen}
              text="Report Issue"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
