import path from 'path';

export const STORAGE_DIR = path.join(process.cwd(), 'storage');
export const DOCUMENTS_DIR = path.join(STORAGE_DIR, 'documents');
export const DB_FILE = path.join(STORAGE_DIR, 'users.json'); 