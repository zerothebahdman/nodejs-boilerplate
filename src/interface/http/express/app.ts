import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from 'config';
import enforce from 'express-sslify';
import userRouter from './router/user/user.route';
import ErrorHandler from './middlewares/error_handler.middleware';
import AppException from '../../../exceptions/AppException';
import morgan from 'morgan';

const app: Application = express();

if (config.get<string>('env') === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

if (config.get<string>('env') === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.use('/api/v1/user', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  return next(
    new AppException(`Cant find ${req.originalUrl} on the server.`, 404)
  );
});
app.use(ErrorHandler);
export default app;

// class App {
//   public app: Application;
//   public port: number;

//   constructor() {}
// }
