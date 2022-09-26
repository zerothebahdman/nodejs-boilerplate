import Joi from 'joi';
import httpStatus from 'http-status';
import AppException from '../../../../exceptions/AppException';
import { NextFunction, Request, Response } from 'express';
import pick from '../../../../utils/pick';

const validate =
  (schema: any) => (req: Request, _res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ['body', 'params', 'query']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' } })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map(() => error.message.replaceAll('"', ''))
        .join(', ');
      return next(
        new AppException(httpStatus.UNPROCESSABLE_ENTITY, errorMessage)
      );
    }
    Object.assign(req, value);
    return next();
  };

export default validate;
