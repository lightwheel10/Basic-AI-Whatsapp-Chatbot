import fs from 'fs/promises';
import path from 'path';
import { DOCUMENTS_DIR, DB_FILE } from '../config/constants';
import { User } from '../models/types';

export class StorageService {
    async init() {
        await fs.mkdir(DOCUMENTS_DIR, { recursive: true });
        try {
            await fs.access(DB_FILE);
        } catch {
            await fs.writeFile(DB_FILE, JSON.stringify([]));
        }
    }

    async saveDocument(fileName: string, data: Buffer): Promise<string> {
        const filePath = path.join(DOCUMENTS_DIR, fileName);
        await fs.writeFile(filePath, data);
        return filePath;
    }

    async getUsers(): Promise<User[]> {
        const data = await fs.readFile(DB_FILE, 'utf-8');
        return JSON.parse(data);
    }

    async saveUsers(users: User[]) {
        await fs.writeFile(DB_FILE, JSON.stringify(users, null, 2));
    }
}

export const storage = new StorageService(); 