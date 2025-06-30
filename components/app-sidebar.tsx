"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  Sparkles,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { ChatType } from "@/types/chat"
import Link from "next/link"
import { useEffect } from "react"
import { useChatStore } from "@/store/useConversationStore"
import { getUserIdClient } from "@/lib/supabase.client"


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  chats?: ChatType[] | null | [];
}
const data = {

  navMain: [

    {
      title: "Agent",
      url: "/chat/new",
      icon: Sparkles,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      isActive: true,
    },

  ],

}
export function AppSidebar({ ...props }: AppSidebarProps) {
  const { recents, fetchRecents } = useChatStore()
  useEffect(() => {
    getUserIdClient().then((id) => {
      if (id) fetchRecents(id)
    })
  }, [])


  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
          <a href="/chat/new" className="px-2 my-4 flex items-start gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Lets Automate RAG.
        </a>
        <Button asChild className="cursor-pointer hover:bg-gray-400/25" variant="outline">
          <Link href={'/chat/new'}>Nowy Czat</Link>
        </Button>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
      {recents && recents?.length > 0 ? <NavFavorites favorites={recents} /> : <p className="text-center text-gray-400">Brak historii wiadomości</p>}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
