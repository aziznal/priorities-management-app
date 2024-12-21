import { Priority } from "@/lib/common/types/priority";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";

type DB = {
  priorities: Priority[];
};

// path is relative to source
const DB_PATH = "lib/server/data/db.json";

async function createIfMissing() {
  const doesDbExist = existsSync(DB_PATH);

  if (doesDbExist) {
    return;
  } else {
    await writeFile(DB_PATH, JSON.stringify({ priorities: [] } satisfies DB));
  }
}

export async function readDb(): Promise<DB | undefined> {
  try {
    await createIfMissing();

    const raw = (await readFile(DB_PATH)).toString();
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export async function writeDb(data: DB): Promise<void> {
  await createIfMissing();

  await writeFile(DB_PATH, JSON.stringify(data));
}
