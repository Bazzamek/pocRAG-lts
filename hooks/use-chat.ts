import { askAgent } from '@/lib/agent'
import { initNewChat, updateTitle, uploadMessage, loadChatMessages, uploadSources } from '@/lib/supabase.client'
import { validSources } from '@/utils/transform/matchSources'
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
  const [sourcesStore, setSourcesStore] = useState<string[] | any>([])
  
  const loadExistingMessages = async () => {
    if (options.chatID && options.chatID !== 'new') {
      const {messages:existingMessages, sources:existingSources} = await loadChatMessages(options.chatID)
      if (existingMessages) {
        setMessages(existingMessages)
        setSourcesStore([...existingSources])
        
      }
    }
  }

  useEffect(() => {
    if (options.chatID === 'new') {
      const createChat = async () => {
        const createdChat = await initNewChat()
        if (createdChat?.id) {
          router.push(`/chat/${createdChat.id}`)
        }
      }
      createChat()
    } else {
      loadExistingMessages()
    }
  }, [options.chatID])

  const pushMessages = async (message: Message, cnvID: string, sources?: string[] | []) => {
    await uploadMessage(message, cnvID)
    sources && await uploadSources(sources, cnvID)
  }

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
    if(message.role === 'user'){
      pushMessages(message, options.chatID)
    }
  }, [])

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

  const assistantId = `assistant-${Date.now()}`;
  const assistantMessage: Message = {
    id: assistantId,
    content: '',
    role: 'assistant',
    isLoading: true,
  };
  addMessage(assistantMessage);
  
  setIsGenerating(true);
  
  try {
    await processAssistantResponse(assistantId, content);
  } catch (error) {
    handleError(assistantId, error);
  } finally {
    setIsGenerating(false);
    setStage('DONE');
    await updateTitle(content, options.chatID);
  }
}, [options.chatID]);

const processAssistantResponse = async (assistantId: string, content: string) => {
  const iterator = askAgent(options.chatID, content);
  let fullAnswer = '';
  let sources;

  for await (const value of iterator) {
    switch (value.stage) {
      case 'searching':
        handleSearchingStage(assistantId, value.message);
        break;
      
      case 'processing':
        sources = handleProcessingStage(assistantId, value.message, value.sources);
        break;
      
      case 'answering':
        handleAnsweringStage(assistantId, value.message);
        break;
      
      case 'streaming':
        fullAnswer = handleStreamingStage(assistantId, fullAnswer, value.token, sources);
        break;
      
      case 'done':
        handleDoneStage(assistantId, fullAnswer, value.sources);
        break;
    }
  }
};

const handleSearchingStage = (assistantId: string, message: string) => {
  setStage('SEARCHING');
  updateMessage(assistantId, {
    content: message,
    isLoading: true,
  });
};

const handleProcessingStage = (assistantId: string, message: string, sources: any) => {
  setStage('ANALYSIS');
  updateMessage(assistantId, {
    content: message,
    isLoading: true,
  });
  return sources;
};

const handleAnsweringStage = (assistantId: string, message: string) => {
  setStage('ANSWERING');
  updateMessage(assistantId, {
    content: message,
    isLoading: true,
  });
};

const handleStreamingStage = (assistantId: string, fullAnswer: string, token: string, sources: any) => {
  setStage('ANSWERING');
  const updatedAnswer = fullAnswer + token;
  updateMessage(assistantId, {
    content: updatedAnswer,
    isLoading: false,
    isStreaming: true,
    sources: sources.map((s: any)=>s.metadata.fileName)
  });
  return updatedAnswer;
};

const handleDoneStage = async (assistantId: string, fullAnswer: string, sources: any) => {
  const finalAssistantMessage: Message = {
    id: assistantId,
    content: fullAnswer,
    role: 'assistant',
    isLoading: false,
    isStreaming: false,
    sources:sources
  };
  await pushMessages(finalAssistantMessage, options.chatID, sources)
    setSourcesStore((prev: string) => {
      const combined = [...sources, ...prev];
      return combined.filter((item, index) => combined.indexOf(item) === index);
    });
      updateMessage(assistantId, finalAssistantMessage);
};

const handleError = (assistantId: string, error: any) => {
  console.error(error);
  updateMessage(assistantId, {
    content: 'Wystąpił błąd: ' + error?.message,
    isLoading: false,
    isStreaming: false,
  });
};

  const clearChat = () => {setMessages([])} 

  return {
    messages,
    isGenerating,
    stage,
    sendMessage,
    clearChat,
    sourcesStore
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

export interface Source{
  content: string[] | [],
  score: number,
  title: string
}
