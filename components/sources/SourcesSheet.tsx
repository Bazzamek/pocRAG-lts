
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FileItem } from "./FileItem"
import { useState } from "react"
import FileModal from "./Modal"
import { getDocumentsByTitle } from "@/lib/langchain"

interface SourcesSheetsProps {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  sourcesStore: string[]
}

export default function SourcesSheets({
  isOpen,
  setIsOpen,
  sourcesStore
}: SourcesSheetsProps) {
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false)
  const [activeFile, setActiveFile] = useState<string | null>('')
  const [fileContent, setFileContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFileClick = async (fileName: string) => {
    setActiveFile(fileName)
    setIsLoading(true)
    
    try {
      const documents = await getDocumentsByTitle(fileName)
      setFileContent(documents)
    } catch (error) {
      console.error('Błąd podczas pobierania dokumentu:', error)
      setFileContent('Błąd ładowania pliku')
    } finally {
      setIsLoading(false)
      setIsReaderOpen(true)
    }
  }

  if (sourcesStore.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Źródła dokumentów</SheetTitle>
            <SheetDescription>
              Brak dostępnych dokumentów.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Źródła dokumentów</SheetTitle>
          <SheetDescription>
            Przeglądaj dostępne dokumenty PDF
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Carousel
            orientation="vertical"
            className="w-full max-w-full"
            opts={{
              align: "start",
            }}
          >
            <CarouselContent className="-mt-2 h-[400px]">
              {sourcesStore.map((fileName, index) => (
                <CarouselItem key={index} className="pt-2 basis-1/3">
                  <FileItem
                    title={fileName}
                    onClick={() => handleFileClick(fileName)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {sourcesStore.length > 3 && (
              <>
                <CarouselPrevious className="left-1/2 -translate-x-1/2 -top-4" />
                <CarouselNext className="left-1/2 -translate-x-1/2 -bottom-4" />
              </>
            )}
          </Carousel>
        </div>
      </SheetContent>
      <FileModal 
        openReader={() => setIsReaderOpen(!isReaderOpen)} 
        isReaderOpen={isReaderOpen} 
        //@ts-ignore
        fileName={activeFile}
        fileContent={fileContent}
        isLoading={isLoading}
      />
    </Sheet>
  )
}
