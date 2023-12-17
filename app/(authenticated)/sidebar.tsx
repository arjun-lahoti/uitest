"use client";
import { useContext, createContext, useState, PropsWithChildren } from "react"
import { MdArrowForward, MdArrowBack } from 'react-icons/md'
import Image from 'next/image'
import logo_long from '/public/logo_long.png'
import logo from  '/public/logo.png'
import { usePathname } from "next/navigation";
import { PAGES } from "./page-with-header";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createBrowserClient } from "@supabase/ssr";

const SidebarContext = createContext({expanded: false})

export default function Sidebar({ children } : PropsWithChildren) {
  const [expanded, setExpanded] = useState(false)
  const currentPah = usePathname()

  return (
    <aside className="h-screen">
      <nav className={`h-full flex flex-col border-r shadow-sm ${expanded ? 'bg-white' : 'bg-primary'}`}>
        <div className="p-2 pb-2 flex gap-2 items-center">
          <Image
            src={logo}
            height={40}
            className="ml-1 inline bg-white rounded-md"
            alt="CandorIQ Logo"
          />
          <div
            className={`${expanded ? '' : 'hidden'}`}
          >CandorIQ</div>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 mt-3">
          {PAGES.map((page) => {
            
            // Added conditional to only show detail page icon in sidebar if it is the current page
            if (page.label === 'Details' && currentPah != page.href) return null;

            return (
              <SidebarItem
                key={page.href}
                icon={page.icon}
                text={page.label}
                href={page.href}
                active={currentPah === page.href}
              />
            );
          })}
          </ul>
        </SidebarContext.Provider>

        <div className={`border-t p-3`}>
          <SidebarContext.Provider value={{ expanded }}>
            <UserAvatar />
          </SidebarContext.Provider>
          <div className='pl-1 mt-3 flex items-center gap-2'>
              <button 
                className="inline-block py-0.5 border border-gray-300 rounded "
                onClick={() => setExpanded((curr) => !curr)}>
                {expanded ?  
                <MdArrowBack className="text-xl mx-1 text-gray-600 duration-300" /> :
                <MdArrowForward className="text-xl mx-1 text-white duration-300" />}
              </button>
              <h3 className={`text-xs font-normal text-center text-gray-700 ${expanded ? 'block' : 'hidden'} whitespace-nowrap`}>
                <span>Powered by </span>
                <Image
                  src={logo_long}
                  height={16}
                  className="ml-1 inline"
                  alt="CandorIQ Logo"
                />
            </h3>
          </div>
        </div>
      </nav>
    </aside>
  )
}

function SidebarItem({ icon: Icon, text, href, active, alert }: {
	icon: IconType
	text: string
  href: string
	active?: boolean
	alert?: boolean
}) {
  const { expanded } = useContext(SidebarContext)
  const router = useRouter()
  return (
    <li
      className={cn(
        'relative flex items-center py-2 px-2 my-2',
        'font-medium rounded-md cursor-pointer',
        'transition-colors group',
        active? "bg-white": "hover:bg-indigo-50 text-gray-600"
      )}
      onClick={() => {
        router.push(href)
      }}
    >
      <Icon className={cn(
        'text-2xl transition-colors group-hover:text-highlight-foreground',
        active ?'text-highlight-foreground':'text-gray-600',
        !active && !expanded ? 'text-white' : '')}/>
      <span
        className={cn(
          'overflow-hidden transition-all group-hover:text-highlight-foreground',
          expanded ? "w-40 ml-3" : "w-0",
          active ? "text-highlight-foreground font-semibold" : "text-gray-500"
        )}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
    </li>
  )
}

const UserAvatar = () => {
  const { expanded } = useContext(SidebarContext)
  const router = useRouter()
  const signOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.signOut()
    router.push('/')
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          <img
            src="https://ui-avatars.com/api/?name=TU&background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-40 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4>Test User</h4>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={cn(
          "w-40 border",
          expanded ? '' : 'ml-6')}>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={signOut}>
            Signout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}