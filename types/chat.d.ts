export type QuestionType = {
    content: string,
    id: string,
    role: 'user' | 'assistant'
    files?: any,

}


export type ChatType = {
    id: string,
    ownerID?: string,
    createdAt?: Date,
    title: string,
    messages?: QuestionType[]
}