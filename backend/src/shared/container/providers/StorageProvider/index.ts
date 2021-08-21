import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

export default {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};
