import IStorageProvider from '../models/IStorageProvider';
import uploadConfig from '@config/upload';
import fs from 'fs/promises';
import path from 'path';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file)
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      await fs.stat(filePath);
    } catch {
      return;
    }
    
    await fs.unlink(filePath);
  }
}
