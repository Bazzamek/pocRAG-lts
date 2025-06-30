import { Source } from "@/hooks/use-chat";

export const validSources = (title: string, content: string, sources: Source[] | string[])=>{
    let filteredSources = sources.filter((s: any)=>{s.title === title})
    filteredSources.map((fs: any)=>{
    })
}