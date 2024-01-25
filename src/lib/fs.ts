import { ensureDir, pathExistsSync } from "fs-extra";
import { join, basename, parse } from "path";
import glob from "fast-glob";
import { readFile, rm } from "node:fs/promises";

async function scanFiles(
  basePath: string = process.cwd(),
  patterns: string[] = ["*.json"]
) {
  let files = await glob(patterns, { unique: true, cwd: basePath });
  return files.map((name) => join(basePath, name));
}

async function checkDirecotry(path: string) {
  await ensureDir(path);
}

function getDirPath(directoryName) {
  return join(process.cwd(), directoryName);
}

function getFileName(path: string) {
  return parse(path).name;
}

async function removeDir(path: string) {
  await rm(path, { recursive: true, force: true });
}

export default {
  checkDirecotry,
  getDirPath,
  scanFiles,
  pathExistsSync,
  readFile,
  basename,
  getFileName,
  removeDir,
};
