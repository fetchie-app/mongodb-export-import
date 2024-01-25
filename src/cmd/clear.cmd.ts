import { program } from "commander";
import tui from "../lib/tui";
import fs from "../lib/fs";

export const clearCmd = program
  .command("clear")
  .description("clear local backup files")
  .action(async () => {
    let backupPath = fs.getDirPath("bkp");
    if (!fs.pathExistsSync(backupPath)) {
      console.log(`Backup path not found`);
      return;
    }
    await tui.removeLocalFiles(backupPath);
  });
