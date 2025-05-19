const fs = require('fs');
const path = require('path');

// Change this to your actual generated types file path
const typesFilePath = path.resolve('src/lib/types/supabase.types.ts');

try {
  let content = fs.readFileSync(typesFilePath, 'utf8');

  const jsonTypeRegex = /export type Json =\s*\|\s*string\s*\|\s*number\s*\|\s*boolean\s*\|\s*null\s*\|\s*{\s*\[key: string\]: Json \| undefined\s*}\s*\|\s*Json\[\]/g;

  if (jsonTypeRegex.test(content)) {
    content = content.replace(
      jsonTypeRegex,
      '// biome-ignore lint/suspicious/noExplicitAny: Json type too complex, simplified for better IDE and TS experience\nexport type Json = Record<string, any>;'
    );
    fs.writeFileSync(typesFilePath, content);
    console.log('Json type simplified successfully.');
  } else {
    console.log('No Json type pattern found. No changes made.');
  }
} catch (err) {
  console.error('Error reading or writing the types file:', err);
}
