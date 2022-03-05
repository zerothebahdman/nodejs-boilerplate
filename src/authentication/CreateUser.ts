import { Request, Response, NextFunction } from 'express';
import UserService, { User } from '../services/User.service';
import AppException from '../exceptions/AppException';

import { PrismaClient } from '@prisma/client';
const { user } = new PrismaClient();

type T = { token: string; result: User };

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

      const { result, token }: any = await UserService.createUser(
        req.body,
        next
      );

      res.status(200).json({
        status: 'success',
        message: 'User created successfully',
        token: token,
        user: result,
      });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
