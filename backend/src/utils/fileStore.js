import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const dataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "data");

const ensureDir = async () => {
  await fs.mkdir(dataDir, { recursive: true });
};

const filePath = (name) => path.join(dataDir, `${name}.json`);

export const readStore = async (name, fallback) => {
  try {
    await ensureDir();
    const raw = await fs.readFile(filePath(name), "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err?.code === "ENOENT") {
      return fallback;
    }
    throw err;
  }
};

export const writeStore = async (name, value) => {
  await ensureDir();
  await fs.writeFile(filePath(name), JSON.stringify(value, null, 2), "utf8");
  return value;
};
