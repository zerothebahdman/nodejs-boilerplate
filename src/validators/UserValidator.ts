import Joi from 'joi';

const UserValidationSchema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).lowercase().max(20).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .lowercase()
    .required()
    .messages({
      'string.email': 'Opps!, you need to provide valid email address',
      'string.required': 'Opps!, you have to specify an email address',
    }),
  phone_number: Joi.string().max(12).strict().required().messages({
    'string.required': 'Opps!, you have to specify an email address',
  }),
  password: Joi.string()
    .min(8)
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  confirm_password: Joi.ref('password'),
  gender: Joi.string().optional().valid('male', 'female'),
  address: Joi.string().optional().lowercase(),
});

export default UserValidationSchema;
