import { llm, searchEmbeddings } from "./langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const genTitle = async (question: string) => {
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "Jesteś asystentem, który generuje tytuły na podstawie pytań. Tytuły muszą oddawać głębie pytania, być ludzkie, oraz twierdzące. Nie możesz w tytułach prosić albo dopytywać."
        ],
        ["human", "{question}"]
    ]);
    const chain = prompt.pipe(llm);
    return (await chain.invoke({ question })).content;
};

export const regenerateQuery = async (question: string) => {
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            `Jesteś odpowiedzialny za przeformatowywanie pytań w taki sposób, by możliwe było poszerzenie znalezienia odpowiedników próbek w RAG,
             w architekturze podobieństwa cosinusowego. Odpowiadanie zacznij od nawiasu klamrowego, a odpowiedź skończ na zamkniętym nawiasie klamrowym - wymagane jest to do parseJSON. 
             Zawsze po polsku - zawsze w polu o nazwie - search_query`
        ],
        ["human", "{question}"]
    ]);
    const chain = prompt.pipe(llm);
    return (await chain.invoke({ question })).content;
};

const buildContext = (sources: any[]) => {
    return sources
        .map((source, index) => `[Źródło ${index + 1} - ${source.metadata.fileName}]: ${source.content}, Dopasowanie: ${source.score}`)
        .join('\n\n');
};

const createPrompt = (context: string, question: string) => {
    return `
Kontekst z dokumentów:
${context}

Pytanie użytkownika: ${question}

Odpowiedz na pytanie bazując na powyższym kontekście. Jeśli informacja nie znajduje się w kontekście, powiedz o tym wprost.
Jeśli nie wiesz - napisz po prostu że nie wiesz. Nie bój się oceny. To tylko pomoże ci się rozwinać.
Cytuj również źródła, każde ze źródeł zamknij w tagu, podaj np [1 - tytul dokumentu]
Jeśli nie dostarczono ci kontekstu, napisz tak "Nie znalazłem odpowiednich danych kontekstowych by odpowiedzieć na to pytanie".
Nie kłam, nie wprowadzaj w błąd. Pokażę ci na przykładzie - jeśli ktoś napisze ci "Cześć", ty poza tym że odpowiadasz "Cześć", dodajesz również "Zadaj pytanie, abym mógł na nie odpowiedzieć"
`;
};

const shouldRegenerateQuery = (sources: any[], count: number) => {
    return sources.filter(s => s.score < 0.65 && s.score > 0.4).length > 0 && count === 0;
};

const performSearch = async (question: string) => {
    let sources = await searchEmbeddings(question, 3);
    let count = 0;
    
    if (shouldRegenerateQuery(sources, count)) {
        count++;
        const proposes: any = await regenerateQuery(question);
        const query = JSON.parse(proposes);
        sources = await searchEmbeddings(query.search_query, 3);
    }
    
    return sources;
};

export async function* askAgent(cvID: string, question: string) {
    yield { stage: "searching", message: "Szukam źródeł..." };
    
    const sources = await performSearch(question);
    yield { stage: "processing", message: "Analizuję...", sources };
    
    const context = buildContext(sources);
    const promptWithContext = createPrompt(context, question);

    yield { stage: "answering", message: "Generuję odpowiedź...", answer: "" };

    let fullAnswer = "";
    const stream = await llm.stream(promptWithContext);
    
    for await (const chunk of stream) {
        const token = typeof chunk === "string" ? chunk : chunk.content;
        fullAnswer += token;
        yield { stage: "streaming", token, partial: fullAnswer };
    }
    const cleanedSources = sources.map(s=>s.metadata.fileName)
    yield { stage: "done", answer: fullAnswer, sources: cleanedSources };
}
