import { Request, Response, NextFunction } from 'express';
import UserService from '../services/User.service';
import AppException from '../../../../exceptions/AppException';

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

  //   async createUser(user: User) {}
}
