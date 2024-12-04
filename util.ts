import { copy } from "https://deno.land/std/fs/mod.ts";

const oldPath = "./index.html";
const newPath = "./index.ejs";

try {
  await copy(oldPath, newPath, { overwrite: true });
  console.log(`Renamed ${oldPath} to ${newPath}`);
} catch (error) {
  console.error(`Error renaming file: ${error}`);
}