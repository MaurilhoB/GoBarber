import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const cachedData = this.cache[key];

    if (!cachedData) {
      return null;
    }

    return JSON.parse(cachedData) as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string) {
    const keys = Object.keys(this.cache).filter(key => {
      return key.startsWith(`${prefix}:`);
    });

    keys.forEach(key => delete this.cache[key]);
  }
}
