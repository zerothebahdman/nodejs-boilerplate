import dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.NODE_ENV || 'development';

export default {
  [ENV]: true,
  env: ENV,
  port: process.env.PORT,
  tokenExpiration: '30min',
};
