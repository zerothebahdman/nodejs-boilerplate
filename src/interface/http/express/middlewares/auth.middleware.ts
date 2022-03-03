import Status from 'http-status';
import { Request, Response, NextFunction } from 'express';
import AppException from '../../../../exceptions/AppException';
import { readFile } from 'fs/promises';
import { join } from 'path';
import log from '../../../../logging/logger';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import TokenService from '../../../../services/Token.service';
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

    /** Decode the token in the TokenService */
    const decodedToken = await TokenService.verifyToken(token, next);

    /** Check if user that has the token still exists */
    const { uuid }: any = decodedToken;
    const result = await user.findFirst({ where: { id: uuid } });
    if (!user)
      return next(
        new AppException('Opps!, user does not exist', Status.NOT_FOUND)
      );

    /** Store the result in a req object */
    req.user = result;
    next();
  } catch (err: any) {
    return next(new AppException(err.message, err.status));
  }
};
