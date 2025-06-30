import { createClient } from "@/utils/supabase/client";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";



const supabase = createClient()


export const llm = new ChatOpenAI({
  model: 'gpt-4.1-nano',
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
})


const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});


export const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabase,
  tableName: "documents",
  queryName: "match_documents",
});

export const searchEmbeddings = async (query: string, limit?: number, filter?: any, check?: boolean) => {
  const docs = [];
  const searchResults = await vectorStore.similaritySearchWithScore(query, limit || 3);
      console.log(searchResults)

  for (const doc of searchResults) {
    if(doc[1]>0.45){
      docs.push({
      content: doc[0].pageContent,
      metadata: doc[0].metadata,
      score: doc[1],
      title: doc[0].metadata.fileName
    });
    }

  }

  return docs;
};
