import Status from 'http-status';
import { Request, Response, NextFunction } from 'express';
import AppException from '../../../../exceptions/AppException';
import { readFile } from 'fs/promises';
import { join } from 'path';
import log from '../../../../logging/logger';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const { user } = new PrismaClient();

export type RequestType = {
  [prop: string]: any;
} & Request;

export const isAuthenticated = async (
  req: RequestType,
  res: Response,
  next: NextFunction
) => {
  try {
    const _noAuth = () =>
      next(
        new AppException(
          `Opps!, you are not authenticated, login`,
          Status.UNAUTHORIZED
        )
      );

    /** Get the token from the headers and confirm they exist */
    const { authorization } = req.headers;
    const _authHeader = authorization;
    if (!_authHeader) return _noAuth();
    const [id, token] = _authHeader.split(' ');
    if (!id || !token) return _noAuth();
    if (id.trim().toLowerCase() !== 'bearer') return _noAuth();

    /** Get the token from the file system*/
    let PUBLIC_KEY = '';
    (async () => {
      try {
        PUBLIC_KEY = await readFile(
          join(__dirname, '../../../../certs/public_key.pem.pem'),
          'utf8'
        );
      } catch (err: any) {
        log.error(err.message);
      }
    })();

    /** Verify that the token is valid */
    let decodedToken: string | jwt.JwtPayload = '';
    try {
      decodedToken = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS512'] });
    } catch (err: any) {
      log.error(err.message);
      if (err.name === 'TokenExpiredError')
        return next(
          new AppException('Whoops!, your token has expired.', Status.FORBIDDEN)
        );
    }

    /** Check if user that has the token still exists */
    const { uuid }: any = decodedToken;
    const result = await user.findFirst({ where: { id: uuid } });
    if (!user)
      return next(
        new AppException('Opps!, user does not exist', Status.NOT_FOUND)
      );

    req.user = result;
    log.info(req.user);
    next();
  } catch (err: any) {
    return next(new AppException(err.message, err.status));
  }
};
