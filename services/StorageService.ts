import { Storage } from '@op-engineering/op-sqlite';

export class StorageService {
  private static instance: StorageService;
  private storage: Storage;

  private constructor() {
    this.storage = new Storage({
      location: 'settings'
    });
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public setItem(key: string, value: string): void {
    try {
      this.storage.setItemSync(key, value);
    } catch (error) {
      console.error('Error setting item:', error);
      throw error;
    }
  }

  public getItem(key: string): string | undefined {
    try {
      return this.storage.getItemSync(key);
    } catch (error) {
      console.error('Error getting item:', error);
      return undefined;
    }
  }

  public removeItem(key: string): void {
    try {
      this.storage.removeItemSync(key);
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }

  public getAllKeys(): string[] {
    try {
      return this.storage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  public clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}