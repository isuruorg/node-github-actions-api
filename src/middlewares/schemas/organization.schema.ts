import Joi from 'joi';

const id = Joi.string().required();
const email = Joi.string().email();
const name = Joi.string();
const accessibleChains = Joi.array();

const schemas = {
  create: Joi.object({
    name: name.required(),
    email: email.optional(),
    accessibleChains: accessibleChains.optional(),
  }),
  updateById: Joi.object({
    id: id,
    name: name.required(),
    email: email.optional(),
    accessibleChains: accessibleChains.optional(),
  }),
  removeChains: Joi.object({
    id: id,
    chains: accessibleChains.required(),
  }),
};

export default schemas;
