import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { join } from 'path';
import log from '../logging/logger';
import config from 'config';
import { readFile } from 'fs/promises';
import AppException from '../exceptions/AppException';
import { NextFunction } from 'express';
import httpStatus from 'http-status';
import { createHash, randomBytes } from 'node:crypto';

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
  /**
   * @param uuid
   * @returns
   */
  static async _generateJwtToken(uuid: string): Promise<string> {
    const token = jwt.sign({ uuid }, PRIVATE_KEY, {
      algorithm: 'RS512',
      expiresIn: config.get<string>('tokenExpiration'),
    });

    return token;
  }

  /**
   * @param token refers to the token that you want to verify
   * @param next inbuilt middleware function
   * @returns
   */
  static async verifyToken(token: string, next: NextFunction) {
    try {
      const _token = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS512'] });
      return _token;
    } catch (err: any) {
      log.error(err);
      if (err.name === 'TokenExpiredError')
        return next(
          new AppException(
            'Opps!, your token has expired.',
            httpStatus.FORBIDDEN
          )
        );

      return next(new AppException(err.message, err.status));
    }
  }

  /**Generate token that will be sent to the users email for verification
   * Generate random string using randomBytes from node crypto library
   */
  static async generateTokenUsedForEmailVerification() {
    /** use the randomBytes func from node crypto module to generate a random string of token*/
    const emailVerificationToken = randomBytes(7)
      .toString('base64')
      .replace('/', '-');

    log.info(emailVerificationToken);

    /** hash the random string generated */
    const hashedEmailVerificationToken = createHash('sha512')
      .update(emailVerificationToken)
      .digest('base64');

    return { emailVerificationToken, hashedEmailVerificationToken };
  }
}
