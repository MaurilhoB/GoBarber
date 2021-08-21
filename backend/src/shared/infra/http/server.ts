import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';

import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';

import routes from './routes';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import { MulterError } from 'multer';

import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'File not expected',
      });
    }
  }

  console.log(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(9000, () => console.log('Server running at port 9000'));
