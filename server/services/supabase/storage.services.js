import { supabase_client } from '../../config/supabase.js'

const bucketName = process.env.SUPABASE_STORAGE_BUCKET;


export async function uploadFile(path, file, options = { upsert: true }) {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .upload(path, file, options);

  if (error) throw error;
  return data;
}


export async function downloadFile(path) {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .download(path);

  if (error) throw error;

  return Buffer.from(await data.arrayBuffer());
}


export async function deleteFile(path) {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .remove([path]);

  if (error) throw error;
  return data;
}


export async function listFiles(folderPath = "") {
  const { data, error } = await supabase_client.storage
    .from(bucketName)
    .list(folderPath);

  if (error) throw error;
  return data; 
}


export function getPublicUrl(path) {
  const { data } = supabase_client.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}