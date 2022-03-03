import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import AppException from '../exceptions/AppException';
import log from '../logging/logger';
import SignUpUserValidationSchema from '../validators/SignUpUserValidator';
import EncryptionService from './Encryption.service';
import TokenService from './Token.service';
import LoginUserValidationSchema from '../validators/LoginUserValidator';
import httpStatus from 'http-status';
const { user } = new PrismaClient();

interface User {
  id: string;
  name: string;
  email: string;
  address: string | null;
  phone_number: string;
}
interface Request {
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

  static async createUser(request: Request, next: NextFunction) {
    try {
      const _validateResource: Request =
        await SignUpUserValidationSchema.validateAsync(request);

      const _hashedPassword = await EncryptionService.hashPassword(
        _validateResource.password
      );

      const result = await user.create({
        data: {
          name: _validateResource.name,
          email: _validateResource.email,
          phone_number: _validateResource.phone_number,
          password: _hashedPassword,
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

      const token = await TokenService._generateJwtToken(result.id);

      return { result, token };
    } catch (err: any) {
      if (err.isJoi === true) return next(new AppException(err.message, 422));
      return next(new AppException(err.message, err.status));
    }
  }

  static async loginUser(request: Request, res: Response, next: NextFunction) {
    try {
      const _validateResource: Request =
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
