import dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.NODE_ENV || 'development';

export default {
  [ENV]: true,
  env: ENV,
  port: process.env.PORT,
  tokenExpiration: '30min',
  name: process.env.APP_NAME,
  from: process.env.MAIL_FROM,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PORT: process.env.MAIL_PORT,
};
