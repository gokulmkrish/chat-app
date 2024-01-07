// mongodb.js

import { Db, MongoClient } from 'mongodb'
import collectionIndex from './collectionIndex';

const uri = process.env.MONGODB_URI || '';

let g: any = global;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Add Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  if (!g._mongoClientPromise) {
    client = new MongoClient(uri)
    g._mongoClientPromise = client.connect()
  }
  clientPromise = g._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

/**
 * @description A function which ensures index for collections
 */
(async function createIndex () {
  console.info('------- Creating Indexes Start ---------');
  const db: Db = (await clientPromise).db(process.env.DB_NAME)
  const indexConf = collectionIndex;
  for (let coll of indexConf) {
    await db.collection(coll.collectionName).createIndex(coll.keys, coll.options);
  }
  console.info('------- Creating Indexes End ---------');
})();

export default clientPromise;