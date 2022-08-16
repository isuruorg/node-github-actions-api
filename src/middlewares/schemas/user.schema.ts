import Joi from 'joi';

const name = Joi.string();
const email = Joi.string().email();
const phone = Joi.string()
  .length(10)
  .pattern(/^[0-9]+$/);
const password = Joi.string();
const passwordHash = Joi.string();
const active = Joi.boolean();
const activeTill = Joi.date().greater('now');
const oneTimePassword = Joi.array().items(Joi.string());
const isPreUser = Joi.boolean();
const organization = Joi.string();
const id = Joi.string();

const schemas = {
  createUser: Joi.object({
    name: name.required(),
    email: email.required(),
    phone: phone.optional(),
    activeTill: activeTill.optional(),
    active: active.optional(),
    password: password.required(),
    organization: organization.optional(),
  }),
  authenticate: Joi.object({
    email: email.required(),
    password: password.required(),
  }),
  getAllUsers: Joi.object({
    email: email.required(),
  }),
  updateUser: Joi.object({
    id: id.required(),
    name: name.optional(),
    phone: phone.optional(),
    activeTill: activeTill.optional(),
    active: active.optional(),
    password: password.optional(),
    organization: organization.optional(),
  }),
  resetPassword: Joi.object({
    id: id.required(),
    newPassword: password.required(),
    currentPassword: password.required(),
  }),
};

export default schemas;
