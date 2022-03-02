import { PrismaClient } from '@prisma/client';
import { NextFunction } from 'express';
import AppException from '../exceptions/AppException';
import log from '../logging/logger';
import UserValidationSchema from '../validators/UserValidator';
import EncryptionService from './Encryption.service';
import TokenService from './Token.service';
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
        await UserValidationSchema.validateAsync(request);

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
}
