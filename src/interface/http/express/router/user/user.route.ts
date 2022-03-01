import { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../../controllers/controllers.module';

const route = Router();

// route.get('/', (req, res, next) => {
//   userController.getAllUsers(req, res, next);
// });

route
  .route('/')
  .get((req, res, next) => {
    userController.getAllUsers(req, res, next);
  })
  .post((req, res, next) => {
    userController.createUser(req, res, next);
  });

export default route;
