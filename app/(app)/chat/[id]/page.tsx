"use client"

import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatFooter } from "@/components/chat/chat-footer"
import { useChat } from "@/hooks/use-chat"
import { useChatInput } from "@/hooks/use-chat-input"
import { useState } from "react"
import SourcesSheets from "@/components/sources/SourcesSheet"
import { useParams } from "next/navigation"

export default function ChatPage() {
  const params = useParams();
  const chatID = params?.id?.toString() || 'new';
  const [isSourceOpen, setIsSourceOpen] = useState(false)

  const {
    messages,
    isGenerating,
    stage,
    sendMessage,
    sourcesStore,
    clearChat
  } = useChat({
    chatID
  })


  const {
    message,
    additionTools,
    manageTools,
    setMessage,
    handleSubmit,
    handleKeyDown,
  } = useChatInput({
    onSubmit: sendMessage,
    disabled: isGenerating
  })

  return (
    <div className="flex flex-col h-screen w-full mx-auto border-x">
      <ChatHeader
        stage={stage}
        onClearChat={clearChat}
        onShowSources={() => setIsSourceOpen(!isSourceOpen)}
      />
      <ChatMessages 
        messages={messages}
        autoScroll={true}
      />

      
      <ChatFooter
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        additionalTools={additionTools}
        manageTools={manageTools}
        stage={stage}
        onShowSources={() => setIsSourceOpen(!isSourceOpen)}
      />
      
      <SourcesSheets 
        isOpen={isSourceOpen} 
        setIsOpen={setIsSourceOpen}
        sourcesStore={sourcesStore}
      />
    </div>
  )
}