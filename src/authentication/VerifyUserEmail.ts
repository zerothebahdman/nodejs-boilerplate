import { NextFunction, Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { TokenMustStillBeValid } from './rules/rules.module';
import AppException from '../exceptions/AppException';
import log from '../logging/logger';
import TokenService from '../services/Token.service';
import { User } from '../services/User.service';

const { user } = new PrismaClient();

export default class VerifyUserEmail {
  async execute(req: Request, res: Response, next: NextFunction) {
    try {
      /** Check if the hashed token sent to the user has not being tampered with*/
      const _hashedEmailToken: string = createHash('sha512')
        .update(req.params.token)
        .digest('base64');

      /** Check if the token is the same with the one stores in the database
       * check if the email has not beign verified
       * check if the token has expired
       */
      let _user: User = null;

      _user = await user.findFirst({
        where: {
          isEmailVerified: false,
          token: _hashedEmailToken,
          token_expires_at: { gt: new Date(Date.now()) },
        },
        select: { id: true, name: true, email: true },
      });

      if (!_user) return TokenMustStillBeValid(next);

      /** Veiry user email
       * set token and token_expires_at field to null cause its no longer needed
       */
      await user.update({
        where: { id: _user.id },
        data: {
          isEmailVerified: true,
          email_verified_at: new Date(Date.now()),
          token: null,
          token_expires_at: null,
        },
      });

      /** Genereate a new JWT token*/
      const token = await TokenService._generateJwtToken(_user.id);

      return res.status(201).json({
        status: `success`,
        message: `Your email: ${_user.email} has been verified`,
        token,
      });
    } catch (err: any) {
      log.error(err);
      return next(new AppException(err.message, err.status));
    }
  }
}
