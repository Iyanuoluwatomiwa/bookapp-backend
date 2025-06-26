const Joi = require("joi");
const joiPwd = require("joi-password-complexity");

//user schema
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).max(30).required(),
  userName: Joi.string().min(10).max(100),
  name: Joi.string().min(10).max(100),
  // lastName: Joi.string().min(3).max(100),
  // mobile: Joi.string().min(3).max(20),
  // studentId: Joi.number().min(1).required(),
});

//login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).max(30).required(),
  // lastName: Joi.string().min(3).max(100),
  // mobile: Joi.string().min(3).max(20),
  // studentId: Joi.number().min(1).required(),
});

//password complexity
const complexityOptions = {
  min: 10,
  max: 30,
  lowercase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

module.exports.userVal = userSchema;
module.exports.loginVal = loginSchema;
module.exports.pwdVal = joiPwd(complexityOptions);
