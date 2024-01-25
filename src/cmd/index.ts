#!/usr/bin/env tsx
import { rootCmd } from "./root.cmd";

export function start() {
  rootCmd.parse();
}

start();
