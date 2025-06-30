import { askAgent } from '@/lib/agent'
import { initNewChat, updateTitle, uploadMessage } from '@/lib/supabase.client'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'

export type StageTypes = 'SEARCHING' | 'ANALYSIS' | "ANSWERING" | "DONE"

interface UseChatOptions {
  chatID: string
}

export function useChat(options: UseChatOptions) {
  const router = useRouter()
  const [stage, setStage] = useState<StageTypes>("DONE")
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  
  useEffect(() => {
    if (options.chatID === 'new') {
      const createChat = async () => {
        const createdChat = await initNewChat()
        if (createdChat?.id) {
          router.push(`/chat/${createdChat.id}`)
        }
      }
      createChat()
    }
  }, [options.chatID])

  const pushMessages = async (message: Message) => {
    await uploadMessage(message)
  }

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
    if(message.role === 'user'){
      pushMessages(message)
    }
  }, [pushMessages])

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ))
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
    };
    addMessage(userMessage);

    const assistantId = `assistant-${Date.now()}`
    const assistantMessage: Message = {
      id: assistantId,
      content: '',
      role: 'assistant',
      isLoading: true,
    };
    addMessage(assistantMessage);
    
    setIsGenerating(true);
    
    try {
      const iterator = askAgent(options.chatID, content);
      let fullAnswer = '';
      let sources;
      for await (const value of iterator) {
        switch (value.stage) {
          case 'searching':
            setStage('SEARCHING')
            updateMessage(assistantId, {
              content: value.message,
              isLoading: true,
            })
            break
          
          case 'processing':
            setStage('ANALYSIS')
            updateMessage(assistantId, {
              content: value.message,
              isLoading: true,
            })
            sources = value.sources
            break
          
          case 'answering':
            setStage('ANSWERING')
            updateMessage(assistantId, {
              content: value.message,
              isLoading: true,
            })
            break
          
          case 'streaming':
            setStage('ANSWERING')
            fullAnswer += value.token
            updateMessage(assistantId, {
              content: fullAnswer,
              isLoading: false,
              isStreaming: true,
              sources: sources
            })
            break
          
          case 'done':
            const finalAssistantMessage: Message = {
              id: assistantId,
              content: fullAnswer,
              role: 'assistant',
              isLoading: false,
              isStreaming: false,
              sources: value.sources,
            };
            break


        }
      }
    } catch (error) {
      console.error(error)
      updateMessage(assistantId, {
        content: 'Wystąpił błąd: ' + error?.message,
        isLoading: false,
        isStreaming: false,
      })
    } finally {
      setIsGenerating(false)
      setStage('DONE')
      await updateTitle(content, options.chatID)
    }
  }, [options.chatID])

  const clearChat = () => {setMessages([])} 
  useEffect(()=>{
  }, [messages])

  return {
    messages,
    isGenerating,
    stage,
    sendMessage,
    clearChat
  }
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  isStreaming?: boolean
  isLoading?: boolean
  sources?: any[]
}
