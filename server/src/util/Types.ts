export interface User {
    id: string,
    username: string,
    email: string
}

export interface Document {
    id?: BigInt,
    title: string,
    modified?: Date,
    created_at: Date,
    owner: string,
    content: Array<Object>,
}