import dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .required()
      .valid('development', 'production', 'test'),
    PORT: Joi.number().default(8080).required(),
    FRONTEND_APP_URL: Joi.string().required().label('Frontend APP URL'),
    DATABASE_URL: Joi.string().required().label('Database URL'),
    APP_NAME: Joi.string().required().label('App Name').default('AGSAAP'),
    JWT_ACCESS_TOKEN_EXPIRES: Joi.string()
      .default('1h')
      .label('JWT Access Token Expires')
      .required(),
    JWT_REFRESH_TOKEN_EXPIRES: Joi.string()
      .default('24h')
      .label('JWT Refresh Token Expires')
      .required(),
    MAIL_FROM: Joi.string().required().label('Mail From').required(),
    MAIL_USER: Joi.string().required().label('Mail User').required(),
    MAIL_PASSWORD: Joi.string().required().label('Mail Password').required(),
    MAIL_HOST: Joi.string().required().label('Mail Host').required(),
    MAIL_PORT: Joi.number().required().label('Mail Port').required(),
    CLOUDINARY_NAME: Joi.string().label('Cloudinary Name'),
    CLOUDINARY_API_KEY: Joi.string().label('Cloudinary API Key'),
    CLOUDINARY_API_SECRET: Joi.string().label('Cloudinary API Secret'),
    CRON_SCHEDULE_DELETE_USER_ACCOUNT_IF_NOT_VERIFIED: Joi.string().label(
      'Cron Schedule Delete User Account If Not Verified'
    ),
  })
  .unknown();
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  FRONTEND_APP_URL: envVars.FRONTEND_APP_URL,
  DATABASE_URL: envVars.DATABASE_URL,
  port: envVars.PORT,
  jwtAccessTokenExpiration: envVars.JWT_ACCESS_TOKEN_EXPIRES,
  jwtRefreshTokenExpiration: envVars.JWT_REFRESH_TOKEN_EXPIRES,
  name: envVars.APP_NAME,
  from: envVars.MAIL_FROM,
  MAIL_HOST: envVars.MAIL_HOST,
  MAIL_PASSWORD: envVars.MAIL_PASSWORD,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PORT: envVars.MAIL_PORT,
  concurrency: parseInt(envVars.QUEUE_CONCURRENCY || '1'),
  emailQueueName: envVars.QUEUE_NAME || 'agsaap',
  connection: {
    host: envVars.REDIS_HOST,
    port: parseInt(envVars.REDIS_PORT || '6379'),
  },
  cloudinary: {
    cloudName: envVars.CLOUDINARY_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
  cronSchedule: {
    deleteUserAccountIfNotVerified:
      envVars.CRON_SCHEDULE_DELETE_USER_ACCOUNT_IF_NOT_VERIFIED,
  },
};
