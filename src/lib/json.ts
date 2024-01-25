import { writeFileSync } from "node:fs";
function parseJSONArray(input: any) {
  let data: any[] = [];
  try {
    data = JSON.parse(input);
  } catch (e) {}

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}

function saveAsJson(path: string, data: any) {
  writeFileSync(path, JSON.stringify(data || []));
}

export default { parseJSONArray, saveAsJson };
