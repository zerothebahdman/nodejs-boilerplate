import { NextFunction, Request, Response } from 'express';
import UserService from '../services/User.service';
import AppException from '../exceptions/AppException';
import httpStatus from 'http-status';

export default class LoginUser {
  async _loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await UserService.loginUser(req.body, res, next);
    } catch (err: any) {
      return next(new AppException(err.message, err.status));
    }
  }
}
