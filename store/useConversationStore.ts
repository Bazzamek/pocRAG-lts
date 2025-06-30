import { create } from "zustand"

import { ChatType } from "@/types/chat"
import { getRecentsChat } from "@/lib/supabase.client"

type ChatStore = {
  recents: ChatType[]
  loading: boolean
  fetchRecents: (userId: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set: any) => ({
  recents: [],
  loading: false,
fetchRecents: async (userId) => {
  set({ loading: true })
  const data = await getRecentsChat(userId)
  if (data) set({ recents: data, loading: false })
  else set({ loading: false }) 
}
}))
