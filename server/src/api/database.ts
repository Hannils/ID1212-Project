import { Client, QueryResult } from 'pg'

import { Document } from '../util/Types'

interface InternalConfiguration {
  id: string
  title: string
  created_at: Date
  owner: string
  modified: Date
  content: string
}

interface Configuration {
  id: string
  title: string
  owner: string
  content: string
}

function toConfiguration(data: InternalConfiguration): Configuration {
  return Object.freeze<Configuration>({
    id: data.id,
    title: data.title || '',
    owner: data.owner || '',
    content: data.content || '',
  })
}

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: process.env.PGPASSWORD,
  port: 5432,
  database: 'realtimeDocumentEditor',
})

export async function initDatabase() {
  await client.connect()
}

async function queryDatabase(query: string, data: any[]): Promise<QueryResult<any>> {
  return new Promise((resolve, reject) => {
    client.query(query, data, (err, res) => {
      if (err) {
        console.error(err)
        return reject(err.message)
      }

      resolve(res)
    })
  })
}

export async function selectDocument(owner: string, docId: string) {
  const res = await queryDatabase('SELECT * FROM document WHERE OWNER = $1 AND id = $2', [
    owner,
    docId,
  ])
  return toConfiguration(res.rows[0])
  //client.query<InternalConfiguration>(
  //    'SELECT * FROM document WHERE OWNER = $1 AND document_id = $2',
  //    [owner, docId],
  //    (err, res) => {
  //        if (err) {
  //            console.log(err.stack)
  //            return null;
  //        }
  //        else
  //            return toConfiguration(res.rows[0]);
  //    })
}

export async function selectDocuments(owner: string) {
  const res = await queryDatabase('SELECT * FROM document WHERE owner = $1', [owner])
  return res.rows.map(toConfiguration)
  //const arr: Configuration[] = await new Promise((resolve, reject) => {
  //    client.query<InternalConfiguration>(
  //        'SELECT * FROM document WHERE owner = $1',
  //        [owner],
  //        (err, res) => {
  //            if (err)
  //                return reject(err.message)
  //
  //            resolve(res.rows.map(toConfiguration))
  //        })
  //})
  //return arr;
}

export async function insertDocument(document: Document) {
  const values = Object.keys(document)
    .map((_, i) => `$${i + 1}`)
    .join(', ')

  const res = await queryDatabase(
    `INSERT INTO document(${Object.keys(document).join(
      ', ',
    )}) VALUES(${values}) RETURNING id`,
    Object.values(document),
  )

  return res.rows[0].id
}
