'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText } from "lucide-react"

interface FileModalPropps {
  trigger?: React.ReactNode,
  isReaderOpen: boolean,
  openReader: ()=>void,
  fileName: string,
  fileContent: string
}

export default function FileModal({ 
    trigger,
    isReaderOpen,
    openReader,
    fileName,
    fileContent
}: FileModalPropps) {

  return (
    <Dialog open={isReaderOpen} onOpenChange={openReader}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {fileName}
          </DialogTitle>
          <DialogDescription>
            Plik został użyty jako referencja w odpowiedziach
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-[500px] w-full rounded-md border p-4" style={{ overflowY: 'auto' }}>
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {fileContent}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Znakow: {fileContent.length} | Linii: {fileContent.split('\n').length}
          </div>
          <Button variant="outline" onClick={openReader}>
            Zamknij
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
