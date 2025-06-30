import { Document } from '@langchain/core/documents';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { vectorStore } from './langchain';





export const addEmbeddings = async (file?: File) => {
  let documents: Document[] = [];

  if (file) {
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'pdf') {
        const uploadsDir = path.join(process.cwd(), 'temp');
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const tempFilePath = path.join(uploadsDir, `temp_${Date.now()}_${file.name}`);
        await writeFile(tempFilePath, buffer);

        const loader = new PDFLoader(tempFilePath, {
          splitPages: false,
        });
        
        const rawDocs = await loader.load();
        
        await import('fs/promises').then(fs => fs.unlink(tempFilePath));
        
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1024,
          chunkOverlap: 256,
          separators: ['\n\n', '\n', ' ', ''],
        });

        documents = await textSplitter.splitDocuments(rawDocs);
        
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        let content = '';
        
        switch (fileExtension) {
          case 'txt':
            content = buffer.toString('utf-8');
            break;
            
          case 'csv':
            content = buffer.toString('utf-8');
            break;
            
          default:
            throw new Error(`Nieobsługiwany typ pliku: ${fileExtension}`);
        }

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1024,
          chunkOverlap: 256,
          separators: ['\n\n', '\n', ' ', ''],
        });

        const chunks = await textSplitter.splitText(content);

        documents = chunks.map((chunk, index) => new Document({
          pageContent: chunk,
          metadata: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            chunkIndex: index,
            totalChunks: chunks.length,
            source: `upload_${Date.now()}`
          }
        }));
      }

      documents = documents.map((doc, index) => new Document({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          chunkIndex: index,
          totalChunks: documents.length,
          source: `upload_${Date.now()}`
        }
      }));

      await vectorStore.addDocuments(documents);

      return { 
        success: true, 
        documentsAdded: documents.length,
        fileName: file.name 
      };

    } catch (error) {
      console.error('Błąd podczas przetwarzania pliku:', error);
      throw new Error(`Nie udało się przetworzyć pliku: ${error}`);
    }
  } else {
    
    return { 
      success: false, 
      documentsAdded: 0,
      fileName: "test_document" 
    };
  }
};

