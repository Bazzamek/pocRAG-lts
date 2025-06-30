// hooks/use-chat-input.ts
import { useState, useCallback } from 'react'

interface UseChatInputOptions {
  maxLength?: number
  onSubmit?: (message: string) => void
  onAttachFile?: () => void
  onVoiceInput?: () => void
  disabled?: boolean
}

export function useChatInput(options: UseChatInputOptions = {}) {
  const [message, setMessage] = useState("")
  const [additionTools, setAdditionalTools] = useState<boolean>(true)
  const { maxLength = 4000, disabled = false } = options

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      options.onSubmit?.(message.trim())
      setMessage("")
    }
  }, [message, disabled, options])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  const handleAttachFile = useCallback(() => {
    if (!disabled) {
      options.onAttachFile?.()
    }
  }, [disabled, options])

  const handleVoiceInput = useCallback(() => {
    if (!disabled) {
      options.onVoiceInput?.()
    }
  }, [disabled, options])

  const remainingChars = maxLength - message.length

const manageTools = (type: 'generative' | 'sources') => {
  setAdditionalTools(!additionTools)
}
  return {
    message,
    additionTools,
    manageTools,
    setMessage,
    remainingChars,
    handleSubmit,
    handleKeyDown,
    handleAttachFile,
    handleVoiceInput,
    canSubmit: message.trim().length > 0 && !disabled
  }
}
