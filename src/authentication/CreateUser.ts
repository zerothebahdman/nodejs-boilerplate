import { Request, Response, NextFunction } from 'express';
import UserService, { User } from '../services/User.service';
import AppException from '../exceptions/AppException';

import { PrismaClient } from '@prisma/client';
import log from '../logging/logger';
import EmailService from '../services/Email.service';
import TokenService from '../services/Token.service';

const { user } = new PrismaClient();
const emailService = new EmailService();

export default class CreateUser {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const _userExists = await user.findUnique({
        where: { email: req.body.email },
      });

      if (_userExists)
        return next(
          new AppException(`Opps!, ${_userExists.email} is taken`, 422)
        );

      /** if user does not exist create the user using the user service */
      const { _user, jwtToken, emailVerificationToken }: any =
        await UserService.createUser(req.body, next);

      /** Send email verfication to user */
      await emailService._sendUserEmailVerificationEmail(
        _user.name,
        _user.email,
        emailVerificationToken,
        req
      );

      res.status(200).json({
        status: 'success',
        message: `We've sent an verification email to your mail`,
        jwtToken: jwtToken,
        user: _user,
      });
    } catch (err: any) {
      log.error(err);
      return next(new AppException(err.message, err.status));
    }
  }
}
