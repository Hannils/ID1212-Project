import { Client } from 'pg'
import { Document } from "../util/Types";

interface InternalConfiguration {
    id: string;
    title: string;
    created_at: Date;
    owner: string;
    modified: Date;
}

interface Configuration {
    id: string;
    title: string;
    owner: string;
}

function toConfiguration(data: InternalConfiguration): Configuration {
    return Object.freeze<Configuration>({
        id: data.id,
        title: data.title || "",
        owner: data.owner || ""
    });
}

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: process.env.PGPASSWORD,
    port: 5432,
    database: "realtimeDocumentEditor"
})

export async function initDatabase() {
    await client.connect()
}


export async function selectDocument(owner: string, docId: string) {
    client.query<InternalConfiguration>(
        'SELECT * FROM document WHERE OWNER = $1 AND document_id = $2',
        [owner, docId],
        (err, res) => {
            if (err) {
                console.log(err.stack)
                return null;
            }
            else
                return toConfiguration(res.rows[0]);
        })
}

export async function selectDocuments(owner: string) {
    let arr: Configuration[] = []
    client.query<InternalConfiguration>(
        'SELECT * FROM document WHERE OWNER = $1',
        [owner],
        (err, res) => {
            if (err)
                console.log(err.stack)
            else
                res.rows.map(row => { arr.push(toConfiguration(row)) })
            return arr;
        })
}

export async function insertDocument(document: Document) {

    const values = Object.keys(document).map((_, i) => `$${i + 1}`).join(", ")

    client.query(
        `INSERT INTO document(${Object.keys(document).join(", ")}) VALUES(${values}) RETURNING id`,
        Object.values(document),
        (err, res) => {
            if (err) throw new Error(err.message)

            console.log("Result: " + res.rows.at(0).id)
            return res.rows.at(0).id
        })
}
