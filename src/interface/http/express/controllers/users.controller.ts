import { Request, Response, NextFunction } from 'express';
import UserService from '../services/User.service';
import AppException from '../../../../exceptions/AppException';

import { PrismaClient } from '@prisma/client';
const { user } = new PrismaClient();

export default class UserController {
  // constructor(req: Request, res: Response, next: NextFunction) {
  //   this.request = req;
  //   this.response = res;
  //   this.next = next;
  // }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getAllUsers();
      return res.status(200).json({ status: 'success', data });
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const _userExists = await user.findUnique({
        where: { email: req.body.email },
      });

      if (_userExists)
        return next(
          new AppException(`Opps!, ${_userExists.email} is taken`, 422)
        );

      const result = await UserService.createUser(req.body, next);
      res.status(200).json({
        status: 'success',
        message: 'User created successfully',
        user: result,
      });
    } catch (err: any) {}
  }
}
