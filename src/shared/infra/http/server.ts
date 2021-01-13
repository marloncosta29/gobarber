import 'reflect-metadata';
import 'dotenv/config';
import uploadConfig from '@config/upload';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import routes from '@shared/infra/http/routes';
import '@shared/infra/typeorm';
import cors from 'cors';
import AppError from '@shared/errors/app-errors';
import '@shared/container';
import { errors } from 'celebrate';
import rateLimiter from './midlewares/rateLimiter';

const app = express();
app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
app.use(errors());
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    console.error(error);
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('Server is runnig in 3333');
});
