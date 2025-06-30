import { llm, searchEmbeddings } from "./langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";


export  const genTitle = async  (question: string)=>{
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "Jesteś asystentem, który generuje tytuły na podstawie pytań. Tytuły muszą oddawać głębie pytania, być ludzkie, oraz twierdzace. Nie mozesz w tytulach prosić albo dopytywać. "
        ],
        ["human", "{question}"]
    ])
    const chain = prompt.pipe(llm);
      return (await chain.invoke({question})).content
}
export  const regenerateQuery = async  (question: string)=>{
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `
            Jesteś odpowiedzialny za przeformatowywanie pytań w taki sposób, by możliwe było poszerzenie znalezienia odpowiednik probek w RAG,
             w architekturze podobieństwa cosinusowego. Odpowiadanie zacznij od nawiasu klamrowego, a odpowiedz skoncz na zamknietym nawiasie klamrowym - wymagane jest to do parseJSON. 
             Zawsze po polsku - zawsze w polu o nazwie - search_query
             `
        ],
        ["human", "{question}"]
    ])
    const chain = prompt.pipe(llm);
      return (await chain.invoke({question})).content
}

export async function* askAgent(cvID: string, question: string) {
    yield { stage: "searching", message: "Szukam źródeł..." };
    let sources = await searchEmbeddings(question, 3);
    let count = 0; 
    if(sources.filter(s => s.score < 0.65 && s.score > 0.4).length > 0 && count === 0){
        count++;
        const proposes:any = await regenerateQuery(question);
        console.log(count, proposes)
        const query = JSON.parse(proposes);
        sources = await searchEmbeddings(query.search_query, 3)
    }
    console.log(sources)
    yield { stage: "processing", message: "Analizuję...", sources };
    const context = sources
        .map((source, index) => `[Źródło ${index + 1}]: ${source.content}, Dopasowanie: ${source.score}`)
        .join('\n\n');

    const promptWithContext = `
Kontekst z dokumentów:
${context}

Pytanie użytkownika: ${question}

Odpowiedz na pytanie bazując na powyższym kontekście. Jeśli informacja nie znajduje się w kontekście, powiedz o tym wprost.
Jeśli nie wiesz - napisz poprostu ze nie wiesz. Nie bój się oceny. To tylko pomoże ci się rozwinać.
Cytuj również zródła, każde ze źrodeł zamknij w tagu, podaj np [1].
Jeśli nie dostarczono ci kontekstu, napisz tak "Nie znalazłem odpowiednich danych kontekstowych by odpowiedzieć na to pytanie".
Nie kłam, nie wprowadzaj w błąd. Pokaze ci na przykładzie - jeśli ktos napisze ci "Cześć", ty poza tym ze odpowiadasz "Cześć", dodajesz również "Zadaj pytanie, abym mógł na nie odpowiedzieć"
`;

    yield { stage: "answering", message: "Generuję odpowiedź...", answer: "" };

    let fullAnswer = "";
    const stream = await llm.stream(promptWithContext);
    for await (const chunk of stream) {
        const token = typeof chunk === "string" ? chunk : chunk.content;
        fullAnswer += token;
        yield { stage: "streaming", token, partial: fullAnswer };
    }

    return { stage: "done", answer: fullAnswer, sources };
}
