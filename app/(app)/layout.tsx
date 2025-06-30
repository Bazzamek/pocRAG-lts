
import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
} from "@/components/ui/sidebar"


export const dynamic = 'force-dynamic'

export default async function AppLayout(
    {
        children
    }:
        {
            children: React.ReactNode
        }
) {
    return (
        <main className="flex flex-row items-start">
            <SidebarProvider className="w-auto">
                <AppSidebar/>
            </SidebarProvider>
            {children}

        </main>
    )
}