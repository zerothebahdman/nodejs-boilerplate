import { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../../controllers/controllers.module';
import { createUser } from '../../authentication/authentication.module';

const route = Router();

route
  .route('/')
  .get((req, res, next) => {
    userController.getAllUsers(req, res, next);
  })
  .post((req, res, next) => {
    createUser.createUser(req, res, next);
  });

export default route;
