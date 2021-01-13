import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadingConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',
  tmpFolder: tmpDir,
  uploadsFolder: path.resolve(tmpDir, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpDir,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const filename = `${fileHash}-${file.originalname}`;
        return callback(null, filename);
      },
    }),
  },
  config: {
    disk: {},
    aws: {
      bucket: 'ma-app-gobarber',
    },
  },
} as IUploadingConfig;
