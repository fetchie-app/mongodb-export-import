import { program } from "commander";
import db from "../lib/db";
import tui from "../lib/tui";
import { Listr } from "listr2";
import fs from "../lib/fs";

export const backupCmd = program
  .command("backup")
  .description("backup mongodb database")
  .argument("<dbUrl>", "database connection string")
  .action(async (dburl) => {
    let backupPath = fs.getDirPath("bkp");
    await fs.checkDirecotry(backupPath);
    console.log("Backup mongodb -> ", dburl, __dirname);

    // Connect
    await tui.dbConnect(dburl);

    // Select collections

    let collections = await tui.selectBackupCollection();

    if (!collections?.length) {
      console.log(`No collections selected.`);
      await db.disconnect();
      return;
    }

    let tasks = new Listr(
      collections?.map((c) => {
        return {
          title: `Backing up ${c.collectionName}`,
          task: async () => {
            await db.saveColelction(c, backupPath);
          },
        };
      })
    );

    await tasks.run().catch((e) => console.log("Error "));

    //

    // Disconnect db
    await db.disconnect();
  });
