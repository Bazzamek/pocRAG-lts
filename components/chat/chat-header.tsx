// components/chat/chat-header.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot,Sparkles, Paperclip } from "lucide-react"
import { StageTypes } from "@/hooks/use-chat"

interface ChatHeaderProps {
  aiName?: string
  aiAvatar?: string
  modelName?: string
  stage?: StageTypes
  onClearChat?: () => void
  onShowSources?: () => void
}

export function ChatHeader({
  aiName = "Agent RAG",
  aiAvatar,
  modelName = "GPT-4.1-nano",
  stage,
  onClearChat,
  onShowSources
}: ChatHeaderProps) {
  return (
      <div className="flex items-center justify-between w-full p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={aiAvatar} alt={aiName} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{aiName}</h3>
              {stage === "DONE" && <Sparkles className="h-3 w-3 text-purple-500 animate-pulse" />}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {modelName}
              </Badge>

              <span className="text-xs text-muted-foreground">
              {{
                SEARCHING: "Szukam źródeł...",
                ANALYSIS: "Analizuję informacje...",
                ANSWERING: "Generuję odpowiedź...",
                DONE: "Zadaj pytanie"
              }[stage ?? 'DONE']}

                
              </span>

            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {
            onShowSources && (
              <Button variant="ghost" size="icon" onClick={onShowSources} title="Pokaż źródła">
                <Paperclip className="h-4 w-4" />
                {/* Pokaż wykorzystane źródła */}
              </Button>
            )
          }

        </div>
      </div>

  )
}
