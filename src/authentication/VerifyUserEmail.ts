import { NextFunction, Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { EmailVerificationToken, PrismaClient } from '@prisma/client';
import { TokenMustStillBeValid } from './rules/rules.module';
import AppException from '../exceptions/AppException';
import log from '../logging/logger';
import TokenService from '../services/Token.service';

const { emailVerificationToken, user } = new PrismaClient();

type Account = {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  email_verification_token: EmailVerificationToken[];
  email_verified_at: Date;
} & typeof user;

export default class VerifyUserEmail {
  static async execute(req: Request, res: Response, next: NextFunction) {
    try {
      /** Check if the hashed token sent to the user has not being tampered with*/
      const _hashedEmailToken: string = createHash('sha512')
        .update(req.params.token)
        .digest('base64');

      /** Check if the token is the same with the one stores in the database
       * check if the email has not beign verified
       * check if the token has expired
       */
      //@ts-ignore
      const _user: Account = await user.findFirst({
        where: { isEmailVerified: false },
        include: {
          email_verification_token: {
            where: {
              token: _hashedEmailToken,
              token_expires_at: { gt: Date.now() },
            },
          },
        },
      });

      if (!_user) return TokenMustStillBeValid(_user, next);

      _user.isEmailVerified = true;
      await user.update({
        where: { id: _user.id },
        //@ts-ignore
        data: { isEmailVerified: true, email_verified_at: Date.now() },
      });

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
