import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Square, Loader2, Lightbulb, PenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { StageTypes } from "@/hooks/use-chat"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatFooterProps {
  message: string
  placeholder?: string
  disabled?: boolean
  stage: StageTypes
  isLoading?: boolean
  maxLength?: number
  additionalTools: any,
  remainingChars?: number
  onMessageChange: (message: string) => void
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  manageTools: any
}

export function ChatFooter({
  message,
  placeholder = "Napisz swoją wiadomość...",
  disabled = false,
  stage,
  additionalTools,
  isLoading = false,
  maxLength = 4000,
  remainingChars,
  onMessageChange,
  onSubmit,
  onKeyDown,
  manageTools
}: ChatFooterProps) {
  const calculatedRemainingChars = remainingChars ?? (maxLength - message.length)
  const isBusy = stage !== "DONE" || isLoading

  const stageText: Record<StageTypes, string> = {
    SEARCHING: "Szukam źródeł...",
    ANALYSIS: "Analizuję informacje...",
    ANSWERING: "Generuję odpowiedź...",
    DONE: "Zadaj pytanie"
  }

  return (
    <div className="p-4 border-t bg-background fixed w-full bottom-0">
      {isBusy && (
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{stageText[stage]}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-2">
<div className="flex gap-2 mb-2">
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={additionalTools ? "default" : "outline"}
        size="icon"
        onClick={() => {
          manageTools('sources')
        }}
        disabled={isBusy}
      >
        <Lightbulb />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Zwróć źródła bez odpowiedzi</TooltipContent>
  </Tooltip>

</div>

        <div className="flex items-end gap-2">
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={isBusy}
            className={cn(
              "min-h-[44px] max-h-32 resize-none pr-12 transition-opacity",
              isBusy && "opacity-60"
            )}
            maxLength={maxLength}
          />

          {stage !== "DONE" ? (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="mb-1"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isBusy}
              className={cn(
                "mb-1 transition-all",
                !message.trim() || isBusy ? "opacity-50" : "hover:scale-105 active:scale-95"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            {stage !== "DONE"
              ? stageText[stage]
              : "Enter - wyślij, Shift+Enter - nowa linia"}
          </div>
          <div className={calculatedRemainingChars < 100 ? "text-orange-500" : ""}>
            {calculatedRemainingChars}/{maxLength}
          </div>
        </div>
      </form>
    </div>
  )
}
