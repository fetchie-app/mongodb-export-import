import { Command } from "commander";
import { backupCmd } from "./backup.cmd";
import { restoreCmd } from "./restore.cmd";
export const rootCmd = new Command("mongobakup")
  .description("nongodb backup / restore tool.")
  .addCommand(backupCmd)
  .addCommand(restoreCmd);
