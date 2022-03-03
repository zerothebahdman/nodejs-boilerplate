import Joi from 'joi';

const LoginUserValidationSchema = Joi.object().keys({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .lowercase()
    .required()
    .messages({
      'any.email': 'Opps!, you need to provide valid email address',
      'any.required': 'Opps!, you have to specify an email address',
    }),
  password: Joi.string().min(8).required(),
  // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

export default LoginUserValidationSchema;
