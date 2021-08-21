import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    const findIndex = this.storage.findIndex(
      storagedFile => storagedFile === file
    );
    if (findIndex < 0) this.storage.push(file);

    return file;
  }
  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      storagedFile => storagedFile === file
    );

    if (findIndex >= 0) this.storage.slice(findIndex, 1);
  }
}
