import { program } from "commander";
import { Listr } from "listr2";
import fs from "../lib/fs";
import tui from "../lib/tui";
import db from "../lib/db";
import json from "../lib/json";

export const restoreCmd = program
  .command("restore")
  .description("restore mongodb database")
  .argument("<dbUrl>", "database connection string")
  .action(async (dburl) => {
    let backupPath = fs.getDirPath("bkp");
    if (!fs.pathExistsSync(backupPath)) {
      console.log(`Backup path not found`);
      return;
    }

    await tui.dbConnect(dburl, true);

    // Scan files

    let files = await fs.scanFiles(backupPath);

    if (!files?.length) {
      console.log(`No backup files.`);
      await db.disconnect();
      return;
    }

    let tasks = new Listr(
      files?.map((file) => {
        let collenctionName = fs.getFileName(file);
        return {
          title: `Exporting ${collenctionName}`,
          task: async () => {
            let data = await fs.readFile(file, { encoding: "utf-8" });

            await db.insertCollection(collenctionName, data);
          },
        };
      })
    );

    await tasks.run().catch(() => {});

    // disconnect
    await db.disconnect();
  });
