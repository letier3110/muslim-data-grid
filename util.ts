import { copy } from "https://deno.land/std/fs/mod.ts";

const oldPath = "./index.html";
const newPath = "./index.ejs";
const translationsPath = "./translations.csv";

// Read translations from CSV
const translations = new Map<string, string>();
const csvContent = await Deno.readTextFile(translationsPath);
const lines = csvContent.split("\n");
lines.slice(1).forEach(line => {
  const [key, english, arabic] = line.split(",");
  translations.set(key, arabic.trim());
});

// Read old file content
let content = await Deno.readTextFile(oldPath);

// Replace strings between double curly brackets
content = content.replace(/{{(.*?)}}/g, (_, key) => {
  return translations.get(key.trim()) || key;
});

// Write new content to new file
await Deno.writeTextFile(newPath, content);
console.log(`Updated ${oldPath} and saved as ${newPath}`);