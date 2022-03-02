import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { join } from 'path';
import log from '../logging/logger';
import config from 'config';
import { readFile } from 'fs/promises';
import AppException from '../exceptions/AppException';
import { NextFunction } from 'express';
import httpStatus from 'http-status';

let PRIVATE_KEY: string = '';
(async () => {
  try {
    PRIVATE_KEY = readFileSync(
      join(__dirname, '../certs/private_key.pem'),
      'utf-8'
    );
  } catch (err: any) {
    log.error(err.message);
  }
})();

let PUBLIC_KEY = '';
(async () => {
  try {
    PUBLIC_KEY = await readFile(
      join(__dirname, '../certs/public_key.pem'),
      'utf8'
    );
  } catch (err: any) {
    log.error(err.message);
  }
})();

export default class TokenService {
  static async _generateJwtToken(uuid: string): Promise<string> {
    const token = jwt.sign({ uuid }, PRIVATE_KEY, {
      algorithm: 'RS512',
      expiresIn: config.get<string>('tokenExpiration'),
    });

    return token;
  }

  static async verifyToken(token: string, next: NextFunction) {
    try {
      const _token = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS512'] });
      return _token;
    } catch (err: any) {
      log.error(err.message);
      if (err.name === 'TokenExpiredError')
        return next(
          new AppException(
            'Whoops!, your token has expired.',
            httpStatus.FORBIDDEN
          )
        );
    }
  }
}
