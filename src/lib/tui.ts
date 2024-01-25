import ora from "ora";
import db from "./db";
import urlParser from "mongo-url-parser";
import { prompt } from "enquirer";
import { Collection, Document } from "mongoose";

type AsyncResponse<T = any> = {
  data: T;
  error: string | null;
};
async function dbConnect(url: string, newDb = false) {
  let result: AsyncResponse<boolean> = {
    data: false,
    error: null,
  };
  let loading = ora("Connecting database...").start();

  try {
    await db.connect(url);

    loading.succeed("Database connected.");

    result["data"] = true;
  } catch (e) {
    loading.fail(`Database connection failed`);
    loading.stop();
    result["error"] = e?.message;
    return result;
  }

  let info = urlParser(url);

  let dbName = info?.dbName;

  let dbs = await db.listDbs();

  let dbnames = dbs
    ?.map((d) => d?.name)
    .filter((v) => !["admin", "config", "local"].includes(v));

  if (!dbnames?.includes(dbName) && !newDb) {
    console.log("Select db");
    //TODO: Select db

    if (dbnames?.length) {
      //Select db

      const dbSelect = await prompt<{ dbname: string }>({
        type: "select",
        name: "dbname",
        message: "Select Database",
        choices: dbnames,
      });

      dbName = dbSelect?.dbname;
    } else {
      // Enter db
      const askDbName = await prompt<{ dbname: string }>({
        type: "input",
        name: "dbname",
        message: "Enter database name",
      });

      dbName = askDbName.dbname;
    }
  }

  console.log("Selected DB", dbName);

  await db.setDb(dbName);

  return result;
}

async function selectBackupCollection() {
  let loading = ora("Listing collections...");
  let collections = await db.listCollections();
  let collectonNames = collections?.map((c) => c?.collectionName);

  if (!collectonNames?.length) {
    loading.fail(`No collections.`);
    return [];
  }

  // All or selected

  let backaupMode = await prompt<{ all: boolean }>({
    type: "confirm",
    name: "all",
    message: "Backup all collections?",
  });

  if (backaupMode.all) {
    return collections;
  }

  let selected = await prompt<{ value: string[] }>({
    type: "multiselect",
    message: "Select collections",
    name: "value",
    choices: collectonNames?.map((v) => ({ name: v, value: v })),
  });

  let selectedCol = collections?.filter((c) => {
    return selected.value.includes(c?.collectionName);
  });

  return selectedCol;
}

export default { dbConnect, selectBackupCollection };
