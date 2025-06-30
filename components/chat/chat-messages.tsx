import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { Message } from "@/hooks/use-chat"

interface ChatMessagesProps {
  messages: Message[]
  className?: string
  autoScroll?: boolean
}

export function ChatMessages({
  messages,
  className,

  autoScroll = true,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  return (
    <ScrollArea className={cn("flex-1 p-4", className)}>
      <div className="space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "group flex gap-3",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {message.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            )}

            <div className={cn(
              "flex flex-col gap-2 max-w-[80%]",
              message.role === 'user' ? "items-end" : "items-start"
            )}>
              <div
                className={cn(
                  "rounded-lg px-4 py-3 text-sm relative",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border",
                  message.isLoading && "bg-muted/50"
                )}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-muted-foreground">Trwa generowanie odpowiedzi</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                    {message.isStreaming && (
                      <span className=" w-0.5 h-4 bg-current hidden ml-1 animate-pulse"></span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}