'use server'


import { addEmbeddings } from '@/lib/embeddings';
import { revalidatePath } from 'next/cache'

type ActionState = {
  success: boolean;
  message?: string;
  error?: string;
  documentsAdded?: number;
  fileName?: string;
}

export async function uploadFiles(prevState: ActionState, formData: FormData): Promise<ActionState> {
  if (!formData) {
    return {
      success: false,
      error: "Brak danych formularza"
    }
  }

  const file = formData.get('file') as File

  if (!file || file.size === 0) {
    return {
      success: false,
      error: "Nie wybrano pliku"
    }
  }

  try {
    const result = await addEmbeddings(file)
    revalidatePath('/')
    
    return {
      success: true,
      message: `Plik ${result.fileName} został pomyślnie przetworzony. Dodano ${result.documentsAdded} fragmentów do bazy wiedzy.`,
      documentsAdded: result.documentsAdded,
      fileName: result.fileName
    }
  } catch (error) {
    console.error('Błąd podczas przetwarzania pliku:', error)
    return {
      success: false,
      error: `Nie udało się przetworzyć pliku: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
    }
  }
}
