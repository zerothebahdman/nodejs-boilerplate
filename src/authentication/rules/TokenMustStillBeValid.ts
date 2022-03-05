import { NextFunction } from 'express';
import AppException from '../../exceptions/AppException';

type Account = { email: string };
const TokenMustStillBeValid = (account: Account, next: NextFunction) => {
  return next(
    new AppException(
      `Email token: Token associated with ${account.email} has expired or is invalid`,
      417
    )
  );
};

export default TokenMustStillBeValid;
