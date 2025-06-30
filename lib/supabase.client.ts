
import { ChatType } from "@/types/chat"
import { createClient } from "@/utils/supabase/client"
import { genTitle } from "./agent"
import { useChatStore } from "@/store/useConversationStore"
import { Message } from "@/hooks/use-chat"
import { isStringObject } from "util/types"

const supabase = createClient()
export const getUserIdClient = async ( ): Promise<string | null>=>{
    'use client'
    const user = await isUserLoggedInClient()
    if (user && user.aud === 'authenticated') {return user.id}
    else {return null}
}
const isUserLoggedInClient = async (): Promise<any> => {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
}
export const initNewChat = async (): Promise<ChatType | null> =>{
    'use client'
    
    const {data, error}: ChatType | any = await supabase
    .from('messages')
    .insert({
      ownerID: getUserIdClient,
      title: '' 
    })
    .select()

    if(error) {return null}
    return data?.[0] ?? null
}

export const updateTitle = async (question: string, cnvID: string) => {
  'use client'
  const userID = await getUserIdClient()
  if(typeof userID !== 'string') return null
  const { data: existing, error: fetchError } = await supabase
    .from('messages')
    .select('title')
    .match({ id: cnvID, ownerID: userID })
    .single()

  if (!existing || existing.title !== '') return

  const title = await genTitle(question)

  const { error: updateError } = await supabase
    .from('messages')
    .update({ title })
    .match({ id: cnvID, ownerID: userID })

  const { fetchRecents } = useChatStore.getState()
  await fetchRecents(userID)
}

export const getRecentsChat = async (uID: string): Promise<ChatType[] | null> => {

    const { data, error } = await supabase.from('messages').select('id, title').eq('ownerID', uID)
    if (data) { return data }
    else {
        ; return null
    }
    
}

export const uploadMessage = async (message?: Message)=>{
    console.log('Wysyłam wiadomość', message)
}