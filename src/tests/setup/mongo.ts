import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db } from "mongodb";

let mongod: MongoMemoryServer;
let client: MongoClient;
let db: Db;

export async function startTestMongo() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  client = await MongoClient.connect(uri);
  db = client.db("testdb");

  return { db, client };
}

export async function stopTestMongo() {
  await client?.close();
  await mongod?.stop();
}