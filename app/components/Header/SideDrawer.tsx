import {Link, useLocation, useParams} from '@remix-run/react'

import {Separator} from '~/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/ui/sheet'
import logo from '../../assets/logo.png'
import {ORG_ID} from '@route/utils/constants'
import {APP_NAME} from '~/constants'

export const SideDrawer = () => {
  const orgId = ORG_ID

  return (
    <Sheet key="left">
      <SheetTrigger>
        <img
          className="flex items-center space-x-4 cursor-pointer my-2"
          src={logo}
          alt={''}
          style={{height: 32, width: 'auto'}}
        />
      </SheetTrigger>
      <div className="flex mr-auto ml-4 text-3xl text-gray-900 tracking-wide font-sans">
        {APP_NAME}
      </div>
      <SheetContent side="left" className="w-[100px] sm:w-[300px] pl-8 pt-12">
        <SheetHeader>
          <SheetTitle className="font-bold">Content</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col justify-between h-16 mt-8">
          <div className="items-center">
            <SheetClose asChild>
              <Link
                to={`/projects?orgId=${orgId}&page=1&pageSize=10`}
                className="text-black hover:text-pale-blue font-medium">
                <span>Projects List</span>
              </Link>
            </SheetClose>
          </div>
        </div>
        <div className="h-3/4 flex flex-col">
          <div className="mt-auto">
            <a
              href="https://docs.google.com/your-doc-link-here" // Replace with your Google Docs link
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-pale-blue font-bold">
              Documentation
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
