'use client'

import { uploadFiles } from '@/app/(app)/dashboard/actions'
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useActionState } from 'react'
import { useEffect } from 'react'

const initialState = {
  success: false,
  message: undefined,
  error: undefined,
  documentsAdded: undefined,
  fileName: undefined
}

export function AddDocs() {
  const [state, formAction, isPending] = useActionState(uploadFiles, initialState)

  useEffect(() => {
    if (state?.success && state.message) {
      console.log('Sukces:', state.message)
    }
    if (state?.error) {
      console.error('Błąd:', state.error)
    }
  }, [state])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Dodaj dokumenty</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Dodaj dokumenty do bazy wiedzy</DialogTitle>
            <DialogDescription>
              Załącz pliki (txt, pdf, docx, csv) i korzystaj z nich w rozmowie z czatbotem
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input 
              name="file" 
              type="file" 
              accept=".pdf,.txt,.docx,.csv" 
              required 
              disabled={isPending}
            />
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm mb-4">
              {state.error}
            </div>
          )}

          {state?.success && state.message && (
            <div className="text-green-500 text-sm mb-4">
              {state.message}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Anuluj
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Przetwarzanie...' : 'Dodaj'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
