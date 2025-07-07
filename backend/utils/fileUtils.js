import { readFile, writeFile } from 'fs/promises';

export async function readData(filePath) {
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Erro ao ler ${filePath}:`, err);
    return [];
  }
}

export async function writeData(filePath, data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Erro ao escrever em ${filePath}:`, err);
  }
}
