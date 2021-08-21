import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import path from 'path';

interface IUploadSettings {
  uploadsFolder: string;
  tmpFolder: string;
  multer: multer.Options;
  driver: 'disk' | 's3';
  aws: {
    bucket: string;
  };
}
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

const uploadConfig = {
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(req, file, callback) {
        const fileName = `${uuidv4()}-${file.originalname}`;
        return callback(null, fileName);
      },
    }),
    fileFilter(req, file, cb) {
      if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
        req.notAllowedFile = true;
        return cb(null, false);
      }
      return cb(null, true);
    },
  },
  driver: process.env.STORAGE_DRIVER || 'disk',
  aws: {
    bucket: process.env.S3_BUCKET_NAME || 'unknown',
  },
  disk: {},
} as IUploadSettings;

export default uploadConfig;
