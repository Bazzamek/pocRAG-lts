import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileItemProps {
  title: string
  onClick: () => void
  className?: string
}

export function FileItem({ title, onClick, className }: FileItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-4 cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors group w-full",
        className
      )}
      onClick={onClick}
    >
      <FileText className="w-12 h-12 text-red-500 group-hover:text-red-600 transition-colors flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-tight break-words">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Kliknij, aby otworzyć
        </p>
      </div>
    </div>
  )
}
