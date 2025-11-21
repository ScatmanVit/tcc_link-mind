import { supabase_client } from '../../config/supabase.js'

const bucketName = process.env.SUPABASE_STORAGE_BUCKET;

/**
 * Upload de arquivo genérico
 * @param path - caminho completo dentro do bucket (ex: "users/1 23/resumo.pdf")
 * @param file - arquivo em Buffer ou Stream
 * @param options - opções extras (cacheControl, upsert, etc.)
 */
export async function uploadFile(path, file, options = { upsert: true }) {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .upload(path, file, options);

  if (error) throw error;
  return data;
}

/**
 * Download de arquivo
 * @param path - caminho completo do arquivo dentro do bucket
 * @returns Buffer do arquivo
 */
export async function downloadFile(path) {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .download(path);

  if (error) throw error;

  // retorna buffer para uso em node
  return Buffer.from(await data.arrayBuffer());
}

/**
 * Deletar arquivo
 * @param path - caminho completo do arquivo dentro do bucket
 */
export async function deleteFile(path) {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .remove([path]);

  if (error) throw error;
  return data;
}

/**
 * Listar arquivos dentro de uma pasta
 * @param folderPath - pasta dentro do bucket (ex: "users/123")
 */
export async function listFiles(folderPath = "") {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .list(folderPath);

  if (error) throw error;
  return data; // array de objetos com {name, id, updated_at, ...}
}

/**
 * Gerar URL pública de um arquivo
 * @param path - caminho do arquivo
 */
export function getPublicUrl(path) {
  const { data } = supabase_client.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}