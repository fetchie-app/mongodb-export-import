import mongoose from "mongoose";
import mongoURLParse from "mongo-url-parser";
import json from "./json";
import { join } from "path";

async function connect(dbUrl: string, ops?: mongoose.ConnectOptions) {
  await mongoose.connect(dbUrl, ops);
}

async function disconnect() {
  if (mongoose?.connection) {
    await mongoose.disconnect();
  }
}

async function listDbs() {
  let d = mongoose.connection.db.admin().listDatabases();
  return (await d).databases;
}

async function setDb(name: string) {
  return mongoose.connection.useDb(name, {
    useCache: true,
  });
}

// List collections

async function listCollections() {
  return mongoose.connection.db.collections();
}

async function getCollection(
  collection: mongoose.mongo.Collection<mongoose.mongo.BSON.Document>
) {
  let docs = await collection.find().toArray();

  return docs;
}

async function saveColelction(
  collection: mongoose.mongo.Collection<mongoose.mongo.BSON.Document>,
  path = ""
) {
  let data = await getCollection(collection);
  json.saveAsJson(join(path, `${collection.collectionName}.json`), data);
}

// insert collection data

async function insertCollection(name: string, data: any) {
  try {
    await mongoose.connection.db.createCollection(name);
  } catch (e) {}
  let collection = await mongoose.connection.db.collection(name);

  let jsonData: any[] = json.parseJSONArray(data);

  if (!jsonData?.length) return 0;

  await collection.deleteMany({});
  // delete existing items
  // insert new items
  await collection.insertMany(jsonData);

  return jsonData?.length;
}

export default {
  connect,
  listDbs,
  setDb,
  disconnect,
  listCollections,
  getCollection,
  insertCollection,
  saveColelction,
};
