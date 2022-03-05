import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import AppException from '../exceptions/AppException';
import log from '../logging/logger';
import SignUpUserValidationSchema from '../validators/SignUpUserValidator';
import EncryptionService from './Encryption.service';
import TokenService from './Token.service';
import LoginUserValidationSchema from '../validators/LoginUserValidator';
import httpStatus from 'http-status';
import EmailService from '../services/Email.service';

const { user } = new PrismaClient();
const emailService = new EmailService();

export interface User {
  id: string;
  name: string;
  email: string;
  address?: string | null;
  phone_number?: string;
  token?: string;
  isEmailVerified?: boolean;
}
interface UserRequest {
  name: string;
  email: string;
  phone_number: string;
  address: string;
  password: string;
}

export default class UserService {
  static async getAllUsers(): Promise<User[]> {
    const data = await user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone_number: true,
        gender: true,
      },
    });

    return data;
  }

  static async createUser(request: UserRequest, next: NextFunction) {
    try {
      /** Use JOI to validate input comming from the request.body property */
      const _validateResource: UserRequest =
        await SignUpUserValidationSchema.validateAsync(request);

      /** Use the encryption service to hash a password*/
      const _hashedPassword = await EncryptionService.hashPassword(
        _validateResource.password
      );
      const { emailVerificationToken, hashedEmailVerificationToken } =
        await TokenService.generateTokenUsedForEmailVerification();

      const _user: User = await user.create({
        data: {
          name: _validateResource.name,
          email: _validateResource.email,
          phone_number: _validateResource.phone_number,
          password: _hashedPassword,
          token: hashedEmailVerificationToken,
          token_expires_at: new Date(Date.now() + 30 * 60 * 1000), //token expires after 30mins
        },
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          phone_number: true,
          gender: true,
        },
      });

      /** Use the token service to generate a jwt token */
      const token: string = await TokenService._generateJwtToken(_user.id);

      return { _user, token, emailVerificationToken };
    } catch (err: any) {
      if (err.isJoi === true) return next(new AppException(err.message, 422));
      return next(new AppException(err.message, err.status));
    }
  }

  static async loginUser(
    request: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const _validateResource: UserRequest =
        await LoginUserValidationSchema.validateAsync(request, {
          abortEarly: false,
        });
      const _userExists = await user.findUnique({
        where: { email: _validateResource.email },
      });

      if (
        !_userExists ||
        !(await EncryptionService.comparePassword(
          _userExists.password,
          _validateResource.password
        ))
      )
        return next(
          new AppException(`Opps!, Incorrect email or password`, 401)
        );

      const token = await TokenService._generateJwtToken(_userExists.id);

      res.status(httpStatus.ACCEPTED).json({
        status: 'success',
        message: `You have successfully logged in ${_userExists.name}`,
        token,
      });
    } catch (err: any) {
      log.error(err.messaage);
      if (err.isJoi === true) {
        let errorMessage: string = '';
        for (const error of err.details) {
          errorMessage +=
            '[ ' +
            error.path.join(' > ') +
            error.message.slice(error.message.lastIndexOf('"') + 1) +
            ' ]';
        }
        return next(
          new AppException(errorMessage, httpStatus.UNPROCESSABLE_ENTITY)
        );
      }
      return next(new AppException(err.message, err.status));
    }
  }
}
