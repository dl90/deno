import { MongoClient } from './dependencies.ts'

const client = new MongoClient()
await client.connect(Deno.env.get('MONGO_URI') || 'mongodb://127.0.0.1:27017')
const db = client.database('deno')

export const usersCollection = db.collection('users')
