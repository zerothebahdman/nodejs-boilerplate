import { Request, Response, NextFunction } from 'express';
import UserService from '../../../../services/User.service';
import AppException from '../../../../exceptions/AppException';

import { PrismaClient } from '@prisma/client';
const { user } = new PrismaClient();

export default class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getAllUsers();
      return res.status(200).json({ status: 'success', data });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
